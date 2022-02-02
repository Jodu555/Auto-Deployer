const fs = require('fs');
const path = require('path');

class Config {
    constructor(cfgPath = null) {
        this.cfgPath = this.cfgPath || path.join(process.cwd(), 'config.json');
        this.data = {};
        this.load();
    }
    load() {
        if (fs.existsSync(this.cfgPath)) {
            this.data = JSON.parse(fs.readFileSync(this.cfgPath, 'utf-8'));
        } else {
            this.data = {
                servers: [
                    { name: 'ExampleServer', alias: 'example', host: '1.1.1.1', username: 'example', password: 'SuperSecretPassword' }
                ],
            };
        }
        this.save();
    }
    set(server) {
        this.data.servers.push(server);
    }
    get(search) {
        let server = null;
        this.data.servers.forEach(entry => {
            if (entry.name.toLowerCase() == search.toLowerCase())
                server = entry;
            if (entry.alias?.toLowerCase() == search.toLowerCase())
                server = entry;
        });
        if (!server)
            server = this.data.servers[Number(search)];

        if (!server)
            throw new Error('There is no Server with name or index: ' + search)

        return server;
    }
    save() {
        fs.writeFileSync(this.cfgPath, JSON.stringify(this.data, null, 4), 'utf-8');
    }
}

module.exports = Config;
