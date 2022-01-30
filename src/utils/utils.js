const Config = require('./src/classes/Config');
const Deploy = require('./src/classes/Deploy');
const Host = require('./src/classes/Host');
const deploys = new Map();
let config = null;


const setupConfig = () => {
    return config = new Config();
};

const registerDeploy = (name, steps, cb) => {
    deploys.set(name, { steps, cb });
}

const callDeploy = (name, GH_DATA) => {
    const { steps, cb } = getDeploy(name);

    cb(new Deploy(name, steps), new Host(), GH_DATA, config);
}

const getDeploy = (name) => deploys.get(name);
const getConfig = () => config;
const getDeploys = () => deploys;

module.exports = {
    setupConfig,
    getConfig,
    registerDeploy,
    getDeploy,
    getDeploys
}