const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('DM\'s a person a message')
		.addUserOption(option =>
			option.setName('person')
				.setDescription('Person to DM')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message to send')
				.setRequired(true)),
	async execute(interaction) {
		const person = interaction.options.getUser('person');
		const message = interaction.options.getString('message');

		const messageEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('1 new message!')
			.setDescription('You have one new message...')
			.addField('**Message**', message, true)
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 | !help', interaction.client.user.avatarURL());

		person.send({ embeds: [messageEmbed] })
			.catch(error => {
				interaction.reply({ content: `❌ I couldn't send ${person} a message, most likely their dm's are off`, ephemeral: true });
				return console.log(error);
			});

		const senderEmbed = new Discord.MessageEmbed()
			.setColor('#39ff14')
			.setTitle('Message sent!')
			.setDescription(`Your message to ${person} has been sent.\n\n**Message:**\n${message}`)
			.setThumbnail(`${person.avatarURL()}`)
			.setTimestamp(message.createdAt)
			.setFooter('FartBot2000 | !help', interaction.client.user.avatarURL());

		await interaction.reply({ embeds: [senderEmbed], ephemeral: true });
	},
};