'use strict';

const joi = require('joi');

module.exports = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(255).required(),
    last: joi.string().max(50).required(),
    first: joi.string().max(50).required(),
    middle: joi.string().max(1).optional(),
    year: joi.number().integer().min(1).max(5).required(),
    birthdate: joi.date().required(),
    phone: joi.string().regex(/^[2-9]\d{2}-\d{3}-\d{4}$/).required()
});
