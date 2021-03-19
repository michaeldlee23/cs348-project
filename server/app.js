'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('./routes/students')(app);
require('./routes/courses')(app);
require('./routes/studentCourse')(app);

module.exports = app;
