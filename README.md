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
* Steps for vueJS client deploy:
    - Pull down code
    - run npm run build
    - delete all except dist
    - Move the dist to anoter folder

* Step for a normal thml deploy:
    - Pull down code
    - delete .gitignore 
    - delete Readme
    - move all other to the specified location

* Steps for nodejs deployment:
    - Pull down the code
    - Delete unused files
    - somehow restart the running node process (maybe nodemon) || Kill the old screen and just start a new one
