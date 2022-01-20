const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
/**
 * Important:
 *      This is just dream code (how i want this code to look)
 *      This code dont works its just an Convention
 *      Of what i would like this to be
 */
const deploymentsDirectory = path.join(process.cwd(), 'deployments');
console.log(deploymentsDirectory);

class Deploy {
    constructor(ID, steps) {
        this.ID = ID;
        this.steps = steps;
        this.stepIdx = 0;
        this.dir = null;
        this.currStep = null;
        this.record = null;
    }

    currentStep() {
        return this.currStep ? this.currStep : this.steps[this.stepIdx];
    }

    createDeploy() {
        this.dir = path.join(deploymentsDirectory, `#${this.ID} - Deployment`);
        fs.mkdirSync(this.dir);
        this.record = {};
        this.record['0'] = this.dir
    }
    deleteDeploy(save) {
        if (save) {
            fs.writeFileSync('./' + this.ID + '--output.json', JSON.stringify(this.record, null, 2), 'utf-8');
        }
        fs.rmdirSync(this.dir);
    }
    exec() {
        const process = child_process.spawnSync("ls", ["-la"], { encoding: 'utf8', cwd: this.dir });
        if (process.error) {
            console.log("ERROR: ", process.error);
        }
        console.log("stdout: ",);
        if (process.stderr == '' && process.status == 0) {
            this.record[this.currentStep()] = { output: process.stdout.split('\n'), success: true, status: process.status };
        } else {
            this.record[this.currentStep()] = { output: process.stdout.split('\n'), error: process.stderr.split('\n'), success: false, status: process.status };
        }
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
        arg.forEach(file => {
            fs.rmSync(path.join(this.dir, file));
        });
    }
}

class Host {
    connect() {

    }
    upload() {

    }
    disconnect() {

    }
}

const deploy = new Deploy('Test-123', ['Download', 'Test', 'Build', 'Deletion', 'Upload']);
console.log();
deploy.createDeploy();
deploy.exec();
console.log(deploy);
deploy.deleteDeploy(true);

// registerDeploy('project-name-html', ['Download', 'Deletion', 'Upload'], (deploy, host) => {
//     deploy.createDeploy(); // Creates a dir to do the deploy in
//     deploy.exec('git pull origin master'); // Executes any ssh-deploy command in the dir
//     deploy.step(); // Steps to the next in this case 'Deletion'
//     deploy.delete('README.md'); // Deletes on file in the dir
//     deploy.delete(['.git', '.gitignore']); // Deletes an array of files in the dir
//     deploy.step('Build'); // Steps to Building
//     deploy.exec('npm run build')
//     deploy.step(); //Steps to Upload
//     host.connect('IP-DEPLOY-SERVER', 'username', 'password', 'PATH-TO-DIR'); // Connects to the deploy host and decides the path to upload in this case: /var/ww/html/proj
//     host.upload(); // This will upload everything left in the dir
//     host.upload('PATH');// This will upload everything in the path
//     host.disconnect(); // Cleanes the connection
//     deploy.deleteDeploy(); // Deletes the dir where the deploy was done // A Boolean if should save or not
// });

function registerDeploy(name, steps, cb) {
    console.log(name, steps, cb(new Deploy(name, steps), new Host()));
}

