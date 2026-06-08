import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Download, Trash2, Search, X,
  BrainCircuit, CheckCircle2, Clock, Sparkles, Eye, User
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
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

const Reports = () => {
  const toast = useToast();
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal (Doctor only)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Upload modal (Doctor only)
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ appointment: '', title: '', description: '', report_file: null });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [autoAppointmentMode, setAutoAppointmentMode] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/reports/reports/');
      setReports(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle auto-opening upload modal based on query param
  useEffect(() => {
    const autoAppointment = searchParams.get('appointment');
    if (autoAppointment && isDoctor) {
      setUploadForm(f => ({ ...f, appointment: autoAppointment }));
      setAutoAppointmentMode(true);
      setIsUploadOpen(true);
      // Clean up the URL so it doesn't reopen if they refresh after closing
      setSearchParams({});
    }
  }, [searchParams, isDoctor, setSearchParams]);

  // Client-side filter by title
  const filteredReports = reports.filter(r =>
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Doctor Actions ---
  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/reports/reports/${selectedReport.id}/`);
      toast.success('Report deleted successfully.');
      setIsDeleteOpen(false);
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete report.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('appointment', uploadForm.appointment);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      if (uploadForm.report_file) {
        formData.append('report_file', uploadForm.report_file);
      }
      await api.post('/reports/reports/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Report uploaded successfully!');
      setIsUploadOpen(false);
      setUploadForm({ appointment: '', title: '', description: '', report_file: null });
      setAutoAppointmentMode(false);
      fetchReports();
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'string' ? data : data?.detail || Object.values(data || {}).flat().join(' ') || 'Failed to upload report.';
      setUploadError(msg);
    } finally {
      setUploadLoading(false);
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
        title="Medical Reports"
        description={isDoctor ? "Manage patient reports and generate AI insights." : "View and download your medical records."}
        action={
          isDoctor && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 font-medium text-sm"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Report</span>
            </button>
          )
        }
      />

      {/* Search */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title..."
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

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="No reports found"
          description={
            searchQuery
              ? `No reports match "${searchQuery}". Try a different search.`
              : isDoctor ? "No medical reports uploaded yet." : "You don't have any medical reports on file."
          }
          icon={FileText}
          actionButton={
            !searchQuery && isDoctor && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <Upload className="h-4 w-4" />
                Upload Report
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredReports.map((report, index) => {
              const hasAI = report.ai_summary && report.ai_summary.trim().length > 0;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Report Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-900 truncate">
                          {report.title || 'Untitled Report'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-600">
                          {isDoctor ? (
                            <>
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              {report.patient_name || `Patient #${report.appointment}`}
                            </>
                          ) : (
                            <>
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              Dr. {report.doctor_name || `Doctor #${report.appointment}`}
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(report.uploaded_at)}
                          </span>
                          {/* AI Status Badge */}
                          {hasAI ? (
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              <Sparkles className="h-3 w-3" />
                              Analysis Complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20">
                              <Clock className="h-3 w-3" />
                              Pending Analysis
                            </span>
                          )}
                        </div>
                        {report.description && (
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{report.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      {/* Download */}
                      {(report.report_file_url || report.report_file) && (
                        <a
                          href={report.report_file_url || (report.report_file.startsWith('http') ? report.report_file : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${report.report_file}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </a>
                      )}

                      {/* AI Insights Link */}
                      {hasAI ? (
                        <Link
                          to={`/ai-insights/${report.appointment}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="View AI Insights"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View Insights</span>
                        </Link>
                      ) : isDoctor ? (
                        <Link
                          to={`/ai-insights/${report.appointment}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Generate AI Insight"
                        >
                          <BrainCircuit className="h-4 w-4" />
                          <span className="hidden sm:inline">Generate Insight</span>
                        </Link>
                      ) : null}

                      {/* Delete (Doctor Only) */}
                      {isDoctor && (
                        <button
                          onClick={() => handleDeleteClick(report)}
                          className="inline-flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirm Dialog (Doctor Only) */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText={deleteLoading ? 'Deleting...' : 'Yes, Delete'}
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => { setIsDeleteOpen(false); setSelectedReport(null); }}
        isDestructive
      />

      {/* Upload Modal (Doctor Only) */}
      <AnimatePresence>
        {isUploadOpen && isDoctor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
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
                  <h2 className="text-xl font-semibold text-slate-900">Upload Report</h2>
                  <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
                  {uploadError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {uploadError}
                    </div>
                  )}

                  {/* Hide appointment field when auto-linked from appointment context */}
                  {!autoAppointmentMode && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Appointment ID</label>
                      <input
                        type="number"
                        required
                        value={uploadForm.appointment}
                        onChange={e => setUploadForm(f => ({ ...f, appointment: e.target.value }))}
                        placeholder="Enter appointment ID"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g., Blood Test Results"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      rows={3}
                      value={uploadForm.description}
                      onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Brief description of the report..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Report Document</label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center cursor-pointer group">
                      <input
                        type="file"
                        required
                        onChange={e => setUploadForm(f => ({ ...f, report_file: e.target.files[0] || null }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.png,.jpg,.jpeg"
                      />
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG (max. 10MB)</p>
                    </div>
                    {uploadForm.report_file && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-900 truncate">{uploadForm.report_file.name}</p>
                          <p className="text-xs text-blue-600">{(uploadForm.report_file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadLoading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadLoading && (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {uploadLoading ? 'Uploading...' : 'Upload Report'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reports;
