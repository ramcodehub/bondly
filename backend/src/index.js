import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
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
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { supabase };