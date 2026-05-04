# Vignan University Clubs Management System - Setup Guide

## Overview

This is a comprehensive full-stack web application for managing university clubs and events at Vignan University. The system supports three main roles: Admin, Club Admin, and Student.

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt
- **Validation**: class-validator
- **File Upload**: Multer

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Headless UI & Heroicons

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd IDP-CMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clubs_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

#### Start Backend
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

#### Start Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account

2. **Create a Cluster**
   - Create a new cluster (M0 free tier is sufficient for development)
   - Choose a cloud provider and region closest to you

3. **Create Database User**
   - Go to Database Access → Add New Database User
   - Create a username and strong password
   - Note these credentials for the MONGODB_URI

4. **Whitelist IP Address**
   - Go to Network Access → Add IP Address
   - Add your current IP address or use 0.0.0.0/0 (allows access from anywhere)

5. **Get Connection String**
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update the MONGODB_URI in your backend .env file

6. **Create Database**
   - Once connected, the database will be created automatically
   - The database name is `clubs_management`

## Default Users

After starting the application, you can create users through the registration page. Here are the recommended default users for testing:

### Admin User
- **Email**: admin@vignan.edu
- **Password**: admin123
- **Role**: Admin

### Club Admin User
- **Email**: clubadmin@vignan.edu
- **Password**: clubadmin123
- **Role**: Club Admin

### Student User
- **Email**: student@vignan.edu
- **Password**: student123
- **Role**: Student

## API Documentation

The API documentation is available at `http://localhost:3000/api` once the backend is running.

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

#### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create new club (Admin only)
- `POST /api/clubs/:id/join` - Join club (Student only)

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create new event (Club Admin only)
- `POST /api/events/:id/register` - Register for event (Student only)

#### Users
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/:id` - Update user profile
- `POST /api/users/:userId/join-club/:clubId` - Join club

#### Notifications
- `GET /api/notifications/my-notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## Features Implemented

### ✅ Completed Features
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin, Club Admin, Student)
   - Password hashing with bcrypt

2. **User Management**
   - User registration and login
   - Profile management
   - Role assignment

3. **Club Management**
   - Create and view clubs
   - Join clubs (students)
   - Approve/reject join requests (club admins)
   - Club categories and search

4. **Event Management**
   - Create and view events
   - Event registration
   - Event status management
   - Search and filter events

5. **Notification System**
   - Real-time notifications
   - Mark as read functionality
   - Different notification types

6. **Frontend Features**
   - Responsive design with Tailwind CSS
   - Role-based dashboards
   - Modern UI with Headless UI
   - Protected routes

### 🚧 Partially Implemented
1. **Club Admin Dashboard**
   - Basic structure implemented
   - Club management interface
   - Member management

2. **University Admin Dashboard**
   - Basic structure implemented
   - User management interface

### ⏳ Pending Features
1. **File Upload**
   - Club logos
   - Event posters
   - Profile pictures

2. **Advanced Analytics**
   - Club participation metrics
   - Event attendance analytics
   - User engagement statistics

3. **Real-time Features**
   - WebSocket notifications
   - Live event updates
   - Chat functionality

## Project Structure

```
IDP-CMS/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── clubs/         # Club management
│   │   ├── events/        # Event management
│   │   ├── notifications/  # Notification system
│   │   └── common/        # Shared utilities
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── .env              # Environment variables
│   └── package.json
└── README.md
```

## Development Notes

### Backend Development
- Use `npm run start:dev` for development with hot reload
- API documentation is available at `/api`
- All routes are prefixed with `/api`

### Frontend Development
- Use `npm run dev` for development with hot reload
- The app will automatically open in your browser
- Changes are reflected immediately

### Common Issues
1. **MongoDB Connection Issues**
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check that your connection string is correct
   - Verify database user credentials

2. **CORS Issues**
   - Backend is configured to allow frontend at `http://localhost:5173`
   - Update CORS settings if using different ports

3. **Authentication Issues**
   - Check JWT_SECRET is set in backend .env
   - Ensure tokens are stored in localStorage
   - Verify token expiration settings

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure production MongoDB connection
4. Set up proper CORS for production domain
5. Use HTTPS in production

### Frontend
1. Set `VITE_API_URL` to production API URL
2. Build with `npm run build`
3. Deploy static files to web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For any issues or questions:
1. Check the API documentation at `/api`
2. Review the console for error messages
3. Verify environment variables are set correctly
4. Ensure MongoDB Atlas is properly configured

## License

This project is licensed under the MIT License.
