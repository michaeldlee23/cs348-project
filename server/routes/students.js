'use strict';

const bcrypt = require('bcryptjs');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { generateAccessToken, authenticateToken, isStudent, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/students';
const ENTITY = 'students';

module.exports = (app) => {
    app.get(ENDPOINT + '/register', (req,res) => {
        return res.render('students/registerStudents.ejs');
    });

    app.get(ENDPOINT + '/login', (req, res) => {
        return res.render('students/loginStudents.ejs');
    });

    app.post(ENDPOINT + '/register', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add student';
        const SUC_MESSAGE = 'Successfully added student';
        const payload = req.body;
        const err = validation.request.students.postStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }

        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt);
        // Add auth scope
        payload.scope = 'STUDENT';

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
        const ERR_MESSAGE = 'Failed to authenticate student';
        const SUC_MESSAGE = 'Successfully authenticated student';
        const payload = req.body;
        const err = validation.request.postAuthSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }
        const sql = `SELECT * FROM ${ENTITY} WHERE email=?`;
        executeQuery(sql, [payload.email], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0) 
                return res.status(401).json({
                    error: ERR_MESSAGE, 
                    message: 'Incorrect username or password',
                });
            const user = results[0];
            const validPass = await bcrypt.compare(payload.password, user.password);
            if (!validPass)
                return res.status(401).json({
                    error: ERR_MESSAGE, 
                    message: 'Incorrect username or password',
                });
            const token = generateAccessToken({
                email: user.email,
                scope: user.scope,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token,
            });
        })
    });

    app.get(ENDPOINT, authenticateToken, isStudent, (req, res) => {
        const sql = `SELECT id, email, last, first, middle, year FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        })
    });

    app.post(ENDPOINT + '/:id', authenticateToken, isStudent, async (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve student information';
        const payload = req.body;
        const err = validation.request.students.getStudentSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        const infoSQL = `SELECT * FROM ${ENTITY} WHERE id=?`;
        const gradesSQL = `SELECT name, grade
                           FROM students S
                           INNER JOIN studentCourseRel SC ON S.id = SC.studentID
                           INNER JOIN courses C ON SC.courseID = C.id
                           WHERE S.id = ?`;

        executeQuery(infoSQL, [req.params.id], async (err, info) => {
            if (err) return res.status(500).json(err);
            if (info.length == 0) {
                return res.status(403).json({
                    error: ERR_MESSAGE,
                    message: 'Access denied',
                });
            }
            const validPass = await bcrypt.compare(payload.password, info[0].password)
            if (!validPass)
                return res.status(403).json({
                    error: ERR_MESSAGE,
                    message: 'Access denied',
                });
            delete info[0].password;
            executeQuery(gradesSQL, [req.params.id], (err, grades) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    info,
                    grades,
                });
            })
        });
    });

    app.put(ENDPOINT, authenticateToken, isStudent, (req, res) => {
        const ERR_MESSAGE = 'Failed to update student record';
        const SUC_MESSAGE = 'Successfully updated student record';
        const payload = req.body;
        const err = validation.request.students.putStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=?`;
        executeQuery(sql, [payload.id], (err, results) => {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No account associated with id'
                });
            }
            if (err) return res.status(500).json(err);
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload
            });
        })
    });

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted student record';
        const ERR_MESSAGE = 'Failed to delete student record';
        const studentID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [studentID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such student found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
