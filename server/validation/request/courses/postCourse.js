'use strict';

const joi = require('joi');

module.exports = joi.object({
    code: joi.string().max(15).required(),
    name: joi.string().max(50).required(),
    departmentID: joi.number().integer().required()
});
