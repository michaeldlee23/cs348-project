'use strict';

const pool = require('../connection');
const validation = require('../validation');

const ENDPOINT = '/teacherCourse';
const ENTITY = 'teacherCourseRel';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve teacher-course mappings';
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
        const ERR_MESSAGE = 'Failed to assign teacher to a course';
        const SUC_MESSAGE = 'Successfully assigned teacher to course';
        const payload = req.body;
        const err = validation.request.postTeacherCourseSchema.validate(payload).error;
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
}
