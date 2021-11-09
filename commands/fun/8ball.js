const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');
const FartBot2000 = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the magic 8ball...')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Question to ask the 8 ball')
				.setRequired(true)),
	async execute(interaction) {
		const result = Math.floor((Math.random() * config.responses.length));

		const question = interaction.options.getString('question');

		const embed = new Discord.MessageEmbed()
			.setTitle('8-Ball')
			.addField('**Question**', question, true)
			.addField('**Answer**', config.responses[result])
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());
		if (result === 0 || result === 1 || result === 2 || result === 3 || result === 4 || result === 5 || result === 6 || result === 7 || result === 8 || result === 9) {
			embed.setColor('#39ff14');
		} else if (result === 10 || result === 11 || result === 12 || result === 13 || result === 14) {
			embed.setColor('#ffff00');
		} else {
			embed.setColor('#ff0000');
		}

		await interaction.reply({ embeds: [embed] });
	},
};