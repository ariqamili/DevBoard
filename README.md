# DevBoard

> A modern full-stack job board platform where companies can publish job opportunities and developers can discover, apply, and track their applications in real time.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

---

# Live Demo

**Frontend:** https://dev-board-jade.vercel.app

**Backend API:** https://devboard-j56m.onrender.com

---

# Overview

DevBoard is a full-stack web application that connects software developers with companies looking to hire.

Companies can create professional job postings, review incoming applications, and manage candidate statuses, while developers can browse available positions, maintain professional profiles, and apply directly through the platform.

The application follows a modern MERN architecture and includes authentication, authorization, profile management, job management, application tracking, and real-time notifications using Socket.IO.

This project was developed during the **Codveda Technologies Full Stack Development Internship**.

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Refresh Token Authentication
- Secure Password Hashing
- Protected Routes
- Persistent Sessions

---

## Role-Based Access Control

The application supports two user roles.

### Developer

- Create Developer Profile
- Browse Jobs
- View Job Details
- Apply to Jobs
- Track Applications
- Receive Live Notifications

### Company

- Create Company Profile
- Create Job Listings
- Edit Jobs
- Delete Jobs
- Review Applications
- Update Application Status
- Receive Live Notifications

---

## Developer Profile

Developers can maintain professional information including:

- Full Name
- Bio
- Skills
- Experience Level
- GitHub Profile
- Portfolio Website
- Location

---

## Company Profile

Companies can manage:

- Company Name
- Industry
- Website
- Description
- Location

---

## Job Management

Companies can create detailed job postings including:

- Job Title
- Description
- Location
- Employment Type
- Experience Level
- Salary Range
- Required Skills
- Nice-to-Have Skills
- Benefits

---

## Application Management

Developers can:

- Submit Applications
- Include Cover Letter
- Prevent Duplicate Applications
- Track Application Status

Companies can:

- View Applicants
- Review Cover Letters
- Update Application Status

Supported statuses:

- Pending
- Reviewed
- Accepted
- Rejected

---

## Real-Time Notifications

Socket.IO is used to provide live notifications.

Companies receive notifications when:

- A new application is submitted

Developers receive notifications when:

- Their application status changes

Notifications are authenticated using JWT and delivered through private Socket.IO rooms.

---

# Technology Stack

## Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Context API
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO

---

## Database

MongoDB Atlas

Collections:

- Users
- DeveloperProfiles
- CompanyProfiles
- Jobs
- Applications
- Notifications

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# Project Structure

```
DevBoard
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── socket
│   │   └── server.js
│   └── package.json
│
└── docs
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/ariqamili/DevBoard
```

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file.

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_secret

ACCESS_TOKEN_EXPIRES=15m

REFRESH_TOKEN_SECRET=your_secret

REFRESH_TOKEN_EXPIRES=30d

FRONTEND_URL=http://localhost:5173

VITE_API_URL=http://localhost:5000
```

---

# Security Features

- JWT Authentication
- Refresh Token Rotation
- Password Hashing
- Protected Routes
- Role-Based Authorization
- Ownership Validation
- Duplicate Application Prevention
- Environment Variables
- Socket Authentication

---

# Future Improvements

Possible future enhancements include:

- Resume Uploads
- Company Logos
- Search & Filtering
- Saved Jobs
- Bookmarking
- Email Notifications
- Messaging System
- Dashboard Analytics
- Admin Panel
- Advanced Search
- Mobile Responsive Improvements

---

# Documentation

Detailed project documentation can be found inside the **docs/** folder.

- SPRINTS.md
- ARCHITECTURE.md
- API.md
- DEPLOYMENT.md

---

# Learning Outcomes

This project strengthened my understanding of:

- Full Stack Development
- REST API Design
- MongoDB Relationships
- JWT Authentication
- Role-Based Authorization
- React Context API
- Socket.IO
- Production Deployment
- Software Architecture
- Secure Web Development

---

# Author

**Arian Qamili**

Computer Science Student

Developed during the **Codveda Technologies Full Stack Development Internship**.

---

# License

This project is licensed under the MIT License.
