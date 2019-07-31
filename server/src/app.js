const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');
const passport = require('passport');
// require statements
require('./models');
require('./config/passport');

// create express server
const app = express();

// use statements
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));
app.use(passport.initialize());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
require('./routes')(app);
console.log('before mongoose connect');
mongoose.connect(config.db.database, {
	useNewUrlParser: true,
	user: config.db.user, 
	pass: config.db.password})
	.then(() => {
		console.log('connected to server.');
	}, err => {
		console.log('error connecting to mongodb');
		console.log(err);
	});
// mongoose.connect(config.db.database, {
// 	useNewUrlParser: true 
// })
// 	.then(() => {
// 		console.log('connected to server.');
// 	}, err => {
// 		console.log('error connecting to mongodb');
// 		console.log(err);
// 	});
console.log('#### OUTPUT PORT & SERVERIP ####');
console.log(config.port);
console.log(config.serverIp);
console.log(config.db.database);
app.listen(config.port, config.serverIp);
console.log('after listening..');