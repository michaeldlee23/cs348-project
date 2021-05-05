'use strict';

const joi = require('joi');

module.exports = joi.object({
    keepid: joi.number().required(),
    deleteid: joi.number().required(),
});
