const axios = require('axios')

class WebHook {
    constructor({ name, type, url }) {
        this.name = name;
        this.type = type;
        this.url = url;
    }

    async call(message) {
        await axios.post(this.url, { content: 'TEST' });
    }
}

module.exports = WebHook;