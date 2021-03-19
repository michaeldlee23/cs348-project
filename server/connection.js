'use strict';

const mysql = require('mysql');
const info = require('../env/cred');

const getPool = () => {
    const pool = mysql.createPool(info);
    return pool;
}

const getConnection = () => {
    const connection = mysql.createConnection(info);
    connection.connect(async (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    return connection;
}

//module.exports = getConnection();
module.exports = getPool();
