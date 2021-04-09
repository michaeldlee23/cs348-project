'use strict';

const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');

const ENDPOINT = '/studentOrganization';
const ENTITY = 'studentOrganizationRel';

module.exports = (app) => {
    app.get(ENDPOINT, (req, res) => {
        const ERR_MESSAGE = 'Failed to retrieve student-organization mappings';
        const sql = `SELECT * FROM ${ENTITY}`;
        pool.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return   res.status(200).json(results); 
        });
    });

    app.post(ENDPOINT, (req, res) => {
        // TODO: this allows duplicate organizations
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
        const {studentID, organizationID} = payload;
        delete payload.studentID;
        delete payload.organizationID;
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE ${ENTITY} SET ${values} WHERE studentID=${studentID} AND organizationID=${organizationID}`;
        console.log(sql);
        pool.query(sql, async (err, results) => {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: `No student with id ${studentID} in org with id ${organizationID}`
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
}
