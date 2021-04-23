'use strict';

const joi = require('joi');

module.exports = joi.object({
    name: joi.string().max(50).required(),
    budget: joi.number().required(),
});
