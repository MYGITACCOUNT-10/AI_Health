import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, Plus, Edit2, Trash2,
  CheckCircle2, User, Search, X, ChevronRight, FileText, Pill, BrainCircuit, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorBanner from '../components/ErrorBanner';
import { SkeletonTable } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  completed: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-red-100 text-red-700 ring-red-600/20',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

const Appointments = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [newForm, setNewForm] = useState({ doctor: '', appointment_date: '', reason: '' });
  const [newFormLoading, setNewFormLoading] = useState(false);
  const [newFormError, setNewFormError] = useState(null);
  const [isNewDropdownOpen, setIsNewDropdownOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ doctor: '', appointment_date: '', reason: '' });
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Status management for doctors
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      const res = await api.get('/appointments/appointments/', { params });
      setAppointments(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setAppointments([]);
      } else {
        setError(err.response?.data?.detail || 'Failed to load appointments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (isPatient) {
      const fetchDoctors = async () => {
        try {
          const res = await api.get('/doctors/profile/');
          setDoctors(res.data);
        } catch {
          // Fallback if fails
        }
      };
      fetchDoctors();
    }
  }, [isPatient]);

  const filteredAppointments = appointments.filter(a =>
    (a.reason || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Patient Actions ---
  const handleCancelClick = (e, appointment) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    setCancelLoading(true);
    try {
      await api.delete(`/appointments/appointments/${selectedAppointment.id}/`);
      toast.success('Appointment cancelled successfully.');
      setIsCancelModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel appointment.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleEditClick = (e, appointment) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setEditForm({
      doctor: appointment.doctor || '',
      appointment_date: appointment.appointment_date ? appointment.appointment_date.slice(0, 16) : '',
      reason: appointment.reason || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditFormLoading(true);
    try {
      await api.patch(`/appointments/appointments/${selectedAppointment.id}/`, {
        doctor: editForm.doctor,
        appointment_date: editForm.appointment_date,
        reason: editForm.reason,
      });
      toast.success('Appointment updated successfully.');
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update appointment.');
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setNewFormLoading(true);
    setNewFormError(null);
    try {
      await api.post('/appointments/appointments/', {
        doctor: parseInt(newForm.doctor),
        appointment_date: newForm.appointment_date,
        reason: newForm.reason,
      });
      toast.success('Appointment booked successfully!');
      setIsNewModalOpen(false);
      setNewForm({ doctor: '', appointment_date: '', reason: '' });
      fetchAppointments();
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'string' ? data : data?.detail || Object.values(data || {}).flat().join(' ') || 'Failed to create appointment.';
      setNewFormError(msg);
    } finally {
      setNewFormLoading(false);
    }
  };

  // --- Doctor Actions ---
  const handleUpdateStatus = async (status) => {
    if (!selectedAppointment) return;
    setStatusLoading(true);
    try {
      await api.patch(`/appointments/appointments/${selectedAppointment.id}/`, {
        status: status
      });
      toast.success(`Appointment marked as ${status}.`);
      setIsDetailsModalOpen(false);
      fetchAppointments();
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'string' ? data : data?.detail || data?.error || Object.values(data || {}).flat().join(' ') || 'Failed to update status.';
      toast.error(msg);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRowClick = (appointment) => {
    if (isDoctor) {
      setSelectedAppointment(appointment);
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-6"
    >
      <PageHeader
        title={isDoctor ? "Appointment Management" : "Appointments"}
        description={isDoctor ? "View and manage your assigned appointments." : "Manage and track your medical appointments."}
        action={
          isPatient && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 font-medium text-sm"
            >
              <Plus className="h-5 w-5" />
              <span>New Appointment</span>
            </button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reason..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={
            searchQuery
              ? `No appointments match "${searchQuery}". Try a different search term.`
              : isDoctor ? "You have no assigned appointments." : "You don't have any appointments yet. Book your first appointment to get started."
          }
          icon={CalendarIcon}
          actionButton={
            !searchQuery && isPatient && (
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Book Now
              </button>
            )
          }
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
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {isDoctor ? "Patient" : "Doctor"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  {isPatient && (
                    <th className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                  {isDoctor && (
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Details
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredAppointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleRowClick(appointment)}
                      className={`hover:bg-slate-50/80 transition-colors group ${isDoctor ? 'cursor-pointer' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            {formatDate(appointment.appointment_date)}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {formatTime(appointment.appointment_date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {isDoctor ? (appointment.patient_name || `Patient #${appointment.patient}`) : `Dr. ${appointment.doctor_name || `Doctor #${appointment.doctor}`}`}
                            </div>
                            {isPatient && appointment.doctor_specialization && (
                              <div className="text-xs text-slate-500">
                                {appointment.doctor_specialization}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs truncate">
                          {appointment.reason && appointment.reason.trim().length > 0 ? appointment.reason : 'General Consultation'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColors[appointment.status] || 'bg-slate-100 text-slate-700 ring-slate-600/20'}`}>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          <span className="capitalize">{appointment.status}</span>
                        </span>
                      </td>
                      
                      {isPatient && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleEditClick(e, appointment)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {appointment.status !== 'cancelled' && (
                              <button
                                onClick={(e) => handleCancelClick(e, appointment)}
                                className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                title="Cancel"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                      {isDoctor && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors ml-auto" />
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Cancel Confirm Dialog (Patient) */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText={cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
        cancelText="No, Keep It"
        onConfirm={confirmCancel}
        onCancel={() => { setIsCancelModalOpen(false); setSelectedAppointment(null); }}
        isDestructive
      />

      {/* New Appointment Modal (Patient) */}
      <AnimatePresence>
        {isNewModalOpen && isPatient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">New Appointment</h2>
                  <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleNewSubmit} className="p-6 space-y-5">
                  {newFormError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {newFormError}
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Doctor</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsNewDropdownOpen(!isNewDropdownOpen)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white flex justify-between items-center"
                      >
                        <span className={newForm.doctor ? 'text-slate-900' : 'text-slate-500'}>
                          {newForm.doctor 
                            ? (() => {
                                const doc = doctors.find(d => d.id.toString() === newForm.doctor.toString());
                                return doc ? `Dr. ${[doc.first_name, doc.last_name].filter(Boolean).join(' ') || doc.user_name || `Doctor #${doc.id}`} — ${doc.specialization || 'General'}` : 'Select a doctor';
                              })()
                            : 'Select a doctor'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </button>

                      <AnimatePresence>
                        {isNewDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setIsNewDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto overflow-x-hidden"
                            >
                              <ul className="py-1">
                                {doctors.map(doc => (
                                  <li 
                                    key={doc.id}
                                    onClick={() => {
                                      setNewForm(f => ({ ...f, doctor: doc.id }));
                                      setIsNewDropdownOpen(false);
                                    }}
                                    className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer text-slate-700 border-b border-slate-50 last:border-0 truncate"
                                  >
                                    <span className="font-medium">Dr. {[doc.first_name, doc.last_name].filter(Boolean).join(' ') || doc.user_name || `Doctor #${doc.id}`}</span>
                                    <span className="text-slate-500 ml-1">— {doc.specialization || 'General'} ({doc.hospital_name || 'N/A'})</span>
                                  </li>
                                ))}
                                {doctors.length === 0 && (
                                  <li className="px-4 py-2.5 text-sm text-slate-500">No doctors available.</li>
                                )}
                              </ul>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newForm.appointment_date}
                      onChange={e => setNewForm(f => ({ ...f, appointment_date: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
                    <textarea
                      required
                      rows={3}
                      value={newForm.reason}
                      onChange={e => setNewForm(f => ({ ...f, reason: e.target.value }))}
                      placeholder="Describe the reason for your visit..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={newFormLoading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {newFormLoading && (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {newFormLoading ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Appointment Modal (Patient) */}
      <AnimatePresence>
        {isEditModalOpen && isPatient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsEditModalOpen(false); setSelectedAppointment(null); }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Edit Appointment</h2>
                  <button onClick={() => { setIsEditModalOpen(false); setSelectedAppointment(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Doctor</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white flex justify-between items-center"
                      >
                        <span className={editForm.doctor ? 'text-slate-900' : 'text-slate-500'}>
                          {editForm.doctor 
                            ? (() => {
                                const doc = doctors.find(d => d.id.toString() === editForm.doctor.toString());
                                return doc ? `Dr. ${[doc.first_name, doc.last_name].filter(Boolean).join(' ') || doc.user_name || `Doctor #${doc.id}`} — ${doc.specialization || 'General'}` : 'Select a doctor';
                              })()
                            : 'Select a doctor'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </button>

                      <AnimatePresence>
                        {isEditDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setIsEditDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto overflow-x-hidden"
                            >
                              <ul className="py-1">
                                {doctors.map(doc => (
                                  <li 
                                    key={doc.id}
                                    onClick={() => {
                                      setEditForm(f => ({ ...f, doctor: doc.id }));
                                      setIsEditDropdownOpen(false);
                                    }}
                                    className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer text-slate-700 border-b border-slate-50 last:border-0 truncate"
                                  >
                                    <span className="font-medium">Dr. {[doc.first_name, doc.last_name].filter(Boolean).join(' ') || doc.user_name || `Doctor #${doc.id}`}</span>
                                    <span className="text-slate-500 ml-1">— {doc.specialization || 'General'} ({doc.hospital_name || 'N/A'})</span>
                                  </li>
                                ))}
                                {doctors.length === 0 && (
                                  <li className="px-4 py-2.5 text-sm text-slate-500">No doctors available.</li>
                                )}
                              </ul>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={editForm.appointment_date}
                      onChange={e => setEditForm(f => ({ ...f, appointment_date: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
                    <textarea
                      required
                      rows={3}
                      value={editForm.reason}
                      onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsEditModalOpen(false); setSelectedAppointment(null); }}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editFormLoading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {editFormLoading && (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {editFormLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Appointment Details Modal (Doctor) */}
      <AnimatePresence>
        {isDetailsModalOpen && isDoctor && selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Appointment Details</h2>
                  <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Info Header */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900">{selectedAppointment.patient_name || `Patient #${selectedAppointment.patient}`}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {formatDate(selectedAppointment.appointment_date)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTime(selectedAppointment.appointment_date)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Reason for Visit</h4>
                    <p className="text-slate-900">{selectedAppointment.reason && selectedAppointment.reason.trim().length > 0 ? selectedAppointment.reason : 'General Consultation'}</p>
                  </div>

                  {/* Actions Grid */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3">Workflow Actions</h4>
                    {selectedAppointment.status === 'completed' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button 
                          onClick={() => navigate(`/prescriptions?appointment=${selectedAppointment.id}`)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-colors text-left group"
                        >
                          <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg group-hover:bg-cyan-200 transition-colors">
                            <Pill className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700">Create Prescription</span>
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/reports?appointment=${selectedAppointment.id}`)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left group"
                        >
                          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">Upload Report</span>
                        </button>

                        <button 
                          onClick={() => navigate(`/ai-insights?appointment=${selectedAppointment.id}`)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group sm:col-span-2"
                        >
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <BrainCircuit className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Generate AI Insight</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-200">
                        Please mark this appointment as <strong>Completed</strong> before uploading reports, prescribing medicines, or generating insights.
                      </div>
                    )}
                  </div>

                  {/* Status Management */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3">Update Status</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={statusLoading || selectedAppointment.status === 'completed'}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedAppointment.status === 'completed' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-50 cursor-not-allowed'
                            : 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('cancelled')}
                        disabled={statusLoading || selectedAppointment.status === 'cancelled'}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedAppointment.status === 'cancelled' 
                            ? 'bg-red-50 border-red-200 text-red-700 opacity-50 cursor-not-allowed'
                            : 'bg-white border-red-200 text-red-700 hover:bg-red-50'
                        }`}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointments;
