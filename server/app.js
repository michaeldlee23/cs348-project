'use strict';

const express = require('express');
const app = express();
app.use(express.json());

require('./routes/students')(app);
require('./routes/courses')(app);
require('./routes/studentCourse')(app);

require('./routes/teachers')(app);
module.exports = app;
