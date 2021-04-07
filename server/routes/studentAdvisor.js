'use strict';

const validation = require('../validation');
const { checkIfRecordExists, executeQuery } = require('../util/db');
const { authenticateToken, isAdvisor } = require('../util/authenticate');

const ENDPOINT = '/studentAdvisor';
const ENTITY = 'studentAdvisorRel';

module.exports = (app) => {
    app.get(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const sql = `SELECT * FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT, authenticateToken, isAdvisor, async (req, res) => {
        const ERR_MESSAGE = 'Failed to add student to advisor';
        const SUC_MESSAGE = 'Successfully added student to advisor';
        const payload = req.body;
        const err = validation.request.students.postStudentAdvisorSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        // TODO: Check if the ids actually exist
        const queryPromises = [];
        queryPromises.push(new Promise((resolve, reject) => {
            checkIfRecordExists(payload.studentID, 'students', (err, result) => {
                if (err) reject(err);
                if (result) resolve();
                reject();
            });
        }));
        queryPromises.push(new Promise((resolve, reject) => {
            checkIfRecordExists(payload.advisorID, 'advisors', (err, result) => {
                if (err) reject(err);
                if (result) resolve();
                reject();
            });
        }));
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        await Promise.all(queryPromises)
            .then(() => {
                executeQuery(sql, [Object.values(payload)], async (err) => {
                    if (err) return res.status(500).json(err);
                    return res.status(200).json({
                        message: SUC_MESSAGE,
                        data: payload,
                    })
                })
            })
            .catch((err) => {
                if (err) return res.status(500).json(err);
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified users',
                });
            })
    });

    app.delete(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const ERR_MESSAGE = 'Failed to remove student from advisor';
        const SUC_MESSAGE = 'Successfully removed student from advisor';
        const payload = req.body;
        const err = validation.request.students.deleteStudentAdvisorSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `DELETE FROM ${ENTITY} WHERE studentID=? AND advisorID=?`;
        executeQuery(sql, [payload.studentID, payload.advisorID], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified users',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
