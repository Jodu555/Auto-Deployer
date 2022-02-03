const Config = require('../classes/Config');
const Deploy = require('../classes/Deploy');
const Host = require('../classes/Host');
const deploys = new Map();
let config = null;


const setupConfig = () => {
    return config = new Config();
};

const registerDeploy = (name, settings, cb) => {
    deploys.set(name, { ...settings, cb });
}

const callDeploy = async (name, GH_DATA) => {
    const { steps, cb } = getDeploy(name);
    const deploy = new Deploy(name, steps)
    const host = new Host(deploy);
    await cb(deploy, host, GH_DATA, config);
}

const getDeploy = (name) => deploys.get(name);
const hasDeploy = (name) => deploys.has(name);
const getConfig = () => config;
const getDeploys = () => deploys;

module.exports = {
    setupConfig,
    getConfig,
    registerDeploy,
    getDeploy,
    hasDeploy,
    getDeploys,
    callDeploy,
}