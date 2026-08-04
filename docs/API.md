# API.md

# DevBoard REST API Documentation

## Overview

The DevBoard backend exposes a RESTful API used by the React frontend.

All endpoints return JSON responses.

Base URL (Development)

```
http://localhost:5000/api
```

Base URL (Production)

```
https:https://devboard-j56m.onrender.com/api
```

---

# Authentication

Protected endpoints require an Access Token.

Example

```
Authorization: Bearer <access_token>
```

---

# Response Format

Successful requests

```json
{
  "success": true,
  "data": {}
}
```

---

Error responses

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# Authentication Endpoints

---

## Register

```
POST /auth/register
```

Registers a new user.

### Request

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "developer"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "john@example.com",
    "role": "developer",
    "accessToken": "..."
  }
}
```

---

## Login

```
POST /auth/login
```

Authenticates a user.

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

Returns

- User
- Access Token
- Refresh Token(HttpOnly cookie and is never exposed to JavaScript)

---

## Refresh Token

```
POST /auth/refresh
```

Returns a new access token.

---

## Logout

```
POST /auth/logout
```

Invalidates the refresh token.

Authentication Required

✅ Yes

---

# Profile Endpoints

---

## Get My Profile

```
GET /profile/me
```

Authentication Required

✅ Yes

Returns the logged-in user's profile.

---

## Create Profile

```
POST /profile
```

Authentication Required

✅ Yes

Creates either

- Developer Profile

or

- Company Profile

depending on the user's role.

---

## Update Profile

```
PUT /profile/me
```

Authentication Required

✅ Yes

Updates the user's profile.

---

# Job Endpoints

---

## Get All Jobs

```
GET /jobs
```

Authentication Required

❌ No

Returns every active job.

---

## Get Job

```
GET /jobs/:id
```

Authentication Required

❌ No

Returns a single job.

---

## Create Job

```
POST /jobs
```

Authentication Required

✅ Yes

Role Required

Company

Creates a new job listing.

Example Request

```json
{
  "title": "Frontend Developer",
  "description": "...",
  "location": "Remote",
  "employmentType": "full-time",
  "experienceLevel": "mid",
  "salary": {
    "min": 3000,
    "max": 4500
  }
}
```

---

## Update Job

```
PUT /jobs/:id
```

Authentication Required

✅ Yes

Role Required

Company

Only the owner of the job can update it.

---

## Delete Job

```
DELETE /jobs/:id
```

Authentication Required

✅ Yes

Role Required

Company

Deletes an existing job.

---

# Application Endpoints

---

## Apply to Job

```
POST /applications/:jobId
```

Authentication Required

✅ Yes

Role Required

Developer

Example

```json
{
  "coverLetter": "I would love to join your team..."
}
```

Business Rules

- Duplicate applications are prevented.
- Only developers can apply.

---

## Get My Applications

```
GET /applications/my
```

Authentication Required

✅ Yes

Role Required

Developer

Returns every application submitted by the current user.

---

## Get Company Applications

```
GET /applications/company
```

Authentication Required

✅ Yes

Role Required

Company

Returns every application submitted to jobs owned by the company.

---

## Update Application Status

```
PATCH /applications/:id/status
```

Authentication Required

✅ Yes

Role Required

Company

Allowed values

```text
pending
reviewed
accepted
rejected
```

Example

```json
{
  "status": "accepted"
}
```

Business Rules

- Only the owning company may update the status.
- Updating the status triggers a real-time notification.

---

# Notification Endpoints

Current implementation uses Socket.IO for real-time delivery.

Notification documents are stored in MongoDB.

Supported notification types

```
NEW_APPLICATION

APPLICATION_STATUS
```

---

# Socket.IO API

Authentication

Socket connections use the same JWT access token.

Example

```javascript
const socket = io(url, {
  auth: {
    token: accessToken,
  },
});
```

---

## Incoming Events

### notification

Received whenever a notification is sent.

Example

```json
{
  "_id": "...",
  "type": "NEW_APPLICATION",
  "message": "New application received",
  "createdAt": "...",
  "read": false
}
```

---

# Authorization Matrix

| Endpoint                  | Guest | Developer | Company |
| ------------------------- | :---: | :-------: | :-----: |
| Register                  |  ✅   |    ✅     |   ✅    |
| Login                     |  ✅   |    ✅     |   ✅    |
| View Jobs                 |  ✅   |    ✅     |   ✅    |
| View Job Details          |  ✅   |    ✅     |   ✅    |
| Create Profile            |  ❌   |    ✅     |   ✅    |
| Update Profile            |  ❌   |    ✅     |   ✅    |
| Create Job                |  ❌   |    ❌     |   ✅    |
| Edit Job                  |  ❌   |    ❌     |   ✅    |
| Delete Job                |  ❌   |    ❌     |   ✅    |
| Apply to Job              |  ❌   |    ✅     |   ❌    |
| View My Applications      |  ❌   |    ✅     |   ❌    |
| View Company Applications |  ❌   |    ❌     |   ✅    |
| Update Application Status |  ❌   |    ❌     |   ✅    |

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource Not Found    |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# Validation Rules

Authentication

- Valid JWT required
- Valid refresh token

Jobs

- Company ownership verified
- Required fields validated

Applications

- Duplicate applications prevented
- Developer role required

Profiles

- One profile per user
- Role-specific validation

Notifications

- Recipient required
- Notification type validated

---

# API Design Principles

The API follows RESTful conventions.

- Resource-based URLs
- Standard HTTP methods
- Consistent JSON responses
- Stateless authentication
- Role-based authorization
- Ownership validation
- Proper HTTP status codes

---

# Future API Improvements

Potential future endpoints include

- Search Jobs
- Filter Jobs
- Upload Resume
- Company Analytics
- Saved Jobs
- User Settings
- Admin Dashboard
- Pagination
- Email Preferences
- Public Company Profiles
