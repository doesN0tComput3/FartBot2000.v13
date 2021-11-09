const fs = require('fs');

module.exports = (client) => {
	client.eventHandler = async () => {
		const events = fs.readdirSync('./events');

		for (const folder of events) {
			const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));

			if (folder == 'discord.js') {
				for (const file of eventFiles) {
					const event = require(`../../events/${folder}/${file}`);
					if (event.once) {
						client.once(event.name, (...args) => event.execute(...args));
					} else {
						client.on(event.name, (...args) => event.execute(...args));
					}
					console.log(`${file}'s content registered as the ${event.name} Discord.js event.`);
				}
			}
			/* else if (folder == 'mongoose') {
				for (const file of eventFiles) {
					const event = require(`./events/${folder}/${file}`);
					if (event.once) {
						mongoose.connection.once(event.name, (...args) => event.execute(...args, client));
					} else {
						mongoose.connection.on(event.name, (...args) => event.execute(...args, client));
					}
					console.log(`${file}'s content registered as the ${event.name} Mongoose connection event.`));
				}
			} */
		}
	};
};