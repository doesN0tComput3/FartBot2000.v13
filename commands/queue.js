const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Queue'),
	async execute(interaction) {
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return interaction.reply('Nothing\'s playing right now...');

		const queue = await music.getQueue({
			interaction: interaction,
		});

		let response = '';

		for (let i = 0; i < queue.length; i++) {
			response += `${i + 1}. [${queue[i].info.title}](${queue[i].info.url}) - ${queue[i].info.duration}\n`;
		}

		interaction.reply({ content: response });
	},
};