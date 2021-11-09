const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (client) => {
	client.registerSlashCommands = async () => {
		try {
			const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
			console.log('Registering guild commands...');

			await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: client.properties.commandArray },
			);

			console.log('Successfully registered application commands.');
		} catch (error) {
			console.error(error);

		}
	};
};