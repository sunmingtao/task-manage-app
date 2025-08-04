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
- **Drag & Drop**: React DND with HTML5 backend for task management
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

**✅ Phase 3 Complete: Core Data Models**

Full Kanban board system implemented:

### Backend Data Models Complete
- ✅ Board model with owner/members, title, description, timestamps
- ✅ List model with position ordering and board relationship
- ✅ Task model with assignee, priority, due_date, completion status
- ✅ Complete Django serializers with nested data and computed fields
- ✅ Permission-based ViewSets ensuring users only access their boards
- ✅ CRUD endpoints for all models with proper error handling

### Frontend UI Complete  
- ✅ BoardList component with create board functionality
- ✅ BoardDetail component with full Kanban board interface
- ✅ List management (create, display with task counts)
- ✅ Task management (create, edit, delete, mark complete)
- ✅ Real-time UI updates without page refresh
- ✅ Enhanced routing with board detail pages
- ✅ Complete API integration with error handling

### Core Data API Endpoints
- `GET/POST /api/boards/` - List/create boards for authenticated user
- `GET/PUT/DELETE /api/boards/{id}/` - Board detail operations
- `POST /api/lists/` - Create lists within boards
- `GET/PUT/DELETE /api/lists/{id}/` - List detail operations  
- `POST /api/tasks/` - Create tasks within lists
- `GET/PUT/DELETE /api/tasks/{id}/` - Task detail operations

**✅ Phase 4-5 Complete: Advanced Features & UI Polish**

Full drag & drop and task management system implemented:

### Drag & Drop System Complete
- ✅ React DND integration with HTML5 backend
- ✅ DragDropProvider component wrapping board interface
- ✅ DraggableTask component with drag functionality and visual feedback
- ✅ DroppableList component with drop zones and hover effects
- ✅ TaskDropZone component for precise task positioning
- ✅ Within-list task reordering with precise drop zones
- ✅ Cross-list task movement between different lists
- ✅ Optimistic UI updates during drag operations
- ✅ Backend API integration for persistent task moves and positioning
- ✅ Visual indicators (hover effects, drop zones, drag states)
- ✅ Smooth animations and transitions during drag operations

### Task Management Features Complete
- ✅ Task editing with professional modal interface
- ✅ EditTaskModal component with form validation
- ✅ Task title, description, and priority editing
- ✅ Priority color coding (High: Red, Medium: Yellow, Low: Green)
- ✅ Edit and delete buttons with hover effects
- ✅ Real-time task updates with backend persistence
- ✅ **Task assignment functionality with user selection**
- ✅ **Assignee display on task cards with user avatars**
- ✅ **Open collaboration: all users can assign tasks to anyone**
- ✅ **All boards visible to all authenticated users**

### Enhanced UI Features
- ✅ Professional Kanban board layout with proper spacing
- ✅ Visual feedback during drag operations (opacity, rotation, colors)
- ✅ Drop zone highlighting with dashed borders and "Drop here" indicators
- ✅ Smooth transitions and hover effects throughout
- ✅ Empty list drop indicators
- ✅ Task positioning and reordering within lists
- ✅ Clean task card design with priority badges and assignee indicators
- ✅ Responsive modal dialogs with form validation
- ✅ **User-friendly assignee selection with name/username display**

**Next Phase**: Team Features & Polish - Due dates, board sharing, notifications, activity tracking

Based on the project plan (project_plan.md), the implementation follows an 8-week development roadmap focusing on user authentication, core data models, UI implementation, drag-and-drop functionality, and advanced features.

## Important Notes

- **Complete Trello-like Kanban system** with full drag & drop and task management
- **Professional task editing** with modal interface and priority management
- **Precise task reordering** within lists and between lists with visual feedback
- **Task assignment system** with user selection and assignee display on cards
- **Open collaboration system** - all boards visible to all users, tasks assignable to anyone
- React DND dependencies added: `react-dnd@^16.0.1` and `react-dnd-html5-backend@^16.0.1`
- Authentication system is fully functional and tested (see `cheatsheet.txt` for curl examples)  
- Enhanced cheatsheet.txt with curl examples for all board/list/task operations
- Database migrations applied for Board, List, and Task models with assignee field
- Development environment fully operational with both servers
- SQLite is used for development; production should use PostgreSQL (psycopg2-binary already in requirements)