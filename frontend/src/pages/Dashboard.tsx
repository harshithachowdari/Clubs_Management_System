import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { 
  clubsAPI, 
  membershipsAPI, 
  applicationsAPI, 
  eventsAPI,
  usersAPI
} from '../services/api';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // 1. Fetch data based on role
  const { data: myMemberships } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: () => membershipsAPI.getMyMemberships(),
    enabled: user?.role === 'student'
  });

  const { data: myApplications } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationsAPI.getMyApplications(),
    enabled: user?.role === 'student'
  });

  const { data: managedClubs } = useQuery({
    queryKey: ['my-managed-clubs'],
    queryFn: () => clubsAPI.getMyClubs(),
    enabled: user?.role === 'club_admin'
  });

  const { data: allClubs } = useQuery({
    queryKey: ['all-clubs-stats'],
    queryFn: () => clubsAPI.getAll(),
    enabled: user?.role === 'admin' || user?.role === 'faculty'
  });

  const { data: studentsByYear } = useQuery({
    queryKey: ['students-by-year'],
    queryFn: () => usersAPI.getStudentsByYear(),
    enabled: user?.role === 'club_admin' || user?.role === 'admin'
  });

  const { data: adminStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminAPI.getStats(),
    enabled: user?.role === 'admin' || user?.role === 'faculty'
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events-dashboard'],
    queryFn: () => eventsAPI.getUpcoming(),
  });

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [showEnrollmentDetails, setShowEnrollmentDetails] = React.useState(false);

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
      case 'faculty':
        return {
          title: 'University Admin Dashboard',
          description: 'Manage clubs, users, and view analytics',
          stats: [
            { label: 'Total Clubs', value: adminStats?.data?.data?.totalClubs || 0, icon: UserGroupIcon, color: 'bg-indigo-600' },
            { label: 'Total Students', value: adminStats?.data?.data?.totalStudents || 0, icon: UserGroupIcon, color: 'bg-indigo-400' },
            { label: 'Club Admins', value: adminStats?.data?.data?.totalClubAdmins || 0, icon: BellIcon, color: 'bg-amber-500' },
            { 
              label: 'Club Enrollments', 
              value: adminStats?.data?.data?.totalMemberships || 0, 
              icon: ChartBarIcon, 
              color: 'bg-emerald-500',
              isClickable: true,
              onClick: () => setShowEnrollmentDetails(true)
            },
          ],
          actions: [
            { name: 'University Panel', href: '/admin/panel', color: 'bg-slate-900 border border-slate-700' },
            { name: 'Manage Clubs', href: '/clubs', color: 'bg-indigo-600 shadow-lg shadow-indigo-500/30' },
            { name: 'View Memberships', href: '#', color: 'bg-white border text-slate-900 shadow-sm', onClick: () => setShowEnrollmentDetails(true) },
          ]
        };
      
      case 'club_admin':
        return {
          title: 'Club Management Portal',
          description: 'Manage your club community and schedule activities',
          stats: [
            { label: 'Managed Clubs', value: managedClubs?.data?.length || 0, icon: UserGroupIcon, color: 'bg-indigo-600' },
            { label: 'Active Members', value: managedClubs?.data?.[0]?.memberCount || 0, icon: UserGroupIcon, color: 'bg-indigo-400' },
            { label: 'Club Events', value: '5', icon: CalendarIcon, color: 'bg-purple-500' },
            { label: 'Pending Requests', value: managedClubs?.data?.[0]?.pendingRequests?.length || 0, icon: BellIcon, color: 'bg-amber-500' },
          ],
          actions: [
            { name: 'Manage Members', href: '/manage-club/members', color: 'bg-slate-900' },
            { name: 'Join Requests', href: '/manage-club/requests', color: 'bg-indigo-600 shadow-lg' },
            { name: 'New Event', href: '/events', color: 'bg-white border text-slate-900 shadow-sm' },
          ]
        };
      
      case 'student':
        return {
          title: 'My Student Hub',
          description: `Track your ${user?.academicYear || ''} activities and club interactions`,
          stats: [
            { label: 'My Clubs', value: myMemberships?.data?.length || 0, icon: UserGroupIcon, color: 'bg-indigo-600' },
            { label: 'Upcoming Events', value: upcomingEvents?.data?.length || 0, icon: CalendarIcon, color: 'bg-purple-500' },
            { label: 'Join Requests', value: myApplications?.data?.filter((a: any) => a.status === 'pending').length || 0, icon: BellIcon, color: 'bg-amber-500' },
            { label: 'Year', value: user?.academicYear || 'N/A', icon: ChartBarIcon, color: 'bg-emerald-500' },
          ],
          actions: [
            { name: 'Explore Clubs', href: '/clubs', color: 'bg-slate-900 shadow-xl' },
            { name: 'Browse Events', href: '/events', color: 'bg-indigo-600 shadow-lg' },
            { name: 'My Profile', href: '/profile', color: 'bg-white border text-slate-900 shadow-sm' },
          ]
        };
      
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to Vignan Clubs Management System',
          stats: [],
          actions: []
        };
    }
  };

  const content = getRoleBasedContent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {getWelcomeMessage()}, {user?.firstName}!
        </h1>
        <p className="mt-2 text-lg text-slate-500 font-medium">{content.description}</p>
      </div>

      {/* Enrollment Details Modal */}
      {showEnrollmentDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-10 border border-white max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900">Global Enrollment Data</h3>
              <button onClick={() => setShowEnrollmentDetails(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <ArrowRightIcon className="w-8 h-8 rotate-180" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allClubs?.data?.map((club: any) => (
                <div key={club._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="font-black text-slate-800">{club.name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{club.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-indigo-600">{club.memberCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {content.stats.map((stat: any, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              onClick={stat.onClick}
              className={`bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ${stat.isClickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className={`flex-shrink-0 ${stat.color} rounded-2xl p-4 shadow-lg shadow-indigo-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <dt className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-sm mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
          Quick Actions
          <div className="h-px bg-slate-100 flex-1 ml-4" />
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {content.actions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`${action.color} text-white font-bold py-5 px-6 rounded-2xl text-center block transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg`}
            >
              {action.name}
            </a>
          ))}
        </div>
      </div>

      {/* Role-Specific Sections */}
      {user?.role === 'club_admin' && studentsByYear?.data && (
        <div className="mb-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            Student Breakdown by Year
            <div className="h-px bg-slate-100 flex-1 ml-4" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(studentsByYear.data).filter(([year]) => year !== 'Uncategorized').map(([year, students]: any) => (
              <div key={year} className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">{year}</h4>
                <div className="text-4xl font-black text-indigo-600 mb-2">{students.length}</div>
                <p className="text-xs font-medium text-slate-500">Active Members</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(user?.role === 'admin' || user?.role === 'faculty') && allClubs?.data && (
        <div className="mb-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            University Club Performance
            <div className="h-px bg-slate-100 flex-1 ml-4" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allClubs.data.slice(0, 3).map((club: any) => (
              <div key={club._id} className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                    {club.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 leading-tight">{club.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{club.category}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400">Events</span>
                    <span className="text-lg font-black text-slate-800">5</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '70%' }} />
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400">Engagement</span>
                    <span className="text-lg font-black text-slate-800">High</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Recent Spotlight
          </h3>
          <a href="/events" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents?.data?.slice(0, 4).map((event: any) => (
            <div key={event._id} className="flex gap-6 p-6 bg-white/40 rounded-3xl border border-white hover:bg-white transition-all">
              <div className="flex-shrink-0 w-16 h-20 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white">
                <span className="text-xs font-bold uppercase">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-black">{new Date(event.startDate).getDate()}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-black text-slate-800 mb-1">{event.title}</h4>
                <p className="text-slate-500 text-sm font-medium mb-3">{event.location}</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{event.type}</span>
                  <a href="/events" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
