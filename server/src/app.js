const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');
const passport = require('passport');
const expressJWT = require('express-jwt');
// require statements
require('./models');
require('./config/passport');

// create express server
const app = express();

// use statements
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

require('./routes')(app);

mongoose.connect(config.db.database,{
	useNewUrlParser: true 
}
);
app.listen(config.port);
