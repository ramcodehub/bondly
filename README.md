# NextGen CRM - Full-Stack Customer Relationship Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <img src="https://img.shields.io/github/license/your-username/nextgen-crm" alt="License" />
  <img src="https://img.shields.io/github/last-commit/your-username/nextgen-crm" alt="Last Commit" />
  <img src="https://img.shields.io/github/languages/code-size/your-username/nextgen-crm" alt="Code Size" />
</div>

<br />

A modern, full-stack CRM (Customer Relationship Management) system designed to streamline business operations, manage customer interactions, and improve data-driven decision-making. Built with a cutting-edge tech stack featuring React/Next.js frontend and Node.js/Express backend, all powered by Supabase for database and authentication services.

## 🌟 Key Features

- **🔐 Secure Authentication**: Robust user authentication and authorization using Supabase Auth with JWT tokens
- **📊 Interactive Dashboard**: Real-time analytics dashboard with visual charts and key performance indicators
- **👥 Lead Management**: Comprehensive lead tracking from initial contact to conversion
- **💼 Opportunity Pipeline**: Advanced sales opportunity tracking with customizable stages
- **🏢 Account & Contact Management**: Centralized database for customer accounts and associated contacts
- **📱 Responsive Design**: Fully responsive UI optimized for desktops, tablets, and mobile devices
- **🔄 Real-time Data Sync**: Live data updates across all connected clients
- **🛡️ Security**: Built-in rate limiting, CORS protection, and input validation
- **🎨 Modern UI Components**: Beautiful, accessible UI components using Radix UI and Tailwind CSS

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | [Next.js 13](https://nextjs.org/), [React 18](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [Supabase](https://supabase.io/) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/docs/guides/database) |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) |
| **API** | RESTful APIs with comprehensive error handling |
| **Testing** | [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/) |
| **Deployment** | [Render](https://render.com/), [Netlify](https://netlify.com/) |

## 📁 Project Structure

```
nextgen-crm/
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
├── scripts/                 # Deployment and utility scripts
└── render.yaml              # Render deployment configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nextgen-crm.git
   cd nextgen-crm
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # backend/.env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   PORT=5000
   NODE_ENV=development
   ```

   Create a `.env.local` file in the `frontend` directory:
   ```env
   # frontend/.env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
   ```

5. **Start the development servers:**

   In one terminal, start the backend:
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Fetch all leads |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/opportunities` | Fetch all opportunities |
| POST | `/api/opportunities` | Create a new opportunity |
| GET | `/api/accounts` | Fetch all accounts |
| GET | `/api/contacts` | Fetch all contacts |
| GET | `/api/homepage/images` | Fetch homepage carousel images |

## 🗄️ Database Schema

The CRM uses Supabase (PostgreSQL) with the following key tables:

- **leads**: Stores information about potential customers
  - `id`, `name`, `email`, `phone`, `company`, `status`, `created_at`
- **opportunities**: Tracks sales opportunities
  - `id`, `lead_id`, `stage`, `value`, `close_date`, `created_at`
- **accounts**: Manages customer accounts
  - `id`, `name`, `industry`, `website`, `created_at`
- **contacts**: Stores contact information for accounts
  - `id`, `account_id`, `name`, `email`, `phone`, `created_at`
- **users**: Managed by Supabase Auth
- **images**: Homepage carousel images
  - `id`, `image_url`, `alt_text`, `created_at`

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Deploy to Render

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
5. Set the build command to:
   ```bash
   npm install && npm run build
   ```
6. Set the start command to:
   ```bash
   npm start
   ```

### Deploy Frontend to Netlify

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `frontend/out` directory to Netlify

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 📞 Support

If you have any questions or need help with setup, please [open an issue](https://github.com/your-username/nextgen-crm/issues) on GitHub.