'use strict';

const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { authenticateToken, isAdmin, isTeacher } = require('../util/authenticate');

const ENDPOINT = '/courses';
const ENTITY = 'courses';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const sql = `SELECT * FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.get(ENDPOINT + '/add', (req, res) => {
        const sql = `SELECT * FROM departments`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.render('admin/addCourse.ejs', {userData: results});
        });
    });

    app.post(ENDPOINT + '/add', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add course';
        const SUC_MESSAGE = 'Successfully added course';
        const payload = req.body;
        const err = validation.request.courses.postCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }

        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], async (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({
                message: SUC_MESSAGE,
            });
        });
    });

    app.get(ENDPOINT + '/:id', authenticateToken, isTeacher, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve course details';
        const courseID = req.params.id;
        const params = req.query;
        const err = validation.request.courses.getCourseSchema.validate(params).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: 'Malformed request',
            });
        }
        params.sortby = params.sortby || 'last';
        params.order = params.order || 'asc';
        params.limit = params.limit || 30;
        const searchLast = params.last ? `AND last LIKE '${params.last}%'` : '';
        const searchFirst = params.first ? `AND first LIKE '${params.first}%'` : '';

        // No prepared statement because we manually sanitize via request validation
        const sql = `SELECT S.id, S.last, S.first, S.middle, grade
                     FROM students S 
                     INNER JOIN studentCourseRel SC ON S.id = SC.studentID
                     INNER JOIN courses C ON SC.courseID = C.id
                     WHERE C.id = ? ${searchLast} ${searchFirst}
                     ORDER BY ${params.sortby} ${params.order}
                     LIMIT ${params.limit}`;
        executeQuery(sql, [courseID], (err, results) => {
            if (err) return res.status(500).json(err);
            console.log(results);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to add course';
        const SUC_MESSAGE = 'Successfully added course';
        const payload = req.body;
        const err = validation.request.courses.postCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.put(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to update course record';
        const SUC_MESSAGE = 'Successfully updated course record';
        const payload = req.body;
        const err = validation.request.courses.putCourseSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=${payload.id}`;
        executeQuery(sql, (err, results) => {
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
    });

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted course record';
        const ERR_MESSAGE = 'Failed to delete course record';
        const courseID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [courseID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such course found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
