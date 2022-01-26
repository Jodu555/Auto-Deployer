const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { NodeSSH } = require('node-ssh');
const merge = require('deepmerge');
const dotenv = require('dotenv').config();

const deploymentsDirectory = path.join(process.cwd(), 'deployments');
const historyDirectory = path.join(process.cwd(), 'history');

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
        this.record['0'] = { time: Date.now(), dir: this.dir };
    }
    deleteDeploy(save) {
        const time = Date.now();
        const timeDifference = time - this.record['0'].time;
        this.record['-1'] = { time, saved: save, timeDifference };
        if (save) {
            const historyFile = path.join(historyDirectory, `${this.ID}--${time}--output.json`)
            fs.writeFileSync(historyFile, JSON.stringify(this.record, null, 2), 'utf-8');
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
    async exec() {
        //Important: This method executes an ssh command direct on your Host Machine
    }
    disconnect() {
        this.ssh.dispose();
    }
}
const Config = require('./src/classes/Config');

registerDeploy('Personal-Website', ['Download', 'Deletion', 'Upload'], async (deploy, host, data, config) => {
    deploy.createDeploy();
    deploy.exec(`git clone ${data.repository.url} .`);
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

