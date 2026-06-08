import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, Eye, EyeOff, User, ArrowRight, BrainCircuit, UserCheck } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient', // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Auto-generate username from email
      const generatedUsername = formData.email.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
      
      await api.post('/accounts/register/', {
        email: formData.email,
        username: generatedUsername,
        password: formData.password,
        role: formData.role,
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      if (error.response?.data) {
        // Display the first error message from the object
        const firstErrorKey = Object.keys(error.response.data)[0];
        const firstErrorMessage = error.response.data[firstErrorKey];
        toast.error(`${firstErrorKey}: ${firstErrorMessage}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40">
           <div className="absolute top-24 -left-24 w-96 h-96 rounded-full bg-cyan-400 blur-3xl"></div>
           <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
        </div>

        <div className="relative z-10 p-12 max-w-lg">
           <div className="glass-panel p-8 rounded-3xl border border-white shadow-2xl backdrop-blur-xl bg-white/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-inner mb-6">
                 <BrainCircuit className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">
                 Join the next generation of healthcare.
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                 Registering gives you instant access to intelligent diagnostics, seamless prescription management, and robust clinical reports.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-900 bg-white/80 rounded-xl p-4 shadow-sm">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <UserCheck className="h-5 w-5" />
                 </div>
                 Join 10k+ Registered Patients
              </div>
           </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">HealthAI</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 mb-8">Fill in the details below to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="relative group">
                <input
                  type="text"
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'patient'})}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center ${formData.role === 'patient' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  I'm a Patient
               </button>
               <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'doctor'})}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center ${formData.role === 'doctor' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  I'm a Doctor
               </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
