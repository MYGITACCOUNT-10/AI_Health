import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Calendar, Activity, Phone, Mail } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/SkeletonLoader';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch appointments to derive unique patients
        const res = await api.get('/appointments/appointments/');
        const appts = Array.isArray(res.data) ? res.data : res.data?.results || [];
        
        const uniquePatientsMap = new Map();
        
        appts.forEach(appt => {
          if (!uniquePatientsMap.has(appt.patient)) {
            uniquePatientsMap.set(appt.patient, {
              id: appt.patient,
              name: appt.patient_name || `Patient #${appt.patient}`,
              last_visit: appt.appointment_date,
              total_visits: 1,
              latest_reason: appt.reason
            });
          } else {
            const p = uniquePatientsMap.get(appt.patient);
            p.total_visits += 1;
            if (!p.name || p.name.startsWith('Patient #')) {
              p.name = appt.patient_name || p.name;
            }
            if (new Date(appt.appointment_date) > new Date(p.last_visit)) {
              p.last_visit = appt.appointment_date;
              p.latest_reason = appt.reason;
            }
          }
        });

        setPatients(Array.from(uniquePatientsMap.values()));
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load patients list.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="My Patients"
        description="A list of patients derived from your appointment history."
      />

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="You haven't seen any patients yet."
          icon={Users}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Visits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Latest Visit Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Visit Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                <AnimatePresence>
                  {patients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {patient.name || `Patient #${patient.id}`}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-xs text-slate-500 flex items-center gap-1"><Mail className="h-3 w-3"/>ID: {patient.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {patient.total_visits} appointments
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 max-w-xs truncate">
                          {patient.latest_reason && patient.latest_reason.length > 5 ? patient.latest_reason : 'General Consultation'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(patient.last_visit)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Patients;
