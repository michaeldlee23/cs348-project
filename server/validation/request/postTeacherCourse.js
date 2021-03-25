'use-strict';

const joi = require('joi');

module.exports = joi.object({
    teacherID: joi.number().required(),
    courseID: joi.number().required(),
});
