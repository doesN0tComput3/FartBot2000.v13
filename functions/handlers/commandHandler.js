const fs = require('fs');

module.exports = (client) => {
	client.commandHandler = async () => {
		const commandFolders = fs.readdirSync('./commands');
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				console.log(command.data);
				client.properties.commandArray.push(command.data.toJSON());
				client.properties.commands.set(command.data.name, command);
				console.log(`${file}'s content registered as the ${command.data.name} command.`);
			}
		}

		await client.registerSlashCommands();
	};
};