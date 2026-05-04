<<<<<<< HEAD
# Vignan University Clubs Management System

A comprehensive full-stack web application for managing university clubs and events.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- React Query for state management

### Backend
- NestJS (Node.js framework)
- MongoDB Atlas
- JWT Authentication
- bcrypt for password hashing
- Multer for file uploads

## Features

### User Roles
1. **Admin (University level)**
   - Create/delete clubs
   - Assign club admins
   - View analytics dashboard
   - Moderate content

2. **Club Admin (Club leaders)**
   - Manage club profile
   - Create and manage events
   - Approve/reject member requests
   - Post announcements

3. **Student/User**
   - Browse and join clubs
   - Register for events
   - View joined clubs dashboard

### Core Functionality
- Secure authentication with JWT
- Role-based access control
- Club management
- Event management with registration
- Notification system
- File upload for logos and posters
- Responsive design

## Project Structure

```
IDP-CMS/
├── backend/          # NestJS API
├── frontend/         # React application
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Backend Setup
1. Navigate to backend directory
2. Install dependencies: `npm install`
3. Create `.env` file with MongoDB connection string
4. Run: `npm run start:dev`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Run: `npm run dev`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## API Documentation

API endpoints will be documented after implementation.

## License

MIT License
=======
# Clubs_Management_System
>>>>>>> 81eb090a7bc02e7d1f7bf4776f0094473a3daa76
