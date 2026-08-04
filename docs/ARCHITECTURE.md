# ARCHITECTURE.md

# DevBoard Architecture

## Overview

DevBoard follows a modern **client-server architecture**, separating the frontend and backend into independent applications that communicate through a REST API.

Real-time communication is handled through Socket.IO, while MongoDB stores all persistent application data.

```
                 +-------------------------+
                 |        React App        |
                 |      (Frontend)         |
                 +------------+------------+
                              |
                    HTTP / HTTPS (REST API)
                              |
                              |
                 +------------v------------+
                 |      Express Server     |
                 |       (Backend)         |
                 +------------+------------+
                              |
             +----------------+----------------+
             |                                 |
     MongoDB Atlas                      Socket.IO Server
             |                                 |
             +----------------+----------------+
                              |
                        Connected Clients
```

---

# Technology Stack

## Frontend

- React
- React Router
- Context API
- Axios
- Tailwind CSS
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

Collections

- Users
- DeveloperProfiles
- CompanyProfiles
- Jobs
- Applications
- Notifications

---

# Frontend Architecture

```
src/

api/
    axios.js

components/
    Footer
    Navbar
    JobCard
    JobForm
    NotificationBell
    ProtectedRoute
    GuestRoute
    Spinner

context/
    UserContext
    SocketContext

pages/
    Landing
    Login
    Register
    Dashboard
    Profile
    Jobs
    JobDetails
    CreateJob
    EditJob
    MyApplications
    CompanyApplications

services/
    authService
    jobService
    applicationService
    profileService
```

---

## Responsibilities

### Pages

Responsible for:

- Fetching data
- Calling services
- Rendering layouts

Pages should not directly communicate with the backend.

---

### Services

Responsible for:

- API requests
- Returning backend responses

This keeps API logic separated from UI components.

---

### Components

Reusable UI building blocks.

Examples:

- Navbar
- Footer
- JobForm
- NotificationBell
- Spinner

---

### Context

Global application state.

Two Context Providers exist:

## UserContext

Stores

- Current User
- Access Token
- Authentication State
- Login
- Logout

---

## SocketContext

Stores

- Socket connection
- Notifications
- Unread count
- Notification updates

---

# Backend Architecture

```
src/

config/
    db.js

controllers/

middleware/

models/

routes/

services/

socket/

server.js
```

---

## Controllers

Controllers contain application logic.

Examples

Authentication

- Login
- Register
- Logout

Jobs

- Create
- Update
- Delete

Applications

- Apply
- View
- Update Status

Profiles

- Create
- Update
- Retrieve

---

## Models

Each MongoDB collection has a corresponding Mongoose model.

Current models:

- User
- DeveloperProfile
- CompanyProfile
- Job
- Application
- Notification

---

## Routes

Routes expose REST endpoints.

Example

```
GET /api/jobs

POST /api/jobs

PATCH /api/jobs/:id
```

Routes remain lightweight by delegating logic to controllers.

---

## Middleware

Middleware handles cross-cutting concerns.

Examples

Authentication

Authorization

Error Handling

Validation

---

## Services

Services contain reusable business logic.

Current example

Notification Service

Responsible for

- Creating Notification documents
- Emitting Socket.IO events

This prevents duplicated notification logic across controllers.

---

# Authentication Architecture

Authentication is based on JWT.

```
Login

↓

Server validates credentials

↓

Generate Access Token

↓

Generate Refresh Token

↓

Return both tokens

↓

Frontend stores tokens

↓

Access Token included on every API request

↓

Protected middleware verifies token

↓

User gains access
```

---

## Access Token

Short-lived.

Used for:

- API requests
- Socket authentication

---

## Refresh Token

Long-lived.

Used only to request new access tokens.

This minimizes security risks while keeping users logged in.

---

# Authorization

Authorization is role-based.

Supported roles:

```
Developer

Company
```

Example rules

Developer

✅ Apply to jobs

❌ Create jobs

---

Company

✅ Create jobs

✅ Review applications

❌ Apply to jobs

---

Ownership validation is also implemented.

For example:

Only the company that created a job can edit or delete it.

---

# Database Relationships

```
User

│

├──────────────┐

│              │

Developer      Company

Profile        Profile

                │

                │

               Jobs

                │

                │

          Applications

                │

                │

         Notifications
```

---

## Relationships

### User

One user can have

- One Developer Profile

or

- One Company Profile

---

### Company

One company

↓

Many jobs

---

### Job

One job

↓

Many applications

---

### Developer

One developer

↓

Many applications

---

### Application

References

- Job
- User

---

### Notification

References

- Recipient
- Application

---

# Socket.IO Architecture

Socket.IO provides real-time notifications.

Connection flow

```
User Login

↓

Socket connects

↓

JWT Token sent

↓

Backend verifies JWT

↓

Socket joins private room

↓

Future events emitted directly to that room
```

---

Private Rooms

Each connected user joins

```
room = userId
```

Example

```
io.to(userId).emit(...)
```

This guarantees notifications are only received by the intended recipient.

---

Current Notification Events

Company

- New Application

Developer

- Application Status Changed

---

# Request Lifecycle

Example

Developer applies for a job.

```
React

↓

Axios

↓

Express Route

↓

Controller

↓

Application Model

↓

MongoDB

↓

Notification Service

↓

Socket.IO

↓

Company Browser
```

---

# Design Principles

The application follows several software engineering principles.

## Separation of Concerns

Frontend

↓

Presentation

Backend

↓

Business Logic

Database

↓

Persistence

---

## Reusability

Shared components

Shared services

Reusable middleware

Reusable notification service

---

## Scalability

The architecture allows additional features to be added with minimal changes.

Possible additions

- Resume Uploads

- Admin Dashboard

- Messaging

- Search

- Analytics

---

## Security

Implemented security measures include

- Password Hashing

- JWT Authentication

- Refresh Tokens

- Protected Routes

- Role Authorization

- Ownership Validation

- Socket Authentication

- Environment Variables

---

# Future Architecture Improvements

Potential future improvements include

- Repository Pattern

- Service Layer Expansion

- File Storage (AWS S3 / Cloudinary)

- Redis Caching

- Docker

- CI/CD Pipeline

- Unit Testing

- Integration Testing

- GraphQL API

- Microservices

---

# Summary

DevBoard is built using a modular, scalable client-server architecture.

The project separates presentation, business logic, persistence, and real-time communication into independent layers, making the application easier to maintain, extend, and deploy.

This architecture provides a solid foundation for future enhancements while following modern full-stack development practices.
