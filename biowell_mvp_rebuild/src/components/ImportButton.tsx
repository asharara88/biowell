import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import { readJSONFile } from '../utils/export';

interface ImportButtonProps {
  onImport: (data: unknown) => void;
  onError?: (error: Error) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  accept?: string;
}

export default function ImportButton({
  onImport,
  onError,
  className = '',
  loading = false,
  disabled = false,
  accept = 'application/json'
}: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJSONFile(file);
      onImport(data);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Import failed'));
    } finally {
      // Reset input value to allow importing the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
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
          <Upload className="w-4 h-4" />
        )}
        Import Data
      </motion.button>
    </>
  );
}