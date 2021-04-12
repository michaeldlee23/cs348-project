'use strict';

const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { checkIfRecordExists, executeQuery } = require('../util/db');
const { authenticateToken, isTeacher, isAdvisor } = require('../util/authenticate');

const ENDPOINT = '/studentCourse';
const ENTITY = 'studentCourseRel';

module.exports = (app) => {
    app.get(ENDPOINT, authenticateToken, isTeacher, (req, res) => {
        const sql = `SELECT * FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT, authenticateToken, isAdvisor, async (req, res) => {
        const ERR_MESSAGE = 'Failed to enrolled student in course';
        const SUC_MESSAGE = 'Successfully enrolled student in course';
        const payload = req.body;
        const err = validation.request.students.postStudentCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }
        const queryPromises = [];
        queryPromises.push(new Promise((resolve, reject) => {
            checkIfRecordExists(payload.studentID, 'students', (err, result) => {
                if (err) reject(err);
                if (result) resolve();
                reject();
            });
        }));
        queryPromises.push(new Promise((resolve, reject) => {
            checkIfRecordExists(payload.courseID, 'courses', (err, result) => {
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
                });
            })
            .catch((err) => {
                if (err) return res.status(500).json(err);
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and course',
                });
            });
    });

    app.put(ENDPOINT, authenticateToken, isTeacher, (req, res) => {
        const ERR_MESSAGE = 'Failed to update course grade for student';
        const SUC_MESSAGE = 'Successfully updated course grade for student';
        const payload = req.body;
        const err = validation.request.students.putStudentCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const { studentID, courseID } = payload;
        delete payload.studentID;
        delete payload.courseID;
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE studentID=? AND courseID=?`;
        executeQuery(sql, [studentID, courseID], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and course'
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.delete(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const ERR_MESSAGE = 'Failed to drop student from course';
        const SUC_MESSAGE = 'Successfully dropped student from course';
        const payload = req.body;
        const err = validation.request.students.deleteStudentCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const { studentID, courseID } = payload;
        const sql = `DELETE FROM ${ENTITY} WHERE studentID=? AND courseID=?`;
        executeQuery(sql, [studentID, courseID], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and course',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
