'use strict';

const pool = require('../connection');

const findStudentByEmail = async (email, callback) => {
    const sql = `SELECT id FROM students WHERE email = ?`;
    executeQuery(sql, [email], (err, results) => {
        if (err) return callback(err);
        if (results.length == 0) return callback();
        return callback(null, results[0]);
    });
}

const executeQuery = async (query, vars, callback) => {
    const UNEXPECTED_ERROR = 'Internal Service Error'
    pool.query(query, vars, (err, results) => {
        if (err) {
            console.log('INTERNAL SERVICE ERROR\n' + err.message);
            return callback({
                error: UNEXPECTED_ERROR,
                message: err.message,
            });
        } else {
            return callback(null, results);
        }
    })
}

module.exports = {
    findStudentByEmail,
    executeQuery,
}
