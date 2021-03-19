'use strict';

const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');

const ENDPOINT = '/studentCourse';
const ENTITY = 'studentCourseRel';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res, next) => {
        const ERR_MESSAGE = 'Failed to retrieve student-course mappings';
        const sql = `SELECT * FROM ${ENTITY}`;
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

    app.post(ENDPOINT, (req, res, next) => {
        const ERR_MESSAGE = 'Failed to enrolled student in course';
        const SUC_MESSAGE = 'Successfully enrolled student in course';
        const payload = req.body;
        const err = validation.request.postStudentCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
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

    app.put(ENDPOINT, (req, res, next) => {
        const ERR_MESSAGE = 'Failed to update course grade for student';
        const SUC_MESSAGE = 'Successfully updated course grade for student';
        const payload = req.body;
        const err = validation.request.putStudentCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const {studentID, courseID} = payload;
        delete payload.studentID;
        delete payload.courseID;
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE studentID=${studentID} AND courseID=${courseID}`;
        console.log(sql);
        pool.query(sql, async (err, results, fields) => {
            if (results.changedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: `No student with id ${studentID} in course with id ${courseID}`
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
