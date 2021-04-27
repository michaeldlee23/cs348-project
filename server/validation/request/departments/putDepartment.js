'use strict';

const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    name: joi.string().max(50).optional(),
    budget: joi.number().required(),
});
