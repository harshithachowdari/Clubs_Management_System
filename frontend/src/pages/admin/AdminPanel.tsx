import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsAPI, adminAPI } from '../../services/api';
import { 
  ShieldCheckIcon, 
  UserGroupIcon,
  PlusCircleIcon,
  PauseCircleIcon,
  TrashIcon,
  UsersIcon,
  BuildingLibraryIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const AdminPanel: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Get all clubs
  const { data: clubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ['all-clubs-admin'],
    queryFn: () => clubsAPI.getAll(),
  });

  // 2. Get global stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats(),
  });

  // 3. Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => clubsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-clubs-admin'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      alert('Club status updated successfully.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clubsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-clubs-admin'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      alert('Club removed from system.');
    }
  });

  if (isLoadingClubs || isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const allClubs = clubs?.data || [];
  const dashboardStats = stats?.data || {};

  const statCards = [
    { label: 'Total Clubs', value: dashboardStats.totalClubs, icon: BuildingLibraryIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Students', value: dashboardStats.totalStudents, icon: UsersIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Club Admins', value: dashboardStats.totalClubAdmins, icon: UserCircleIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Club Enrollments', value: dashboardStats.totalMemberships, icon: UserGroupIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Faculty Administration</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">University Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex justify-between items-center px-4">
        <h2 className="text-2xl font-black text-slate-800">Clubs Inventory</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Club Name</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Members</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allClubs.map((club: any) => (
                <tr key={club._id || club.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-sm">
                        {club.name?.[0]}
                      </div>
                      <span className="font-bold text-slate-800">{club.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {club.category}
                    </span>
                  </td>
                  <td className="px-10 py-6 font-bold text-slate-500">
                    {club.memberCount}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${club.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={`text-xs font-black uppercase tracking-tighter ${club.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {club.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: club._id || club.id, data: { isActive: !club.isActive } })}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                        title={club.isActive ? "Deactivate" : "Activate"}
                      >
                        {club.isActive ? <PauseCircleIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(club._id || club.id)}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
