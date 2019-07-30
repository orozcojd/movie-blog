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
mongoose.connect(config.db.database, {
	useNewUrlParser: true 
})
	.then(() => {
		console.log('connected to server!!');
	}, err => {console.log(err);});
app.listen(config.port, config.serverIp);
