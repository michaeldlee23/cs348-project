'use strict';

const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    email: joi.string().email().optional(),
    role: joi.string().min(8).max(255).optional(),
    last: joi.string().max(50).optional(),
    first: joi.string().max(50).optional(),
    middle: joi.string().max(1).optional(),
    salary: joi.number().optional(),
});
