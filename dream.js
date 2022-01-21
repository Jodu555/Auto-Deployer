const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { NodeSSH } = require('node-ssh');
const merge = require('deepmerge');
const dotenv = require('dotenv').config();
/**
 * Important:
 *      This is just dream code (how i want this code to look)
 *      This code dont works its just an Convention
 *      Of what i would like this to be
 */
const deploymentsDirectory = path.join(process.cwd(), 'deployments');
console.log(deploymentsDirectory);

class Deploy {
    constructor(ID, steps) {
        this.ID = ID;
        this.steps = steps;
        this.stepIdx = 0;
        this.dir = null;
        this.currStep = null;
        this.record = null;
    }
    currentStep() {
        return this.currStep ? this.currStep : this.steps[this.stepIdx];
    }
    createDeploy() {
        this.dir = path.join(deploymentsDirectory, `#${this.ID} - Deployment`);
        fs.mkdirSync(this.dir);
        this.record = {};
        this.record['0'] = this.dir
    }
    deleteDeploy(save) {
        this.record['-1'] = 'Finished'
        if (save) {
            fs.writeFileSync('./' + this.ID + '--output.json', JSON.stringify(this.record, null, 2), 'utf-8');
        }
        fs.rmdirSync(this.dir, { recursive: true });
    }
    exec(command, args = []) {
        if (args.length == 0) {
            const arr = command.split(' ');
            command = arr.shift();
            args = arr;
        }
        const process = child_process.spawnSync(command, args, { encoding: 'utf8', cwd: this.dir });
        if (process.error) {
            console.log("ERROR: ", process.error);
        }
        const output = [...process.stdout.split('\n'), ...process.stderr.split('\n')];
        this.appendRecord({ output, success: process.status == 0, status: process.status });
    }
    step(name) {
        if (name) {
            this.currStep = name
        } else {
            this.stepIdx++;
            this.currStep = null;
        }
    }
    delete(arg) {
        arg = Array.isArray(arg) ? arg : [arg];
        arg.forEach(node => {
            if (fs.statSync(path.join(this.dir, node)).isDirectory()) {
                fs.rmdirSync(path.join(this.dir, node), { recursive: true });
            } else {
                fs.rmSync(path.join(this.dir, node));
            }
        });
        this.appendRecord({ deletedFiles: arg })
    }
    appendRecord(obj) {
        this.record[this.currentStep()] = merge(this.getCurrentRecord(), obj);
    }
    getCurrentRecord() {
        return this.record[this.currentStep()];
    }
}

class Host {
    constructor(deploy) {
        this.deploy = deploy;
        this.cwd = '';
        this.ssh = new NodeSSH();
    }
    async connect(host, username, password, initPath) {
        const config = {};
        if (host.host) {
            config = host
            initPath = username;
        } else {
            config = { host, username, password }
        }
        await this.ssh.connect(config);
        this.cwd = initPath;
    }
    async upload(uploadPath = null) {
        const failed = []
        const succeeded = []
        const success = await this.ssh.putDirectory(this.deploy.dir, uploadPath ? path.join(this.cwd, uploadPath) : this.cwd, {
            recursive: true,
            concurrency: 10,
            tick: (localPath, remotePath, error) => {
                const arr = this.deploy.getCurrentRecord()?.upload?.part || [];
                arr.push({ localPath, remotePath, error });
                this.deploy.appendRecord({ upload: { part: arr } });
                if (error) {
                    failed.push(localPath)
                } else {
                    succeeded.push(localPath)
                }
            }
        });
        this.deploy.appendRecord({ upload: { success, failed, succeeded } });
    }
    //Important: This method executes an ssh command direct on your Host Machine
    async exec() {

    }
    disconnect() {
        this.ssh.dispose();
    }
}

class Config {
    constructor(cfgPath = null) {
        this.cfgPath = this.cfgPath || path.join(process.cwd(), 'config.json');
        this.data = {};
        this.load();
    }
    load() {
        if (fs.existsSync(this.cfgPath)) {
            this.data = JSON.parse(fs.readFileSync(this.cfgPath, 'utf-8'));
        } else {
            this.data = {
                servers: [
                    { name: 'ExampleServer', alias: 'example', host: '1.1.1.1', username: 'example', password: 'SuperSecretPassword' }
                ],
            };
        }
        this.save();
    }
    set(server) {
        this.data.servers.push(server);
    }
    get(search) {
        let server = null;
        this.data.servers.forEach(entry => {
            if (entry.name.toLowerCase() == search.toLowerCase())
                server = entry;
            if (entry.alias?.toLowerCase() == search.toLowerCase())
                server = entry;
        });
        if (!server)
            server = this.data.servers[Number(search)];

        if (!server)
            throw new Error('There is no Server with name or index: ' + search)

        return server;
    }
    save() {
        fs.writeFileSync(this.cfgPath, JSON.stringify(this.data, null, 4), 'utf-8');
    }
}

registerDeploy('Personal-Website', ['Download', 'Deletion', 'Upload'], async (deploy, host, data, config) => {
    deploy.createDeploy();
    deploy.exec('git clone https://github.com/Jodu555/Ticket-System.git .');
    deploy.step();
    deploy.delete('README.md');
    deploy.delete(['.git', '.gitignore']);
    deploy.step();

    await host.connect(config.get('ci'), '/home/Test');
    await host.upload();
    host.disconnect();

    deploy.deleteDeploy();
});

const config = new Config();

console.log(config.get('example'));

function registerDeploy(name, steps, cb) {
    console.log(name, steps);
    const GH_DATA = {};
    // cb(new Deploy(name, steps), new Host(), GH_DATA, config);

}

