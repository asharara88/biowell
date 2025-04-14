import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoalManagement from '../components/GoalManagement';

const GoalSettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-16 px-4 pb-16">
      <Helmet>
        <title>Manage Goals | BIOWELL</title>
        <meta name="description" content="Manage your wellness goals and priorities to personalize your BIOWELL experience." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8">
        <Link 
          to="/settings" 
          className="inline-flex items-center text-biowellGreen hover:text-biowellGreen/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Manage Your Goals</h1>
          <p className="text-gray-400">
            Select and prioritize your wellness goals to personalize your experience.
          </p>
        </motion.div>

        <GoalManagement />
      </div>
    </div>
  );
};

export default GoalSettingsPage;