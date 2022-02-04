const fs = require('fs');
const path = require('path');
const historyDirectory = path.join(process.cwd(), 'history');

class History {
    constructor() {
        this.files = fs.readdirSync(historyDirectory);
        this.histories = this.files.map(e => {
            return {
                name: e.split('--')[0],
                time: e.split('--')[1]
            }
        });
        console.log(this);
    }
}

module.exports = History;