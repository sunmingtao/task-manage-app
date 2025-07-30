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

### Frontend (React)
- **Location**: `/frontend/`
- **Framework**: React 19.1.1 with Create React App
- **UI Library**: Material-UI (@mui/material, @mui/icons-material)
- **HTTP Client**: Axios for API communication
- **Routing**: React Router DOM 6.30.1
- **Styling**: Emotion (CSS-in-JS) with Material-UI

### Key Configuration
- CORS configured for `http://localhost:3000` (React dev server)
- JWT tokens: 60min access, 7-day refresh
- Development servers: Django on :8000, React on :3000

## Development Commands

### Backend (Django)
```bash
cd backend
python manage.py runserver              # Start Django development server
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

This project is in the initial setup phase. The basic Django and React scaffolding is complete with:
- Django project configured with DRF, JWT auth, and CORS
- React app bootstrapped with Material-UI components
- Basic apps created but models are still empty (accounts, boards, tasks)
- No API endpoints implemented yet beyond Django admin

Based on the project plan (project_plan.md), the implementation follows an 8-week development roadmap focusing on user authentication, core data models, UI implementation, drag-and-drop functionality, and advanced features.

## Important Notes

- Models in all Django apps (accounts, boards, tasks) are currently empty - the core data models need to be implemented
- No API endpoints are configured yet in the main urls.py
- The React frontend currently shows a basic welcome page
- CORS is configured for development but will need production configuration
- SQLite is used for development; production should use PostgreSQL (psycopg2-binary already in requirements)