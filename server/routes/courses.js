'use strict';

const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { authenticateToken, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/courses';
const ENTITY = 'courses';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve courses';
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
        pool.query(sql, async (err, results) => {
            if (results.affectedRows == 0) {
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
