import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsAPI, eventsAPI, authAPI, membershipsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'members' | 'events' | 'achievements'>('about');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [roleApplied, setRoleApplied] = useState('member');
  const [applyReason, setApplyReason] = useState('');

  const { user: authUser, validateToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: club, isLoading: isClubLoading, refetch: refetchClub } = useQuery({
    queryKey: ['club', id],
    queryFn: () => clubsAPI.getById(id!),
    enabled: !!id,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['profile-data'],
    queryFn: () => authAPI.getProfile(),
  });

  const { data: userMemberships } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: () => membershipsAPI.getMyMemberships(),
    enabled: !!userProfile,
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['club-events', id],
    queryFn: () => eventsAPI.getByClub(id!),
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: (clubId: string) => clubsAPI.join(clubId),
    onSuccess: async () => {
      await validateToken();
      queryClient.invalidateQueries({ queryKey: ['profile-data'] });
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      queryClient.invalidateQueries({ queryKey: ['my-memberships'] });
      alert('Successfully joined the club!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to join the club. Please try again.';
      alert(message);
    }
  });
  const applyMutation = useMutation({
    mutationFn: (data: { clubId: string; role: string; reason: string }) => 
      applicationsAPI.create(data.clubId, { role: data.role, reason: data.reason }),
    onSuccess: () => {
      setShowApplyModal(false);
      setApplyReason('');
      alert('Application submitted successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to submit application');
    }
  });

  const handleApply = () => {
    if (!applyReason.trim()) return alert('Please provide a reason');
    applyMutation.mutate({ clubId: id!, role: roleApplied, reason: applyReason });
  };

  const user = userProfile?.data || authUser;
  const isStudent = user?.role === 'student';
  const joinedClubIds = userMemberships?.data?.map((m: any) => String(m.club?._id || m.club?.id || m.club).toLowerCase()) || [];
  
  const clubId = id?.toLowerCase();
  const isJoined = 
    joinedClubIds.includes(clubId || '') || 
    (user?.joinedClubs?.some((cid: string) => String(cid).toLowerCase() === clubId)) || 
    (club?.data?.members?.some((uid: string) => String(uid).toLowerCase() === String(user?.id || user?._id).toLowerCase()));

  if (isClubLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!club) return <div>Club not found</div>;

  const isClubAdmin = authUser?.role === 'club_admin' && authUser.managedClubs?.includes(id!);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'members', label: 'Members' },
    { id: 'events', label: 'Events' },
    { id: 'achievements', label: 'Achievements' },
    ...(isClubAdmin ? [{ id: 'analytics' as const, label: 'Analytics' }] : []),
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border border-white animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Apply for a Role</h3>
            <p className="text-slate-500 font-medium mb-8 text-sm">Join the {club.data.name} community and contribute to its growth.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 font-black uppercase text-[10px] tracking-widest mb-3 px-1">Select Position</label>
                <div className="grid grid-cols-2 gap-3">
                  {['member', 'secretary', 'treasurer', 'organizer'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleApplied(role)}
                      className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all ${
                        roleApplied === role 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                          : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-black uppercase text-[10px] tracking-widest mb-3 px-1">Why do you want to join?</label>
                <textarea
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  placeholder="Tell us about your interest..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm min-h-[120px]"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Club Header Header */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 group">
        <img 
          src={club.data.coverImage || 'https://images.unsplash.com/photo-1523240715630-99d0e169729d?auto=format&fit=crop&q=80'} 
          alt={club.data.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1.5 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={club.data.logo || 'https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&q=80'} 
                  alt="logo" 
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <div className="text-white">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">
                  {club.data.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{club.data.name}</h1>
                <p className="text-slate-300 font-medium mt-1">Est. {club.data.createdAt ? new Date(club.data.createdAt).getFullYear() : '2024'}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              {isStudent && (
                <button 
                  onClick={() => !isJoined && joinMutation.mutate(id!)}
                  disabled={isJoined || joinMutation.isPending}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 ${
                    isJoined 
                      ? 'bg-emerald-50 text-emerald-600 cursor-default ring-1 ring-emerald-200' 
                      : 'bg-white text-slate-900 hover:bg-slate-50 transform hover:-translate-y-1 active:scale-95'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Joined
                    </>
                  ) : (
                    joinMutation.isPending ? 'Joining...' : 'Join Club'
                  )}
                </button>
              )}
              <button 
                onClick={() => setShowApplyModal(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Apply for Role
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200 w-fit mb-12 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {activeTab === 'about' && (
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight uppercase text-xs tracking-[0.2em] text-indigo-600">About the Club</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8">
                {club.data.description}
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">President</h4>
                  <p className="text-slate-800 font-bold text-lg">Coming Soon</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Faculty Admin</h4>
                  <p className="text-slate-800 font-bold text-lg">Coming Soon</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight uppercase text-xs tracking-[0.2em] text-indigo-600">Active Members</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {club.data.members?.map((memberId: string) => (
                  <div key={memberId} className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-white hover:border-indigo-100 hover:bg-white transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-600">
                      {memberId.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Member ID: {memberId.substring(0, 8)}</p>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">Active Member</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight uppercase text-xs tracking-[0.2em] text-indigo-600">Upcoming Activities</h2>
              {isEventsLoading ? (
                <div>Loading events...</div>
              ) : (
                <div className="space-y-6">
                  {events?.data?.length === 0 ? (
                    <p className="text-slate-500 italic font-medium">No upcoming events scheduled.</p>
                  ) : (
                    events?.data?.map((event: any) => (
                      <div key={event._id} className="flex gap-6 p-6 bg-white/40 rounded-3xl border border-white hover:shadow-lg transition-all">
                        <div className="flex-shrink-0 w-16 h-20 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black">{new Date(event.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-800 mb-1">{event.title}</h4>
                          <p className="text-slate-500 text-sm font-medium mb-3">{event.location}</p>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{event.type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight uppercase text-xs tracking-[0.2em] text-indigo-600">Hall of Fame</h2>
              <div className="space-y-8">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white flex gap-6 items-start">
                  <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">National Techfest Winners</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Coming soon - We are migrating our legacy achievement data to the new digital platform.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && isClubAdmin && (
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight uppercase text-xs tracking-[0.2em] text-indigo-600">Club Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Year-wise Members */}
                <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Active Members (Year-wise)</h3>
                  <div className="space-y-4">
                    {[
                      { year: '1st Year', count: 45, color: 'bg-indigo-500' },
                      { year: '2nd Year', count: 32, color: 'bg-purple-500' },
                      { year: '3rd Year', count: 28, color: 'bg-pink-500' },
                      { year: '4th Year', count: 15, color: 'bg-amber-500' },
                    ].map((item) => (
                      <div key={item.year}>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>{item.year}</span>
                          <span>{item.count} Members</span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                          <div 
                            className={`h-full ${item.color} transition-all duration-1000`} 
                            style={{ width: `${(item.count / 50) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-8 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                    <h3 className="text-xs font-black opacity-80 uppercase tracking-widest mb-2">Upcoming Events</h3>
                    <div className="text-4xl font-black mb-1">04</div>
                    <p className="text-indigo-100 text-[10px] font-bold">Scheduled for this month</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Organised</h3>
                    <div className="text-4xl font-black text-slate-800 mb-1">24</div>
                    <p className="text-slate-400 text-[10px] font-bold">Since club establishment</p>
                  </div>
                </div>
              </div>

              {/* Registration Metrics */}
              <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
                  <div className="text-center md:text-left">
                    <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-2">Event Participation</h3>
                    <p className="text-emerald-600 font-medium text-sm">Members registered for upcoming events</p>
                  </div>
                  <div className="flex gap-10">
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-800">156</div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Total Regs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-800">82%</div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Avg Turnout</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Members</span>
                <span className="text-slate-900 font-black">{club.data.memberCount}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Active</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="text-slate-900 font-bold capitalize">{club.data.category}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/20 text-white">
            <h3 className="text-lg font-black mb-4">Questions?</h3>
            <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">Contact the club president or visit the student services office for more information.</p>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-sm hover:bg-slate-50 transition-colors shadow-lg">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
