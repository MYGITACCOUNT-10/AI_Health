import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Pill, Calendar as CalendarIcon, Upload, BrainCircuit, Activity,
  Clock, CheckCircle2, ChevronRight, User, TrendingUp,
  Stethoscope
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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
        {trend && (
          <p className="text-xs font-medium text-emerald-600 flex items-center mt-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend} from last month
          </p>
        )}
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} shadow-inner group-hover:scale-110 transition-transform`}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, to, colorClass }) => (
  <motion.div variants={itemVariants} className="h-full">
    <Link to={to} className="block group h-full">
      <div className="glass-panel p-6 h-full border-l-4 border-transparent hover:border-blue-500 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-lg">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className={`inline-flex p-3 rounded-xl ${colorClass} mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

const ActivityTimelineItem = ({ item, isLast }) => {
  const isAppointment = item.type === 'appointment';
  const Icon = isAppointment ? CalendarIcon : FileText;
  const colorClass = isAppointment ? 'text-blue-600 bg-blue-50 border-white' : 'text-emerald-600 bg-emerald-50 border-white';
  
  return (
    <div className="relative flex gap-5 pb-8 group">
      {!isLast && (
        <div className="absolute left-[1.35rem] top-12 -bottom-2 w-0.5 bg-slate-200 group-hover:bg-blue-200 transition-colors" />
      )}
      <div className="flex-shrink-0 mt-1">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] shadow-sm z-10 relative transition-colors ${colorClass} group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-100`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 glass-panel p-5 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm hover:shadow-md cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">
            {formatDate(item.date)} at {formatTime(item.date)}
          </span>
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-1">
          {isAppointment ? (item.reason || 'General Consultation') : item.title}
        </h4>
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
          {isAppointment ? (
            <><User className="h-4 w-4" /> Patient: {item.patient_name || `ID #${item.patient}`}</>
          ) : (
            <><CheckCircle2 className="h-4 w-4" /> Report for Appt #{item.appointment}</>
          )}
        </p>
        <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${isAppointment ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'}`}>
            {isAppointment ? item.status.toUpperCase() : (item.ai_summary ? 'ANALYZED' : 'PENDING')}
          </span>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for charts
  const chartData = [
    { name: 'Mon', appointments: 4 },
    { name: 'Tue', appointments: 7 },
    { name: 'Wed', appointments: 5 },
    { name: 'Thu', appointments: 8 },
    { name: 'Fri', appointments: 6 },
    { name: 'Sat', appointments: 2 },
    { name: 'Sun', appointments: 0 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, appointmentsRes, reportsRes] = await Promise.all([
          api.get('/dashboard/doctor/'),
          api.get('/appointments/appointments/', { params: { status: 'scheduled' } }),
          api.get('/reports/reports/')
        ]);

        setStats(statsRes.data);

        const appts = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : appointmentsRes.data?.results || [];
        const reps = Array.isArray(reportsRes.data) ? reportsRes.data : reportsRes.data?.results || [];

        // Combine and sort activities
        const combined = [
          ...appts.map(a => ({ ...a, type: 'appointment', date: a.appointment_date })),
          ...reps.map(r => ({ ...r, type: 'report', date: r.uploaded_at }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setActivities(combined.slice(0, 6));

      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <SkeletonDashboard />;

  const pieData = stats ? [
    { name: 'Scheduled', value: stats.scheduled_appointments || 1 },
    { name: 'Completed', value: stats.completed_appointments || 0 },
    { name: 'Cancelled', value: stats.cancelled_appointments || 0 },
  ] : [];

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
            Welcome back, Dr. {user?.first_name || user?.username || 'Doctor'} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Here is your practice overview for today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </motion.div>
      )}

      {/* Stats Row */}
      {stats && (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          <StatCard title="Total Appointments" value={stats.total_appointments ?? 0} icon={CalendarIcon} colorClass="bg-blue-100 text-blue-600" trend="+12%" />
          <StatCard title="Patients" value={stats.total_patients ?? 0} icon={User} colorClass="bg-emerald-100 text-emerald-600" trend="+5%" />
          <StatCard title="Reports Uploaded" value={stats.total_reports ?? 0} icon={FileText} colorClass="bg-amber-100 text-amber-600" trend="+18%" />
          <StatCard title="Prescriptions Issued" value={stats.total_prescriptions ?? 0} icon={Pill} colorClass="bg-cyan-100 text-cyan-600" trend="+2%" />
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <QuickActionCard title="Upload Report" description="Add patient PDF records" icon={Upload} to="/reports" colorClass="bg-blue-50 text-blue-600 border border-blue-100" />
          <QuickActionCard title="Prescribe" description="Write new medications" icon={Pill} to="/prescriptions" colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100" />
          <QuickActionCard title="Directory" description="View all patients" icon={User} to="/patients" colorClass="bg-amber-50 text-amber-600 border border-amber-100" />
          <QuickActionCard title="AI Insights" description="Run smart analysis" icon={BrainCircuit} to="/ai-insights" colorClass="bg-cyan-50 text-cyan-600 border border-cyan-100" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Charts Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6 h-96">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" /> Weekly Appointments Trend
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <Area type="monotone" dataKey="appointments" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorAppts)" activeDot={{r: 6, strokeWidth: 0}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" /> Status Distribution
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-700 font-semibold">{entry.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 text-lg">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="glass-panel p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Activity Timeline
              </h3>
            </div>
            
            {activities.length === 0 ? (
               <EmptyState title="No recent activity" description="No appointments or reports." icon={Activity} />
            ) : (
              <div className="space-y-0 relative mt-4">
                {activities.map((item, index) => (
                  <ActivityTimelineItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    isLast={index === activities.length - 1}
                  />
                ))}
              </div>
            )}
            
            {activities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  View Full History
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default DoctorDashboard;