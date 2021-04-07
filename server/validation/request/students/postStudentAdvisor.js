'use-strict';

const joi = require('joi');

module.exports = joi.object({
    studentID: joi.number().required(),
    advisorID: joi.number().required(),
});
