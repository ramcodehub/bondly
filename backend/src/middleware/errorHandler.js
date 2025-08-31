// Custom error class for application-specific errors
export class AppError extends Error {
  constructor(message, statusCode = 500, code) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.code = code

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error types enum
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
}

// Async error wrapper to catch async route errors
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Global error handling middleware
export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let error = { ...err }
  error.message = err.message

  // Log error details
  console.error(`Error ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  })

  // Generate unique request ID for tracking
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substr(2, 9)

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = handleValidationError(err)
  } else if (err.name === 'CastError') {
    error = handleCastError(err)
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError()
  } else if (err.name === 'TokenExpiredError') {
    error = handleExpiredJWTError()
  } else if (isSupabaseError(err)) {
    error = handleSupabaseError(err)
  } else if (!error.statusCode) {
    // Default to internal server error
    error.statusCode = 500
    error.message = 'Internal Server Error'
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      type: getErrorType(error),
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      requestId: requestId
    }
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack
    errorResponse.error.details = {
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    }
  }

  // Send error response
  res.status(error.statusCode || 500).json(errorResponse)
}

// Handle validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message)
  const message = `Invalid input data: ${errors.join(', ')}`
  return new AppError(message, 400, ErrorTypes.VALIDATION_ERROR)
}

// Handle cast errors (invalid ObjectId, etc.)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400, ErrorTypes.VALIDATION_ERROR)
}

// Handle JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, ErrorTypes.AUTHENTICATION_ERROR)
}

// Handle expired JWT
const handleExpiredJWTError = () => {
  return new AppError('Your token has expired. Please log in again.', 401, ErrorTypes.AUTHENTICATION_ERROR)
}

// Handle Supabase errors
const handleSupabaseError = (err) => {
  const message = err.message || 'Database operation failed'
  const statusCode = getSupabaseErrorStatusCode(err)
  return new AppError(message, statusCode, ErrorTypes.DATABASE_ERROR)
}

// Check if error is from Supabase
const isSupabaseError = (err) => {
  return err.code || err.hint || (err.message && err.message.includes('supabase'))
}

// Get appropriate status code for Supabase errors
const getSupabaseErrorStatusCode = (err) => {
  if (err.code === '23505') return 409 // Unique constraint violation
  if (err.code === '23503') return 400 // Foreign key constraint violation
  if (err.code === '23502') return 400 // Not null constraint violation
  if (err.code === '42P01') return 500 // Table does not exist
  if (err.code === '42703') return 500 // Column does not exist
  return 500 // Default to internal server error
}

// Get error type for response
const getErrorType = (error) => {
  if (error.code) return error.code
  if (error.statusCode === 400) return ErrorTypes.VALIDATION_ERROR
  if (error.statusCode === 401) return ErrorTypes.AUTHENTICATION_ERROR
  if (error.statusCode === 403) return ErrorTypes.AUTHORIZATION_ERROR
  if (error.statusCode === 404) return ErrorTypes.NOT_FOUND_ERROR
  return ErrorTypes.INTERNAL_ERROR
}

// 404 handler for unmatched routes
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    ErrorTypes.NOT_FOUND_ERROR
  )
  next(error)
}

// Health check endpoint
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}

// Create specific error functions for common scenarios
export const createValidationError = (message) => {
  return new AppError(message, 400, ErrorTypes.VALIDATION_ERROR)
}

export const createAuthenticationError = (message = 'Authentication required') => {
  return new AppError(message, 401, ErrorTypes.AUTHENTICATION_ERROR)
}

export const createAuthorizationError = (message = 'Insufficient permissions') => {
  return new AppError(message, 403, ErrorTypes.AUTHORIZATION_ERROR)
}

export const createNotFoundError = (resource) => {
  return new AppError(`${resource} not found`, 404, ErrorTypes.NOT_FOUND_ERROR)
}

export const createDatabaseError = (message) => {
  return new AppError(message, 500, ErrorTypes.DATABASE_ERROR)
}