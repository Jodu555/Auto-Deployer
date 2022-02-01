const fs = require('fs')
const path = require('path')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()
// Putting entire directories
const p = path.join(__dirname, 'deployments', '#Personal-Website - Deployment');
console.log(p);


function uploadSingles(lcPath, rmPath) {
    const files = [];
    fs.readdirSync(lcPath).map(e => { return { name: e, path: path.join(lcPath, e) } }).forEach(entity => {
        if (fs.statSync(entity.path).isDirectory()) {
            files.push(...uploadSingles(path.join(entity.path), path.join(rmPath, entity.name)));
        } else {
            files.push({ lc: entity.path, rm: path.join(rmPath, entity.name) });
        }
    });
    return files;
}

// console.log(uploadSingles(p, '/home/TEST'));

test(uploadSingles(p, '/home/TEST'));

async function test(files) {
    await ssh.connect({
        host: 'ci.jodu555.de',
        username: 'root',
        password: 'xxxx'
    });

    const uploadProcesses = [];

    // files.forEach(entity => {
    //     uploadProcesses.push(ssh.putFiles([{ local: entity.lc, remote: entity.rm }]).then(function () {
    //         console.log(entity, "The File thing is done")
    //     }, function (error) {
    //         console.log(entity, "Something's wrong")
    //         console.log(error)
    //     }));
    // });
    for (const entity of files) {
        await ssh.putFiles([{ local: entity.lc, remote: entity.rm }]).then(function () {
            console.log(entity, "The File thing is done")
        }, function (error) {
            console.log(entity, "Something's wrong")
            console.log(error)
        });
    }
    console.log('Finish');

    return;

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