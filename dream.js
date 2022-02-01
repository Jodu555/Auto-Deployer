const Config = require('./src/classes/Config')
const Deploy = require('./src/classes/Deploy')
const Host = require('./src/classes/Host')

const config = new Config();

registerDeploy('Personal-Website', ['Download', 'Deletion', 'Upload'], async (deploy, host, data, config) => {
    deploy.createDeploy();
    deploy.exec(`git clone https://github.com/Jodu555/Personal-Website .`);
    deploy.step();
    deploy.delete('README.md');
    deploy.delete(['.git', '.gitignore']);
    deploy.step();

    await host.connect(config.get('ci'), '/home/DEPL/TEST');
    await host.upload();
    host.disconnect();

    deploy.deleteDeploy();
});

function registerDeploy(name, steps, cb) {
    console.log(name, steps);
    const GH_DATA = {};
    const deploy = new Deploy(name, steps)
    const host = new Host(deploy);
    cb(deploy, host, GH_DATA, config);

}

