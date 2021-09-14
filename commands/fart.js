const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fart')
		.setDescription('Fart (must be in vc)'),
	async execute(interaction) {
    const fart = Math.floor((Math.random() * config.farts.length));

    const connection = joinVoiceChannel({
      channelId: interaction.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator
    });
    const stream = ytdl(config.farts[fart], { filter: 'audioonly' });
    const subscription = connection.subscribe(stream);

    if (subscription) {
	    // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
	    setTimeout(() => subscription.unsubscribe(), 5_000);
    }
		await interaction.reply('boop!');
	},
};