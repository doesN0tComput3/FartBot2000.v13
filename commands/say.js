const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const FartBot2000 = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Repeats what you say')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('Text to say')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('image')
				.setDescription('Attach image?')
				.addChoice('yes', 'yes')
				.addChoice('no', 'no')),
	async execute(interaction) {
		const text = interaction.options.getString('text');

		if (interaction.options.getString('image') === 'yes') {
			const sendImageEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('Send an Image')
				.setDescription('Please check your DM\'s for instructions on how to send your image.')
				.setThumbnail(`${interaction.user.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

			interaction.reply({ embeds: [sendImageEmbed], ephemeral: true });

			const dmEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setTitle('Send your photo')
				.setDescription('Send your photo here.\n\nMax time: 30s')
				.setThumbnail(`${interaction.user.avatarURL()}`)
				.setTimestamp(interaction.createdAt)
				.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

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
						await interaction.channel.send({ content: text.toString(), files: [image] });

						await interaction.user.send('✅ Done!');
					}).catch(error => {
						interaction.user.send(`Ok.\n\n${error}`);
					});
			});
		} else {
			await interaction.channel.send(text);
			await interaction.reply({ content: '✅ Done!', ephemeral: true });
		}
	},
};