const fs = require('fs')
const path = require('path')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

ssh.connect({

});

// Putting entire directories
const p = path.join(__dirname, 'deployments', '#Personal-Website - Deployment') + '\\';
console.log(p);
// return;
up();
function up() {
    const failed = [];
    const successful = [];
    ssh.putDirectory(p, '/home/TEST', {
        recursive: true,
        concurrency: 10,
        // ^ WARNING: Not all servers support high concurrency
        tick: (localPath, remotePath, error) => {
            console.log(1337, localPath, error);
            if (error) {
                failed.push(localPath);
            } else {
                successful.push(localPath);
            }
        }
    }).then((status) => {
        console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
        console.log('failed transfers', failed.join(', '));
        console.log('successful transfers', successful.join(', '));
    })
}