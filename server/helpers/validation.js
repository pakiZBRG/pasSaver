const { check } = require('express-validator');

exports.validEmail = [
    check('email', 'Email is required')
        .isEmail().withMessage('Must be a valid email address'),
]

exports.validKeyPass = [
    check('keyPass', 'keyPass is required')
        .isLength({ min: 10 }).withMessage('keyPass must contain at least 10 characters')
        .isAlphanumeric().withMessage('Letters and numbers are allowed')
]