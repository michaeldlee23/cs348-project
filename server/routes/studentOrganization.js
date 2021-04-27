'use strict';

const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');
const { checkIfRecordExists, executeQuery } = require('../util/db');
const { authenticateToken, isStudent, isAdvisor } = require('../util/authenticate');

const ENDPOINT = '/studentOrganization';
const ENTITY = 'studentOrganizationRel';

module.exports = (app) => {
    app.get(ENDPOINT, authenticateToken, isAdvisor, (req, res) => {
        const sql = `SELECT * FROM ${ENTITY}`;
        executeQuery(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    app.post(ENDPOINT, authenticateToken, isStudent, async (req, res) => {
        const ERR_MESSAGE = 'Failed to add student to organization';
        const SUC_MESSAGE = 'Successfully added student to organization';
        const payload = req.body;
        const err = validation.request.students.postStudentOrganizationSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
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
            checkIfRecordExists(payload.organizationID, 'organizations', (err, result) => {
                if (err) reject(err);
                if (result) resolve();
                reject();
            });
        }));
        const sql = `INSERT INTO ${ENTITY}(${Object.keys(payload).toString()}) VALUES (?)`;
        await Promise.all(queryPromises)
            .then(() => {
                executeQuery(sql, [Object.values(payload)], (err) => {
                    if (err) return res.status(500).json(err);
                    return resizeTo.status(200).json({
                        message: SUC_MESSAGE,
                        data: payload,
                    });
                });
            })
            .catch((err) => {
                if (err) return res.status(500).json(err);
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and organization',
                });
            });
    });

    app.put(ENDPOINT, authenticateToken, isStudent, (req, res) => {
        const ERR_MESSAGE = 'Failed to update position for student';
        const SUC_MESSAGE = 'Successfully updated position for student';
        const payload = req.body;
        const err = validation.request.student.studentOrganizationSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const { studentID, organizationID } = payload;
        delete payload.studentID;
        delete payload.organizationID;
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE studentID=? AND organizationID=?`;
        executeQuery(sql, [studentID, organizationID], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and organization',
                });
            }
            return res.status(200).json({
                message: SUC_MESSAGE,
                data: payload,
            });
        });
    });

    app.delete(ENDPOINT, authenticateToken, isStudent, (req, res) => {
        const ERR_MESSAGE = 'Failed to remove student from organization';
        const SUC_MESSAGE = 'Successfully removed student from organization';
        const payload = req.body;
        const err = validation.request.students.deleteStudentOrganizationSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                error: ERR_MESSAGE,
                message: err.message,
            });
        }
        const { studentID, organizationID } = payload;
        const sql = `DELETE FROM ${ENTITY} WHERE studentID=? AND organizationID=?`;
        executeQuery(sql, [studentID, organizationID], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    error: ERR_MESSAGE,
                    message: 'Could not find specified student and organization',
                });
            }
            return res.status(200).json({ message: SUC_MESSAGE });
        });
    });
}
