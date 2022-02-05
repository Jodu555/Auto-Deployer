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
    notify() {
        const hooks = require('../utils/utils').getConfig().data.webhooks.map(e => new Webhook(e));
        hooks.forEach(hook => {
            hook.call(`Deployment Finished: ${this.ID} in ${this.record['-1'].timeDifference} milliseconds`);
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
    exec(command, args = []) {
        if (args.length == 0) {
            const arr = command.split(' ');
            command = arr.shift();
            args = arr;
        }
        const process = child_process.spawnSync(command, args, { encoding: 'utf8', cwd: this.dir });
        if (process.error) {
            console.log("ERROR: ", process.error);
        }
        const output = [...process.stdout.split('\n'), ...process.stderr.split('\n')];
        this.appendRecord({ output, success: process.status == 0, status: process.status });
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