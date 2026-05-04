import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    rollNumber: '',
    department: '',
    role: 'student',
    academicYear: '',
    administeringClubId: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/clubs`);
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error('Failed to fetch clubs', err);
      }
    };
    fetchClubs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'student' && !formData.academicYear) {
      setError('Please select your academic year');
      return;
    }

    if (formData.role === 'club_admin' && !formData.administeringClubId) {
      setError('Please select the club you administer');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-xl border border-white/80 relative z-10 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <svg className="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Join Vignan Clubs
          </h2>
          <p className="text-slate-500 font-medium text-lg">Create your account and start exploring</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 ml-1">First Name</label>
                <input
                  id="firstName" name="firstName" type="text" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="John" value={formData.firstName} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 ml-1">Last Name</label>
                <input
                  id="lastName" name="lastName" type="text" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="Doe" value={formData.lastName} onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">Email address</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                placeholder="john@example.com" value={formData.email} onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label htmlFor="rollNumber" className="block text-sm font-bold text-slate-700 ml-1">Roll Number</label>
                <input
                  id="rollNumber" name="rollNumber" type="text" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="20XX..." value={formData.rollNumber} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-bold text-slate-700 ml-1">Department</label>
                <select
                  id="department" name="department" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                  value={formData.department} onChange={handleChange}
                >
                  <option value="" disabled>Select...</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Business">Business</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-bold text-slate-700 ml-1">Role</label>
                <select
                  id="role" name="role" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                  value={formData.role} onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="club_admin">Club Admin</option>
                  <option value="admin">Univ Admin</option>
                </select>
              </div>
            </div>

            {formData.role === 'student' && (
              <div className="space-y-2 animate-in slide-in-from-left duration-300">
                <label htmlFor="academicYear" className="block text-sm font-bold text-slate-700 ml-1">Academic Year</label>
                <select
                  id="academicYear" name="academicYear" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                  value={formData.academicYear} onChange={handleChange}
                >
                  <option value="" disabled>Select Year...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            )}

            {formData.role === 'club_admin' && (
              <div className="space-y-2 animate-in slide-in-from-left duration-300">
                <label htmlFor="administeringClubId" className="block text-sm font-bold text-slate-700 ml-1">Administering Club</label>
                <select
                  id="administeringClubId" name="administeringClubId" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                  value={formData.administeringClubId} onChange={handleChange}
                >
                  <option value="" disabled>Select Club...</option>
                  {clubs.map(club => (
                    <option key={club._id} value={club._id}>{club.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">Password</label>
                <input
                  id="password" name="password" type="password" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="••••••••" value={formData.password} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 ml-1">Confirm</label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password" required
                  className="w-full px-5 py-3.5 bg-white/70 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundSize: '200% auto', transition: '0.5s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundPosition = 'right center'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = 'left center'; }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-500 hover:underline underline-offset-4 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
