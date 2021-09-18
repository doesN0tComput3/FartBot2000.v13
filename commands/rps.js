const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Rock paper scissors'),
	async execute(interaction) {
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('rock')
					.setLabel('Rock')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomId('paper')
					.setLabel('Paper')
					.setStyle('SUCCESS'),
				new Discord.MessageButton()
					.setLabel('Scissors')
					.setCustomId('scissors')
					.setStyle('DANGER'),
			);

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Welcome to Rock Paper Scissors!')
			.setDescription('Please **select an option** (times out in 15s)')
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp(interaction.createdAt)
			.setFooter('FartBot2000 | /help', interaction.client.user.avatarURL());

		await interaction.reply({ embeds: [embed], components: [row] });
		const possibleAnswers = ['Rock', 'Paper', 'Scissors'];
		const answer = Math.floor((Math.random() * possibleAnswers.length));

		const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000, max: 1 });

		collector.on('collect', i => {
			if (!i.user.id === interaction.user.id) {
				i.reply({ content: 'go away this isn\'t for you.', ephemeral: true });
			} else {
				// nice, move on
			}
		});

		collector.on('end', async (collection) => {
			if (collection.first()?.customId === 'rock') {
				const embed = new Discord.MessageEmbed()
					.setThumbnail(interaction.user.avatarURL())
					.setTimestamp(interaction.createdAt)
					.setFooter('FartBot2000 | /help', interaction.client.user.avatarURL());

				if (possibleAnswers[answer] === 'Rock') {
					embed.setColor('#ffff00');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`We both chose **${possibleAnswers[answer]}**, **it's a tie!**`);
				} else if (possibleAnswers[answer] === 'Paper') {
					embed.setColor('#ff0000');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Rock,** and I chose **${possibleAnswers[answer]}. L**`);
				} else {
					embed.setColor('#39ff14');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Rock,** and I chose **${possibleAnswers[answer]}. You win!**`);
				}

				await interaction.editReply({ content: ' ', embeds: [embed], components: [] });
			} else if (collection.first()?.customId === 'paper') {
				const embed = new Discord.MessageEmbed()
					.setThumbnail(interaction.user.avatarURL())
					.setTimestamp(interaction.createdAt)
					.setFooter('FartBot2000 | /help', interaction.client.user.avatarURL());

				if (possibleAnswers[answer] === 'Rock') {
					embed.setColor('#39ff14');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Paper,** and I chose **${possibleAnswers[answer]}. You win!**`);
				} else if (possibleAnswers[answer] === 'Paper') {
					embed.setColor('#ffff00');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`We both chose **${possibleAnswers[answer]}, it's a tie!**`);
				} else {
					embed.setColor('#ff0000');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Paper,** and I chose **${possibleAnswers[answer]}. L**`);
				}

				await interaction.editReply({ content: ' ', embeds: [embed], components: [] });
			} else if (collection.first()?.customId === 'scissors') {
				const embed = new Discord.MessageEmbed()
					.setThumbnail(interaction.user.avatarURL())
					.setTimestamp(interaction.createdAt)
					.setFooter('FartBot2000 | /help', interaction.client.user.avatarURL());

				if (possibleAnswers[answer] === 'Rock') {
					embed.setColor('#ff0000');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Scissors,** and I chose **${possibleAnswers[answer]}. L**`);
				} else if (possibleAnswers[answer] === 'Paper') {
					embed.setColor('#39ff14');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`You chose **Scissors,** and I chose **${possibleAnswers[answer]}, You win!**`);
				} else {
					embed.setColor('#ffff00');
					embed.setTitle(`${possibleAnswers[answer]}!`);
					embed.setDescription(`We both chose **${possibleAnswers[answer]}, it's a tie!**`);
				}

				await interaction.editReply({ content: ' ', embeds: [embed], components: [] });
			} else {
				await interaction.editReply({ content: '**Game timed out**', components: [] });
			}
		});
	},
};