const fs = require('fs');
const path = require('path');
const historyDirectory = path.join(process.cwd(), 'history');

class History {
    constructor() {
        this.files = fs.readdirSync(historyDirectory);
        this.histories = this.files.map(e => {
            const info = {
                name: e.split('--')[0],
                time: e.split('--')[1],
                contents: JSON.parse(fs.readFileSync(path.join(historyDirectory, e))),
            };

            info.taken = info.contents['-1'].timeDifference;
            return info;
        });
        console.log(this);
    }
}

module.exports = History;