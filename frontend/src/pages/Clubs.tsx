import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsAPI, authAPI, membershipsAPI } from '../services/api';
import type { Club, User } from '../types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

const Clubs: React.FC = () => {
  const queryClient = useQueryClient();
  const { validateToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const categories = [
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs', debouncedQuery, selectedCategory],
    queryFn: async () => {
      if (debouncedQuery) {
        return clubsAPI.search(debouncedQuery);
      } else if (selectedCategory) {
        return clubsAPI.getByCategory(selectedCategory);
      } else {
        return clubsAPI.getAll();
      }
    },
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

  const joinMutation = useMutation({
    mutationFn: (clubId: string) => clubsAPI.join(clubId),
    onSuccess: async () => {
      // 1. Refetch global auth state to update Navbar/Profile counts
      await validateToken();
      
      // 2. Invalidate React Query caches
      queryClient.invalidateQueries({ queryKey: ['profile-data'] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['my-memberships'] });
      
      alert('Successfully joined the club!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to join the club. Please try again.';
      alert(message);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const user = userProfile?.data as User;
  const isStudent = user?.role === 'student';
  const joinedClubIds = userMemberships?.data?.map((m: any) => m.club?._id || m.club?.id || m.club) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          {user?.role === 'club_admin' ? 'My Managed Clubs' : 'Explore Clubs'}
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative group">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search club name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
          <div className="w-px bg-slate-100 hidden md:block my-2" />
          <div className="relative md:w-64">
            <FunnelIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-14 pr-10 py-4 bg-transparent border-none focus:ring-0 text-slate-600 font-bold appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubs?.data?.filter((club: Club) => {
          if (user?.role === 'club_admin') {
            const clubId = (club as any)._id || club.id;
            return user.managedClubs?.includes(String(clubId));
          }
          return true;
        }).map((club: Club) => {
          // Prefer _id (what MongoDB returns) then fallback to id
          const rawClubId = (club as any)._id || club.id;
          const rawUserId = (user as any)?._id || user?.id;
          const clubId = rawClubId ? String(rawClubId) : '';
          const userId = rawUserId ? String(rawUserId) : '';

          // Skip this club card entirely if we couldn't resolve its ID
          if (!clubId || clubId === 'undefined') return null;
          
          const isJoined = 
            joinedClubIds.some(id => String(id) === clubId) || 
            (user?.joinedClubs?.some((id: string) => String(id) === clubId)) || 
            (club?.members?.some((id: string) => String(id) === userId));
          
          return (
            <div
              key={clubId}
              className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col transition-all duration-300 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {club.name[0]}
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {club.category}
                </span>
              </div>
              
              <Link to={`/clubs/${clubId}`} className="block mb-4">
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {club.name}
                </h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-2">
                  {club.description}
                </p>
              </Link>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-slate-900 font-black text-lg">{club.memberCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</span>
                </div>
                
                {isStudent && (
                  <button
                    onClick={() => !isJoined && joinMutation.mutate(clubId)}
                    disabled={isJoined || joinMutation.isPending}
                    className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
                      isJoined 
                        ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 active:scale-95'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Joined
                      </>
                    ) : (
                      joinMutation.isPending ? 'Joining...' : 'Join Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {clubs?.data?.length === 0 && (
        <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-400">No clubs found matching your search.</h3>
        </div>
      )}
    </div>
  );
};

export default Clubs;
