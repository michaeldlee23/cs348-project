'use strict';

const bcrypt = require('bcryptjs');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { generateAccessToken, authenticateToken, isAdvisor, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/advisors';
const ENTITY = 'advisors';

module.exports = (app) => {
    app.get(ENDPOINT + '/register', (req, res) => {
        return res.render('advisors/registerAdvisors.ejs');
    });

    app.post(ENDPOINT + '/register', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add advisor';
        const SUC_MESSAGE = 'Successfully added advisor';
        const payload = req.body;
        const err = validation.request.advisors.postAdvisorSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });

        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt);
        // Add auth scope
        payload.scope = 'ADVISOR';

        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], (err, results) => {
            if (err) return res.status(500).json(err);
            const token = generateAccessToken({
                id: results.insertId,
                email: payload.email,
                scope: payload.scope,
            });
            res.cookie('token',token,{
                httpOnly:true,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token,
            });
        });
    });

    app.post(ENDPOINT + '/login', async (req, res) => {
        const ERR_MESSAGE = 'Failed to authenticate advisors';
        const SUC_MESSAGE = 'Successfully authenticated advisors';
        const payload = req.body;
        const err = validation.request.postAuthSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `SELECT * FROM ${ENTITY} WHERE email=?`;
        executeQuery(sql, [payload.email], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0) return res.status(401).send('No account associated with email');
            const user = results[0];

            const validPass = await bcrypt.compare(payload.password, user.password);
            if (!validPass) return res.status(401).send('Incorrect password');
            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                scope: user.scope,
            });
            res.cookie('token',token,{
                httpOnly:true,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token,
            });
        });
    });

    app.get(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const sql = `SELECT id, email, last, first, middle, salary FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.get(ENDPOINT + '/:id/info', (req, res) => {
        const infoSQL = `SELECT * FROM ${ENTITY} WHERE id=?`;
        const courseDataSQL = `CALL getCourseData(-1)`
    
        executeQuery(infoSQL, [req.params.id], (err, info) => {
            if (err)  return res.status(500).json(err); 
            if (!info[0]) return res.status(403).send("Forbidden");
            delete info[0].password;
            executeQuery(courseDataSQL, [req.params.id], (er, cData) => {
                console.log(cData);
                return res.render('advisors/advisorInfo.ejs',{id:req.params.id,info1:info, courses:cData[0]});
            })
        });
    });

    app.get(ENDPOINT + '/:id/info/:course', (req, res) => {
        const p = req.params.course.split("?")
        const courseID = p[0];
        const parameter = p.length > 1 ? p[1] : null;
        const params = {}
        const ERR_MESSAGE = 'Failed to retrieve course details';
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
            return res.render('advisors/manageStudents.ejs',{id:req.params.id,students:results, courseID:courseID});
        });
    });

    app.post(ENDPOINT + '/:id', authenticateToken, isAdvisor, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve advisor information';
        const payload = req.body;
        const err = validation.request.advisors.getAdvisorSchema.validate(payload).error;
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
        })
    });

    //#region TEMP put endpoint without auth
    app.put(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to update advisor record';
        const SUC_MESSAGE = 'Successfully updated advisor record';
        const payload = req.body;
        const err = validation.request.advisors.putAdvisorSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=?`;
        executeQuery(sql, [payload.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0)
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No account associated with id',
                });
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });
    //#endregion

    app.put(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const ERR_MESSAGE = 'Failed to update advisor record';
        const SUC_MESSAGE = 'Successfully updated advisor record';
        const payload = req.body;
        const err = validation.request.advisors.putAdvisorSchema.validate(payload).error;
        if (err)
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=?`;
        executeQuery(sql, [payload.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0)
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No account associated with id',
                });
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted advisor record';
        const ERR_MESSAGE = 'Failed to delete advisor record';
        const advisorID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [advisorID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such advisor found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
