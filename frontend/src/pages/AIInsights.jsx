import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Activity, Pill, CheckCircle2, Apple, User,
  Ban, Home, AlertTriangle, MessageCircleQuestion, ArrowLeft,
  Calendar, Sparkles, Shield, Clock, ChevronRight, ChevronDown
} from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';

/* ─── Follow-Up Accordion ─── */
const FollowUpAccordion = ({ item, t, delay }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`rounded-xl border border-white/60 overflow-hidden ${t.itemBg}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left focus:outline-none"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1.5 flex-shrink-0">
            <div className={`h-2 w-2 rounded-full ${t.dot}`} />
          </div>
          <span className="text-sm font-medium text-slate-800">{item.question || item}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && item.answer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 pl-8 pr-4 text-sm text-slate-600 border-t border-white/40 mt-1">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Insight Card Component ─── */
const InsightCard = ({ title, items, icon: Icon, colorTheme, delay = 0 }) => {
  const themes = {
    blue:   { bg: 'bg-blue-50/60',   border: 'border-blue-100',   iconBg: 'bg-blue-100', iconColor: 'text-blue-600',   titleColor: 'text-blue-900',   itemBg: 'bg-blue-50/40',   dot: 'bg-blue-400' },
    emerald:{ bg: 'bg-emerald-50/60', border: 'border-emerald-100', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', titleColor: 'text-emerald-900', itemBg: 'bg-emerald-50/40', dot: 'bg-emerald-400' },
    amber:  { bg: 'bg-amber-50/60',   border: 'border-amber-100',   iconBg: 'bg-amber-100', iconColor: 'text-amber-600',   titleColor: 'text-amber-900',   itemBg: 'bg-amber-50/40',   dot: 'bg-amber-400' },
    red:    { bg: 'bg-red-50/60',     border: 'border-red-100',     iconBg: 'bg-red-100',   iconColor: 'text-red-600',     titleColor: 'text-red-900',     itemBg: 'bg-red-50/40',     dot: 'bg-red-400' },
    purple: { bg: 'bg-purple-50/60',   border: 'border-purple-100',   iconBg: 'bg-purple-100', iconColor: 'text-purple-600', titleColor: 'text-purple-900', itemBg: 'bg-purple-50/40', dot: 'bg-purple-400' },
    cyan:   { bg: 'bg-cyan-50/60',     border: 'border-cyan-100',     iconBg: 'bg-cyan-100',   iconColor: 'text-cyan-600',   titleColor: 'text-cyan-900',   itemBg: 'bg-cyan-50/40',   dot: 'bg-cyan-400' },
  };

  const t = themes[colorTheme] || themes.blue;

  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 ${t.bg} -mr-10 -mt-10 pointer-events-none`}></div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 ${t.iconBg} rounded-xl shadow-sm`}>
          <Icon className={`h-5 w-5 ${t.iconColor}`} />
        </div>
        <h3 className={`text-lg font-semibold ${t.titleColor}`}>{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => {
          if (typeof item === 'object' && item.question) {
            return <FollowUpAccordion key={index} item={item} t={t} delay={delay + 0.05 * index} />;
          }
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 * index }}
              className={`flex items-start gap-3 ${t.itemBg} p-3 rounded-xl border border-white/60 text-slate-700`}
            >
              <div className="mt-1.5 flex-shrink-0">
                <div className={`h-2 w-2 rounded-full ${t.dot}`} />
              </div>
              <span className="text-sm leading-relaxed">{item}</span>
            </motion.li>
          );
        })}
      </ul>
      </div>
    </motion.div>
  );
};

/* ─── Confidence Badge ─── */
const ConfidenceBadge = ({ level }) => {
  const config = {
    high:   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: Shield, label: 'High Confidence' },
    medium: { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   icon: Shield, label: 'Medium Confidence' },
    low:    { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     icon: AlertTriangle, label: 'Low Confidence' },
  };
  const c = config[level?.toLowerCase()] || config.medium;
  const BadgeIcon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.0 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${c.bg} ${c.text} border ${c.border}`}
    >
      <BadgeIcon className="h-4 w-4" />
      <span className="font-semibold text-sm">{c.label}</span>
    </motion.div>
  );
};

/* ─── Hub Page (no appointmentId) ─── */
const InsightsHub = () => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get('/appointments/appointments/');
        setAppointments(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/25 mb-5">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
          AI Health Insights
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
          Select an appointment to generate AI-powered health insights, personalized recommendations, and comprehensive analysis.
        </p>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading && (
        <div className="flex justify-center py-16">
          <div className="relative">
            <BrainCircuit className="h-12 w-12 text-blue-600 animate-pulse" />
            <div className="absolute inset-0 border-4 border-cyan-400 rounded-full animate-ping opacity-20" />
          </div>
        </div>
      )}

      {!loading && appointments.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Appointments Found</h3>
          <p className="text-slate-500">You need an appointment to generate AI insights.</p>
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            Go to Appointments
          </Link>
        </motion.div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {appointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/ai-insights/${apt.id}`)}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {apt.reason && apt.reason.length > 5 ? apt.reason : 'General Consultation'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <User className="h-4 w-4" />
                    {isDoctor ? `Patient: ${apt.patient_name || apt.patient}` : `Doctor: ${apt.doctor_name || apt.doctor}`}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(apt.appointment_date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[apt.status] || 'bg-slate-100 text-slate-600'}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">ID #{apt.id}</span>
                  <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 text-sm font-medium transition-colors bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100">
                    <Sparkles className="h-4 w-4" />
                    Generate Insight
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ─── Detail Page (with appointmentId) ─── */
const InsightDetail = ({ appointmentId }) => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing Medical Data...",
    "Reviewing Medical Report...",
    "Consulting Clinical Guidelines...",
    "Generating Recommendations...",
    "Finalizing AI Report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/ai-engine/appointment/${appointmentId}/generate-insight/`);
        setData(res.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404 || status === 400) {
          setError("Could not generate insights for this appointment. Please ensure both a prescription and a medical report have been uploaded.");
        } else {
          setError("AI service temporarily unavailable. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [appointmentId]);

  if (loading) {
    const progress = ((loadingStep + 1) / loadingMessages.length) * 100;
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] min-w-[400px]">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <BrainCircuit className="h-16 w-16 text-blue-600 animate-pulse relative z-10" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">
            {loadingMessages[loadingStep]}
          </h2>
          {/* Progress bar */}
          <div className="w-64 mt-5">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-slate-400">Step {loadingStep + 1} of {loadingMessages.length}</p>
              <p className="text-xs text-slate-400">{Math.round(progress)}%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">May take up to 30 seconds</p>
          <p className="mt-1 text-xs text-slate-400">Powered by Google Gemini</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16">
        <Link
          to="/ai-insights"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insights Hub
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-red-500 mb-5">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Unable to Generate Insights</h2>
          <p className="text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Upload a Report
            </Link>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              View Appointments
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <Link
        to="/ai-insights"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Insights Hub
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Health Insights</h1>
              <p className="text-slate-500">Appointment #{appointmentId}</p>
            </div>
          </div>
        </div>
        {data?.confidence_level && isDoctor && (
          <ConfidenceBadge level={data.confidence_level} />
        )}
      </motion.div>

      {data?.summary && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-xl shadow-blue-500/15"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-cyan-300 opacity-10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-200" />
              <h2 className="text-lg font-semibold text-blue-100">Executive Summary</h2>
            </div>
            <p className="text-xl leading-relaxed font-light">{data.summary}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard title="Key Findings" items={data?.key_findings} icon={Activity} colorTheme="blue" delay={0.1} />
        <InsightCard title="Medication Guidance" items={data?.medication_guidance} icon={Pill} colorTheme="purple" delay={0.2} />
        <InsightCard title="Recommendations" items={data?.recommendations} icon={CheckCircle2} colorTheme="emerald" delay={0.3} />
        <InsightCard title="Foods To Eat" items={data?.foods_to_eat} icon={Apple} colorTheme="emerald" delay={0.4} />
        <InsightCard title="Foods To Avoid" items={data?.foods_to_avoid} icon={Ban} colorTheme="red" delay={0.5} />
        <InsightCard title="Home Care Tips" items={data?.home_care_tips} icon={Home} colorTheme="cyan" delay={0.6} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="Risk Factors" items={data?.risk_factors} icon={AlertTriangle} colorTheme="amber" delay={0.7} />
        <InsightCard title="Follow-Up Questions" items={data?.follow_up_questions} icon={MessageCircleQuestion} colorTheme="blue" delay={0.8} />
      </div>
    </div>
  );
};

const AIInsights = () => {
  const { appointmentId } = useParams();
  if (!appointmentId) return <InsightsHub />;
  return <InsightDetail appointmentId={appointmentId} />;
};

export default AIInsights;
