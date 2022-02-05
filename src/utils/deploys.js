const { registerDeploy } = require('./utils');

registerDeploy('Personal-Website', {
    steps: ['Download', 'Deletion', 'Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/Personal-Website',
    gh_repo_SECRET: 'TEST123',
    webhooks: ['test'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        deploy.exec(`git clone https://github.com/Jodu555/Personal-Website .`);
        deploy.step();
        deploy.delete('README.md');
        deploy.delete(['.git', '.gitignore', '.vscode']);
        deploy.step();

        await host.connect(config.get('dsh'), '/home/DEPLOY');
        await host.upload();
        host.disconnect();

        deploy.deleteDeploy();
    });