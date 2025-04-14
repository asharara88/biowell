import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle,
  Info,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MultiGoalSelector from '../components/MultiGoalSelector';
import { useUser } from '../context/UserContext';
import { useGamificationStore } from '../store/gamificationStore';
import { supabase } from '../api/client';

const GoalSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setGoals, setHasCompletedOnboarding } = useUser();
  const { addPoints, completeAchievement } = useGamificationStore();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleGoalsChange = (goals: string[]) => {
    setSelectedGoals(goals);
  };
  
  const handleSkip = () => {
    toast.info('Goal selection skipped. You can set your goals later.');
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Set primary goal (first in the list)
      if (selectedGoals.length > 0) {
        setGoals(selectedGoals[0]);
      }
      
      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
          goals: JSON.stringify({
            selectedGoals,
            primary: selectedGoals[0] || null
          })
        });
      
      if (error) throw error;
      
      // Save to localStorage
      if (selectedGoals.length > 0) {
        localStorage.setItem('userGoals', selectedGoals[0]);
      }
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Mark onboarding as completed
      setHasCompletedOnboarding(true);
      
      // Award points for completing goal setup
      addPoints(25, 'milestone', 'Set wellness goals');
      
      // Complete profile achievement if not already done
      completeAchievement('complete_profile');
      
      toast.success('Goals saved successfully!');
      
      // Move to confirmation step
      setStep(2);
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <Helmet>
        <title>Set Your Wellness Goals | BIOWELL</title>
        <meta name="description" content="Select and prioritize your wellness goals to personalize your BIOWELL experience." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl"
        >
          {step === 1 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
                    <Target className="w-5 h-5 text-biowellGreen" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Set Your Wellness Goals</h1>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Skip for now
                </button>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg mb-8">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-300 text-sm">
                      You can select up to 3 wellness goals and prioritize them in order of importance. 
                      This helps us personalize your experience and recommendations.
                    </p>
                  </div>
                </div>
              </div>
              
              <MultiGoalSelector 
                onGoalsChange={handleGoalsChange}
                maxGoals={3}
                showSaveButton={false}
              />
              
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">Goals Saved Successfully!</h2>
                <p className="text-gray-300 mb-8">
                  Your wellness journey has been personalized based on your selected goals.
                </p>
                
                {selectedGoals.length > 0 ? (
                  <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Selected Goals:</h3>
                    <ol className="space-y-4">
                      {selectedGoals.map((goalId, index) => (
                        <li key={goalId} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-biowellGreen font-semibold">{index + 1}</span>
                          </div>
                          <span className="text-gray-300">
                            {goalId === 'sleep' && 'Improve Sleep'}
                            {goalId === 'energy' && 'Boost Energy'}
                            {goalId === 'cognitive' && 'Mental Clarity'}
                            {goalId === 'fitness' && 'Physical Performance'}
                            {goalId === 'wellness' && 'Overall Wellness'}
                            {goalId === 'longevity' && 'Longevity'}
                            {goalId === 'stress' && 'Stress Management'}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-6 mb-8 text-center">
                    <p className="text-gray-300">
                      No specific goals selected. We'll focus on overall wellness optimization.
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GoalSelectionPage;