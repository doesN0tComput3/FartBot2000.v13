const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();

module.exports = (client) => {
	client.registerSlashCommands = async () => {
		try {
			const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
			console.log(chalk.blue('[Slash Commands]: ') + chalk.cyan('Registering guild commands...'));

			await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: client.properties.commandArray },
			);

			console.log(chalk.blue('[Slash Commands]: ') + chalk.cyan('Registration completed without issues!'));
		} catch (error) {
			console.error(error);

		}
	};
};