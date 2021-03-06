'use strict';

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

// eslint-disable-next-line
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.json());

app.use(cookieParser());

require('./routes/students')(app);

require('./routes/courses')(app);
require('./routes/studentCourse')(app);
require('./routes/teacherCourse')(app);

require('./routes/teachers')(app);

require('./routes/organizations')(app);
require('./routes/studentOrganization')(app);

require('./routes/advisors')(app);

require('./routes/admin')(app);

require('./routes/departments')(app);

module.exports = app;
