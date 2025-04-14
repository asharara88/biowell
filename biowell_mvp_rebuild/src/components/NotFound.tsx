import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6"
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-900/30 rounded-full">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-400 text-center mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-biowellGreen text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}