'use-strict';

const joi = require('joi');

module.exports = joi.object({
    studentID: joi.number().required(),
    organizationID: joi.number().required(),
    position: joi.string().max(50).required()
});
