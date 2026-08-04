# Deployment Guide

This guide explains how DevBoard is deployed in production using **Vercel** for the frontend and **Render** for the backend. MongoDB Atlas is used as the cloud database.

---

# Deployment Architecture

```
                 Users
                    │
                    ▼
      ┌───────────────────────────┐
      │   Vercel (React Frontend) │
      │  https://dev-board-jade.vercel.app
      └──────────────┬────────────┘
                     │ HTTPS API Calls
                     ▼
      ┌───────────────────────────┐
      │ Render (Express Backend)  │
      │ https://devboard-j56m.onrender.com
      └──────────────┬────────────┘
                     │
                     ▼
      MongoDB Atlas Database
```

The frontend communicates with the backend through REST APIs and Socket.IO for real-time notifications. The backend stores all application data inside MongoDB Atlas.

---

# Technologies

| Service       | Purpose                           |
| ------------- | --------------------------------- |
| Vercel        | React frontend hosting            |
| Render        | Node.js / Express backend hosting |
| MongoDB Atlas | Cloud database                    |
| GitHub        | Source code repository            |

---

# Frontend Deployment (Vercel)

The frontend is deployed directly from the GitHub repository using Vercel.

### Build Settings

```
Framework:
Vite

Build Command:
npm run build

Output Directory:
dist
```

### Environment Variables

```
VITE_API_URL=https://devboard-j56m.onrender.com
```

Whenever changes are pushed to GitHub, Vercel automatically builds and deploys a new version.

---

# Backend Deployment (Render)

The Express backend is deployed using Render.

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

Render automatically installs dependencies and starts the Express server after each deployment.

---

# Environment Variables

The backend requires the following environment variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=30d

FRONTEND_URL=https://dev-board-jade.vercel.app
```

Sensitive information is never committed to GitHub and is managed securely through Render's Environment Variables.

---

# Database Deployment

MongoDB Atlas hosts the production database.

Collections include:

- Users
- DeveloperProfiles
- CompanyProfiles
- Jobs
- Applications
- Notifications

MongoDB Atlas provides:

- Cloud-hosted storage
- Automatic backups
- Secure authentication
- Scalable infrastructure

---

# Production Features

The deployed application supports:

- User Authentication
- JWT Access & Refresh Tokens
- Secure Password Hashing
- Developer Profiles
- Company Profiles
- Job Posting
- Job Editing
- Job Applications
- Application Tracking
- Real-Time Notifications (Socket.IO)
- Protected Routes
- Role-Based Authorization

---

# Continuous Deployment

Both frontend and backend are connected to GitHub.

Deployment workflow:

1. Push code to GitHub.
2. GitHub updates the repository.
3. Vercel automatically rebuilds the frontend.
4. Render automatically redeploys the backend.
5. The latest version becomes available without manual deployment.

This continuous deployment workflow simplifies development and ensures the production application always reflects the latest codebase.

---

# Deployment Challenges

Several deployment challenges were encountered and resolved during the project:

- Configuring CORS between frontend and backend
- Managing production environment variables
- Connecting Render to MongoDB Atlas
- Updating frontend API URLs for production
- Configuring JWT authentication in production
- Testing Socket.IO connections after deployment
- Verifying protected routes in the production environment

Resolving these issues provided practical experience with deploying a full-stack MERN application.

---

# Final Deployment

The application is fully deployed and accessible online.

**Frontend**

- Hosted on Vercel

**Backend**

- Hosted on Render

**Database**

- MongoDB Atlas

The deployment demonstrates a complete production-ready MERN stack application using modern cloud hosting services with automated deployment pipelines.
