import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/token/', formData);
      const user = await login(response.data.access, response.data.refresh);
      toast.success(`Welcome back, ${user.username}!`);
      
      if (user.role === 'doctor') navigate('/doctor-dashboard');
      else navigate('/patient-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">HealthAI</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Please enter your details to sign in to your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                id="email"
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
                id="password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-40">
           <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-cyan-400 blur-3xl"></div>
        </div>

        <div className="relative z-10 p-12 max-w-lg">
           <div className="glass-panel p-8 rounded-3xl border border-white shadow-2xl backdrop-blur-xl bg-white/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-inner mb-6">
                 <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">
                 Secure, HIPAA-compliant healthcare infrastructure.
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                 Experience peace of mind knowing that your medical data is encrypted and protected by industry-leading security protocols.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-900 bg-white/80 rounded-xl p-4 shadow-sm">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <HeartPulse className="h-5 w-5" />
                 </div>
                 Trusted by 500+ Healthcare Providers
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;