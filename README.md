# Gmail IMAP Viewer 📧

A full-stack application that allows users to authenticate with Gmail, retrieve emails using the IMAP protocol, and view them through a modern web interface. The system stores email metadata in a MySQL database and runs entirely in Docker containers.

---

## 🚀 Features

* Google OAuth2 authentication
* Gmail email retrieval using IMAP
* Email metadata storage in MySQL
* Paginated email browsing
* Email subject search
* Dockerized development environment
* GitHub Actions CI/CD pipelines

---

## 🏗️ Architecture Overview

The application follows a layered architecture:

```
React Frontend → Node.js API → Service Layer → Gmail IMAP
                                 ↓
                              MySQL
```

### Tech Stack

**Frontend**

* React
* Tailwind CSS
* Axios

**Backend**

* Node.js
* Express
* IMAP (imap-simple)
* Google OAuth2
* Sequelize ORM

**Database**

* MySQL

**DevOps**

* Docker & Docker Compose
* GitHub Actions (CI/CD)

---

## 📂 Project Structure

```
gmail-imap-viewer
├── frontend/
├── backend/
├── docker-compose.yml
└── .github/
    └── workflows/
```

### Backend Structure

```
backend/
├── controllers/
├── routes/
├── services/
├── models/
├── config/
└── server.js
```

---

## 🔐 Authentication Flow

1. User clicks **Login with Google**
2. Browser is redirected to Google OAuth2
3. Backend exchanges authorization code for tokens
4. Tokens are stored securely in the database
5. Backend connects to Gmail using IMAP with OAuth2

---

## 📨 Email Retrieval

After login:

```
Gmail IMAP → Backend → Email metadata → MySQL
```

Stored metadata includes:

* sender
* subject
* date
* message ID

---

## 🐳 Running the Project with Docker

### Prerequisites

* Docker
* Docker Compose

### Setup

```bash
git clone https://github.com/SAYANISHAN98/gmail-imap-viewer.git
cd gmail-imap-viewer
```

Create a `.env` file in the backend directory:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

DB_HOST=mysql
DB_USER=root
DB_PASSWORD=password
DB_NAME=gmail_viewer
```

### Start the application

```bash
docker compose up --build
```

### Access services

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MySQL       | localhost:3306        |

---

## 🧪 Running Tests

Backend tests:

```bash
cd backend
npm test
```

Frontend tests:

```bash
cd frontend
npm test
```

GitHub Actions automatically runs tests on every pull request. ✅

---

## 🔄 CI/CD Workflow

### Continuous Integration

Triggered on:

* Pull requests to `main` and `dev`

Checks:

* Dependency installation
* Backend tests
* Frontend tests

### Deployment Strategy

| Branch | Environment                               |
| ------ | ----------------------------------------- |
| dev    | Development deployment                    |
| main   | Production deployment (requires approval) |

---

## 🌐 API Endpoints

### Authentication

```
GET /auth/google
GET /auth/google/callback
```

### Emails

```
GET /emails?page=1
GET /emails/search?q=invoice
```

---

## 🗄️ Database Schema

### Users

| Column        | Description    |
| ------------- | -------------- |
| id            | primary key    |
| email         | Gmail address  |
| google_id     | Google user ID |
| access_token  | OAuth token    |
| refresh_token | OAuth token    |

### Emails

| Column     | Description      |
| ---------- | ---------------- |
| id         | primary key      |
| user_id    | foreign key      |
| sender     | email sender     |
| subject    | email subject    |
| date       | email date       |
| message_id | Gmail message ID |

---

## 🔧 Development Workflow

1. Create feature branch from `dev`
2. Implement changes
3. Open pull request
4. CI checks run automatically
5. Merge into `dev` → deploy to development
6. Merge `dev` → `main` → production deployment (owner approval required)

---

## 📸 UI Overview

The frontend provides:

* Login screen
* Email dashboard
* Search bar
* Pagination controls

---

## 🛡️ Security Considerations

* OAuth2 used instead of passwords
* Tokens stored securely
* Environment variables for secrets
* Docker isolates services

---

## 📜 License

This project is developed as part of a software engineering technical assignment.
