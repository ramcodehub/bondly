import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

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

// Import Supabase client
import supabase from './config/supabase.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  
  // Production frontend
  'https://prototypecrm.netlify.app',
  
  // Production backend (for reference, if needed)
  'https://crm-prototype.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// API Routes
app.use('/api/leads', leadsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hello', helloRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/homepage', homepageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { supabase };