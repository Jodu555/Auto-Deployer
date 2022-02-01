const { CommandManager, Command } = require('@jodu555/commandmanager');
const commandManager = CommandManager.getCommandManager();

const { callDeploy } = require('./utils');

commandManager.registerCommand(new Command('trigger', 'trigger [name]', 'Triggers a Deployment without the github Hook', async (command, [...args], scope) => {
    const name = args[1];
    if (!name) return 'Please Provide the name!';
    console.log('Triggered Deployment: ' + name);
    await callDeploy(name, { scope: 'USER' });
    return 'Deployment Finished';
}));