const path = require('path');
const { exec } = require("child_process");

const dir = path.join(process.cwd(), 'deployments', '#EZ-Uploader - Deployment');


async function executeCommand(command, cwd) {
    return await new Promise((resolve, reject) => {
        exec(command, { encoding: 'utf8', cwd }, (error, stdout, stderr) => {
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

async function run() {
    const out =

        console.log(`out: `, out.split('\n'));

}

run();

// const command = child_process.spawnSync('npm', ['i'], { encoding: 'utf8', cwd: dir });

// console.log(command);
