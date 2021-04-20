'use strict';

const joi = require('joi');

module.exports = joi.object({
    sortby: joi.any().valid('id', 'last', 'first', 'grade').optional(),
    order: joi.any().valid('asc', 'desc').optional(),
    limit: joi.number().min(1).max(100).optional(),
    last: joi.string().alphanum().optional(),
    first: joi.string().alphanum().optional(),
});
