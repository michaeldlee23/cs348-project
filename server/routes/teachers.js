'use strict';

const bcrypt = require('bcryptjs');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { generateAccessToken, authenticateToken, isTeacher, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/teachers';
const ENTITY = 'teachers';

module.exports = (app) => {
    app.get(ENDPOINT + '/register', (req, res) => {
        const sql = `SELECT id, name from departments`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            const departments = JSON.parse(JSON.stringify(results));
            return res.render('teachers/registerTeachers.ejs', { departments });
        });
    });

    app.post(ENDPOINT + '/register', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add teacher';
        const SUC_MESSAGE = 'Successfully added teacher';
        const payload = req.body;
        const err = validation.request.teachers.postTeacherSchema.validate(payload).error;
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt);
        // Add auth scope
        payload.scope = 'TEACHER';

        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], (err) => {
            if (err) return res.status(500).json(err);
            const token = generateAccessToken({
                email: payload.email,
                scope: payload.scope,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token,
            });
        });
    });

    app.post(ENDPOINT + '/login', async (req, res) => {
        const ERR_MESSAGE = 'Failed to authenticate teacher';
        const SUC_MESSAGE = 'Successfully authenticated teacher';
        const payload = req.body;
        const err = validation.request.postAuthSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        const sql = `SELECT * FROM ${ENTITY} WHERE email=?`;
        executeQuery(sql, [payload.email], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0) return res.status(501).send('No account associated with email');
            const user = results[0];

            const validPass = await bcrypt.compare(payload.password, user.password);
            if (!validPass) return res.status(401).send('Incorrect password');
            const token = generateAccessToken({
                email: user.email,
                scope: user.scope,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token,
            });
        });
    });

    app.get(ENDPOINT, authenticateToken, isTeacher, (req, res) => {
        const sql = `SELECT id, email, last, first, middle FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT + '/:id', authenticateToken, isTeacher, async (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve teacher information';
        const payload = req.body;
        const err = validation.request.teachers.getTeacherSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        const sql = `SELECT * FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [req.params.id], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0)
                return res.status(403).json({
                    error: ERR_MESSAGE,
                    message: 'Access denied',
                });
            const validPass = await bcrypt.compare(payload.password, results[0].password)
            if (!validPass)
                return res.status(403).json({
                    error: ERR_MESSAGE,
                    message: 'Access denied',
                });
            delete results[0].password
            return res.status(200).json(results);
        });
    });

    app.put(ENDPOINT, authenticateToken, isTeacher, (req, res) => {
        const ERR_MESSAGE = 'Failed to update teacher record';
        const SUC_MESSAGE = 'Successfully updated teacher record';
        const payload = req.body;
        const err = validation.request.teachers.putTeacherSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=?`;
        executeQuery(sql, [payload.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No account associated with id'
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted teacher record';
        const ERR_MESSAGE = 'Failed to delete teacher record';
        const teacherID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [teacherID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such teacher found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
