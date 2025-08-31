import { body, param, query, validationResult } from 'express-validator';
import { createValidationError } from './errorHandler.js';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    const message = `Validation failed: ${errorMessages.map(e => `${e.field} ${e.message}`).join(', ')}`;
    throw createValidationError(message);
  }
  
  next();
};

// Common validation rules
export const commonValidations = {
  id: param('id')
    .isInt({ min: 1 })
    .withMessage('must be a positive integer'),
    
  email: (fieldName = 'email') => 
    body(fieldName)
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('must be a valid email address'),
      
  phone: (fieldName = 'phone') =>
    body(fieldName)
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('must be a valid phone number'),
      
  name: (fieldName = 'name', required = true) => {
    const validation = body(fieldName)
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('must be between 1 and 255 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('must contain only letters, spaces, hyphens, dots, and apostrophes');
      
    return required ? validation.notEmpty().withMessage('is required') : validation.optional();
  },
  
  string: (fieldName, options = {}) => {
    const { required = false, min = 0, max = 255, pattern } = options;
    
    let validation = body(fieldName).trim();
    
    if (required) {
      validation = validation.notEmpty().withMessage('is required');
    } else {
      validation = validation.optional();
    }
    
    if (min || max) {
      validation = validation.isLength({ min, max })
        .withMessage(`must be between ${min} and ${max} characters`);
    }
    
    if (pattern) {
      validation = validation.matches(pattern)
        .withMessage('format is invalid');
    }
    
    return validation;
  },
  
  url: (fieldName = 'website') =>
    body(fieldName)
      .optional()
      .isURL()
      .withMessage('must be a valid URL'),
      
  date: (fieldName) =>
    body(fieldName)
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('must be a valid date in ISO format'),
      
  number: (fieldName, options = {}) => {
    const { required = false, min, max } = options;
    
    let validation = body(fieldName);
    
    if (required) {
      validation = validation.notEmpty().withMessage('is required');
    } else {
      validation = validation.optional();
    }
    
    validation = validation.isNumeric().withMessage('must be a number');
    
    if (min !== undefined || max !== undefined) {
      validation = validation.isFloat({ min, max })
        .withMessage(`must be between ${min || 'any'} and ${max || 'any'}`);
    }
    
    return validation;
  }
};

// Lead validation schemas
export const leadValidation = {
  create: [
    commonValidations.name('name', true),
    commonValidations.string('company', { required: false, max: 255 }),
    commonValidations.email('email'),
    commonValidations.phone('phone'),
    commonValidations.string('lead_owner', { required: false, max: 255 }),
    commonValidations.string('lead_source', { required: false, max: 100 }),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.id,
    commonValidations.name('name', false),
    commonValidations.string('company', { required: false, max: 255 }),
    commonValidations.email('email'),
    commonValidations.phone('phone'),
    commonValidations.string('lead_owner', { required: false, max: 255 }),
    commonValidations.string('lead_source', { required: false, max: 100 }),
    handleValidationErrors
  ],
  
  delete: [
    commonValidations.id,
    handleValidationErrors
  ]
};

// Contact validation schemas
export const contactValidation = {
  create: [
    commonValidations.name('name', true),
    commonValidations.string('role', { required: false, max: 100 }),
    commonValidations.email('email'),
    commonValidations.phone('phone'),
    commonValidations.url('image_url'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.id,
    commonValidations.name('name', false),
    commonValidations.string('role', { required: false, max: 100 }),
    commonValidations.email('email'),
    commonValidations.phone('phone'),
    commonValidations.url('image_url'),
    handleValidationErrors
  ]
};

// Account validation schemas
export const accountValidation = {
  create: [
    commonValidations.string('account_name', { required: true, max: 255 }),
    commonValidations.string('industry', { required: false, max: 100 }),
    commonValidations.url('website'),
    commonValidations.email('contact_email'),
    commonValidations.url('logo_url'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.id,
    commonValidations.string('account_name', { required: false, max: 255 }),
    commonValidations.string('industry', { required: false, max: 100 }),
    commonValidations.url('website'),
    commonValidations.email('contact_email'),
    commonValidations.url('logo_url'),
    handleValidationErrors
  ]
};

// Opportunity validation schemas
export const opportunityValidation = {
  create: [
    commonValidations.string('title', { required: true, max: 255 }),
    commonValidations.string('description', { required: false, max: 1000 }),
    commonValidations.number('value', { required: false, min: 0 }),
    commonValidations.string('stage', { required: false, max: 50 }),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.id,
    commonValidations.string('title', { required: false, max: 255 }),
    commonValidations.string('description', { required: false, max: 1000 }),
    commonValidations.number('value', { required: false, min: 0 }),
    commonValidations.string('stage', { required: false, max: 50 }),
    handleValidationErrors
  ]
};

// Auth validation schemas
export const authValidation = {
  login: [
    commonValidations.email('email'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
  ],
  
  register: [
    commonValidations.name('name', true),
    commonValidations.email('email'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    handleValidationErrors
  ]
};

// Query parameter validation
export const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .matches(/^[a-zA-Z_]+:(asc|desc)$/)
      .withMessage('Sort must be in format "field:asc" or "field:desc"'),
    handleValidationErrors
  ],
  
  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    query('fields')
      .optional()
      .matches(/^[a-zA-Z_,]+$/)
      .withMessage('Fields must be comma-separated field names'),
    handleValidationErrors
  ]
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attacks
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    return value;
  };

  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      req.body[key] = sanitizeValue(req.body[key]);
    }
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      req.query[key] = sanitizeValue(req.query[key]);
    }
  }

  next();
};