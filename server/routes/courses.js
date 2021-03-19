'use strict';

const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');

module.exports = (app) => {
    app.get('/courses', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to retrieve courses';
        const sql = 'SELECT * FROM courses';
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return res.status(200).json(results);
        });
    });

    app.post('/courses', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to add course';
        const SUC_MESSAGE = 'Successfully added course';
        const payload = req.body;
        const err = validation.request.postCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `INSERT INTO courses(${Object.keys(payload).toString()}) VALUES (?)`;
        pool.query(sql, [Object.values(payload)], async (err, results, fields) => {
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

    app.put('/courses', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to update course record';
        const SUC_MESSAGE = 'Successfully updated course record';
        const payload = req.body;
        const err = validation.request.putCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE courses SET ${values} WHERE id=${payload.id}`;
        pool.query(sql, async (err, results, fields) => {
            if (results.changedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: `No course with id ${payload.id}`
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