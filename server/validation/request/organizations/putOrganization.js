'use strict';

const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    type: joi.string().max(15).optional(),
    name: joi.string().max(50).optional(),
    budget: joi.number().optional(),
});
