const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');

require('./models')

// create express server
const app = express();

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app);

mongoose.connect(config.db.database,{
     useNewUrlParser: true 
    }
);
app.listen(config.port);
