const Config = require('../classes/Config');
const Deploy = require('../classes/Deploy');
const Host = require('../classes/Host');
const deploys = [];
let config = null;


const setupConfig = () => {
    return config = new Config();
};

const registerDeploy = (name, settings, cb) => {
    deploys.push({ ...settings, name, cb });
}

const callDeploy = async (name, GH_DATA) => {
    const { steps, cb } = getDeployByName(name);
    const deploy = new Deploy(name, steps)
    const host = new Host(deploy);
    console.log('Technical deployment call!');
    // await cb(deploy, host, GH_DATA, config);
}

const getDeployByName = (name) => deploys.find(e => e.name.toLowerCase() === name.toLowerCase());
const hasDeployByName = (name) => Boolean(deploys.find(e => e.name.toLowerCase() === name.toLowerCase()));
const getConfig = () => config;
const getDeploys = () => deploys;

module.exports = {
    setupConfig,
    getConfig,
    registerDeploy,
    getDeployByName,
    hasDeployByName,
    getDeploys,
    callDeploy,
}