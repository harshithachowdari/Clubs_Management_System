import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsAPI } from '../../services/api';
import { 
  UserMinusIcon, 
  UserGroupIcon,
  EnvelopeIcon,
  IdentificationIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ManageMembers: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Get the clubs managed by this admin
  const { data: managedClubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ['my-managed-clubs'],
    queryFn: () => clubsAPI.getMyClubs(),
  });

  const activeClub = managedClubs?.data?.[0];

  // 2. Get members for the active club using the new dedicated endpoint
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['club-members', activeClub?._id],
    queryFn: () => clubsAPI.getMembers(activeClub!._id),
    enabled: !!activeClub?._id,
  });

  // 3. Mutation for Remove Member
  const removeMutation = useMutation({
    mutationFn: (userId: string) => clubsAPI.removeMember(activeClub?.id || '', userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-members', activeClub?.id] });
      alert('Member removed from the club.');
    }
  });

  if (isLoadingClubs || isLoadingMembers) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!activeClub) {
    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
          <AcademicCapIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-800 mb-2">No Managed Clubs</h3>
          <p className="text-slate-500 font-medium">You haven't been assigned as an admin to any clubs yet.</p>
        </div>
      </div>
    );
  }

  const activeMembers = members?.data || [];

  // Group members by year
  const groupedMembers = activeMembers.reduce((acc: any, member: any) => {
    const year = member.academicYear || 'Uncategorized';
    if (!acc[year]) acc[year] = [];
    acc[year].push(member);
    return acc;
  }, {});

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Uncategorized'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Manage Members</h1>
          <p className="text-slate-500 font-medium tracking-wide">
            Managing <span className="text-indigo-600 font-black">{activeClub.name}</span>
          </p>
        </div>
        <div className="bg-white border border-slate-200 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{activeMembers.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Members</p>
          </div>
        </div>
      </div>

      {/* Year Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {years.map(year => (
          <div key={year} className="bg-white/60 backdrop-blur-xl border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{year}</h4>
            <p className="text-2xl font-black text-indigo-600">{groupedMembers[year]?.length || 0}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {years.map(year => (
          groupedMembers[year]?.length > 0 && (
            <div key={year} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                {year} Students
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">
                  {groupedMembers[year].length}
                </span>
                <div className="h-px bg-slate-100 flex-1 ml-4" />
              </h3>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Branch/Dept</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {groupedMembers[year].map((member: any) => (
                        <tr key={member._id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                                {member.firstName?.[0]}{member.lastName?.[0]}
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{member.firstName} {member.lastName}</p>
                                <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="font-bold text-slate-700">{member.rollNumber}</span>
                          </td>
                          <td className="px-10 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              {member.department}
                            </span>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => window.location.href = `/manage-club/student-profile/${member._id}/club/${activeClub._id}`}
                                className="p-3 bg-white text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm border border-slate-100"
                                title="View Profile"
                              >
                                <IdentificationIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => removeMutation.mutate(member._id)}
                                disabled={removeMutation.isPending}
                                className="p-3 bg-white text-slate-300 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm border border-slate-100"
                                title="Remove Member"
                              >
                                <UserMinusIcon className="w-5 h-5" />
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
          )
        ))}

        {activeMembers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg italic">No members found in this club.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;
