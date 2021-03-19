'use strict';

const mysql = require('mysql');
const info = require('../env/cred');

const getPool = () => {
    const pool = mysql.createPool(info);
    return pool;
}

module.exports = getPool();
