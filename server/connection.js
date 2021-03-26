'use strict';

const mysql = require('mysql');
const config = require('../env/config');

const getPool = () => {
    const pool = mysql.createPool(config.connectionCreds);
    return pool;
}

module.exports = getPool();
