const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');



const loginLimit = rateLimit({
	windowMs: 15 * 60 * 100,
	max: config.ratelimits.login,
	skipSuccessfulRequests: true,
	message: 'Max attempts reached. Please try again later.',
});
const limiter = rateLimit({
	windowMs: 15 * 60 * 100,
	message: 'You are abusing your priviledge. Please try again later.',
	max: config.ratelimits.default,
});
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 100,
	message: 'Too many requests made. Please try again later.',
	max: config.ratelimits.api,
});
const addUserLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: config.ratelimits.adduser,
	message: 'Too many accounts created from this IP, please try again after an hour',
});
// create express server
const app = express();

// API declarations
app.use(bodyParser.json({ limit: '300kb',
	extended: true }));
app.use(bodyParser.urlencoded({ extended: true,
	limit: '300kb' }));

app.use(flash());
app.use(helmet.hidePoweredBy());
app.disable('x-powered-by');
app.disable('x-ratelimit-limit');
app.use(limiter);
app.use('/login', loginLimit);
app.use('/api/', apiLimiter);
app.use('/api/addUser/', addUserLimiter);
app.use(morgan('combined'));
app.use(cors({ credentials: true,
	origin: true }));
app.use(passport.initialize());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
require('./routes')(app);

module.exports = app;
