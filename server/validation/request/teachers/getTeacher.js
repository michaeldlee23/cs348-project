'use strict';

const joi = require('joi');

module.exports = joi.object({
    password: joi.string().required(),
});