const joi = require('joi');

module.exports = joi.object({
    id: joi.number().required(),
    code: joi.string().max(15).optional(),
    name: joi.string().max(50).optional(),
});
