import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, clubsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  MapPinIcon, 
  TagIcon, 
  InformationCircleIcon,
  TicketIcon,
  PhotoIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clubId: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'workshop',
    poster: '',
    maxParticipants: 0,
    requiresRegistration: true,
    registrationDeadline: '',
    requirements: '',
    contactInfo: '',
    tags: '',
  });

  // Fetch clubs based on role
  const { data: clubs } = useQuery({
    queryKey: ['available-clubs-for-event'],
    queryFn: () => user?.role === 'admin' ? clubsAPI.getAll() : clubsAPI.getMyClubs(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => eventsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      alert('Event created successfully!');
      navigate('/events');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to create event'}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const deadline = formData.registrationDeadline ? new Date(formData.registrationDeadline) : null;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Please provide valid start and end dates/times.');
      return;
    }

    if (deadline && isNaN(deadline.getTime())) {
      alert('Please provide a valid registration deadline date/time.');
      return;
    }

    if (end <= start) {
      alert('End date must be after the start date.');
      return;
    }

    // Process tags and numbers
    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      startDate: start,
      endDate: end,
      registrationDeadline: deadline || undefined,
      maxParticipants: parseInt(formData.maxParticipants as any) || 0,
    };

    createMutation.mutate(processedData);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </button>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <CalendarIcon className="w-8 h-8 opacity-80" />
            <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Event Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Host a New Event</h1>
          <p className="mt-2 text-indigo-100 font-medium italic opacity-90">Fill in the details to launch your campus activity.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Event Title</label>
                <div className="relative group">
                  <InformationCircleIcon className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="e.g. AI Ethics Workshop"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Club</label>
                <select
                  required
                  name="clubId"
                  value={formData.clubId}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                >
                  <option value="">Select an organization...</option>
                  {clubs?.data?.map((club: any) => (
                    <option key={club._id || club.id} value={club._id || club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="meeting">Meeting</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                    placeholder="0 for unlimited"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                <textarea
                  required
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 leading-relaxed"
                  placeholder="Describe your event, agenda, and target audience..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location</label>
                <div className="relative group">
                  <MapPinIcon className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"
                    placeholder="e.g. SAC Auditorium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Start Date</label>
                  <input
                    required
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">End Date</label>
                  <input
                    required
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"
                  />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reg. Deadline</label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags (comma separated)</label>
                  <div className="relative group">
                    <TagIcon className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold transition-all"
                      placeholder="coding, fun, ai"
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Media & Extras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Poster URL</label>
              <div className="relative group">
                <PhotoIcon className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                <input
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Info</label>
              <input
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                placeholder="e.g. Phone or Email"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-lg shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TicketIcon className="w-6 h-6" />
                  Create Event Activity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
