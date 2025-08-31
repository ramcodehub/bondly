import rateLimit from 'express-rate-limit';
import { createValidationError } from './errorHandler.js';

// Store for tracking rate limit hits (in production, use Redis)
const store = new Map();

// Custom store implementation for development (use Redis in production)
class MemoryStore {
  constructor() {
    this.hits = new Map();
    this.resetTime = new Map();
  }

  incr(key, cb) {
    const now = Date.now();
    const current = this.hits.get(key) || { count: 0, resetTime: now + 60000 };
    
    // Reset if time window has passed
    if (now > current.resetTime) {
      current.count = 1;
      current.resetTime = now + 60000;
    } else {
      current.count++;
    }
    
    this.hits.set(key, current);
    
    const timeLeft = Math.max(0, current.resetTime - now);
    cb(null, current.count, new Date(current.resetTime), timeLeft);
  }

  decrement(key) {
    const current = this.hits.get(key);
    if (current && current.count > 0) {
      current.count--;
      this.hits.set(key, current);
    }
  }

  resetKey(key) {
    this.hits.delete(key);
  }

  resetAll() {
    this.hits.clear();
  }
}

// Create custom error response for rate limiting
const rateLimitHandler = (req, res) => {
  throw createValidationError(
    'Too many requests from this IP, please try again later.'
  );
};

// Key generator function
const keyGenerator = (req) => {
  // Use IP address and user agent for more specific limiting
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  return `${ip}:${userAgent.substring(0, 50)}`;
};

// Skip function for certain conditions
const skipSuccessfulRequests = (req, res) => {
  return res.statusCode < 400;
};

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60 // 15 minutes in seconds
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    error: {
      type: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: 15 * 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true // Don't count successful auth attempts
});

// More permissive rate limiting for read operations
export const readRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    error: {
      type: 'READ_RATE_LIMIT_EXCEEDED',
      message: 'Too many read requests, please slow down.',
      retryAfter: 5 * 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler,
  skip: skipSuccessfulRequests
});

// Strict rate limiting for write operations
export const writeRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // limit each IP to 30 write operations per windowMs
  message: {
    error: {
      type: 'WRITE_RATE_LIMIT_EXCEEDED',
      message: 'Too many write operations, please try again later.',
      retryAfter: 10 * 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler
});

// Very strict rate limiting for sensitive operations
export const sensitiveRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 sensitive operations per hour
  message: {
    error: {
      type: 'SENSITIVE_RATE_LIMIT_EXCEEDED',
      message: 'Too many sensitive operations, please try again later.',
      retryAfter: 60 * 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler
});

// Rate limiting for file uploads
export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: {
    error: {
      type: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      message: 'Too many file uploads, please try again later.',
      retryAfter: 15 * 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator,
  handler: rateLimitHandler
});

// Dynamic rate limiting based on user type (if authentication is implemented)
export const createUserRateLimit = (userType = 'guest') => {
  const limits = {
    guest: { windowMs: 15 * 60 * 1000, max: 50 },
    user: { windowMs: 15 * 60 * 1000, max: 200 },
    premium: { windowMs: 15 * 60 * 1000, max: 500 },
    admin: { windowMs: 15 * 60 * 1000, max: 1000 }
  };

  const config = limits[userType] || limits.guest;

  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      error: {
        type: 'USER_RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded for ${userType} users.`,
        retryAfter: config.windowMs / 1000
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new MemoryStore(),
    keyGenerator: (req) => {
      // Use user ID if available, otherwise fall back to IP
      const userId = req.user?.id;
      return userId ? `user:${userId}` : keyGenerator(req);
    },
    handler: rateLimitHandler
  });
};

// Rate limiting bypass for internal services (if needed)
export const bypassRateLimit = (req, res, next) => {
  // Check for internal service token or specific IP ranges
  const internalToken = req.headers['x-internal-token'];
  const trustedIPs = ['127.0.0.1', '::1']; // Add your internal IPs
  
  if (internalToken === process.env.INTERNAL_SERVICE_TOKEN || 
      trustedIPs.includes(req.ip)) {
    return next();
  }
  
  // Apply general rate limiting
  return generalRateLimit(req, res, next);
};

// Middleware to add rate limit headers to all responses
export const rateLimitHeaders = (req, res, next) => {
  // Add standard rate limit headers
  res.setHeader('X-RateLimit-Policy', 'general=100/15min;auth=5/15min;write=30/10min');
  next();
};