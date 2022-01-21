const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { NodeSSH } = require('node-ssh')
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
        // fs.rmdirSync(this.dir, { recursive: true });

    }
    exec(command, args = []) {
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
        this.record[this.currentStep()] = { ...this.getCurrentRecord(), ...obj }
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
        await this.ssh.connect({
            host: host,
            username: username,
            password: password,
        });
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
                console.log(1, arr);
                arr.push({ localPath, remotePath, error });
                console.log(2, arr);
                this.deploy.appendRecord({ upload: { part: [...arr] } });
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

    }
}

async function test(params) {
    const deploy = new Deploy('Test-123', ['Download', 'Deletion', 'Upload']);
    const host = new Host(deploy);
    deploy.createDeploy();
    deploy.exec('git', ['clone', 'https://github.com/Jodu555/Ticket-System.git', '.']);
    deploy.step();
    deploy.delete('README.md');
    deploy.delete(['.git', '.gitignore']);
    deploy.step();

    await host.connect(process.env.TEST_IP, process.env.TEST_USR, process.env.TEST_PW, '/home/Test');
    await host.upload();
    // await host.upload('PATH');


    deploy.deleteDeploy(true);

}

test();

// registerDeploy('Personal-Website', ['Download', 'Deletion', 'Upload'], async (deploy, host) => {
//     deploy.createDeploy(); // Creates a dir to do the deploy in
//     deploy.exec('git pull origin master'); // Executes any ssh-deploy command in the dir
//     deploy.step(); // Steps to the next in this case 'Deletion'
//     deploy.delete('README.md'); // Deletes on file in the dir
//     deploy.delete(['.git', '.gitignore']); // Deletes an array of files in the dir
//     deploy.step('Build'); // Steps to Building
//     deploy.exec('npm run build')
//     deploy.step(); //Steps to Upload
//     await host.connect('IP-DEPLOY-SERVER', 'username', 'password', 'PATH-TO-DIR'); // Connects to the deploy host and decides the path to upload in this case: /var/ww/html/proj
//     await host.upload(); // This will upload everything left in the dir
//     await host.upload('PATH');// This will upload everything in the sub path of the deploy dir
//     host.disconnect(); // Cleanes the connection
//     deploy.deleteDeploy(); // Deletes the dir where the deploy was done // A Boolean if should save or not
// });

function registerDeploy(name, steps, cb) {
    // console.log(name, steps, cb(new Deploy(name, steps), new Host()));
}

