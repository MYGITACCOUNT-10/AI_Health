import { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import AIInsights from './pages/AIInsights';
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';

import About from './pages/About';
import Team from './pages/Team';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import { PhoneCall } from 'lucide-react';

const EmergencyWidget = () => (
  <button className="fixed bottom-6 left-6 z-50 bg-red-600 text-white rounded-full p-4 shadow-lg shadow-red-600/30 hover:bg-red-700 hover:-translate-y-1 transition-all group flex items-center gap-3">
    <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
      <PhoneCall className="h-5 w-5" />
    </div>
    <div className="hidden group-hover:block pr-2 text-left animate-in fade-in slide-in-from-right-4">
      <p className="text-xs font-bold uppercase tracking-wider text-red-200">Emergency Support</p>
      <p className="text-sm font-bold">24/7 Assistance</p>
    </div>
  </button>
);

// RoleBasedLayout: renders DoctorLayout or PatientLayout based on user role
const RoleBasedLayout = ({ children }) => {
  const { role } = useContext(AuthContext);

  if (role === 'doctor') {
    return (
      <DoctorLayout>
        {children}
      </DoctorLayout>
    );
  } else if (role === 'patient') {
    return (
      <PatientLayout>
        {children}
      </PatientLayout>
    );
  }
  return children;
};

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <EmergencyWidget />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route element={<DoctorLayout />}>
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/patients" element={<Patients />} />
              </Route>
            </Route>

            {/* Patient-only Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route element={<PatientLayout />}>
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
              </Route>
            </Route>

            {/* Shared Protected Routes (both doctor & patient) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/appointments" element={
                <RoleBasedLayout>
                  <Appointments />
                </RoleBasedLayout>
              } />
              <Route path="/reports" element={
                <RoleBasedLayout>
                  <Reports />
                </RoleBasedLayout>
              } />
              <Route path="/ai-insights" element={
                <RoleBasedLayout>
                  <AIInsights />
                </RoleBasedLayout>
              } />
              <Route path="/ai-insights/:appointmentId" element={
                <RoleBasedLayout>
                  <AIInsights />
                </RoleBasedLayout>
              } />
              <Route path="/prescriptions" element={
                <RoleBasedLayout>
                  <Prescriptions />
                </RoleBasedLayout>
              } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;