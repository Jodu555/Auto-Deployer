


registerDeploy('Personal-Website', ['Download', 'Deletion', 'Upload'], async (deploy, host, data, config) => {
    deploy.createDeploy();
    deploy.exec(`git clone ${data.repository.url} .`);
    deploy.step();
    deploy.delete('README.md');
    deploy.delete(['.git', '.gitignore']);
    deploy.step();

    await host.connect(config.get('ci'), '/home/Test');
    await host.upload();
    host.disconnect();

    deploy.deleteDeploy();
});

const config = new Config();

console.log(config.get('example'));

function registerDeploy(name, steps, cb) {
    console.log(name, steps);
    const GH_DATA = {};
    // cb(new Deploy(name, steps), new Host(), GH_DATA, config);

}

