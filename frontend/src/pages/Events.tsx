import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import type { Event } from '../types';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const canCreateEvent = user?.role === 'admin' || user?.role === 'club_admin';

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', debouncedQuery, showUpcomingOnly],
    queryFn: async () => {
      if (debouncedQuery) {
        return eventsAPI.search(debouncedQuery);
      } else if (showUpcomingOnly) {
        return eventsAPI.getUpcoming();
      } else {
        return eventsAPI.getAll();
      }
    },
  });

  const handleRegisterEvent = async (eventId: string) => {
    try {
      await eventsAPI.register(eventId);
      alert('Successfully registered for the event!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register for the event.';
      alert(message);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      upcoming: 'bg-indigo-500 text-white',
      ongoing: 'bg-emerald-500 text-white',
      completed: 'bg-slate-400 text-white',
      cancelled: 'bg-rose-500 text-white',
    };
    return colors[status] || colors.upcoming;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Campus Timeline</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">University Events</h1>
          <p className="text-lg text-slate-500 font-medium">From workshops to cultural fests, never miss a beat at Vignan.</p>
        </div>
        
        {canCreateEvent && (
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <CalendarIcon className="w-5 h-5" />
            Create New Event
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by event title, description or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center justify-center p-4 bg-white/50 rounded-2xl border border-slate-100">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showUpcomingOnly}
                  onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${showUpcomingOnly ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${showUpcomingOnly ? 'translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-4 text-sm font-bold text-slate-600 uppercase tracking-wide">Upcoming Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.data?.map((event: Event) => (
          <div key={event.id} className="group flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            {/* Poster area */}
            <div className="relative h-56 overflow-hidden">
               <img 
                src={event.poster || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="event"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(event.status)} shadow-lg`}>
                  {event.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-xl">
                  <p className="text-[10px] font-black uppercase text-purple-600 leading-none mb-1">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{new Date(event.startDate).getDate()}</p>
                </div>
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xl">{event.type}</span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">{event.title}</h3>
              <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-2 leading-relaxed flex-1 italic">{event.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                    <MapPinIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold">{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                    <UserGroupIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold">{event.currentParticipants || 0} Registered</span>
                </div>
              </div>

              {user?.role === 'student' && (
                <button
                  onClick={() => handleRegisterEvent(event.id || (event as any)._id)}
                  disabled={
                    event.status === 'completed' || 
                    (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants) ||
                    event.registeredParticipants?.includes(user?.id)
                  }
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transform transition-all active:scale-95 disabled:cursor-not-allowed ${
                    event.registeredParticipants?.includes(user?.id)
                      ? 'bg-emerald-50 text-emerald-600 shadow-none'
                      : 'bg-slate-900 text-white hover:bg-purple-600'
                  } group-hover:shadow-purple-500/20`}
                >
                  {event.registeredParticipants?.includes(user?.id) ? (
                    <span className="flex items-center justify-center gap-2">
                       Successfully Registered
                    </span>
                  ) : event.status === 'completed' ? (
                    'Event Ended'
                  ) : event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants ? (
                    'Event Full'
                  ) : (
                    'Register Now'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {events?.data?.length === 0 && (
        <div className="text-center py-32 bg-white/40 rounded-[3rem] border border-dashed border-slate-300">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No events scheduled</h3>
          <p className="text-slate-500 font-medium">Try adjusting your filters or check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Events;
