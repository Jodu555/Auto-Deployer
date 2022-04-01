const { registerDeploy } = require('../utils/utils');


registerDeploy('Personal-Website', {
    steps: ['Download', 'Deletion', 'Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/Personal-Website',
    gh_repo_SECRET: '',
    webhooks: ['dc-deploy'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        await deploy.exec(`git clone ${data.repository.url} .`);
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
    steps: ['Download', 'Deletion', 'Website-Uploader', 'Website-Deletion', 'Installation', 'Program-Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/ez-uploader.de',
    gh_repo_SECRET: '',
    webhooks: ['dc-deploy'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        await deploy.exec(`git clone ${data.repository.url} .`);
        deploy.step();
        deploy.delete('README.md');
        deploy.delete(['.git', '.gitignore']);
        deploy.step();

        await host.connect(config.get('rooti'), '/var/www/html/EzUploader');
        await host.upload('', 'Website');
        host.disconnect();
        deploy.step();
        deploy.delete('Website');
        deploy.step();
        await deploy.exec(`npm i`);
        deploy.step();
        await host.connect(config.get('rooti'), '/home/Backend/ez-uploader');
        await host.upload();
        host.disconnect();

        deploy.deleteDeploy();
    });

registerDeploy('GitHub-Info-API', {
    steps: ['Download', 'Deletion', 'Installation', 'Upload'],
    gh_repo_URL: 'https://github.com/Jodu555/github-information-api',
    gh_repo_SECRET: '',
    webhooks: ['dc-deploy'],
},
    async (deploy, host, data, config) => {
        deploy.createDeploy();
        await deploy.exec(`git clone ${data.repository.url} .`);
        deploy.step();
        deploy.delete('README.md');
        deploy.delete(['.git', '.gitignore']);
        deploy.step();
        await deploy.exec(`npm i`);
        deploy.step();
        await host.connect(config.get('rooti'), '/home/Backend/github-information-api');
        await host.upload();
        host.disconnect();
        deploy.deleteDeploy();
    });