const pool = require('../connection');
const validation = require('../validation');
const jsonConverter = require('../util/jsonConverter');

module.exports = (app) => {
    app.get('/students', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to retrieve students';
        const sql = 'SELECT * FROM students';
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    message: ERR_MESSAGE,
                    data: err.message
                });
            }
            return res.status(200).json(results);
        });
    });

    app.post('/students', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to add student';
        const SUC_MESSAGE = 'Successfully added student';
        const payload = req.body;
        const err = validation.request.postStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const sql = `INSERT INTO students(${Object.keys(payload).toString()}) VALUES (?)`;
        pool.query(sql, [Object.values(payload)], async (err, results, fields) => {
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

    app.put('/students', (req, res, next) => {
        const ERR_MESSAGE = 'Failed to update student record';
        const SUC_MESSAGE = 'Successfully updated student record';
        const payload = req.body;
        const err = validation.request.putStudentSchema.validate(payload).error;
        if (err) {
            return res.status(400).json({
                message: ERR_MESSAGE,
                data: err.message
            });
        }
        const values = jsonConverter.payloadToUpdate(payload);
        const sql = `UPDATE students SET ${values} WHERE id=${payload.id}`;
        pool.query(sql, async (err, results, fields) => {
            if (results.changedRows == 0) {
                return res.status(404).json({
                    message: ERR_MESSAGE,
                    data: `No student with id ${payload.id}`
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
