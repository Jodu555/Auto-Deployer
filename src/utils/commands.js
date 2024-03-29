const { CommandManager, Command } = require('@jodu555/commandmanager');
const commandManager = CommandManager.getCommandManager();

const { callDeployByName, hasDeployByName, getDeploys } = require('./utils');
const History = require('../classes/History');

commandManager.registerCommand(
	new Command(['trigger', 't'], 'trigger [name]', 'Triggers a Deployment without the github Hook', async (command, [...args], scope) => {
		const name = args[1];
		const dry = args[2];
		const isDry = dry == '--dry=true' || false;
		if (!name) return 'Please Provide the name!';
		if (!hasDeployByName(name)) return 'A Deploy with this name dont exist!';
		console.log('Triggered Deployment: ' + name, { state: { dry: isDry } });
		await callDeployByName(name, { scope: 'USER' }, isDry);
		return 'Deployment Finished';
	})
);

commandManager.registerCommand(
	new Command(['list', 'ls'], 'list', 'Lists all registered deployment Processes', (command, [...args], scope) => {
		return [
			'Registered Deployment-Processes: ',
			...getDeploys().map((e) => {
				return `  - ${e.name} ${e.gh_repo_URL ? '\n      Linked to ' + e.gh_repo_URL : ''} ${
					e.webhooks.length != 0 ? '\n      Webhooks: ' + e.webhooks.join(', ') : ''
				}`;
			}),
			' ',
		];
	})
);

commandManager.registerCommand(
	new Command(['history', 'h'], 'history', 'Shows a history of all deploys', (command, [...args], scope) => {
		new History();
		return '';
	})
);
