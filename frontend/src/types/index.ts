export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'club_admin' | 'student' | 'faculty';
  rollNumber: string;
  department: string;
  academicYear?: string;
  profileImage?: string;
  joinedClubs?: string[];
  managedClubs?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'social' | 'other';
  adminId: string;
  logo?: string;
  coverImage?: string;
  members: string[];
  pendingRequests: string[];
  isActive: boolean;
  memberCount: number;
  tags: string[];
  meetingSchedule?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubId: string;
  organizerId: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'workshop' | 'seminar' | 'competition' | 'meeting' | 'social' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  poster?: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredParticipants: string[];
  attendedParticipants: string[];
  requiresRegistration: boolean;
  registrationDeadline?: string;
  requirements?: string;
  contactInfo?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  type: 'event_registration' | 'event_approval' | 'club_join_request' | 'club_join_approval' | 'announcement' | 'reminder';
  relatedEntityId?: string;
  relatedEntityType?: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department: string;
  role: 'admin' | 'club_admin' | 'student' | 'faculty';
  academicYear?: string;
  administeringClubId?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
