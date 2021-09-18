const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snipe')
		.setDescription('Sends the last deleted message in the channel'),
	async execute(interaction) {
		const msg = interaction.client.snipes.get(interaction.channelId);
		if (!msg) {
			return interaction.reply('❌ there wasn\'t any messages to snipe sorry broski');
		}

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(msg.author, msg.authorAvatar)
			.setDescription(msg.content)
			.setTimestamp(msg.timestamp)
			.setFooter('FartBot2000 • /help', interaction.client.user.avatarURL());

		if (msg.image) {
			embed.setImage(msg.image);
		}

		await interaction.reply({ embeds: [embed] });
	},
};