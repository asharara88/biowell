import React from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { exportToJSON } from '../utils/export';

interface ExportButtonProps {
  data: unknown;
  fileName?: string;
  onExport?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function ExportButton({
  data,
  fileName,
  onExport,
  className = '',
  loading = false,
  disabled = false
}: ExportButtonProps) {
  const handleExport = () => {
    try {
      exportToJSON(data, { fileName });
      onExport?.();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={loading || disabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gray-800 text-white rounded-lg
        hover:bg-gray-700 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Export Data
    </motion.button>
  );
}