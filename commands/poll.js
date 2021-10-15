const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Runs a poll in the channel')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Question to ask')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('image')
				.setDescription('Attach image?')
				.addChoice('yes', 'yes')
				.addChoice('no', 'no')),
	async execute(interaction) {
		const question = interaction.options.getString('question');

		const pollEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Poll')
			.addField('**Question**', question, true)
			.addField('**Poll Started By**', interaction.user.toString())
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 • /help', interaction.client.user.avatarURL());

		if (interaction.options.getString('image') === 'yes') {
			const sendImageEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('Send an Image')
				.setDescription('Please check your DM\'s for instructions on how to send your image.')
				.setThumbnail(`${interaction.user.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter('FartBot2000 • /help', interaction.client.user.avatarURL());

			interaction.reply({ embeds: [sendImageEmbed], ephemeral: true });

			const dmEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('Send your photo')
				.setDescription('Send your photo here.\n\nMax time: 30s')
				.setThumbnail(`${interaction.user.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter('FartBot2000 • /help', interaction.client.user.avatarURL());

			interaction.user.send({ embeds: [dmEmbed] }).then(() => {
				const filter = m => m.author.id === interaction.user.id;

				interaction.user.dmChannel.awaitMessages({ filter, time: 30000, max: 1, errors: ['time'] })
					.then(async messages => {
						if (!messages) return interaction.user.send('❌ Too late, please try again.');
						const msg = messages.first();

						if (!msg.attachments) return interaction.user.send('❌ Attach something next time.');
						if (!msg.attachments.first().contentType.startsWith('image')
							|| msg.attachments.first().contentType.startsWith('video')) return interaction.user.send('❌ Attach a photo next time.');

						const image = msg.attachments.first() ? msg.attachments.first().proxyURL : null;
						pollEmbed.setImage(image);

						const poll = await interaction.channel.send({ embeds: [pollEmbed], fetchReply: true });
						poll.react('👍')
							.then(() => poll.react('👎'))
							.catch(error => console.error('One of the emojis failed to react:', error));

						await interaction.user.send('✅ Done!');
					}).catch(() => {
						interaction.user.send('❌ Too late, try again.');
					});
			});
		} else {
			const poll = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });
			poll.react('👍')
				.then(() => poll.react('👎'))
				.catch(error => console.error('One of the emojis failed to react:', error));
		}
	},
};