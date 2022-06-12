const Joi = require('joi')

const signinSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    password: Joi.string().min(8).trim(true).required(),
});

module.exports = signinSchema;