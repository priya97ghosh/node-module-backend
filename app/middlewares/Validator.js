const createHttpError = require('http-errors')
// Include joi to check error type 
const Joi = require('joi')
// Include all validators
const Validators = require('../validators')

module.exports = function validator(validation) {
    console.log("validator")
    // If validator is not exist, throw err
    if(!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)

    return async function(req, res, next) {
        try {
            const validated = await Validators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            // Passing err to next
            // If validation error occurs call next with HTTP 422. Otherwise HTTP 500
            if(err.isJoi) 
                return next(createHttpError(422, {message: err.message}))
            next(createHttpError(500))
        }
    }
}























// const Joi = require("joi");
// const Validation = async (req, res, next) => {
// const userValidation = Joi.object.keys({
//     fullName: Joi.string().alphanum().min(3).max(25).trim(true).required(),
//     email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
//     contactNumber: Joi.string().length(10).pattern(/^([0]|\+91)? [789]\d{9}$/).required(),
//     password: Joi.string().min(8).trim(true).required(),
//     image: Joi.string().required().label('image'),
//     is_active: Joi.boolean().default(true),
// })

// const payload = {
//             fullName: req.body.userName,
//             email: req.body.email,
//             contactNumber: req.body.contactNumber,
//             password: req.body.password,
//             image: req.body.image,
//             is_active: req.body.is_active,
//         };
    
//         const { error } = userValidation.validate(payload);
//         if (error) {
//             return res.send({
//                 status: 406,
//                 error: true,
//                 message: "Error in user data. Please try again!!",
//             });
//         } else {
//             next();
//         }
// }
// module.exports = Validation;
