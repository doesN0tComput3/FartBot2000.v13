const { Collection } = require('discord.js');
const dotenv = require('dotenv');

// dotenv.config();

module.exports = (client) => {
	client.start = async () => {
		client.properties = {
			buttons: new Collection(),
			commands: new Collection(),
			commandArray: [],
		};

		await client.eventHandler();
		await client.commandHandler();
		// await client.buttonHandler();
		await client.login(process.env.TOKEN);
	};
};