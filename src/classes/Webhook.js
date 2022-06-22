const axios = require('axios')

class Webhook {
    constructor({ name, type, url }) {
        this.name = name;
        this.type = type;
        this.url = url;
    }

    async call(content) {
        if (type == 'discord')
            await axios.post(this.url, { content });

        if (type == 'slack')
            await axios.post(this.url, { text: content });
    }
}

module.exports = Webhook;