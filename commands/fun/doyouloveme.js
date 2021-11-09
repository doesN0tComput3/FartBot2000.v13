const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('doyouloveme')
		.setDescription('Do you love me, FartBot2000?'),
	async execute(interaction) {
		await interaction.reply(`Of course I do, ${interaction.user} <3`);
	},
};