const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jesusballin')
		.setDescription('repost if jesus ballin'),
	async execute(interaction) {
		await interaction.reply('https://cdn.discordapp.com/attachments/749084221024239717/775417382989594635/image0.gif');
	},
};