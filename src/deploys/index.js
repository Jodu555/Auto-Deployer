const { registerDeploy } = require('../utils/utils');


registerDeploy('Personal-Website', {
    steps: ['Download', 'Deletion', 'Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/Personal-Website',
    gh_repo_SECRET: '',
    webhooks: ['dc-deploy'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        deploy.exec(`git clone ${data.repository.url} .`);
        deploy.step();
        deploy.delete('README.md');
        deploy.delete(['.git', '.gitignore', '.vscode']);
        deploy.step();

        await host.connect(config.get('rooti'), '/var/www/html/root');
        await host.upload();
        host.disconnect();

        deploy.deleteDeploy();
    });

registerDeploy('EZ-Uploader', {
    steps: ['Download', 'Deletion', 'Installation', 'Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/ez-uploader.de',
    gh_repo_SECRET: '',
    webhooks: ['dc-deploy'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        deploy.exec(`git clone ${data.repository.url} .`);
        deploy.step();
        deploy.delete('README.md');
        deploy.delete(['.git', '.gitignore']);
        deploy.step();

        // await host.connect(config.get('rooti'), '/var/www/html/EzUploader');
        await host.connect(config.get('dsh'), '/home/DEPLOY');
        await host.upload('', 'Website');
        host.disconnect();

        deploy.deleteDeploy();
    });