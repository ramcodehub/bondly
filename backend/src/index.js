import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';

// Import middleware
import { errorHandler, notFoundHandler, healthCheck } from './middleware/errorHandler.js';
import { generalRateLimit, rateLimitHeaders } from './middleware/rateLimiting.js';
import { addRequestId, developmentLogger, productionLogger, errorLogger, performanceMonitor } from './middleware/logging.js';

// Import routes
import leadsRoutes from './routes/leads.js';
import authRoutes from './routes/auth.js';
import helloRoutes from './routes/hello.js';
import homeRoutes from './routes/home.js';
import opportunitiesRoutes from './routes/opportunities.js';
import accountRoutes from './routes/account.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import homepageRoutes from '../routes/homepage.js';
import dealsRoutes from './routes/deals.js';
import tasksRoutes from './routes/tasks.js';

// Import Supabase client
import supabase from './config/supabase.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Request ID and logging middleware
app.use(addRequestId);
app.use(performanceMonitor);

// Environment-specific logging
if (process.env.NODE_ENV === 'development') {
  app.use(developmentLogger);
} else {
  app.use(productionLogger);
}

// Always log errors regardless of environment
app.use(errorLogger);

// Environment-specific CORS configuration
const allowedOrigins = {
  development: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ],
  production: [
    'https://prototypecrm.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove undefined values
  staging: [
    'https://staging-prototypecrm.netlify.app',
    process.env.STAGING_FRONTEND_URL
  ].filter(Boolean)
};

const currentOrigins = allowedOrigins[process.env.NODE_ENV] || allowedOrigins.development;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman) only in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Reject requests with no origin in production
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('Request blocked: No origin header'), false);
    }
    
    // Check if origin is in allowed list
    if (currentOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Enhanced origin validation for subdomains in production
    if (process.env.NODE_ENV === 'production') {
      const allowedDomains = ['netlify.app', 'vercel.app'];
      const originDomain = new URL(origin).hostname;
      
      // Check if it's a subdomain of allowed domains
      const isAllowedSubdomain = allowedDomains.some(domain => 
        originDomain.endsWith(`.${domain}`) || originDomain === domain
      );
      
      if (isAllowedSubdomain) {
        return callback(null, true);
      }
    }
    
    // Log rejected origins for security monitoring
    console.warn(`CORS: Blocked request from origin: ${origin}`);
    
    const msg = process.env.NODE_ENV === 'development' 
      ? `CORS policy: Origin '${origin}' is not allowed. Add it to allowedOrigins in ${process.env.NODE_ENV} mode.`
      : 'CORS policy: Origin not allowed';
    
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'X-Request-ID',
    'X-Client-Version'
  ],
  exposedHeaders: [
    'Content-Range', 
    'X-Content-Range',
    'X-Request-ID',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset'
  ],
  credentials: true,
  maxAge: process.env.NODE_ENV === 'production' ? 86400 : 3600, // 24h in prod, 1h in dev
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false // Pass control to next handler
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting
app.use(rateLimitHeaders);
app.use('/api/', generalRateLimit);

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  const publicPath = path.join(__dirname, '..', 'frontend', 'dist');
  
  // Check if frontend build exists, but don't exit if it doesn't
  if (fs.existsSync(publicPath)) {
    console.log('Serving frontend from:', publicPath);
    
    // Serve static files with proper caching and content types
    app.use(express.static(publicPath, {
      etag: true,
      lastModified: true,
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // Set proper content type for HTML files
        if (filePath.endsWith('.html')) {
          res.set('Content-Type', 'text/html; charset=UTF-8');
          // Prevent caching of HTML files
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
        }
      }
    }));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error loading the application');
        }
      });
    });
  } else {
    console.warn('Frontend build not found at:', publicPath);
    console.warn('Skipping frontend static file serving. The backend API will still work.');
  }
}

// API Routes
app.get('/health', healthCheck);
app.use('/api/leads', leadsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hello', helloRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/tasks', tasksRoutes);

// 404 handler for unmatched API routes
app.use('/api/*', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
