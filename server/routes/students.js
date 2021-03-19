'use strict';

const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');

const ENDPOINT = '/students';
const ENTITY = 'students';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve students';
        const sql = `SELECT * FROM ${ENTITY}`;
        pool.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to add student';
        const SUC_MESSAGE = 'Successfully added student';
        const payload = req.body;
        const err = validation.request.postStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        pool.query(sql, [Object.values(payload)], async (err) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload
            });
        });
    });

    app.put(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to update student record';
        const SUC_MESSAGE = 'Successfully updated student record';
        const payload = req.body;
        const err = validation.request.putStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=${payload.id}`;
        pool.query(sql, async (err, results) => {
            if (results.changedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: `No student with id ${payload.id}`
                });
            }
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload
            });
        });
    });
}
