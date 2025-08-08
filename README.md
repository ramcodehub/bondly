# Full-Stack CRM Project

A professional, full-stack CRM (Customer Relationship Management) system designed to streamline business operations, manage customer interactions, and improve data-driven decision-making. This application is built with a modern tech stack, featuring a React-based frontend and a Node.js/Express backend, all powered by Supabase for database and authentication services.

The system is fully responsive, ensuring a seamless experience across all devices. All dynamic data is fetched from the Supabase database through a robust set of backend APIs, providing real-time updates and a clear separation of concerns between the client and server.

## ✨ Features

- **Authentication**: Secure user login and registration using Supabase Auth.
- **Dashboard**: An intuitive dashboard providing a high-level overview of key metrics.
- **Lead Management**: Track and manage potential customers from initial contact to conversion.
- **Opportunity Tracking**: Monitor sales opportunities and manage the sales pipeline effectively.
- **Account & Contact Management**: Maintain a centralized database of customer accounts and their associated contacts.
- **Dynamic Homepage Carousel**: An engaging and interactive carousel on the homepage to showcase key features or announcements, with images fetched dynamically from the database.
- **Responsive Design**: A fully responsive UI that adapts to desktops, tablets, and mobile devices.
- **Mobile-First Sidebar**: A collapsible sidebar for easy navigation on smaller screens.
- **Dynamic Data Fetching**: All application data is fetched from the backend via RESTful APIs, ensuring the UI is always up-to-date.

## 🛠️ Tech Stack

| Category      | Technology                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------|
| **Frontend**  | [React](https://reactjs.org/), [TailwindCSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Shadcn UI](https://shadcn.dev/) |
| **Backend**   | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)                                    |
| **Database**  | [Supabase](https://supabase.io/) / [PostgreSQL](https://www.postgresql.org/)                           |
| **API**       | RESTful APIs                                                                                           |
| **Build Tool**| [Vite](https://vitejs.dev/)                                                                            |

## 📂 Folder & File Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

```
frontend/
├── public/              # Static assets (images, fonts)
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages (Dashboard, Leads, etc.)
│   ├── services/        # API service for backend communication
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component with routing
│   └── main.jsx         # Entry point of the React application
├── .env                 # Environment variables for the frontend
├── package.json         # Frontend dependencies and scripts
└── vite.config.js       # Vite configuration
```

### Backend

```
backend/
├── routes/              # API route definitions
│   └── homepage.js      # Example route for homepage data
├── src/
│   ├── config/          # Configuration files (e.g., Supabase client)
│   ├── controllers/     # Logic for handling API requests
│   ├── models/          # Data models (if any)
│   └── index.js         # Main entry point for the backend server
├── .env                 # Environment variables for the backend
└── package.json         # Backend dependencies and scripts
```

## 🚀 Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or higher)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account

### Step-by-Step Guide

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables**:
    - Create a `.env` file in both the `frontend` and `backend` directories.
    - Copy the contents from `.env.example` (if available) or use the template below.

5.  **Run the Backend Server**:
    ```bash
    cd ../backend
    npm start
    ```

6.  **Run the Frontend Application**:
    ```bash
    cd ../frontend
    npm run dev
    ```

## 🔑 Environment Variables (.env)

Create a `.env` file in both the `frontend` and `backend` directories and add the following variables.

### Backend (`backend/.env`)

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
```

### Frontend (`frontend/.env`)

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_API_URL=http://localhost:5000
```

## 📝 API Documentation

Key API endpoints for the CRM:

- `GET /api/leads`: Fetch all leads.
- `POST /api/leads`: Create a new lead.
- `PUT /api/leads/:id`: Update a lead.
- `DELETE /api/leads/:id`: Delete a lead.
- `GET /api/opportunities`: Fetch all opportunities.
- `POST /api/opportunities`: Create a new opportunity.
- `GET /api/accounts`: Fetch all accounts.
- `GET /api/contacts`: Fetch all contacts.
- `GET /api/homepage/images`: Fetch images for the homepage carousel.

## 🗄️ Database Schema

Supabase (PostgreSQL) is used for the database. Key tables include:

- **Leads**: Stores information about potential customers.
  - `id`, `name`, `email`, `phone`, `status`, `created_at`
- **Opportunities**: Tracks sales opportunities.
  - `id`, `lead_id`, `stage`, `value`, `close_date`
- **Accounts**: Manages customer accounts.
  - `id`, `name`, `industry`, `website`
- **Contacts**: Stores contact information for accounts.
  - `id`, `account_id`, `name`, `email`, `phone`
- **Users**: Managed by Supabase Auth.
- **Images**: Stores URLs for the homepage carousel.
  - `id`, `image_url`, `alt_text`

## 🏃 Running the Project

### Development

- **Backend**: `npm start` (runs on `http://localhost:5000`)
- **Frontend**: `npm run dev` (runs on `http://localhost:5173`)

### Production

- **Frontend Build**: `npm run build`

## 🔮 Future Enhancements

- **Analytics Dashboard**: A visual dashboard with charts and graphs for sales trends.
- **AI-Powered Recommendations**: Suggest next best actions for leads and opportunities.
- **Role-Based Access Control (RBAC)**: Different permission levels for users (Admin, Manager, Sales Rep).
- **Email Integration**: Sync emails with contacts and leads.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
