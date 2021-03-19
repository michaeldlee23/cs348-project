'use-strict';

const joi = require('joi');

module.exports = joi.object({
    studentID: joi.number().required(),
    courseID: joi.number().required(),
    grade: joi.number().min(0).max(100).optional(),
});
