import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon, FileText, Pill, Activity,
  ArrowRight, Clock, BrainCircuit, Sparkles, CheckCircle2,
  Zap, Eye, Stethoscope, HeartPulse
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import HealthChatbot from '../components/HealthChatbot';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <motion.div variants={itemVariants} className="glass-panel p-6 card-hover group cursor-pointer">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-slate-700 transition-colors">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} shadow-inner group-hover:scale-110 transition-transform`}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  </motion.div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(dateStr);
};

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return 'bg-blue-50 text-blue-700 ring-blue-600/20 shadow-sm';
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 shadow-sm';
    case 'cancelled':
      return 'bg-red-50 text-red-700 ring-red-600/20 shadow-sm';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-600/20 shadow-sm';
  }
};

const TimelineItem = ({ appointment, isLast }) => (
  <div className="relative flex gap-5 pb-8 group">
    {!isLast && (
      <div className="absolute left-[1.35rem] top-12 -bottom-2 w-0.5 bg-slate-200 group-hover:bg-blue-200 transition-colors" />
    )}
    <div className="flex-shrink-0 mt-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 border-[3px] border-white shadow-sm text-blue-600 z-10 relative group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Stethoscope className="h-4 w-4" />
      </div>
    </div>
    <div className="flex-1 glass-panel p-5 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm hover:shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-bold text-blue-600">
          {formatRelativeDate(appointment.appointment_date)}
        </span>
        <span className="text-sm text-slate-400">— {formatDate(appointment.appointment_date)}</span>
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1">
        {appointment.reason || 'General Consultation'}
      </h4>
      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        Dr. {appointment.doctor_name || `Doctor #${appointment.doctor}`}
      </p>
      <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${statusColor(appointment.status)}`}
        >
          {appointment.status}
        </span>
      </div>
    </div>
  </div>
);

// Health Score Gauge Component
const HealthScoreGauge = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];
  const COLORS = ['#10B981', '#E2E8F0'];
  if (score < 70) COLORS[0] = '#F59E0B';
  if (score < 40) COLORS[0] = '#EF4444';

  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 w-full text-center pb-2">
        <div className="text-4xl font-bold text-slate-900">{score}<span className="text-lg text-slate-400">/100</span></div>
        <div className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Overall Health</div>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthScore, setHealthScore] = useState(82);

  // Mock Health Activity Data for the Recharts AreaChart
  const healthData = [
    { name: 'Jan', activity: 40 },
    { name: 'Feb', activity: 30 },
    { name: 'Mar', activity: 60 },
    { name: 'Apr', activity: 45 },
    { name: 'May', activity: 70 },
    { name: 'Jun', activity: 85 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, appointmentsRes] = await Promise.all([
          api.get('/dashboard/patient/'),
          api.get('/appointments/appointments/'),
        ]);

        setStats(statsRes.data);

        const appts = Array.isArray(appointmentsRes.data)
          ? appointmentsRes.data
          : appointmentsRes.data?.results || [];
        setAppointments(appts.slice(0, 5));
        
        // Derive health score slightly based on completed appointments
        const completed = statsRes.data.completed_appointments || 0;
        let score = 75 + (completed * 2);
        if (score > 98) score = 98;
        setHealthScore(score);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load dashboard data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <SkeletonDashboard />;

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.first_name || user?.username || 'Patient'} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Track your appointments, medical records, and AI health insights.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <HeartPulse className="h-5 w-5 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-700">Health Status: Good</span>
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div variants={itemVariants}>
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </motion.div>
      )}

      {/* Stat Cards */}
      {stats && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          <div onClick={() => navigate('/appointments')}>
            <StatCard
              title="Upcoming Appointments"
              value={stats.upcoming_appointments ?? 0}
              icon={CalendarIcon}
              colorClass="bg-blue-100 text-blue-600"
            />
          </div>
          <div onClick={() => navigate('/appointments')}>
            <StatCard
              title="Completed Appointments"
              value={stats.completed_appointments ?? 0}
              icon={CheckCircle2}
              colorClass="bg-emerald-100 text-emerald-600"
            />
          </div>
          <div onClick={() => navigate('/reports')}>
            <StatCard
              title="Total Reports"
              value={stats.total_reports ?? 0}
              icon={FileText}
              colorClass="bg-amber-100 text-amber-600"
            />
          </div>
          <div onClick={() => navigate('/prescriptions')}>
            <StatCard
              title="Total Prescriptions"
              value={stats.total_prescriptions ?? 0}
              icon={Pill}
              colorClass="bg-cyan-100 text-cyan-600"
            />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Health Insights Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 shadow-xl shadow-blue-500/20 flex flex-col justify-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/3 -translate-x-1/4" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
                    <BrainCircuit className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">AI Health Insights</h3>
                    <p className="text-sm font-medium text-blue-100 flex items-center gap-1 mt-0.5">
                      <Sparkles className="h-4 w-4" /> Powered by Google Gemini
                    </p>
                  </div>
                </div>
                <p className="text-blue-50 max-w-xl leading-relaxed text-lg font-light">
                  View AI-generated health recommendations based on your medical reports and prescriptions.
                  Get personalized insights, dietary advice, and proactive health guidance.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold text-white shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Personalized For You
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold text-white shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    HIPAA Secure
                  </span>
                </div>
              </div>

              <Link
                to="/ai-insights"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex-shrink-0"
              >
                <Eye className="h-5 w-5" />
                View My Insights
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Health Score Widget */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="glass-panel p-6 h-full flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2 self-start w-full border-b border-slate-100 pb-4 flex items-center gap-2">
               <Activity className="h-5 w-5 text-emerald-500" /> Wellness Score
            </h3>
            <div className="flex-1 w-full flex items-center justify-center mt-4">
              <HealthScoreGauge score={healthScore} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Health Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="glass-panel p-6 h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" /> Health Engagement
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <Area type="monotone" dataKey="activity" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" activeDot={{r: 6, strokeWidth: 0, fill: '#06B6D4'}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Health Timeline */}
        <motion.div variants={itemVariants}>
          <div className="glass-panel p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Health Journey</h3>
              <Link
                to="/appointments"
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
              >
                View all
              </Link>
            </div>

            {appointments.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Your appointment history will appear here once you book."
                icon={CalendarIcon}
                actionButton={
                  <Link
                    to="/appointments"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Book Appointment
                  </Link>
                }
              />
            ) : (
              <div className="space-y-0 relative mt-4">
                {appointments.slice(0,4).map((appt, index) => (
                  <TimelineItem
                    key={appt.id}
                    appointment={appt}
                    isLast={index === Math.min(appointments.length, 4) - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <HealthChatbot />
    </motion.div>
  );
};

export default PatientDashboard;