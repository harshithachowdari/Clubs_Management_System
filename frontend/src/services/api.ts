import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterData, User, Club, Event, Notification } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  validate: () => 
    api.post('/auth/validate'),
  
  getProfile: () => 
    api.get<User>('/auth/profile'),
};

export const usersAPI = {
  getProfile: () => 
    api.get<User>('/users/profile'),
  
  updateProfile: (id: string, data: Partial<User>) => 
    api.patch<User>(`/users/${id}`, data),
  
  joinClub: (userId: string, clubId: string) => 
    api.post(`/users/${userId}/join-club/${clubId}`),
  
  leaveClub: (userId: string, clubId: string) => 
    api.post(`/users/${userId}/leave-club/${clubId}`),
  
  getStudentsByYear: () => 
    api.get('/users/students-by-year'),
  
  getStudentClubDetails: (userId: string, clubId: string) => 
    api.get(`/users/student-details/${userId}/club/${clubId}`),
};

export const clubsAPI = {
  getAll: () => 
    api.get<Club[]>('/clubs'),
  
  getById: (id: string) => 
    api.get<Club>(`/clubs/${id}`),
  
  getByCategory: (category: string) => 
    api.get<Club[]>(`/clubs/category/${category}`),
  
  search: (query: string) => 
    api.get<Club[]>(`/clubs/search?q=${query}`),
  
  getMyClubs: () => 
    api.get<Club[]>('/clubs/my-clubs'),
  
  create: (data: Partial<Club>) => 
    api.post<Club>('/clubs', data),
  
  update: (id: string, data: Partial<Club>) => 
    api.patch<Club>(`/clubs/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/clubs/${id}`),
  
  join: (id: string) => 
    api.post(`/clubs/${id}/join`),
  
  approveMember: (clubId: string, userId: string) => 
    api.post(`/clubs/${clubId}/approve/${userId}`),
  
  rejectMember: (clubId: string, userId: string) => 
    api.post(`/clubs/${clubId}/reject/${userId}`),
  
  removeMember: (clubId: string, userId: string) => 
    api.post(`/clubs/${clubId}/remove-member/${userId}`),
  
  getPendingRequests: (id: string) => 
    api.get<Club>(`/clubs/${id}/pending-requests`),
  
  getMembers: (id: string) => 
    api.get<User[]>(`/clubs/${id}/members`),
  
  getPerformance: (id: string) => 
    api.get(`/clubs/${id}/performance`),
  
  getEngagement: (id: string) => 
    api.get(`/clubs/${id}/engagement`),
};

export const eventsAPI = {
  getAll: () => 
    api.get<Event[]>('/events'),
  
  getUpcoming: () => 
    api.get<Event[]>('/events/upcoming'),
  
  getById: (id: string) => 
    api.get<Event>(`/events/${id}`),
  
  getByClub: (clubId: string) => 
    api.get<Event[]>(`/events/club/${clubId}`),
  
  search: (query: string) => 
    api.get<Event[]>(`/events/search?q=${query}`),
  
  getMyEvents: () => 
    api.get<Event[]>('/events/my-events'),
  
  getRegistered: () => 
    api.get<Event[]>('/events/registered'),
  
  getAttended: () => 
    api.get<Event[]>('/events/attended'),
  
  create: (data: Partial<Event>) => 
    api.post<Event>('/events', data),
  
  update: (id: string, data: Partial<Event>) => 
    api.patch<Event>(`/events/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/events/${id}`),
  
  register: (id: string) => 
    api.post(`/events/${id}/register`),
  
  unregister: (id: string) => 
    api.post(`/events/${id}/unregister`),
  
  markAttendance: (eventId: string, userId: string) => 
    api.post(`/events/${eventId}/attendance/${userId}`),
  
  updateStatus: (id: string, status: string) => 
    api.patch<Event>(`/events/${id}/status`, { status }),
};

export const notificationsAPI = {
  getMyNotifications: () => 
    api.get<Notification[]>('/notifications/my-notifications'),
  
  getUnread: () => 
    api.get<Notification[]>('/notifications/unread'),
  
  getUnreadCount: () => 
    api.get<number>('/notifications/unread-count'),
  
  markAsRead: (id: string) => 
    api.patch<Notification>(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.patch('/notifications/mark-all-read'),
  
  createAnnouncement: (data: {
    title: string;
    message: string;
    recipientIds: string[];
    relatedEntityId?: string;
    relatedEntityType?: string;
  }) => 
    api.post('/notifications/announcement', data),
};

export const applicationsAPI = {
  create: (data: { club: string; positionApplied: string; reason?: string }) =>
    api.post('/applications', data),
  
  getByClub: (clubId: string) =>
    api.get(`/applications/club/${clubId}`),
  
  getMyApplications: () =>
    api.get('/applications/my-applications'),
  
  updateStatus: (id: string, status: 'approved' | 'rejected') =>
    api.patch(`/applications/${id}/status`, { status }),
};

export const membershipsAPI = {
  findByClub: (clubId: string) =>
    api.get(`/memberships/club/${clubId}`),
  
  getMyMemberships: () =>
    api.get('/memberships/my-memberships'),
};

export const adminAPI = {
  getStats: () => 
    api.get('/admin/stats'),
};

export default api;
