import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Calendar, FileText, Pill, BrainCircuit } from 'lucide-react';

const patientLinks = [
  { name: 'Dashboard', href: '/patient-dashboard', icon: LayoutDashboard },
  { name: 'My Appointments', href: '/appointments', icon: Calendar },
  { name: 'My Reports', href: '/reports', icon: FileText },
  { name: 'Prescriptions', href: '/prescriptions', icon: Pill },
  { name: 'AI Insights', href: '/ai-insights', icon: BrainCircuit },
];

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar links={patientLinks} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar links={patientLinks} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
