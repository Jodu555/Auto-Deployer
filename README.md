# Auto-Deployer

An Selfmade Deployment system for some self education

## Feature List and Brain Storm

### Automated Deploy System

- Github Integration
- configurable Deploys
  - Commands
  - Files
- external Server to handel all this stuff
  - which ssh's into other servers to upload the necessary files

### Deployment Step Ideas

- Steps for a Vue deploy:

  - Pull down code
  - run npm run build
  - delete all except dist
  - Move the dist to anoter folder

- Step for a HTML deploy:

  - Pull down code
  - delete .gitignore
  - delete Readme
  - move all other to the specified location

- Steps for a Nodejs deployment:
  - Pull down the code
  - Delete unused files
  - somehow restart the running node process (maybe nodemon) || Kill the old screen and just start a new one

## Example

```js
deploy.createDeploy(); // Creates a dir to do the deploy in
deploy.exec(`git clone ${data.repository.url} .`); // Executes any ssh-deploy command in the dir the data comes with if you link the deploy
deploy.step(); // Steps to the next in this case 'Deletion'
deploy.delete('README.md'); // Deletes on file in the dir
deploy.delete(['.git', '.gitignore']); // Deletes an array of files in the dir
deploy.step('Build'); // Steps to Building
deploy.exec('npm run build');
deploy.step(); //Steps to Upload
await host.connect('IP-DEPLOY-SERVER', 'username', 'password', 'PATH-TO-DIR'); // Connects to the deploy host and decides the path to upload in this case: /var/ww/html/proj
await host.connect(config.get('Rooti')); // Connects to the deploy host and decides the path to upload in this case: /var/ww/html/proj
await host.upload(); // This will upload everything left in the dir
await host.upload('PATH'); // This will upload everything in the sub path of the deploy dir
host.disconnect(); // Cleanes the connection
deploy.deleteDeploy(); // Deletes the dir where the deploy was done // A Boolean if should save or not
```

## Command Ideas

- trigger / t : Triggers a deployment process
- list / ls : lists all registered deployment processes
- history / h : lists a history of all the already deployed processes
- info / i : Shows Informations about one specified deployment process

### Projects to Integrate

- [x] Personal Website
- [x] Ez-Uploader (Website)
- [x] Dev-Ez-Uploader (Dev Edittion)
- [x] GitHub-Information
- [ ] Amazon-Price-Tracker
- [x] CineFinn

### Stretch

- [ ] Implement a database
  - [ ] Log every deployment
  - [ ] Display Deployments in an ui
- [x] Implement multiple deploy hosts
- [x] Implement a config file
  - [x] Store the server connections there
- [x] Discord Webhook Integration
- [x] Slack Webhook Integration
- [ ] Upgrade to typescript
- [ ] On deploy store the current commit ID to trace back if something happens
- [ ] Implement a native Website renderer so it renders a file default on the slash route
- [ ] Implement a simple api to get deploy infos
- [ ] Implement hot swap deploys
