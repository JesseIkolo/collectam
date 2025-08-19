const { body, param, query, validationResult } = require('express-validator');

// User validation rules
const userSignupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('role')
    .optional()
    .isIn(['user', 'collector', 'manager', 'admin'])
    .withMessage('Invalid role')
];

const userLoginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Collection validation rules
const collectionReportValidation = [
  body('wasteType')
    .isIn(['organic', 'plastic', 'paper', 'glass', 'metal', 'electronic', 'hazardous', 'mixed'])
    .withMessage('Invalid waste type'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be [longitude, latitude]'),
  body('location.coordinates.*')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid coordinates'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('estimatedWeight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number')
];

const collectionScheduleValidation = [
  body('scheduledTime')
    .isISO8601()
    .toDate()
    .withMessage('Valid scheduled time is required'),
  body('collectionType')
    .isIn(['regular', 'priority', 'bulk'])
    .withMessage('Invalid collection type'),
  body('recurringPattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid recurring pattern')
];

// Mission validation rules
const missionValidation = [
  body('collectionId')
    .isMongoId()
    .withMessage('Valid collection ID is required'),
  body('vehicleId')
    .isMongoId()
    .withMessage('Valid vehicle ID is required')
];

// Vehicle validation rules
const vehicleRegistrationValidation = [
  body('registration')
    .matches(/^[A-Z0-9-]{6,10}$/)
    .withMessage('Invalid vehicle registration format'),
  body('capacity')
    .isFloat({ min: 0 })
    .withMessage('Capacity must be a positive number'),
  body('vehicleType')
    .isIn(['truck', 'van', 'motorcycle', 'bicycle'])
    .withMessage('Invalid vehicle type')
];

// Ad validation rules
const adCreationValidation = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('content')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('targetAudience')
    .isIn(['all', 'users', 'collectors', 'premium'])
    .withMessage('Invalid target audience'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
];

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  userSignupValidation,
  userLoginValidation,
  collectionReportValidation,
  collectionScheduleValidation,
  missionValidation,
  vehicleRegistrationValidation,
  adCreationValidation,
  handleValidationErrors
};
