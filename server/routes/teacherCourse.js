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
        const err = validation.request.teachers.postTeacherCourseSchema.validate(payload).error;
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
        const ERR_MESSAGE = 'Failed to update teacher-course record';
        const SUC_MESSAGE = 'Successfully updated teacher-course record';
        const payload = req.body;
        if (payload.teacherID === "" || isNaN(payload.teacherID)) {
            const sql = `DELETE FROM ${ENTITY} WHERE courseID=${payload.courseID}`;
            pool.query(sql, (err, results) => {
                if (results.affectedRows == 0) {
                    return res.status(404).json({
                        error: ERR_MESSAGE,
                        message: 'No such course found',
                    });
                }
                if (err) return res.status(500).json(err);
                return res.status(200).json({
                    message: SUC_MESSAGE,
                    data: payload,
                });
            });
        }
        else {
            const err = validation.request.teachers.putTeacherCourseSchema.validate(payload).error;
            if (err) {
                return res.status(400).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            const values = payloadToUpdateSpecial(payload);
            const sql = `UPDATE ${ENTITY} SET ${values} WHERE courseID=${payload.courseID}`;
            pool.query(sql, (err, results) => {
                if (results.affectedRows == 0) {
                    return res.status(404).json({
                        error: ERR_MESSAGE,
                        message: 'No such course found',
                    });
                }
                if (err) return res.status(500).json(err);
                return res.status(200).json({
                    message: SUC_MESSAGE,
                    data: payload,
                });
            });
        }
    });
}


const payloadToUpdateSpecial = (payload) => {
    let res = '';
    for (const key in payload) {
        if (key == 'courseID') {
            continue; // Never update the primary key
        }
        if (typeof(payload[key]) == 'string') {
            res += `,${key}='${payload[key]}'`;
        } else {
            res += `,${key}=${payload[key]}`;
        }
    }
    return res.substr(1);
};