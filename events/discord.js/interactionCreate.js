const Discord = require('discord.js');
const FartBot2000 = require('../../package.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);

			const embed = new Discord.MessageEmbed()
				.setTitle(`/${interaction.commandName}`)
				.setThumbnail(interaction.user.avatarURL())
				.setTimestamp(interaction.createdAt)
				.setColor('GREEN')
				.addField('User', `${interaction.user}`, true)
				.addField('Channel', `${interaction.channel}`, true)
				.setFooter(`FartBot2000 • v${FartBot2000.version}`, interaction.client.user.avatarURL());

			if (!interaction.ephemeral) {
				const reply = await interaction.fetchReply();
				const replyId = reply.id;

				embed.addField('Link', `[Link to Command](https://discord.com/channels/${interaction.guild.id}/${interaction.channelId}/${replyId})`);

				if (reply.content.length > 25) {
					embed.addField('Reply', 'Reply is too large to send here.', true);
				} else {
					embed.addField('Reply', reply.content, true);
				}
			}

			const logChannel = interaction.client.channels.cache.get('904469691798536232');
			logChannel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: '❌ There was an error trying to execute this command :(', ephemeral: true });
		}
	},
};