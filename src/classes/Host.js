const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh');

class Host {
    constructor(deploy) {
        this.deploy = deploy;
        this.cwd = '';
        this.ssh = new NodeSSH();
    }
    async connect(host, username, password, initPath) {
        let config = {};
        if (host.host) {
            config = host
            initPath = username;
        } else {
            config = { host, username, password }
        }
        await this.ssh.connect(config);
        this.cwd = initPath;
    }
    async upload(uploadPath = '') {
        const files = this.listFiles(this.deploy.dir, path.join(this.cwd, uploadPath));

        const failed = [];
        const succeeded = [];
        for (const entity of files) {
            await this.ssh.putFiles([{ local: entity.lc, remote: entity.rm }]).then(() => {
                succeeded.push(entity)
            }, (error) => {
                failed.push({ ...entity, error });
            });
        }
        this.deploy.appendRecord({ success: failed.length == 0, failed, succeeded });
    }
    listFiles(lcPath, rmPath) {
        const files = [];
        fs.readdirSync(lcPath).map(e => { return { name: e, path: path.join(lcPath, e) } }).forEach(entity => {
            if (fs.statSync(entity.path).isDirectory()) {
                files.push(...this.listFiles(path.join(entity.path), path.join(rmPath, entity.name)));
            } else {
                files.push({ lc: entity.path, rm: path.join(rmPath, entity.name) });
            }
        });
        return files;
    }
    async exec() {
        //Important: This method executes an ssh command direct on your Host Machine
    }
    disconnect() {
        this.ssh.dispose();
    }
}

module.exports = Host;