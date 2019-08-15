const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const loginLimit = rateLimit({
	windowMs: 15 * 60 * 100,
	max: 100
});
const limiter = rateLimit({
	windowMs: 15 * 60 * 100,
	max: 100
});

// create express server
const app = express();

// API declarations
app.use(flash());
app.use(helmet());
app.disable('x-powered-by');
app.use(limiter);
app.use('/login', loginLimit);
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
module.exports = app;
