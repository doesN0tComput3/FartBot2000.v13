const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play\'s a song in vc')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('Search or enter a URL')
				.setRequired(true)),
	async execute(interaction) {
		const song = interaction.options.getString('song');

		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ content: '❌ You should probably be in a vc...just sayin.', ephemeral: true });

		music.play({
			interaction: interaction,
			channel: voiceChannel,
			song: song,
		});

		await interaction.reply('ok.');
	},
};