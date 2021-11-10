const express = require('express');
const chalk = require('chalk');
const server = express();

server.all('/', (req, res) => {
	res.send('OK');
});

function keepAlive() {
	server.listen(3000, () => { console.log(chalk.blue('[FartBot2000]: ') + chalk.cyan('Server is ready!')); });
}

module.exports = keepAlive;