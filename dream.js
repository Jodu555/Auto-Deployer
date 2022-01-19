/**
 * Important:
 *      This is just dream code (how i want this code to look)
 *      This code dont works its just an Convention
 *      Of what i would like this to be
 */

class SSH {
    constructor(ID, steps) {
        this.ID = ID;
        this.steps = steps;
    }

    createDeploy() {

    }
    deleteDeploy() {

    }
    exec() {

    }
    step() {

    }
    delete() {

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

registerDepoy('project-name-html', ['Download', 'Deletion', 'Upload'], (ssh, host) => {
    ssh.createDeploy(); // Creates a dir to do the deploy in
    ssh.exec('git pull origin master'); // Executes any ssh command in the dir
    ssh.step(); // Steps to the next in this case 'Deletion'
    ssh.delete('README.md'); // Deletes on file in the dir
    ssh.delete(['.git', '.gitignore']); // Deletes an array of files in the dir
    ssh.step('Build'); // Steps to Building
    ssh.exec('npm run build')
    ssh.step(); //Steps to Upload
    host.connect('IP-DEPLOY-SERVER', 'username', 'password', 'PATH-TO-DIR'); // Connects to the deploy host and decides the path to upload in this case: /var/ww/html/proj
    host.upload(); // This will upload everything left in the dir
    host.upload('PATH');// This will upload everything in the path
    host.disconnect(); // Cleanes the connection
    ssh.deleteDeploy(); // Deletes the dir where the deploy was done
});

function registerDepoy(name, steps, cb) {
    console.log(name, steps, cb(new SSH(name, steps)));
}

