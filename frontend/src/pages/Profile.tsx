import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { usersAPI, eventsAPI, authAPI } from '../services/api';
import type { User } from '../types';
import { 
  UserCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: authUser?.firstName,
    lastName: authUser?.lastName,
    department: authUser?.department,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Fetch fresh profile data
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile-data'],
    queryFn: () => authAPI.getProfile(),
  });

  const user = profileResponse?.data || authUser;

  // 2. Fetch registered events for the count
  const { data: registeredEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['registered-events-count'],
    queryFn: () => eventsAPI.getRegistered(),
    enabled: user?.role === 'student',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setMessage('');

    try {
      await usersAPI.updateProfile(user.id, formData);
      
      // Update local storage for immediate persistence
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload(); // Refresh to sync auth context
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName,
      lastName: user?.lastName,
      department: user?.department,
    });
    setIsEditing(false);
    setMessage('');
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-sm overflow-hidden mb-10">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
          <div className="px-10 pb-10">
            <div className="relative flex justify-between items-end -mt-16 mb-8">
              <div className="relative">
                <div className="h-32 w-32 bg-white rounded-3xl p-1.5 shadow-2xl">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-full w-full rounded-[1.25rem] object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-indigo-500 rounded-[1.25rem] flex items-center justify-center">
                      <UserCircleIcon className="h-20 w-20 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-500 font-medium mb-4">{user?.email}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {user?.role?.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {user?.department}
                </span>
              </div>
            </div>

            {message && (
              <div className={`mb-8 p-6 rounded-2xl font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                message.includes('successfully') 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-3 px-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-3 px-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-3 px-1">Roll Number / ID</label>
                  <input
                    type="text"
                    value={user?.rollNumber}
                    disabled
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-bold cursor-not-allowed opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-3 px-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50 appearance-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Business">Business</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Clubs Joined</h3>
            <p className="text-3xl font-black text-slate-900">{user?.joinedClubs?.length || 0}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Events Registered</h3>
            <p className="text-3xl font-black text-slate-900">
              {isEventsLoading ? '...' : (registeredEvents?.data?.length || 0)}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <AcademicCapIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Department</h3>
            <p className="text-xl font-black text-slate-900 truncate">{user?.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
