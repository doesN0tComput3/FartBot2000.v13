const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const FartBot2000 = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('DM\'s a person a message')
		.addUserOption(option =>
			option.setName('person')
				.setDescription('Person to DM')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message to send')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('image')
				.setDescription('Attach image?')
				.addChoice('yes', 'yes')
				.addChoice('no', 'no')),
	async execute(interaction) {
		const person = interaction.options.getUser('person');
		const message = interaction.options.getString('message');

		const messageEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('1 new message!')
			.setDescription('You have one new message...')
			.addField('**Message**', message, true)
			.setTimestamp(interaction.createdAt)
			.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

		const senderEmbed = new Discord.MessageEmbed()
			.setColor('#39ff14')
			.setTitle('Message sent!')
			.setDescription(`Your message to ${person} has been sent.\n\n**Message:**\n${message}`)
			.setThumbnail(`${person.avatarURL()}`)
			.setTimestamp(message.createdAt)
			.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

		if (interaction.options.getString('image') === 'yes') {
			const sendImageEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle(`Send an Image to ${person}`)
				.setDescription('Please check your DM\'s for instructions on how to send your image.')
				.setThumbnail(`${person.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

			interaction.reply({ embeds: [sendImageEmbed], ephemeral: true });

			const dmEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('Send your photo')
				.setDescription('Send your photo here.\n\nMax time: 30s')
				.setThumbnail(`${person.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

			interaction.user.send({ embeds: [dmEmbed] }).then(() => {
				const filter = m => m.author.id === interaction.user.id;

				interaction.user.dmChannel.awaitMessages({ filter, time: 30000, max: 1, errors: ['time'] })
					.then(messages => {
						if (!messages) return interaction.user.send('❌ Too late, please try again.');
						const msg = messages.first();

						if (!msg.attachments) return interaction.user.send('❌ Attach something next time.');
						if (!msg.attachments.first().contentType.startsWith('image')
						|| msg.attachments.first().contentType.startsWith('video')) return interaction.user.send('❌ Attach a photo next time.');

						const image = msg.attachments.first() ? msg.attachments.first().proxyURL : null;
						messageEmbed.setImage(image);
						senderEmbed.setImage(image);

						person.send({ embeds: [messageEmbed] })
							.catch(error => {
								interaction.user.send({ content: `❌ I couldn't send ${person} a message, most likely their dm's are off`, ephemeral: true });
								return console.log(error);
							});
						interaction.user.send({ embeds: [senderEmbed], ephemeral: true });
					}).catch(() => {
						interaction.user.send('❌ Too late, try again.');
					});
			});
		} else {
			person.send({ embeds: [messageEmbed] })
				.catch(error => {
					interaction.reply({ content: `❌ I couldn't send ${person} a message, most likely their dm's are off`, ephemeral: true });
					return console.log(error);
				});

			await interaction.reply({ embeds: [senderEmbed], ephemeral: true });
		}
	},
};