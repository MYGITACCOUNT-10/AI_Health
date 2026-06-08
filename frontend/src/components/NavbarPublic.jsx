import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const NavbarPublic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                HealthAI
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 relative">
            {[
              { path: '/about', label: 'About Us' },
              { path: '/#services', label: 'Services' },
              { path: '/team', label: 'Our Doctors' },
              { path: '/blog', label: 'Research' },
              { path: '/contact', label: 'Contact' }
            ].map((link) => {
              const isActive = location.pathname === link.path || (link.path.includes('#') && location.hash === link.path.substring(1));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6 ml-2">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300"
              >
                Appointments
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">About Us</Link>
            <Link to="/team" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Our Doctors</Link>
            <Link to="/blog" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Research</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Contact</Link>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 px-3">
              <Link to="/login" className="block text-center px-4 py-2 text-base font-medium text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100">Log in</Link>
              <Link to="/register" className="block text-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Appointments</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarPublic;
