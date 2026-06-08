import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User as UserIcon, Settings, ChevronDown, Search, HeartPulse, ShieldAlert, FileText, Pill, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Very basic local routing based on query text
      const q = searchQuery.toLowerCase();
      if (q.includes('report')) navigate('/reports');
      else if (q.includes('appoint')) navigate('/appointments');
      else if (q.includes('presc')) navigate('/prescriptions');
      else if (q.includes('ai') || q.includes('insight')) navigate('/ai-insights');
      else navigate('/patient-dashboard'); // fallback
      setSearchQuery('');
    }
  };

  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  const displayName = user?.username || 'User';
  const displayRole = user?.role || 'User';

  const mockNotifications = [
    { id: 1, title: 'AI Insight Ready', desc: 'Your recent medical report analysis is complete.', time: '10 min ago', icon: HeartPulse, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { id: 2, title: 'Appointment Reminder', desc: 'Consultation with Dr. Smith tomorrow at 10 AM.', time: '2 hrs ago', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 3, title: 'New Prescription', desc: 'You have a new prescription available for download.', time: '1 day ago', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative ml-4 max-w-md w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, reports, insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer flex gap-3 transition-colors">
                    <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full ${notif.bg} ${notif.color} flex items-center justify-center`}>
                      <notif.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-700 leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 capitalize">{displayRole}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-500/20">
              {avatarLetter}
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500 capitalize">{displayRole}</p>
              </div>

              <div className="px-4 py-3 border-b border-slate-100 hidden md:block">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.email || ''}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  Profile
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>
              </div>

              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
