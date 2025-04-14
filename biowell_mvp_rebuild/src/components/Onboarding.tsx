import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useGamificationStore } from '../store/gamificationStore';
import { supabase } from '../api/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Onboarding = () => {
  const navigate = useNavigate();
  const { setGoals, setTrackingMethod, saveUserPreferences, isLoading } = useUser();
  const { addPoints, completeAchievement } = useGamificationStore();
  const [selectedGoal, setSelectedGoal] = useState('Sleep');
  const [selectedMethod, setSelectedMethod] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoal(e.target.value);
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(e.target.value);
  };

  const handleOnboardingSubmit = async () => {
    if (isLoading || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update context values
      setGoals(selectedGoal);
      setTrackingMethod(selectedMethod);
      
      // Save preferences directly to Supabase
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
          goals: JSON.stringify({ primary: selectedGoal }),
          tracking_method: selectedMethod
        });

      if (upsertError) throw upsertError;
      
      // Also save to localStorage as backup
      localStorage.setItem('userGoals', selectedGoal);
      localStorage.setItem('userTrackingMethod', selectedMethod);
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Award points for completing onboarding
      addPoints(25, 'milestone', 'Completed initial setup');
      
      // Complete profile achievement
      completeAchievement('complete_profile');
      
      toast.success('Setup completed successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto py-12"
      >
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Setup</h2>
          <p className="text-gray-400 mb-8">
            Let's personalize your BIOWELL experience with a few quick questions.
          </p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {/* Goal Selection */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Select your primary wellness goal:
            </label>
            <select
              value={selectedGoal}
              onChange={handleGoalChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            >
              <option value="Sleep">Improve Sleep</option>
              <option value="Energy">Boost Energy</option>
              <option value="Mood">Enhance Mood</option>
              <option value="Fitness">Optimize Fitness</option>
              <option value="Cognitive">Mental Performance</option>
              <option value="Longevity">Longevity</option>
            </select>
          </div>

          {/* Tracking Method Selection */}
          <div className="mb-8">
            <label className="block text-white font-medium mb-2">
              Preferred tracking method:
            </label>
            <select
              value={selectedMethod}
              onChange={handleMethodChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            >
              <option value="manual">Manual Tracking</option>
              <option value="wearable">Wearable Device Sync</option>
              <option value="both">Both Methods</option>
            </select>
          </div>

          <button
            onClick={handleOnboardingSubmit}
            disabled={isSubmitting || isLoading}
            className="w-full py-3 bg-biowellGreen text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            You can always change these preferences later in your settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;