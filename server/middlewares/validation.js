const { body, param, query, validationResult, oneOf } = require('express-validator');
const E164_REGEX = /^\+?[1-9]\d{6,14}$/; // General E.164 pattern

// User validation rules
const userSignupValidation = [
  body('invitationToken')
    .notEmpty()
    .withMessage('Invitation token is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('firstName')
    .notEmpty()
    .trim()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .trim()
    .withMessage('Last name is required'),
  oneOf([
    body('phone').exists().bail().matches(E164_REGEX),
    body('phoneNumber').exists().bail().matches(E164_REGEX),
    body().custom((body) => {
      const local = body.phone || body.phoneNumber;
      const dial = body.dialCode || body.countryCode || body.phoneCode;
      if (!local || !dial) return false;
      const digits = String(local).replace(/\D/g, '');
      const dialDigits = String(dial).replace(/\D/g, '');
      const composed = `+${dialDigits}${digits}`;
      return E164_REGEX.test(composed);
    })
  ], 'Valid phone number is required (use E.164, e.g., +237699553309)')
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

// OTP validation
const otpValidation = [
  body('recipient')
    .notEmpty()
    .withMessage('Recipient (email or phone) is required'),
  body('channel')
    .optional()
    .isIn(['sms', 'email'])
    .withMessage('Channel must be sms or email')
];

const otpVerifyValidation = [
  body('recipient')
    .notEmpty()
    .withMessage('Recipient is required'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be 6 digits'),
  body('channel')
    .optional()
    .isIn(['sms', 'email'])
    .withMessage('Channel must be sms or email')
];

// Invitation validation
const invitationIssueValidation = [
  body('role')
    .isIn(['user', 'collector', 'org_admin', 'admin'])
    .withMessage('Invalid role'),
  body('organizationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid organization ID')
];

const invitationValidateValidation = [
  body('token')
    .notEmpty()
    .withMessage('Invitation token is required')
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
  body('collectorId')
    .optional()
    .isMongoId()
    .withMessage('Valid collector ID is required'),
  body('vehicleId')
    .optional()
    .isMongoId()
    .withMessage('Valid vehicle ID is required')
];

const missionStatusUpdateValidation = [
  body('status')
    .isIn(['planned', 'assigned', 'in-progress', 'blocked', 'completed', 'cancelled'])
    .withMessage('Invalid mission status'),
  body('blockReason.reason')
    .optional()
    .isIn(['vehicle_breakdown', 'access_denied', 'collector_unavailable', 'other'])
    .withMessage('Invalid block reason'),
  body('blockReason.description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Block description must be less than 500 characters'),
  body('proofs.before.photo')
    .optional()
    .isURL()
    .withMessage('Before photo must be a valid URL'),
  body('proofs.after.photo')
    .optional()
    .isURL()
    .withMessage('After photo must be a valid URL'),
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be [longitude, latitude]')
];

// Mission reassignment validation
const missionReassignValidation = [
  body('collectorId')
    .isMongoId()
    .withMessage('Valid collector ID is required'),
  body('vehicleId')
    .optional()
    .isMongoId()
    .withMessage('Valid vehicle ID is required'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters')
];

const routeOptimizationValidation = [
  body('collectorId')
    .isMongoId()
    .withMessage('Valid collector ID is required'),
  body('collectionIds')
    .isArray({ min: 1, max: 100 })
    .withMessage('collectionIds must be an array of IDs'),
  body('collectionIds.*')
    .isMongoId()
    .withMessage('Each collectionId must be a valid ID')
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
  otpValidation,
  otpVerifyValidation,
  invitationIssueValidation,
  invitationValidateValidation,
  collectionReportValidation,
  collectionScheduleValidation,
  missionValidation,
  missionStatusUpdateValidation,
  missionReassignValidation,
  routeOptimizationValidation,
  vehicleRegistrationValidation,
  adCreationValidation,
  handleValidationErrors
};
