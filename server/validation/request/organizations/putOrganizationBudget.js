'use strict';

const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    amount: joi.number().required(),
});
