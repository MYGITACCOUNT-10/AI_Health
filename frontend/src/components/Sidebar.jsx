import { NavLink, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const statusItems = [
  { label: 'System Operational' },
  { label: 'Report Analysis Ready' },
  { label: 'Secure Connection' },
];

const Sidebar = ({ links }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      {/* Brand */}
      <Link to="/" className="h-16 flex items-center px-6 border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">
          Health<span className="text-blue-600">AI</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === '/doctor-dashboard' || link.href === '/patient-dashboard'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {link.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Platform Status
          </p>
          <div className="space-y-2.5">
            {statusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
