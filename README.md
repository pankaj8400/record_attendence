# HRMS Lite — Lightweight Human Resource Management System

## 📋 Project Overview

HRMS Lite is a full-stack web application for basic HR operations — managing employee records and tracking daily attendance. It provides a clean, professional admin interface focused on essential workforce management tasks.

## 🛠 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 18 + Vite     |
| Backend    | Python FastAPI      |
| Database   | SQLite (SQLAlchemy) |
| Styling    | Vanilla CSS         |
| HTTP Client| Axios               |

## 🚀 Getting Started — Run Locally

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** and npm

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

## ✅ Features

### Core
- **Employee Management** — Add, view, and delete employees
- **Attendance Tracking** — Mark daily attendance (Present / Absent) per employee
- **Validation** — Required fields, valid email format, duplicate employee handling
- **Error Handling** — Proper HTTP status codes and meaningful error messages

### Bonus
- 📊 Dashboard with summary stats (total employees, present/absent today, departments)
- 📅 Filter attendance records by date
- ✅ Display total present days per employee

## 📁 Project Structure

```
quess/
├── backend/
│   ├── main.py            # FastAPI app entry point
│   ├── database.py        # SQLAlchemy engine & session
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── crud.py            # Database operations
│   ├── routers/
│   │   ├── employees.py   # Employee API endpoints
│   │   └── attendance.py  # Attendance API endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js         # Axios API client
│   │   ├── App.jsx        # Root component with routing
│   │   ├── index.css      # Design system
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   └── components/
│   │       ├── Toast.jsx
│   │       ├── Loader.jsx
│   │       ├── EmptyState.jsx
│   │       └── ConfirmDialog.jsx
│   └── package.json
└── README.md
```

## 🔗 API Endpoints

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/api/employees/`                     | List all employees             |
| POST   | `/api/employees/`                     | Add a new employee             |
| GET    | `/api/employees/{id}`                 | Get single employee            |
| DELETE | `/api/employees/{id}`                 | Delete an employee             |
| POST   | `/api/attendance/`                    | Mark or update attendance      |
| GET    | `/api/attendance/`                    | Get all attendance records     |
| GET    | `/api/attendance/employee/{id}`       | Get attendance for an employee |
| GET    | `/api/attendance/present-count/{id}`  | Get present day count          |
| GET    | `/api/dashboard`                      | Dashboard summary stats        |

## ⚠️ Assumptions & Limitations

- Single admin user — no authentication required
- SQLite used for simplicity (easily replaceable with PostgreSQL)
- Leave management, payroll, and advanced HR features are out of scope
- Date filter on attendance records requires clicking "Filter" button to apply
