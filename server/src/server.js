/* eslint-disable import/no-commonjs */
const app = require('./app.js');
const config = require('./config/config');
const mongoose = require('mongoose');
// require statements

require('./models');
require('./config/passport');


mongoose.connect(config.db.database, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log('success');
	}, err => {
		console.log(err);
	});

app.listen(config.port, config.serverIp);

module.exports = app; // for testing