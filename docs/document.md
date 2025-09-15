# Bondly Bondly - Full-Stack Customer Relationship Management System

## Project Overview

Bondly Bondly is a modern, full-stack Customer Relationship Management system designed to streamline business operations, manage customer interactions, and improve data-driven decision-making. The system features a cutting-edge tech stack with a React/Next.js frontend and Node.js/Express backend, all powered by Supabase for database and authentication services.

### Key Features

- **🔐 Secure Authentication**: Robust user authentication and authorization using Supabase Auth with JWT tokens
- **📊 Interactive Dashboard**: Real-time analytics dashboard with visual charts and key performance indicators
- **👥 Lead Management**: Comprehensive lead tracking from initial contact to conversion
- **💼 Opportunity Pipeline**: Advanced sales opportunity tracking with customizable stages
- **🏢 Account & Contact Management**: Centralized database for customer accounts and associated contacts
- **📱 Responsive Design**: Fully responsive UI optimized for desktops, tablets, and mobile devices
- **🔄 Real-time Data Sync**: Live data updates across all connected clients
- **🛡️ Security**: Built-in rate limiting, CORS protection, and input validation
- **🎨 Modern UI Components**: Beautiful, accessible UI components using Radix UI and Tailwind CSS

## Technology Stack

### Frontend
- **Framework**: Next.js 13 with TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: RESTful APIs with comprehensive error handling
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Logging**: Morgan

### Testing
- **Framework**: Jest
- **Frontend Testing**: React Testing Library
- **Backend Testing**: Supertest

## Project Structure

```
Bondly-Bondly/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (Supabase client)
│   │   ├── middleware/      # Custom middleware (auth, validation, logging)
│   │   ├── routes/          # API route definitions
│   │   └── index.js         # Main server entry point
│   ├── __tests__/           # Backend unit tests
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js 13 app directory structure
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and helpers
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   ├── __tests__/           # Frontend unit tests
│   └── package.json         # Frontend dependencies
└── DEPLOYMENT_GUIDE.md      # Detailed deployment instructions
```

## Database Schema

The Bondly uses Supabase (PostgreSQL) with the following key tables:

### Leads Table
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Opportunities Table
```sql
CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL,
  stage TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Homepage Carousel Table
```sql
CREATE TABLE IF NOT EXISTS public.homepage_carousel (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  cta_link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Activities Table
```sql
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/user` - Get current user

### Leads
- `GET /api/leads` - Fetch all leads
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Opportunities
- `GET /api/opportunities` - Fetch all opportunities
- `POST /api/opportunities` - Create a new opportunity

### Accounts
- `GET /api/accounts` - Fetch all accounts

### Contacts
- `GET /api/contacts` - Fetch all contacts

### Homepage
- `GET /api/homepage/images` - Fetch homepage carousel images

## Authentication Flow

1. **User Registration**:
   - User fills out signup form with email, password, first name, and last name
   - Form validation ensures password strength and matching confirmation
   - Supabase Auth handles user registration
   - User profile is optionally added to profiles table

2. **User Login**:
   - User provides email and password
   - Supabase Auth validates credentials
   - Session token is returned upon successful authentication
   - User is redirected to the dashboard

3. **Protected Routes**:
   - Dashboard and other authenticated pages use ProtectedRoute component
   - Checks for valid session before allowing access
   - Redirects unauthenticated users to login page

## Frontend Architecture

### Main Pages
1. **Landing Page** (`/`) - Public homepage with navigation to signup/login
2. **Login Page** (`/login`) - Authentication form for existing users
3. **Signup Page** (`/signup`) - Registration form for new users
4. **Dashboard** (`/dashboard`) - Main application interface with metrics and data visualization
5. **Leads Management** (`/dashboard/leads`) - View, create, and manage leads
6. **Opportunities** (`/dashboard/opportunities`) - Track sales opportunities
7. **Contacts** (`/dashboard/contacts`) - Manage customer contacts
8. **Companies** (`/dashboard/companies`) - Organize customer accounts
9. **Tasks** (`/dashboard/tasks`) - Track and manage tasks
10. **Settings** (`/dashboard/settings`) - User preferences and configuration

### Component Structure
- **UI Components**: Reusable components like buttons, cards, forms, and data tables
- **Layout Components**: Header, sidebar, and navigation elements
- **Feature Components**: Specialized components for specific functionality
- **Authentication Components**: Login and signup forms with validation

### State Management
- **Real-time Data**: Uses Supabase real-time subscriptions for live updates
- **Local State**: React useState and useEffect hooks for component state
- **Global State**: Zustand for complex state management needs

## Backend Architecture

### Server Configuration
- **Express.js Server**: Main application server with middleware stack
- **Security Middleware**: Helmet for security headers, CORS for cross-origin requests
- **Rate Limiting**: Express-rate-limit to prevent abuse
- **Logging**: Morgan for request logging
- **Error Handling**: Custom error handling middleware

### Middleware
1. **Authentication**: Validates user sessions for protected routes
2. **Validation**: Input validation and sanitization
3. **Rate Limiting**: Prevents API abuse
4. **Logging**: Request and error logging
5. **Database Optimization**: Caching and query optimization

### API Routes
- **Modular Structure**: Each resource has its own route file
- **Error Handling**: Consistent error handling across all endpoints
- **Validation**: Input validation for all POST/PUT requests
- **Security**: Authentication checks for protected endpoints

## Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `.next`
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_BACKEND_API_URL`

### Backend (Render)
1. Connect GitHub repository to Render
2. Set runtime to Node
3. Set build command to `npm install`
4. Set start command to `npm start`
5. Configure environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `FRONTEND_URL`

### Supabase Configuration
1. Enable Auth and configure sign-in providers
2. Set up database tables according to schema
3. Configure Row Level Security (RLS) policies
4. Add frontend/backend URLs to Supabase auth settings

## Development Setup

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Set up environment variables in both directories

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Testing
Run tests for both frontend and backend:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Security Features

1. **Authentication**: Supabase Auth with JWT tokens
2. **Rate Limiting**: Prevents API abuse
3. **CORS Protection**: Restricts cross-origin requests
4. **Input Validation**: Prevents injection attacks
5. **Helmet**: Sets security headers
6. **Environment Variables**: Sensitive data stored securely

## Performance Optimization

1. **Caching**: Database query caching
2. **Indexing**: Database indexes for faster queries
3. **Code Splitting**: Next.js automatic code splitting
4. **Image Optimization**: Next.js image optimization
5. **Bundle Optimization**: Tree shaking and minification

## Future Enhancements

1. **Advanced Analytics**: More detailed reporting and visualization
2. **AI Recommendations**: Intelligent lead scoring and recommendations
3. **Role-Based Access Control**: Fine-grained permissions system
4. **Mobile App**: Native mobile application
5. **Integration Marketplace**: Third-party service integrations
6. **Automation Workflows**: Custom business process automation