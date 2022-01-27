const path = require('path');
const { NodeSSH } = require('node-ssh');
const dotenv = require('dotenv').config();

const Deploy = require('./src/classes/Deploy');
const Config = require('./src/classes/Config');
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

