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
app.use(cors());
app.use(passport.initialize());

require('./routes')(app);


app.use((err, req, res, next) => {
	/* 
        catch error and send unauthorized response
    */
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({'message' : err.name + ': ' + err.message});
	}
});
mongoose.connect(config.db.database,{
	useNewUrlParser: true 
}
);
app.listen(config.port);
