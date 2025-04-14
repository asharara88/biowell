import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../../context/UserContext';
import PersonalizedDashboard from '../../components/PersonalizedDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isLoading, hasCompletedOnboarding } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-biowellGreen" />
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Complete Your Onboarding</h2>
          <p className="text-gray-400 mb-6">
            Please complete the onboarding process to access your personalized dashboard.
          </p>
          <a 
            href="/onboarding" 
            className="inline-block px-6 py-3 bg-biowellGreen text-black rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go to Onboarding
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-16">
      <Helmet>
        <title>Your Wellness Dashboard | BIOWELL</title>
        <meta name="description" content="Your personalized wellness dashboard with device connections, health metrics, and AI-powered recommendations." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Your Wellness Dashboard</h1>
          <p className="text-gray-400">Personalized insights and recommendations based on your goals and data</p>
        </motion.div>

        <PersonalizedDashboard />
      </div>
    </div>
  );
};

export default Dashboard;