import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
    { name: 'Clubs', href: '/clubs', icon: UserGroupIcon, current: location.pathname.startsWith('/clubs') },
    { name: 'Events', href: '/events', icon: CalendarIcon, current: location.pathname.startsWith('/events') },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon, current: location.pathname === '/profile' },
  ] : [
    { name: 'Clubs', href: '/clubs', icon: UserGroupIcon, current: location.pathname.startsWith('/clubs') },
  ];


  const clubAdminNavigation = [
    { name: 'Manage Members', href: '/manage-club/members', icon: UserGroupIcon, current: location.pathname === '/manage-club/members' },
    { name: 'Join Requests', href: '/manage-club/requests', icon: BellIcon, current: location.pathname === '/manage-club/requests' },
    { name: 'Create Event', href: '/events/create', icon: CalendarIcon, current: location.pathname === '/events/create' },
  ];

  const facultyNavigation = [
    { name: 'University Panel', href: '/admin/panel', icon: Cog6ToothIcon, current: location.pathname === '/admin/panel' },
    { name: 'Create Event', href: '/events/create', icon: CalendarIcon, current: location.pathname === '/events/create' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
                  Vignan Clubs
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {(user?.role === 'admin' || user?.role === 'faculty') && facultyNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {user?.role === 'club_admin' && clubAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                  </Link>
                  
                  {/* Profile dropdown */}
                  <div className="relative">
                    <Link to="/profile" className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                      <div className="hidden md:block">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user?.role?.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                        <UserCircleIcon className="h-6 w-6 text-white" />
                      </div>
                    </Link>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Sign In</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors">Join Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
