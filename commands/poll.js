const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Runs a poll in the channel')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Question to ask')
				.setRequired(true)),
	async execute(interaction) {
		const question = interaction.options.getString('question');

		const pollEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Poll')
			.addField('**Question**', question, true)
			.addField('**Poll Started By**', interaction.user.toString())
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 | !help', interaction.client.user.avatarURL());

		const poll = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });
		poll.react('👍')
			.then(() => poll.react('👎'))
			.catch(error => console.error('One of the emojis failed to react:', error));
	},
};