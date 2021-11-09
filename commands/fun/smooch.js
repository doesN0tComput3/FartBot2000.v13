const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('smooch')
		.setDescription('muah'),
	async execute(interaction) {
		await interaction.reply('https://media.discordapp.net/attachments/699833690175438878/775796573266378772/SMOOCH.gif');
	},
};