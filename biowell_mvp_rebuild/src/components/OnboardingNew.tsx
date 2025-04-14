import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Moon, 
  Dumbbell, 
  Heart, 
  Zap, 
  Loader2, 
  Watch, 
  Smartphone,
  Activity
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useGamificationStore } from '../store/gamificationStore';
import { supabase } from '../api/client';
import { toast } from 'react-toastify';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

const OnboardingNew: React.FC = () => {
  const navigate = useNavigate();
  const { setGoals, setTrackingMethod, setHasCompletedOnboarding } = useUser();
  const { addPoints, completeAchievement } = useGamificationStore();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTrackingMethod, setSelectedTrackingMethod] = useState<string>('manual');
  
  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to BIOWELL',
      description: 'Let\'s personalize your wellness journey in just a few steps.'
    },
    {
      id: 'goals',
      title: 'What\'s your primary wellness goal?',
      description: 'This helps us tailor your experience to what matters most to you.'
    },
    {
      id: 'tracking',
      title: 'How would you like to track your progress?',
      description: 'Connect your devices or track manually - it\'s up to you.'
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Your personalized wellness journey is ready to begin.'
    }
  ];
  
  // Define the wellness goals
  const wellnessGoals = [
    {
      id: 'sleep',
      title: 'Improve Sleep',
      description: 'Optimize sleep quality and duration',
      icon: <Moon className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-400/10'
    },
    {
      id: 'energy',
      title: 'Boost Energy',
      description: 'Enhance daily vitality and focus',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-400 bg-yellow-400/10'
    },
    {
      id: 'cognitive',
      title: 'Mental Clarity',
      description: 'Improve focus and cognitive function',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-purple-400 bg-purple-400/10'
    },
    {
      id: 'fitness',
      title: 'Physical Performance',
      description: 'Enhance strength and endurance',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'text-green-400 bg-green-400/10'
    },
    {
      id: 'wellness',
      title: 'Overall Wellness',
      description: 'Optimize general health and vitality',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-red-400 bg-red-400/10'
    }
  ];
  
  // Define tracking methods
  const trackingMethods = [
    {
      id: 'manual',
      title: 'Manual Tracking',
      description: 'Log your activities and metrics manually',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'text-gray-400 bg-gray-400/10'
    },
    {
      id: 'wearable',
      title: 'Wearable Devices',
      description: 'Connect your fitness trackers and health devices',
      icon: <Watch className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-400/10'
    },
    {
      id: 'both',
      title: 'Combined Approach',
      description: 'Use both manual tracking and connected devices',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-green-400 bg-green-400/10'
    }
  ];
  
  const currentStep = steps[currentStepIndex];
  
  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStepIndex === 1 && !selectedGoal) {
      toast.warning('Please select a wellness goal to continue');
      return;
    }
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };
  
  const handleTrackingMethodSelect = (methodId: string) => {
    setSelectedTrackingMethod(methodId);
  };
  
  const handleComplete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Set the selected goal and tracking method
      if (selectedGoal) {
        setGoals(selectedGoal);
      }
      
      setTrackingMethod(selectedTrackingMethod);
      
      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
          goals: JSON.stringify({ 
            primary: selectedGoal,
            selectedGoals: [selectedGoal]
          }),
          tracking_method: selectedTrackingMethod
        });
      
      if (error) throw error;
      
      // Save to localStorage
      localStorage.setItem('userGoals', selectedGoal || 'wellness');
      localStorage.setItem('userTrackingMethod', selectedTrackingMethod);
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Mark onboarding as completed
      setHasCompletedOnboarding(true);
      
      // Award points for completing onboarding
      addPoints(50, 'milestone', 'Completed onboarding');
      
      // Complete profile achievement
      completeAchievement('complete_profile');
      
      // Show success message
      toast.success('Setup completed successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Progress percentage for the progress bar
  const progressPercentage = ((currentStepIndex) / (steps.length - 1)) * 100;
  
  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <div className="max-w-3xl mx-auto py-12">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-biowellGreen"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl"
        >
          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep.id === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-biowellGreen/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-biowellGreen" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{currentStep.title}</h2>
                <p className="text-gray-300 mb-8">{currentStep.description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                  <h3 className="text-xl font-semibold text-white mb-4">What to expect:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-biowellGreen font-semibold">1</span>
                      </div>
                      <span className="text-gray-300">Choose your primary wellness goal</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-biowellGreen font-semibold">2</span>
                      </div>
                      <span className="text-gray-300">Select how you want to track your progress</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-biowellGreen font-semibold">3</span>
                      </div>
                      <span className="text-gray-300">Get your personalized wellness plan</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-gray-400 text-sm mb-8">
                  This will take less than a minute to complete. Your information helps us create a truly personalized experience.
                </p>
              </motion.div>
            )}
            
            {/* Goals Step */}
            {currentStep.id === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">{currentStep.title}</h2>
                <p className="text-gray-400 mb-8">{currentStep.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wellnessGoals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ y: -5 }}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`flex items-start p-4 rounded-xl border-2 transition-all text-left ${
                        selectedGoal === goal.id
                          ? `${goal.color} border-current`
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${goal.color} mr-4`}>
                        {goal.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {goal.title}
                        </h3>
                        <p className="text-sm text-gray-400">{goal.description}</p>
                      </div>
                      {selectedGoal === goal.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-full ml-auto mt-2 ${goal.color.replace('text-', 'bg-').replace('/10', '')}`}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Tracking Method Step */}
            {currentStep.id === 'tracking' && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-2">{currentStep.title}</h2>
                <p className="text-gray-400 mb-6">{currentStep.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {trackingMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ y: -5 }}
                      onClick={() => handleTrackingMethodSelect(method.id)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        selectedTrackingMethod === method.id
                          ? `${method.color} border-current`
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${method.color} mb-3`}>
                        {method.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-400 text-center">{method.description}</p>
                      {selectedTrackingMethod === method.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-full mt-2 ${method.color.replace('text-', 'bg-').replace('/10', '')}`}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Complete Step */}
            {currentStep.id === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{currentStep.title}</h2>
                <p className="text-gray-300 mb-8">{currentStep.description}</p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Personalized Setup:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-biowellGreen mr-3 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Primary Goal:</span>
                        <span className="text-gray-300 ml-2">
                          {wellnessGoals.find(g => g.id === selectedGoal)?.title || 'Overall Wellness'}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-biowellGreen mr-3 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Tracking Method:</span>
                        <span className="text-gray-300 ml-2">
                          {trackingMethods.find(m => m.id === selectedTrackingMethod)?.title || 'Manual Tracking'}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <p className="text-gray-400 text-sm mb-8">
                  You can update these preferences anytime from your settings. Your dashboard has been personalized based on your selections.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 pt-4 border-t border-gray-800">
            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  <>
                    Start My Wellness Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OnboardingNew;