const Discord = require('discord.js');
const FartBot2000 = require('../../package.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.properties.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: '❌ There was an error trying to execute this command :(', ephemeral: true });
		}
	},
};