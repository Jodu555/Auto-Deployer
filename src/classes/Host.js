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
        console.log(config);
        await this.ssh.connect(config);
        this.cwd = initPath;
    }
    async upload(uploadPath = null) {
        console.log('Upload: START');
        const failed = []
        const succeeded = []
        const success = await this.ssh.putDirectory(this.deploy.dir, uploadPath ? path.join(this.cwd, uploadPath) : this.cwd, {
            recursive: true,
            concurrency: 10,
            tick: (localPath, remotePath, error) => {
                console.log('TICK', localPath, remotePath, error);
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
        console.log('Successs', { upload: { success, failed, succeeded } });
        this.deploy.appendRecord({ upload: { success, failed, succeeded } });
    }
    async exec() {
        //Important: This method executes an ssh command direct on your Host Machine
    }
    disconnect() {
        this.ssh.dispose();
    }
}

module.exports = Host;