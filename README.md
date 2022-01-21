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
deploy.exec('git pull origin master'); // Executes any ssh-deploy command in the dir
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

### Stretch

- [ ] Implement a database
  - [ ] Log every deployment
  - [ ] Display Deployments in an ui
- [ ] Implement multiple deploy hosts
- [ ] Implement a config file
  - [ ] Store the server connections there
