import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Profile from './pages/Profile';
import ClubDetail from './pages/ClubDetail';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import JoinRequests from './pages/club-admin/JoinRequests';
import ManageMembers from './pages/club-admin/ManageMembers';
import StudentProfileDetail from './pages/club-admin/StudentProfileDetail';
import AdminPanel from './pages/admin/AdminPanel';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

import CreateEvent from './pages/CreateEvent';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/clubs" element={
        <Layout>
          <Clubs />
        </Layout>
      } />
      <Route path="/events" element={
        <Layout>
          <Events />
        </Layout>
      } />
      <Route path="/events/create" element={
        <ProtectedRoute>
          <Layout>
            <CreateEvent />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/clubs/:id" element={
        <Layout>
          <ClubDetail />
        </Layout>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Management Routes */}
      <Route path="/manage-club/requests" element={
        <ProtectedRoute>
          <Layout>
            <JoinRequests />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/manage-club/members" element={
        <ProtectedRoute>
          <Layout>
            <ManageMembers />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/manage-club/student-profile/:userId/club/:clubId" element={
        <ProtectedRoute>
          <Layout>
            <StudentProfileDetail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/panel" element={
        <ProtectedRoute>
          <Layout>
            <AdminPanel />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
