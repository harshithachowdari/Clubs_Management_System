import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsAPI } from '../../services/api';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';

const JoinRequests: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Get the clubs managed by this admin
  const { data: managedClubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ['my-managed-clubs'],
    queryFn: () => clubsAPI.getMyClubs(),
  });

  const activeClub = managedClubs?.data?.[0];

  // 2. Get pending requests for the active club
  const { data: clubWithRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['pending-requests', activeClub?.id],
    queryFn: () => clubsAPI.getPendingRequests(activeClub!.id),
    enabled: !!activeClub?.id,
  });

  // 3. Mutations for Approve/Reject
  const approveMutation = useMutation({
    mutationFn: (userId: string) => clubsAPI.approveMember(activeClub!.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', activeClub!.id] });
      alert('Member approved!');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (userId: string) => clubsAPI.rejectMember(activeClub!.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', activeClub!.id] });
      alert('Member request rejected.');
    }
  });

  if (isLoadingClubs || isLoadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!activeClub) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-400">You don't manage any clubs yet.</h3>
      </div>
    );
  }

  const pendingRequests = clubWithRequests?.data?.pendingRequests || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Join Requests</h1>
        <p className="text-slate-500 font-medium">Review pending applications for <span className="text-indigo-600 font-bold">{activeClub.name}</span></p>
      </div>

      <div className="grid gap-6">
        {pendingRequests.length === 0 ? (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <ClockIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No pending join requests at the moment.</h3>
          </div>
        ) : (
          pendingRequests.map((user: any) => (
            <div key={user._id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all transition-duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-200">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{user.firstName} {user.lastName}</h3>
                  <p className="text-slate-500 font-medium">{user.email}</p>
                  <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-1">{user.rollNumber || 'Student'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => rejectMutation.mutate(user._id)}
                  disabled={rejectMutation.isPending || approveMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors"
                >
                  <XCircleIcon className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => approveMutation.mutate(user._id)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-95"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JoinRequests;
