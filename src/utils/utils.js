const Config = require('../classes/Config');
const Deploy = require('../classes/Deploy');
const Host = require('../classes/Host');
const deploys = [];
let config = {};

const setupConfig = () => {
	config = new Config();
};

// deploy, host, data, config

/**
 * @callback deployCallCallback
 * @param {Deploy} deploy
 * @param {Host} host
 * @param {Object} data
 * @param {config} config
 */

/**
 * @param  {String} name
 * @param  {Object} settings
 * @param  {deployCallCallback} cb
 */
const registerDeploy = (name, settings, cb) => {
	deploys.push({ ...settings, name, cb });
};

const callDeepDeploy = async (data, GH_DATA, dry) => {
	const { name, steps, cb } = data;
	const deploy = new Deploy(name, data);
	const host = new Host(deploy, dry);
	GH_DATA = { ...GH_DATA, repository: { ...GH_DATA.repository, url: data.gh_repo_URL } };
	// console.log(4, 'Technical Deployment', data, GH_DATA);
	await cb(deploy, host, GH_DATA, config);
};

const callDeployByRepoURL = async (url, GH_DATA) => {
	await callDeepDeploy(getDeployByRepoUrl(url), GH_DATA);
};
const callDeployByName = async (name, GH_DATA, dry) => {
	await callDeepDeploy(getDeployByName(name), GH_DATA, dry);
};

const getDeployByName = (name) => deploys.find((e) => e.name.toLowerCase() === name.toLowerCase());
const hasDeployByName = (name) => Boolean(deploys.find((e) => e.name.toLowerCase() === name.toLowerCase()));

const getDeployByRepoUrl = (url) => deploys.find((e) => e.gh_repo_URL.toLowerCase() === url.toLowerCase());
const hasDeployByRepoUrl = (url) => Boolean(deploys.find((e) => e.gh_repo_URL.toLowerCase() === url.toLowerCase()));

const getConfig = () => config;
const getDeploys = () => deploys;

module.exports = {
	setupConfig,
	getConfig,
	registerDeploy,
	getDeployByName,
	hasDeployByName,
	getDeploys,
	callDeployByName,
	getDeployByRepoUrl,
	hasDeployByRepoUrl,
	callDeployByRepoURL,
	getConfig,
};
