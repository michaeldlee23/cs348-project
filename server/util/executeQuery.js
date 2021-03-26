'use strict';

const pool = require('../connection');

const executeQuery = async (query, vars) => {
    console.log(query);
    return new Promise((resolve, reject) => {
        pool.query(query, vars, (err, results) => {
            if (err) {
                console.log('inside:\n' + err);
                return reject(err);
            } else {
                // console.log('resolving:\n' + results);
                return resolve(results);
            }
        });
    });
}

module.exports = executeQuery;