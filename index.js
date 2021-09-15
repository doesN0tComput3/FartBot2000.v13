// FartBot2000-v13
// Updating FartBot2000 to discord.js
// ----------------------------------
// Require necessary packages
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const keepAlive = require('./server.js');

// Create client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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

// Deleted message
client.snipes = new Map();
client.on('messageDelete', message => {
	if (message.author.bot) return;

	// Save message info
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author.tag,
		authorAvatar: message.author.avatarURL(),
		timestamp: message.createdAt,
		image: message.attachments.first() ? message.attachments.first().proxyURL : null,
	});
	// Logs into channel
	const embed = new MessageEmbed()
		.setTitle('Message Deleted')
		.setColor('RED')
		.setThumbnail(message.author.avatarURL())
		.addField('Author', message.author.toString(), true)
		.setFooter('FartBot2000 | !help', message.client.user.avatarURL())
		.setTimestamp(message.createdAt);

	if (message.content) {
		embed.setDescription(`A message was deleted in ${message.channel}!`);
		embed.addField('Message', message.content, true);
	}
	// Adds image in if one exists
	const image = client.snipes.get(message.channel.id).image;
	if (image) {
		embed.setDescription(`A message was deleted in ${message.channel}!`);
		embed.setImage(image);
	}
	const channel = message.client.channels.cache.find(channel => channel.id === '800815475822821436');
	channel.send({ embeds: [embed] });
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