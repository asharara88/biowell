import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Save, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import { toast } from 'react-toastify';
import GoalSelector from './GoalSelector';
import { supabase } from '../api/client';
import { useUser } from '../context/UserContext';

interface GoalManagementProps {
  userId?: string;
  className?: string;
  onSave?: (goals: string[]) => void;
}

const GoalManagement: React.FC<GoalManagementProps> = ({ 
  userId = '550e8400-e29b-41d4-a716-446655440000',
  className = '',
  onSave
}) => {
  const { setGoals } = useUser();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load saved goals on component mount
  useEffect(() => {
    loadSavedGoals();
  }, [userId]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadSavedGoals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('goals')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data?.goals) {
        let parsedGoals;
        if (typeof data.goals === 'string') {
          try {
            parsedGoals = JSON.parse(data.goals);
          } catch (e) {
            console.warn('Error parsing goals:', e);
            return;
          }
        } else {
          parsedGoals = data.goals;
        }

        if (parsedGoals.selectedGoals && Array.isArray(parsedGoals.selectedGoals)) {
          setSelectedGoals(parsedGoals.selectedGoals);
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load your saved goals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalsChange = (goals: string[]) => {
    setSelectedGoals(goals);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update primary goal in user context
      if (selectedGoals.length > 0) {
        setGoals(selectedGoals[0]);
      }
      
      // Save to localStorage
      if (selectedGoals.length > 0) {
        localStorage.setItem('userGoals', selectedGoals[0]);
      }
      
      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          goals: JSON.stringify({
            selectedGoals,
            primary: selectedGoals[0] || null
          })
        });

      if (error) {
        throw error;
      }

      setSuccess('Your goals have been saved successfully');
      toast.success('Goals saved successfully');
      
      if (onSave) {
        onSave(selectedGoals);
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      setError('Failed to save your goals. Please try again.');
      toast.error('Failed to save goals');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
            <Target className="w-5 h-5 text-biowellGreen" />
          </div>
          <h2 className="text-xl font-semibold text-white">Manage Your Goals</h2>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2 shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-start"
        >
          <CheckCircle className="w-5 h-5 text-green-400 mr-2 shrink-0 mt-0.5" />
          <p className="text-green-200 text-sm">{success}</p>
        </motion.div>
      )}

      <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <p className="text-blue-300 text-sm">
              You can select up to 3 wellness goals and prioritize them in order of importance.
              Your primary goal (highest priority) will be used to personalize your dashboard and recommendations.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
        </div>
      ) : (
        <GoalSelector 
          onGoalsChange={handleGoalsChange}
          maxGoals={3}
          userId={userId}
        />
      )}
    </div>
  );
};

export default GoalManagement;