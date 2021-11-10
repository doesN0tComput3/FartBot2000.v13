const fs = require('fs');
const chalk = require('chalk');

module.exports = (client) => {
	client.commandHandler = () => {
		const commandFolders = fs.readdirSync('./commands');
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				client.properties.commandArray.push(command.data.toJSON());
				client.properties.commands.set(command.data.name, command);
				console.log(chalk.blue('[Command Handler]: ') + chalk.yellow(`${file}'s content registered as the ${command.data.name} command.`));
			}
		}
	};
};