import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clubsAPI, eventsAPI } from '../services/api';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const { data: clubs } = useQuery({
    queryKey: ['featured-clubs'],
    queryFn: () => clubsAPI.getAll(),
  });

  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventsAPI.getUpcoming(),
  });

  const featuredClubs = clubs?.data?.slice(0, 3) || [];
  const upcomingEvents = events?.data?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
            Vignan Clubs
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 font-bold hover:text-indigo-600 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white rounded-full shadow-sm mb-8 animate-fade-in-up">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Digital Club Management</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 animate-fade-in-up animation-delay-200">
          Discover. Join.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Lead the Future.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-12 font-medium leading-relaxed animate-fade-in-up animation-delay-400">
          The ultimate platform for Vignan University students to explore clubs, 
          manage activities, and grow as leaders in an innovative digital ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-20 animate-fade-in-up animation-delay-600">
          <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-2 active:scale-95">
            Join a Club Now
          </Link>
          <Link to="/clubs" className="bg-white px-10 py-5 rounded-[2rem] font-bold text-lg text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-sm transform hover:-translate-y-1">
            Explore Clubs
          </Link>
        </div>
      </main>

      {/* Featured Clubs Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 bg-white/30 backdrop-blur-sm rounded-[3rem] border border-white/50 mb-20">
        <div className="flex items-end justify-between mb-12 px-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Featured Organizations</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Campus Clubs</h2>
          </div>
          <Link to="/clubs" className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
            View All Clubs <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredClubs.length > 0 ? featuredClubs.map((club: any) => (
            <div key={club._id || club.id} className="group bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform">
                {club.logo ? (
                  <img src={club.logo} alt="logo" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{club.name}</h3>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 h-10">{club.description}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">{club.category}</span>
                <span className="text-xs font-bold text-slate-400">{club.memberCount} Members</span>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-12 text-center text-slate-400 font-medium">Loading amazing clubs...</div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 mb-32">
        <div className="flex items-end justify-between mb-12 px-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Mark Your Calendars</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h2>
          </div>
          <Link to="/events" className="flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all">
            Browse Events <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? upcomingEvents.map((event: any) => (
            <div key={event._id || event.id} className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden group h-80 shadow-2xl">
              <img 
                src={event.poster || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                alt="event"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-purple-600 text-[10px] font-black uppercase text-white rounded-md tracking-wider">{event.type}</span>
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{new Date(event.date || event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 leading-tight">{event.title}</h3>
                <p className="text-white/60 text-sm font-medium line-clamp-1">{event.location}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-12 text-center text-slate-400 font-medium">No events scheduled yet.</div>
          )}
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
    </div>
  );
};

export default LandingPage;
