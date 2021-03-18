const Joi = require('joi');
const pool = require('../connection');
const validation = require('../validation');
const Student = require('../classes/student');

module.exports = (app) => {
    app.get('/students', (req, res, next) => {
        const sql = 'SELECT * FROM students';
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            res.json(results);
        });
    });

    app.post('/students', (req, res, next) => {
        const payload = req.body;
        const err = validation.request.postStudentSchema.validate(payload).error;
        if (err) {
            return res.json({
                status: 400,
                message: 'Invalid payload',
                data: payload
            });
        }
        const {last, first, middle, year, birthdate, email, phone} = payload;
        if (!middle) {
            middle = '';
        }
        const sql = `INSERT INTO students (last, first, middle, year, birthdate, email, phone) VALUES
                     ('${last}', '${first}', '${middle}', ${year}, '${birthdate}', '${email}', '${phone}')`
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({
                    status: 500,
                    message: 'Failed to add student',
                    data: err.message
                });
            }
        });
        return res.json({
            status: 200,
            message: 'Successfully added student',
            data: payload
        });
    });
}
