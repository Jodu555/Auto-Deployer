const Config = require('../classes/Config');
const Deploy = require('../classes/Deploy');
const Host = require('../classes/Host');
const deploys = new Map();
let config = null;


const setupConfig = () => {
    return config = new Config();
};

const registerDeploy = (name, steps, cb) => {
    deploys.set(name, { steps, cb });
}

const callDeploy = async (name, GH_DATA) => {
    const { steps, cb } = getDeploy(name);
    const deploy = new Deploy(name, steps)
    const host = new Host(deploy);
    await cb(deploy, host, GH_DATA, config);
}

const getDeploy = (name) => deploys.get(name);
const getConfig = () => config;
const getDeploys = () => deploys;

module.exports = {
    setupConfig,
    getConfig,
    registerDeploy,
    getDeploy,
    getDeploys,
    callDeploy,
}