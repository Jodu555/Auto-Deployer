const axios = require('axios')

class Webhook {
    constructor({ name, type, url }) {
        this.name = name;
        this.type = type;
        this.url = url;
    }

    async call(content) {
        await axios.post(this.url, { content });
    }
}

module.exports = Webhook;