const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh');

class Host {
	constructor(deploy, dry = false) {
		this.deploy = deploy;
		this.cwd = '';
		this.ssh = new NodeSSH();
		this.dry = dry;
	}
	async connect(host, username, password, initPath) {
		if (dry) return;
		let config = {};
		if (host.host) {
			config = host;
			initPath = username;
		} else {
			config = { host, username, password };
		}
		await this.ssh.connect(config);
		this.cwd = initPath;
	}
	async upload(uploadPath = '', deployPath = '') {
		if (dry) return;
		const files = this.listFiles(path.join(this.deploy.dir, deployPath), path.join(this.cwd, uploadPath));

		const failed = [];
		const succeeded = [];
		for (const entity of files) {
			await this.ssh.putFiles([{ local: entity.lc, remote: entity.rm }]).then(
				() => {
					succeeded.push(entity);
				},
				(error) => {
					failed.push({ ...entity, error });
				}
			);
		}
		this.deploy.appendRecord({ success: failed.length == 0, failed, succeeded });
	}
	listFiles(lcPath, rmPath) {
		if (dry) return;
		const files = [];
		fs.readdirSync(lcPath)
			.map((e) => {
				return { name: e, path: path.join(lcPath, e) };
			})
			.forEach((entity) => {
				if (fs.statSync(entity.path).isDirectory()) {
					files.push(...this.listFiles(path.join(entity.path), path.join(rmPath, entity.name)));
				} else {
					files.push({ lc: entity.path, rm: path.join(rmPath, entity.name) });
				}
			});
		return files;
	}
	async exec() {
		if (dry) return;
		//Important: This method executes an ssh command direct on your Host Machine
	}
	disconnect() {
		if (dry) return;
		this.ssh.dispose();
	}
}

module.exports = Host;
