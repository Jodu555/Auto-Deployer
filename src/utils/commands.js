const { CommandManager, Command } = require('@jodu555/commandmanager');
const commandManager = CommandManager.getCommandManager();

const { callDeploy, hasDeploy } = require('./utils');

commandManager.registerCommand(new Command(['trigger', 't'], 'trigger [name]', 'Triggers a Deployment without the github Hook', async (command, [...args], scope) => {
    const name = args[1];
    if (!name) return 'Please Provide the name!';
    if (!hasDeploy(name)) return 'A Deploy with this name dont exist!';
    console.log('Triggered Deployment: ' + name);
    await callDeploy(name, { scope: 'USER' });
    return 'Deployment Finished';
}));