const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ilove')
		.setDescription('How much do YOU love *that* person?')
		.addUserOption(option =>
			option.setName('person')
				.setDescription('Person you love')
				.setRequired(true)),
	async execute(interaction) {
		const person = interaction.options.getUser('person');
		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`**How much does ${interaction.user.username} love ${person.username}?**`)
			.setDescription(`**${interaction.user.username}** loves **${person}** this much:\n\n**${Math.floor(love)}%\n${loveLevel}**`)
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 • /help', interaction.client.user.avatarURL());

		await interaction.reply({ embeds: [embed] });
	},
};