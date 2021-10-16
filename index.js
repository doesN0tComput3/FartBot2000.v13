// FartBot2000-v13
// Updating FartBot2000 to discord.js
// ----------------------------------
// Require necessary packages
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const keepAlive = require('./server.js');
const statuses = require('./statuses.json');
const FartBot2000 = require('./package.json');

// Create client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

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
	console.log('Good evening.');

	setInterval(function() {
		const statusType = Math.floor(Math.random() * (6 - 1 + 1) + 1);

		// Playing statuses
		if (statusType >= 1 && statusType <= 2) {
			const status = Math.floor(Math.random() * statuses.playingStatus.length);
			client.user.setActivity(`${statuses.playingStatus[status]} • v${FartBot2000.version}`, { type: 'PLAYING' });
			// Listening statuses
		} else if (statusType >= 3 && statusType <= 4) {
			const status = Math.floor(Math.random() * statuses.listeningStatus.length);
			client.user.setActivity(`${statuses.listeningStatus[status]} • v${FartBot2000.version}`, { type: 'LISTENING' });
			// Watching statuses
		} else if (statusType >= 5 && statusType <= 6) {
			const status = Math.floor(Math.random() * statuses.watchingStatus.length);
			client.user.setActivity(`${statuses.watchingStatus[status]} • v${FartBot2000.version}`, { type: 'WATCHING' });
		}
	}, 10000);
});

// Handle promise rejections
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
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
		.setFooter(`FartBot2000 • v${FartBot2000.version}`, message.client.user.avatarURL())
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

// Edited message
client.editSnipes = new Map();
client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content.includes('https://') || oldMessage.content.includes('http://') || oldMessage.content.includes('www.')) return;
	if (newMessage.content.includes('https://') || newMessage.content.includes('http://') || newMessage.content.includes('www.')) return;
	if (!oldMessage.guild) return;
	if (!oldMessage.content) return;

	// Save message info
	client.editSnipes.set(oldMessage.channel.id, {
		oldContent: oldMessage.content,
		newContent: newMessage.content,
		author: oldMessage.author.tag,
		authorAvatar: oldMessage.author.avatarURL(),
		timestamp: newMessage.createdAt,
		oldImage: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
		newImage: newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : null,
	});

	const embed = new MessageEmbed()
		.setTitle('Message Edited')
		.setColor('YELLOW')
		.setDescription(`${oldMessage.author} edited their message in ${oldMessage.channel}.\n\n[Link to Message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
		.setThumbnail(oldMessage.author.avatarURL())
		.addField('Old Message', oldMessage.content, true)
		.addField('New Message', newMessage.content, true)
		.setTimestamp(newMessage.createdAt)
		.setFooter(`FartBot2000 • v${FartBot2000.version}`, oldMessage.client.user.avatarURL());

	const image = newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : null;

	if (image) {
		embed.setImage(image);
	}

	const channel = oldMessage.client.channels.cache.find(channel => channel.id === '800865975015833660');

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