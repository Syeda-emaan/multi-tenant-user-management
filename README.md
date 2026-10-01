# 🚀 Multi-Tenant User Management System

A full-stack multi-tenant user management platform where multiple companies can register and securely manage their employees within isolated organizational environments.

The system provides JWT-based authentication, role-based access control, company management, user management, REST APIs, Swagger API documentation, and a React-based frontend.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Protected API routes
- Role-based access control
- Session/token-based authorization
- Password security

### 🏢 Multi-Tenant Architecture
- Multiple companies can use the same application
- Each company operates within its own tenant
- Users are associated with their respective companies
- Tenant-level data isolation
- Company-specific user management

### 👥 Role-Based Access Control

The system supports different user roles:

| Role | Access |
|------|--------|
| 👑 Admin | Full company/user management |
| 🧑‍💼 Manager | Manage permitted users and company resources |
| 👤 Employee | Access permitted employee-level features |

Access to different resources is controlled according to the authenticated user's role.

---

## 📊 Dashboard & User Management

The React frontend provides a modern interface for:

- Dashboard overview
- User management
- User profiles
- Company settings
- Authentication
- Registration
- Role-based functionality
- API-connected frontend operations

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React.js
- ⚡ Vite
- 🎨 CSS
- 🔗 REST API Integration
- 🔐 JWT Authentication

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 JWT
- 🛡️ Role-Based Access Control
- 📡 RESTful APIs

### Database

- 🍃 MongoDB
- 🔌 MongoDB/Mongoose

### API & Documentation

- 📚 Swagger / OpenAPI
- 📮 Postman
- REST API

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 🏗️ Project Architecture

```text
multi-tenant-user-management/
│
├── client/                    # React Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── client.js
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       │   ├── AuthShell.jsx
│       │   ├── CompanySettings.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   └── Users.jsx
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── src/                      # Backend
├── docs/                     # Documentation
├── tests/                    # Test files
├── uploads/                  # Uploaded files
│
├── .env.example              # Environment variables example
├── server.js                 # Backend entry point
├── package.json
├── package-lock.json
│
├── postman_environment.json
├── Multi-Tenant User Management API.postman_collection.json
│
└── README.md
