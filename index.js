// FartBot2000-v13
// Updating FartBot2000 to discord.js
// ----------------------------------
// Require necessary packages
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const keepAlive = require('./server.js');

// Create client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Reading command files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Configure dotenv
dotenv.config();

// Once the client is ready, this will run (once)
client.once('ready', () => {
	console.log('Hello.');
});

// When an interaction is created, this will run
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '❌ There was an error trying to execute this command :(', ephemeral: true });
	}
});

// Keep bot alive
keepAlive();

// Login to bot
client.login(process.env.TOKEN);