import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Pill, Plus, Download, Search, X, Calendar, Edit2, Trash2, User, Stethoscope, Clock
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorBanner from '../components/ErrorBanner';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Prescriptions = () => {
  const toast = useToast();
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';
  const [searchParams, setSearchParams] = useSearchParams();

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    appointment: '',
    diagnosis: '',
    medicines: '',
    instructions: '',
    follow_up_date: ''
  });
  const [autoAppointmentMode, setAutoAppointmentMode] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rxRes, aptRes] = await Promise.all([
        api.get('/prescriptions/prescriptions/'),
        api.get('/appointments/appointments/')
      ]);
      setPrescriptions(rxRes.data);
      setAppointments(aptRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle auto-opening new prescription modal based on query param
  useEffect(() => {
    const autoAppointment = searchParams.get('appointment');
    if (autoAppointment && isDoctor) {
      handleNewClick();
      setForm(f => ({ ...f, appointment: autoAppointment }));
      setAutoAppointmentMode(true);
      setSearchParams({});
    }
  }, [searchParams, isDoctor, setSearchParams]);

  const filteredPrescriptions = prescriptions.filter(rx =>
    (rx.diagnosis || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rx.medicines || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (prescription) => {
    setSelectedPrescription(prescription);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/prescriptions/prescriptions/${selectedPrescription.id}/`);
      toast.success('Prescription deleted successfully.');
      setIsDeleteOpen(false);
      setSelectedPrescription(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete prescription.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (prescription) => {
    setIsEditing(true);
    setSelectedPrescription(prescription);
    setForm({
      appointment: prescription.appointment,
      diagnosis: prescription.diagnosis || '',
      medicines: prescription.medicines || '',
      instructions: prescription.instructions || '',
      follow_up_date: prescription.follow_up_date ? prescription.follow_up_date.slice(0, 10) : ''
    });
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setIsEditing(false);
    setSelectedPrescription(null);
    setForm({
      appointment: '',
      diagnosis: '',
      medicines: '',
      instructions: '',
      follow_up_date: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    // Construct payload
    const payload = {
      appointment: parseInt(form.appointment),
      diagnosis: form.diagnosis,
      medicines: form.medicines,
      instructions: form.instructions
    };
    if (form.follow_up_date) {
      payload.follow_up_date = form.follow_up_date;
    }

    try {
      if (isEditing) {
        await api.patch(`/prescriptions/prescriptions/${selectedPrescription.id}/`, payload);
        toast.success('Prescription updated successfully!');
      } else {
        await api.post('/prescriptions/prescriptions/', payload);
        toast.success('Prescription created successfully!');
      }
      setIsModalOpen(false);
      setAutoAppointmentMode(false);
      fetchData();
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'string' ? data : data?.detail || Object.values(data || {}).flat().join(' ') || 'Failed to save prescription.';
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Prescriptions"
        description={isDoctor ? "Create and manage patient prescriptions." : "View your prescribed medications."}
        action={
          isDoctor && (
            <button
              onClick={handleNewClick}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 font-medium text-sm"
            >
              <Plus className="h-5 w-5" />
              <span>New Prescription</span>
            </button>
          )
        }
      />

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by diagnosis or medicine..."
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

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description={
            searchQuery
              ? `No prescriptions match "${searchQuery}". Try a different search.`
              : isDoctor ? "You haven't written any prescriptions yet." : "You don't have any prescriptions on file."
          }
          icon={Pill}
          actionButton={
            !searchQuery && isDoctor && (
              <button
                onClick={handleNewClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Write Prescription
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrescriptions.map((rx, index) => {
              // Find matching appointment to display patient/doctor names
              const apt = appointments.find(a => a.id === rx.appointment) || {};

              return (
                <motion.div
                  key={rx.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-[#fafafa] rounded-none border border-slate-300 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Decorative Rx Top Bar */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                  {/* Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                     <Stethoscope className="w-48 h-48" />
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100 flex-shrink-0">
                        <Pill className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 truncate" title={rx.diagnosis}>
                          {rx.diagnosis || 'General Prescription'}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(rx.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-sm mt-2 border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Medicines</span>
                      <p className="text-slate-900 mt-1 whitespace-pre-line">{rx.medicines}</p>
                    </div>
                    {rx.instructions && (
                      <div>
                        <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Instructions</span>
                        <p className="text-slate-900 mt-1 whitespace-pre-line">{rx.instructions}</p>
                      </div>
                    )}
                    {rx.follow_up_date && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-xs font-medium">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Follow-up: {formatDate(rx.follow_up_date)}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      {isDoctor ? (
                        <>
                          <User className="h-4 w-4 text-slate-400" />
                          {rx.patient_name || apt.patient_name || `Patient #${apt.patient}`}
                        </>
                      ) : (
                        <>
                          <Stethoscope className="h-4 w-4 text-slate-400" />
                          Dr. {rx.doctor_name || apt.doctor_name || `Doctor #${apt.doctor}`}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isPatient && (
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html><head><title>Prescription</title>
                              <style>
                                body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; }
                                h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                                .section { margin: 20px 0; }
                                .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                                .value { margin-top: 4px; white-space: pre-line; }
                                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
                              </style></head><body>
                              <h1>Medical Prescription</h1>
                              <div class="section"><div class="label">Doctor</div><div class="value">Dr. ${rx.doctor_name || apt.doctor_name || 'N/A'}</div></div>
                              <div class="section"><div class="label">Patient</div><div class="value">${rx.patient_name || apt.patient_name || 'N/A'}</div></div>
                              <div class="section"><div class="label">Date</div><div class="value">${formatDate(rx.created_at)}</div></div>
                              <div class="section"><div class="label">Diagnosis</div><div class="value">${rx.diagnosis || 'N/A'}</div></div>
                              <div class="section"><div class="label">Medicines</div><div class="value">${rx.medicines || 'N/A'}</div></div>
                              <div class="section"><div class="label">Instructions</div><div class="value">${rx.instructions || 'N/A'}</div></div>
                              ${rx.follow_up_date ? `<div class="section"><div class="label">Follow-up Date</div><div class="value">${formatDate(rx.follow_up_date)}</div></div>` : ''}
                              <div class="footer">Generated by HealthAI Platform</div>
                              </body></html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download / Print"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {isDoctor && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(rx)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(rx)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                  </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription? This action cannot be undone."
        confirmText={deleteLoading ? 'Deleting...' : 'Yes, Delete'}
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => { setIsDeleteOpen(false); setSelectedPrescription(null); }}
        isDestructive
      />

      {/* Create / Edit Modal (Doctor Only) */}
      <AnimatePresence>
        {isModalOpen && isDoctor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {isEditing ? 'Edit Prescription' : 'New Prescription'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <form id="rx-form" onSubmit={handleSubmit} className="space-y-5">
                    {formError && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {!autoAppointmentMode && !isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Appointment</label>
                          <select
                            required
                            value={form.appointment}
                            onChange={e => setForm(f => ({ ...f, appointment: e.target.value }))}
                            disabled={isEditing}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            <option value="">Select appointment</option>
                            {appointments.map(apt => (
                              <option key={apt.id} value={apt.id}>
                                {formatDate(apt.appointment_date)} - {apt.patient_name || `Patient #${apt.patient}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Diagnosis</label>
                        <input
                          type="text"
                          required
                          value={form.diagnosis}
                          onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
                          placeholder="e.g., Acute Bronchitis"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Medicines</label>
                      <textarea
                        required
                        rows={4}
                        value={form.medicines}
                        onChange={e => setForm(f => ({ ...f, medicines: e.target.value }))}
                        placeholder="List medicines with dosage and frequency..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none font-mono text-[13px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Instructions</label>
                      <textarea
                        rows={3}
                        value={form.instructions}
                        onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                        placeholder="Additional instructions for the patient..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Follow-up Date (Optional)</label>
                      <input
                        type="date"
                        value={form.follow_up_date}
                        onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    </div>
                  </form>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="rx-form"
                    disabled={formLoading}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {formLoading && (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {formLoading ? 'Saving...' : 'Save Prescription'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;
