import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom token for request ID
morgan.token('id', (req) => {
  return req.id || req.headers['x-request-id'] || 'unknown';
});

// Custom token for user ID (if auth is implemented)
morgan.token('user', (req) => {
  return req.user?.id || 'anonymous';
});

// Custom token for response time in a more readable format
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '-';
  }
  
  const ms = (res._startAt[0] - req._startAt[0]) * 1000 +
             (res._startAt[1] - req._startAt[1]) * 1e-6;
  
  return ms.toFixed(3) + 'ms';
});

// Custom token for request body size
morgan.token('req-size', (req) => {
  const size = req.headers['content-length'];
  return size ? `${size}b` : '-';
});

// Custom token for IP address with proxy support
morgan.token('real-ip', (req) => {
  return req.ip || 
         req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         'unknown';
});

// Structured log format for production
const productionFormat = JSON.stringify({
  timestamp: ':date[iso]',
  level: 'info',
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time-ms',
  contentLength: ':res[content-length]',
  requestSize: ':req-size',
  userAgent: ':user-agent',
  ip: ':real-ip',
  requestId: ':id',
  userId: ':user',
  referrer: ':referrer'
});

// Colorized format for development
const developmentFormat = ':real-ip :id :method :url :status :response-time-ms - :res[content-length]';

// Error log format
const errorFormat = JSON.stringify({
  timestamp: ':date[iso]',
  level: 'error',
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time-ms',
  ip: ':real-ip',
  requestId: ':id',
  userId: ':user',
  userAgent: ':user-agent'
});

// Create write streams for different log levels
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Middleware to add request ID
export const addRequestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || 
           Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Request logging middleware for development
export const developmentLogger = morgan(developmentFormat, {
  skip: (req, res) => {
    // Skip logging for health checks and static files
    return req.url === '/health' || req.url.startsWith('/static');
  }
});

// Request logging middleware for production
export const productionLogger = morgan(productionFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Skip logging for health checks
    return req.url === '/health';
  }
});

// Error logging middleware
export const errorLogger = morgan(errorFormat, {
  stream: errorLogStream,
  skip: (req, res) => {
    // Only log errors (4xx and 5xx)
    return res.statusCode < 400;
  }
});

// Security event logger
export const securityLogger = {
  logFailedAuth: (ip, userAgent, attempt) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'security',
      event: 'failed_auth',
      ip,
      userAgent,
      attempt,
      severity: 'medium'
    };
    
    console.warn('SECURITY:', JSON.stringify(logEntry));
    
    // Write to security log file
    fs.appendFileSync(
      path.join(logsDir, 'security.log'),
      JSON.stringify(logEntry) + '\n'
    );
  },
  
  logRateLimitHit: (ip, endpoint, limit) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'security',
      event: 'rate_limit_hit',
      ip,
      endpoint,
      limit,
      severity: 'low'
    };
    
    console.warn('SECURITY:', JSON.stringify(logEntry));
    
    fs.appendFileSync(
      path.join(logsDir, 'security.log'),
      JSON.stringify(logEntry) + '\n'
    );
  },
  
  logSuspiciousActivity: (ip, userAgent, activity, severity = 'high') => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'security',
      event: 'suspicious_activity',
      ip,
      userAgent,
      activity,
      severity
    };
    
    console.error('SECURITY ALERT:', JSON.stringify(logEntry));
    
    fs.appendFileSync(
      path.join(logsDir, 'security.log'),
      JSON.stringify(logEntry) + '\n'
    );
  }
};

// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: 'warning',
        event: 'slow_request',
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        ip: req.ip,
        requestId: req.id
      };
      
      console.warn('PERFORMANCE:', JSON.stringify(logEntry));
      
      fs.appendFileSync(
        path.join(logsDir, 'performance.log'),
        JSON.stringify(logEntry) + '\n'
      );
    }
  });
  
  next();
};

// Database query logger
export const dbLogger = {
  logQuery: (query, duration, success = true) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'error',
      event: 'database_query',
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
      success
    };
    
    if (duration > 1000 || !success) {
      console.warn('DATABASE:', JSON.stringify(logEntry));
    }
    
    fs.appendFileSync(
      path.join(logsDir, 'database.log'),
      JSON.stringify(logEntry) + '\n'
    );
  },
  
  logSlowQuery: (query, duration) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      event: 'slow_database_query',
      query: query.substring(0, 200),
      duration: `${duration}ms`
    };
    
    console.warn('SLOW QUERY:', JSON.stringify(logEntry));
    
    fs.appendFileSync(
      path.join(logsDir, 'slow-queries.log'),
      JSON.stringify(logEntry) + '\n'
    );
  }
};

// Log rotation utility (run daily)
export const rotateLog = (logFile) => {
  const logPath = path.join(logsDir, logFile);
  const backupPath = path.join(logsDir, `${logFile}.${new Date().toISOString().split('T')[0]}`);
  
  if (fs.existsSync(logPath)) {
    fs.renameSync(logPath, backupPath);
    
    // Keep only last 30 days of logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    fs.readdirSync(logsDir)
      .filter(file => file.startsWith(logFile) && file.includes('.'))
      .forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old log file: ${file}`);
        }
      });
  }
};

// Application logger for business logic
export const appLogger = {
  info: (message, metadata = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...metadata
    };
    
    console.log(JSON.stringify(logEntry));
  },
  
  warn: (message, metadata = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      ...metadata
    };
    
    console.warn(JSON.stringify(logEntry));
  },
  
  error: (message, error, metadata = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      ...metadata
    };
    
    console.error(JSON.stringify(logEntry));
    
    fs.appendFileSync(
      path.join(logsDir, 'application.log'),
      JSON.stringify(logEntry) + '\n'
    );
  }
};