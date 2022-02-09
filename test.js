const path = require('path');
const { exec } = require("child_process");

const dir = path.join(process.cwd(), 'deployments', '#EZ-Uploader - Deployment');


async function executeCommand(command, cwd) {
    return await new Promise((resolve, reject) => {
        exec(command, { encoding: 'utf8', cwd }, (error, stdout, stderr) => {
            if (error) {
                console.log(1);
                reject(error);
            }
            // { out: stdout?.split('\n'), err: stderr?.split('\n') }
            resolve([...stdout?.split('\n'), ...stderr?.split('\n')]);
        });
    })
}

async function run() {
    const out = await executeCommand('git clone https://github.com/Jodu555/ez-uploader.de .', dir)

    console.log('OOO', out);

    // console.log(`out: `, out.split('\n'));

}

run();

// const command = child_process.spawnSync('npm', ['i'], { encoding: 'utf8', cwd: dir });

// console.log(command);
