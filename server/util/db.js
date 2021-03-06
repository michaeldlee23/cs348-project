'use strict';

const pool = require('../connection');

const findUserByEmail = async (email, entity, callback) => {
    const sql = `SELECT id FROM ${entity} WHERE email = ?`;
    executeQuery(sql, [email], (err, results) => {
        if (err) return callback(err);
        if (results.length == 0) return callback();
        return callback(null, results[0]);
    });
}

const checkIfRecordExists = async (id, entity, callback) => {
    const sql = `SELECT id FROM ${entity} WHERE id = ?`;
    executeQuery(sql, [id], (err, results) => {
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

const executeTransaction = async (isolation, queries, vars, callback) => {
    const UNEXPECTED_ERROR = 'Internal Service Error'
    await pool.getConnection(async (err, connection) => {
        if (err) {
            return callback({
                error: UNEXPECTED_ERROR,
                message: err.message,
            });
        }
        await connection.query('SET TRANSACTION ISOLATION LEVEL ?', isolation);
        await connection.beginTransaction(async (err) => {
            if (err) {
                connection.rollback(() => { connection.release(); });
            } else {
                const queryPromises = [];
                for (let i = 0; i < queries.length; i++) {
                    queryPromises.push(new Promise((resolve, reject) => {
                        connection.query(queries[i], vars[i], (err, results) => {
                            if (err) {
                                console.log("REJECTING " + i);
                                console.log(vars[i]);
                                reject(err);
                            } else {
                                console.log("RESOLVING " + i);
                                console.log(vars[i]);
                                resolve(queries[i], results);
                            }
                        });
                    }));
                }
                await Promise.all(queryPromises)
                    .then((query, results) => {
                        connection.commit((err) => {
                            console.log(query);
                            console.log(results);
                            console.log('Committing');
                            if (err) {
                                connection.rollback((err) => {
                                    if (err) connection.release();
                                });
                                return callback({
                                    error: UNEXPECTED_ERROR,
                                    message: 'Failed to commit transaction',
                                });
                            } else {
                                connection.release();
                                return callback(null, results);
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        console.log('Rolling back...');
                        connection.rollback((err) => {
                            if (err) console.log('Rollback failed.');
                            else console.log('Rollback successful.');
                            connection.release(); 
                        });
                        return callback({
                            error: UNEXPECTED_ERROR,
                            message: err.message,
                        });
                    });
            }
        });
    });
}

module.exports = {
    findUserByEmail,
    checkIfRecordExists,
    executeQuery,
    executeTransaction,
}
