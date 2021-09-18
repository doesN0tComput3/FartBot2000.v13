const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes messages from a channel')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount of messages to delete')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply({ content: '❌ Sorry kitten you don\'t have admin tho ☹', ephemeral: true });
		}

		const amount = interaction.options.getInteger('amount');
		const channel = interaction.channel;

		await channel.bulkDelete(amount, true);

		const embed = new MessageEmbed()
			.setTitle('Done!')
			.setColor('GREEN')
			.setDescription(`Successfully deleted ${amount} message(s) in ${channel}.`)
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 | /help', interaction.client.user.avatarURL());

		await interaction.reply({ embeds: [embed] });
	},
};