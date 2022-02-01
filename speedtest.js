const fs = require('fs')
const path = require('path')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()
// Putting entire directories
const p = path.join(__dirname, 'deployments', '#Personal-Website - Deployment');
console.log(p);


// console.log(uploadSingles(p, '/home/TEST'));

test(uploadSingles(p, '/home/TEST'));

async function upload(files) {
    const failed = [];
    const succeeded = [];
    for (const entity of files) {
        await ssh.putFiles([{ local: entity.lc, remote: entity.rm }]).then(() => {
            succeeded.push(entity)
        }, (error) => {
            failed.push({ ...entity, error });
        });
    }
    return { success: failed.length > 0, failed, succeeded };
}

async function test(files) {
    await ssh.connect({
        host: '78.108.216.90',
        username: 'root',
        password: ''
    });
    const status = await upload(files);

    console.log('Finished');
}