'use strict';

const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    email: joi.string().email().optional(),
    last: joi.string().max(50).optional(),
    first: joi.string().max(50).optional(),
    middle: joi.string().max(1).optional(),
    year: joi.number().integer().min(1).max(5).optional(),
    birthdate: joi.date().optional(),
    advisorID: joi.number().optional(),
    phone: joi.string().regex(/^[2-9]\d{2}-\d{3}-\d{4}$/).optional()
});
