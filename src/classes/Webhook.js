const axios = require('axios');

class Webhook {
	constructor({ name, type, url }) {
		this.name = name;
		this.type = type;
		this.url = url;
	}

	async call(content) {
		if (this.type == 'discord') await axios.post(this.url, { content });

		if (this.type == 'slack') await axios.post(this.url, { text: content });

		if (this.type == 'gotify') {
			await axios.post(this.url, {
				title: 'Auto-Deployer',
				message: content,
				priority: 5,
			});
		}
	}
}

module.exports = Webhook;
