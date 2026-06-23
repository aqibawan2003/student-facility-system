const { body, validationResult } = require('express-validator');

// Validation middleware
const validateStudent = [
    body('first_name')
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password').isAlphanumeric()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    body('phone_number')
        .notEmpty()
        .withMessage('Phone number is required'),
    body('address')
        .notEmpty()
        .withMessage('Address is required'),
    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be either male, female, or other'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateStudent
};
