# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a task manager application built with Django (backend) and React (frontend), designed as a Trello-like Kanban board system. The project follows a full-stack web application architecture with JWT authentication and REST API communication between frontend and backend.

## Architecture

### Backend (Django)
- **Location**: `/backend/`
- **Framework**: Django 5.2.4 with Django REST Framework
- **Authentication**: JWT-based using `djangorestframework_simplejwt`
- **Database**: SQLite (configured in settings, but ready for PostgreSQL)
- **Apps Structure**:
  - `accounts/` - User authentication and account management
  - `boards/` - Board/workspace management (Kanban boards)
  - `tasks/` - Individual task management within boards
  - `taskmanager/` - Main Django project configuration
- **API**: Basic API root endpoint configured at `/api/`

### Frontend (React)
- **Location**: `/frontend/`
- **Framework**: React 19.1.1 with Create React App
- **UI Library**: Material-UI (@mui/material, @mui/icons-material)
- **HTTP Client**: Axios for API communication (configured in `services/api.js`)
- **Routing**: React Router DOM 6.30.1
- **Styling**: Emotion (CSS-in-JS) with Material-UI
- **Structure**: Organized with `components/`, `contexts/`, `services/` and `utils/` directories
- **Authentication**: Context-based state management with automatic token handling

### Key Configuration
- CORS configured for `http://localhost:3000` (React dev server)
- JWT tokens: 60min access, 7-day refresh
- Development servers: Django on :8000, React on :3000

## Development Commands

### Backend (Django)
```bash
cd backend
python manage.py runserver              # Start Django development server
./startserver.sh                        # Alternative: Run server with venv activation
python manage.py makemigrations         # Create database migrations
python manage.py migrate                # Apply database migrations
python manage.py createsuperuser        # Create admin user
python manage.py test                   # Run Django tests
python manage.py shell                  # Django interactive shell
```

### Frontend (React)
```bash
cd frontend
npm start                               # Start React development server (with polling enabled)
npm test                                # Run Jest tests in watch mode  
npm run build                           # Build for production
npm run eject                           # Eject from Create React App (one-way operation)
```

### Dependencies Management
```bash
# Backend
cd backend
pip install -r requirements.txt        # Install Python dependencies
pip freeze > requirements.txt          # Update requirements file

# Frontend  
cd frontend
npm install                            # Install Node.js dependencies
npm install <package>                  # Add new dependency
```

## Project Status

**✅ Phase 1 Complete: Project Setup & Foundation**

The project has completed Phase 1 with full-stack foundation in place:

### Backend Setup Complete
- ✅ Django project with virtual environment
- ✅ Django REST Framework configured
- ✅ CORS middleware configured for React communication  
- ✅ Basic project structure with apps: accounts, boards, tasks
- ✅ API root endpoint at `/api/` with basic response
- ✅ Convenience script `startserver.sh` for development

### Frontend Setup Complete
- ✅ React app with Create React App
- ✅ Material-UI integration ready
- ✅ Axios configured for API calls (`services/api.js`)
- ✅ Organized folder structure with `services/` and `utils/`
- ✅ Backend connectivity test implemented
- ✅ API endpoints constants defined (`utils/constants.js`)

**✅ Phase 2 Complete: User Authentication**

JWT authentication system fully implemented:

### Backend Authentication Complete
- ✅ User registration endpoint (`/api/auth/register/`)
- ✅ JWT token login endpoint (`/api/auth/token/`)
- ✅ JWT token refresh endpoint (`/api/auth/token/refresh/`)
- ✅ User profile endpoint (`/api/auth/profile/`)
- ✅ UserSerializer with proper password handling
- ✅ JWT tokens automatically generated on registration
- ✅ Proper permissions (AllowAny for registration, IsAuthenticated for profile)

### Frontend Authentication Complete
- ✅ AuthContext with React Context API for global auth state
- ✅ Login and Register components with form validation
- ✅ Dashboard component with user profile display
- ✅ Protected routes with ProtectedRoute component
- ✅ Public routes with automatic redirect for authenticated users
- ✅ Automatic token refresh with Axios interceptors
- ✅ Token storage in localStorage with proper cleanup
- ✅ Complete routing system (`/login`, `/register`, `/dashboard`)

### Authentication API Endpoints
- `POST /api/auth/register/` - User registration with automatic JWT token generation
- `POST /api/auth/token/` - Login to get access/refresh tokens
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET/PUT /api/auth/profile/` - View/update user profile (authenticated)

**Next Phase**: Core Data Models (Week 3) - Board, List, and Task models with CRUD endpoints

Based on the project plan (project_plan.md), the implementation follows an 8-week development roadmap focusing on user authentication, core data models, UI implementation, drag-and-drop functionality, and advanced features.

## Important Notes

- Board and Task models are currently empty - ready for Phase 3 implementation
- Authentication system is fully functional and tested (see `cheatsheet.txt` for curl examples)
- Frontend authentication forms fully implemented in Phase 2 continuation
- Development environment fully operational with both servers
- SQLite is used for development; production should use PostgreSQL (psycopg2-binary already in requirements)