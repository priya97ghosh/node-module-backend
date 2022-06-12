
const Joi = require('joi');

const signupSchema = Joi.object({
    fullName: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    contactNumber: Joi.string().length(10).pattern(/^([0]|\+91)? [789]\d{9}$/).required(),
    password: Joi.string().min(8).trim(true).required(),
    image: Joi.string().required(),
    is_active: Joi.boolean().default(true),
});

module.exports = signupSchema;