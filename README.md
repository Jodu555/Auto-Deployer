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
* Steps for a Vue deploy:
    - Pull down code
    - run npm run build
    - delete all except dist
    - Move the dist to anoter folder

* Step for a HTML deploy:
    - Pull down code
    - delete .gitignore 
    - delete Readme
    - move all other to the specified location

* Steps for a Nodejs deployment:
    - Pull down the code
    - Delete unused files
    - somehow restart the running node process (maybe nodemon) || Kill the old screen and just start a new one


### Stretch
* [ ] Implement a database
    * [ ] Log every deployment
    * [ ] Display Deployments in an ui
* [ ] Implement multiple deploy hosts
* [ ] Implement a config file 
    * [ ] Store the server connections there
