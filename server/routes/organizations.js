'use strict';

const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery, executeTransaction } = require('../util/db');
const { authenticateToken, isStudent, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/organizations';
const ENTITY = 'organizations';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const sql = `SELECT id, name, type FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.get(ENDPOINT + '/:id', authenticateToken, isStudent, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve organization information';
        const SUC_MESSAGE = 'Successfully retrieved organization information';
        const sql = `SELECT * FROM ${ENTITY} WHERE id = ?`;
        executeQuery(sql, [req.params.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such organization found',
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: results[0],
            });
        })
    })

    app.post(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to add organizations';
        const SUC_MESSAGE = 'Successfully added organizations';
        const payload = req.body;
        const err = validation.request.organizations.postOrganizationSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        executeQuery(sql, [Object.values(payload)], (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            })
        });
    });

    app.put(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to update organization record';
        const SUC_MESSAGE = 'Successfully updated organization record';
        const payload = req.body;
        const err = validation.request.organizations.putOrganizationDetailsSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE id=?`;
        executeQuery(sql, [payload.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: `No such organization found`,
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.put(ENDPOINT + '/budget', authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to update organization budget';
        const SUC_MESSAGE = 'Successfully updated organization budget';
        const payload = req.body;
        const err = validation.request.organizations.putOrganizationBudgetSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const queries = [];
        const vars = [];
        // Withdraw from department budget
        const withdrawSQL = `UPDATE departments
                             SET budget=(
                                 SELECT budget
                                 FROM (SELECT * FROM departments) depts
                                 WHERE id=(
                                     SELECT departmentID
                                     FROM (SELECT * FROM organizations) orgs
                                     WHERE id=?
                                 )
                             ) - ?
                             WHERE id=(
                                 SELECT departmentID
                                 FROM (SELECT * FROM organizations) orgs
                                 WHERE id=?
                             )`;
        queries.push(withdrawSQL);
        vars.push([payload.id, payload.amount, payload.id])
        // Deposit into organization budget
        const depositSQL = `UPDATE organizations
                            SET budget=(
                                SELECT budget
                                FROM (SELECT * FROM organizations) orgs
                                WHERE id=?
                            ) + ?
                            WHERE id=?`;
        queries.push(depositSQL);
        vars.push([payload.id, payload.amount, payload.id]);

        const isolation = "READ COMMITTED";
        executeTransaction(isolation, queries, vars, (err) => {
            if (err) {
                err.error = ERR_MESSAGE;
                return res.status(500).json(err);
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    })

    app.delete(ENDPOINT + '/:id', authenticateToken, isAdmin, async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted organization record';
        const ERR_MESSAGE = 'Failed to delete organization record';
        const organizationID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [organizationID], async (err, results) => {
            if (err) return err.status(500).json(err);
            if (results.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such organization found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
