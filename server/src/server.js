const app = require('./app.js');
const config = require('./config/config');
const mongoose = require('mongoose');
// require statements

require('./models');
require('./config/passport');


mongoose.connect(config.db.database, {
	useNewUrlParser: true
})
	.then(() => {
	}, err => {
		console.log(err);
	});
console.log(process.env.NODE_ENV);
app.listen(config.port, config.serverIp);