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

exports.validCollection = [
    check('name', 'Name is required')
        .isLength({ min: 1, max: 32 }).withMessage('Name can have between 1 and 50 characters.'),
    check('website', 'Website is required'),
    check('color', 'Color is required')
        .isHexColor().withMessage('Color must be in hex - #A123BC')
]

exports.validPassword = [
    check('email', 'Email is required')
        .isEmail().withMessage('Must be a valid email address'),
    check('password', 'Password is required'),
    check('collector', 'Pick a collection')
]