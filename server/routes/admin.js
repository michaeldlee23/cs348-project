'use strict';

const bcrypt = require('bcryptjs');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { generateAccessToken, authenticateToken, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/admin';
const ENTITY = 'admin';

module.exports = (app) => {
    app.get(ENDPOINT + '/salaries', (req, res) => {
        const sql = `SELECT scope AS position, id, email, salary FROM ((SELECT scope, id, email, salary FROM advisors) UNION (SELECT scope, id, email, salary FROM teachers)) AS a;`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.render('admin/salaries.ejs', {userData: results});
        });
    });

    app.get(ENDPOINT + '/register', (req, res) => {
        return res.render('admin/registerAdmin.ejs');
    });
    app.get(ENDPOINT + '/login', (req, res) => {
        return res.render('admin/loginAdmin.ejs');
    });

    app.post(ENDPOINT + '/register', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add admin';
        const SUC_MESSAGE = 'Successfully added admin';
        const payload = req.body;
        const err = validation.request.admins.postAdminSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }

        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt);
        // Add auth scope
        payload.scope = 'ADMIN';

        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], async (err) => {
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
        const ERR_MESSAGE = 'Failed to authenticate admin';
        const SUC_MESSAGE = 'Successfully authenticated admin';
        const payload = req.body;
        const err = validation.request.postAuthSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `SELECT * FROM ${ENTITY} WHERE email='${payload.email}'`;
        executeQuery(sql, async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0) return res.status(401).send('No account associated with email');
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

    app.get(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const sql = `SELECT id, email, last, first, middle FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT + '/:id', authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed ot retrieve admin information';
        const payload = req.body;
        const err = validation.request.admin.getAdminSchema.validate(payload).error;
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
            delete results[0].password;
            return res.status(200).json(results[0]);
        });
    });

    app.put(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to update admin record';
        const SUC_MESSAGE = 'Successfully updated admin record';
        const payload = req.body;
        const err = validation.request.admins.putAdminSchema.validate(payload).error;
        if (err) return res.status(500).json(err);
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id='${payload.id}'`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0)
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No account associated with id'
                });
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted admin record';
        const ERR_MESSAGE = 'Failed to delete admin record';
        const adminID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [adminID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such admin found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
