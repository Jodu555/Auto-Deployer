const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const merge = require('deepmerge');
const Webhook = require('./Webhook');

const deploymentsDirectory = path.join(process.cwd(), 'deployments');
const historyDirectory = path.join(process.cwd(), 'history');

class Deploy {
    constructor(ID, { steps, webhooks }) {
        this.ID = ID;
        this.steps = steps;
        this.webhooks = webhooks;
        this.stepIdx = 0;
        this.dir = null;
        this.currStep = null;
        this.record = null;
    }
    notify(message = null) {
        const confHooks = require('../utils/utils').getConfig().data.webhooks;
        const hooks = this.webhooks.map(e => new Webhook(confHooks.find(x => x.name)));
        if (message == null) {
            message = `Deployment Finished: ${this.ID} in ${this.record['-1'].timeDifference} milliseconds`;
        }
        hooks.forEach(hook => {
            hook.call(message);
        });
    }
    currentStep() {
        return this.currStep ? this.currStep : this.steps[this.stepIdx];
    }
    createDeploy() {
        this.dir = path.join(deploymentsDirectory, `#${this.ID} - Deployment`);
        if (fs.existsSync(this.dir)) fs.rmSync(this.dir, { recursive: true });
        fs.mkdirSync(this.dir);
        this.record = {};
        this.record['0'] = { time: Date.now(), dir: this.dir };
    }
    deleteDeploy(save = true) {
        const time = Date.now();
        const timeDifference = time - this.record['0'].time;
        this.record['-1'] = { time, saved: save, timeDifference };
        if (save) {
            const historyFile = path.join(historyDirectory, `${this.ID}--${time}--output.json`)
            fs.writeFileSync(historyFile, JSON.stringify(this.record, null, 2), 'utf-8');
        }
        this.notify();
        fs.rmSync(this.dir, { recursive: true });
    }
    async exec(command) {
        const output = [...await this.deepExecPromisify(command, this.dir)];
        this.appendRecord({ output, success: process.status == 0, status: process.status });
    }
    async deepExecPromisify(command, cwd) {
        return await new Promise((resolve, reject) => {
            child_process.exec(command, { encoding: 'utf8', cwd }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                if (stderr) {
                    reject(stderr);
                }
                resolve(stdout)
            });
        })
    }
    step(name) {
        if (name) {
            this.currStep = name
        } else {
            this.stepIdx++;
            this.currStep = null;
        }
    }
    delete(arg) {
        arg = Array.isArray(arg) ? arg : [arg];
        arg.forEach(node => {
            if (fs.statSync(path.join(this.dir, node)).isDirectory()) {
                fs.rmSync(path.join(this.dir, node), { recursive: true });
            } else {
                fs.rmSync(path.join(this.dir, node));
            }
        });
        this.appendRecord({ deletedFiles: arg })
    }
    appendRecord(obj) {
        this.record[this.currentStep()] = merge(this.getCurrentRecord(), obj);
    }
    getCurrentRecord() {
        return this.record[this.currentStep()];
    }
}

module.exports = Deploy;