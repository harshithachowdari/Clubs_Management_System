import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../../services/api';
import { ArrowLeftIcon, UserCircleIcon, TrophyIcon, CalendarDaysIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const StudentProfileDetail: React.FC = () => {
  const { userId, clubId } = useParams<{ userId: string; clubId: string }>();
  const navigate = useNavigate();

  const { data: studentDetails, isLoading } = useQuery({
    queryKey: ['student-details', userId, clubId],
    queryFn: () => usersAPI.getStudentClubDetails(userId!, clubId!),
    enabled: !!userId && !!clubId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const student = studentDetails?.data?.profile;
  const metrics = studentDetails?.data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Members
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-indigo-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
                {student?.profileImage ? (
                  <img src={student.profileImage} alt={student.firstName} className="w-full h-full object-cover rounded-[2rem]" />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-indigo-600" />
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {student?.firstName} {student?.lastName}
              </h2>
              <p className="text-slate-500 font-medium mb-4">{student?.rollNumber}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                {student?.academicYear || 'Uncategorized'}
              </div>

              <div className="w-full h-px bg-slate-100 my-8" />

              <div className="w-full space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Department</span>
                  <span className="text-sm font-black text-slate-700">{student?.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Role</span>
                  <span className="text-sm font-black text-slate-700 capitalize">{student?.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Status</span>
                  <span className="flex items-center gap-1.5 text-sm font-black text-emerald-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details and Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <TrophyIcon className="w-6 h-6 text-amber-500" />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Events Organized</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{metrics?.eventsOrganized || 0}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <ChartBarIcon className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Engagement</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{metrics?.overallEngagement || 'Low'}</div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
              Club Activities
              <div className="h-px bg-slate-100 flex-1 ml-4" />
            </h3>
            
            {metrics?.activities?.length > 0 ? (
              <div className="space-y-6">
                {/* Map activities here */}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDaysIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No recent activities found in this club</p>
              </div>
            )}
          </div>

          {/* Recent Participations */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
              Recent Participation
              <div className="h-px bg-slate-100 flex-1 ml-4" />
            </h3>
            <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50">
              <p className="text-indigo-900 font-bold text-center">
                User is an active participant in this club since {new Date(student?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDetail;
