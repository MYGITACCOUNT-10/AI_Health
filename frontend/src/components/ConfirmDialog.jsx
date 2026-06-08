import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, isDestructive = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} mb-4`}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <button 
                    onClick={onCancel}
                    className="text-slate-400 hover:text-slate-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 mb-6">
                  {message}
                </p>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                      isDestructive 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
