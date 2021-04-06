'use strict';

const bcrypt = require('bcryptjs');
const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery } = require('../util/db');
const { generateAccessToken, authenticateToken, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/admin';
const ENTITY = 'admin';

module.exports = (app) => {
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
        pool.query(sql, async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            if (results.length == 0) {
                return res.status(401).send('No account associated with email');
            }
            const user = results[0];

            const validPass = await bcrypt.compare(payload.password, user.password);
            if (!validPass) {
                return res.status(401).send('Incorrect password');
            }
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
        const ERR_MESSAGE = 'Failed to retrieve admin';
        const sql = `SELECT id, email, last, first, middle FROM ${ENTITY}`;
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

    app.get(ENDPOINT + '/:id', authenticateToken, isAdmin, (req, res) => {
        // TODO: Make this secure so admins can't see each other's info.
        //       Might need to make this a POST and take password as payload.
        const ERR_MESSAGE = 'Failed to retrieve admin information';
        const sql = `SELECT id, email, last, first, middle, role, salary
                     FROM ${ENTITY}
                     WHERE id=${req.params.id}`;
        pool.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message,
                });
            }
            return res.status(200).json(results[0]);
        })
    });

    app.post(ENDPOINT + '/register', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add admin';
        const SUC_MESSAGE = 'Successfully added admin';
        const payload = req.body;
        const err = validation.request.admin.postAdminSchema.validate(payload).error;
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
        pool.query(sql, [Object.values(payload)], async (err) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            const token = generateAccessToken({
                email: payload.email,
                scope: payload.scope,
            });
            return res.status(200).json({
                message: SUC_MESSAGE,
                jwt: token
            });
        });
    });

    app.put(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to update admin record';
        const SUC_MESSAGE = 'Successfully updated admin record';
        const payload = req.body;
        const err = validation.request.admin.putAdminSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id='${payload.id}'`;
        pool.query(sql, (err, results) => {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: 'No account associated with id'
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
