const { CommandManager, Command } = require('@jodu555/commandmanager');
const commandManager = CommandManager.getCommandManager();

const { callDeploy, hasDeployByName, getDeploys } = require('./utils');

commandManager.registerCommand(new Command(['trigger', 't'], 'trigger [name]', 'Triggers a Deployment without the github Hook', async (command, [...args], scope) => {
    const name = args[1];
    if (!name) return 'Please Provide the name!';
    if (!hasDeployByName(name)) return 'A Deploy with this name dont exist!';
    console.log('Triggered Deployment: ' + name);
    await callDeploy(name, { scope: 'USER' });
    return 'Deployment Finished';
}));

commandManager.registerCommand(new Command(['list', 'ls'], 'list', 'Lists all registered deployment Processes', (command, [...args], scope) => {
    return ['Registered Deployment-Processes: ', ...[...getDeploys().keys()].map(name => '  - ' + name), ' '];
}));