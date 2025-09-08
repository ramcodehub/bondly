# Travels - React Frontend Application

## Overview
This is a React-based frontend application for a travel management system. The application is built using Vite as the build tool and includes various components for managing leads, user authentication, and more.

## Project Structure
The project follows a component-based architecture with the following main components:
- Header: Navigation and app header
- Leads: Lead management interface
- User: User profile management
- UserAuthentication: Login and registration functionality

## Development

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install` or `yarn`
3. Start the development server: `npm run dev` or `yarn dev`

### Build
To build the application for production:
```
npm run build
```

## Notes
- This application uses mock data for demonstration purposes
- The Python/FastAPI backend has been removed from this project

## Deployment Status
- ✅ Fixed TypeScript configuration issues with Supabase auth-helpers-nextjs
- ✅ Resolved React component composition errors
- ✅ Fixed Node.js version compatibility for Netlify deployment
- ✅ Application is ready for deployment