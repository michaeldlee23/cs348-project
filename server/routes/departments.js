'use strict';

//const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { executeQuery, executeTransaction } = require('../util/db');
const { authenticateToken, isAdmin } = require('../util/authenticate');

const ENDPOINT = '/departments';
const ENTITY = 'departments';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const sql = `SELECT id, name FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) 
                return res.status(500).json(err);
            
            return res.status(200).json(results);
        });
    });

    app.get(ENDPOINT + '/add', (req, res) => {
        return res.render('admin/addDepartment.ejs');
    });

    app.get(ENDPOINT + '/:id', authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve department information';
        const SUC_MESSAGE = 'Successfully retrieved department information';
        const sql = `SELECT * FROM ${ENTITY} WHERE id = ?`;
        executeQuery(sql, [req.params.id], (err, results) => {
            if (err) return res.status(500).json(err);
            if(results.length==0){
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No department found',
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: results[0],
            });
        });
    });
    
    

    app.post(ENDPOINT + '/add', async (req, res) => {
        const ERR_MESSAGE = 'Failed to add department';
        const SUC_MESSAGE = 'Successfully added department';
        const payload = req.body;
        const err = validation.request.departments.postDepartmentSchema.validate(payload).error;
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

    app.put(ENDPOINT + '/merge', (req, res) => {
        const ERR_MESSAGE = 'Failed to merge departments';
        const SUC_MESSAGE = 'Successfully merged departments';
        const payload = req.body;
        const err = validation.request.departments.putMergeDepartmentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const queries = [];
        const vars = [];
        // Withdraw from department budget
        const changeCoursesSQL = `CALL changeDepartmentTable('courses',?,?)`;
        queries.push(changeCoursesSQL);
        vars.push([payload.keepid, payload.deleteid])

        const changeTeachersSQL = `CALL changeDepartmentTable('teachers',?,?)`;
        queries.push(changeTeachersSQL);
        vars.push([payload.keepid, payload.deleteid])
        
        const changeOrgSQL = `CALL changeDepartmentTable('organizations',?,?)`;
        queries.push(changeOrgSQL);
        vars.push([payload.keepid, payload.deleteid])
        // Deposit into organization budget
        const depositSQL = `CALL moveDepartmentFunds(?,?)`;
        queries.push(depositSQL);
        vars.push([payload.keepid, payload.deleteid]);
        const deleteSQL = `DELETE FROM departments WHERE id=?`;
        queries.push(deleteSQL);
        vars.push([payload.deleteid]);
        const isolation = "REPEATABLE READ";
        executeTransaction(isolation, queries, vars, (err) => {
            if (err) {
                err.error = ERR_MESSAGE;
                return res.status(500).json(err);
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    })

    app.post(ENDPOINT,authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to add departments';
        const SUC_MESSAGE = 'Successfully added departments';
        const payload = req.body;
        const err = validation.request.departments.postDepartmentSchema.validate(payload).error;
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
                data: payload
            });
        });
    });

    app.put(ENDPOINT, authenticateToken, isAdmin, (req, res) => {
        const ERR_MESSAGE = 'Failed to update department record';
        const SUC_MESSAGE = 'Successfully updated department record';
        const payload = req.body;
        const err = validation.request.departments.putDepartmentSchema.validate(payload).error;
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
                    message: `No department with id ${payload.id}`
                });
            }
            if (err) return res.status(500).json(err);
            
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload
            });
        });
    });

    app.delete(ENDPOINT + '/:id', async (req, res) => {
        const SUC_MESSAGE = 'Successfully deleted department record';
        const ERR_MESSAGE = 'Failed to delete department record';
        const departmentID = req.params.id;
        const sql = `DELETE FROM ${ENTITY} WHERE id=?`;
        executeQuery(sql, [departmentID], async (err, info) => {
            if (err) return err.status(500).json(err);
            if (info.length == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'No such department found',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
