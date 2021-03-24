'use strict';

const process = require('process');
const dotenv = require('dotenv');

dotenv.config();

const creds = {
    connectionLimit: 20,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const credsTest = {
    connectionLimit: 20,
    host: process.env.HOST_TEST,
    user: process.env.USER_TEST,
    password: process.env.PASSWORD_TEST,
    database: process.env.DATABASE_TEST,
};

module.exports = {
    connectionCreds: process.env.TEST ? credsTest : creds,
    secret: process.env.TOKEN_SECRET,
};
