import { FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new record.", 
  icon: Icon = FileSearch,
  actionButton 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-6">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">
        {description}
      </p>
      {actionButton && (
        <div className="mt-2">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
