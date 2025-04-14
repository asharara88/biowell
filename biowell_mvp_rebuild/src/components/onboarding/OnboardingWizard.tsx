import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useGamificationStore } from '../../store/gamificationStore';

// Import simplified step components
import StepWelcome from './steps/StepWelcome';
import StepGoals from './steps/StepGoals';
import StepHealthMetrics from './steps/StepHealthMetrics';
import StepNutritionProfile from './steps/StepNutritionProfile';
import StepFinish from './steps/StepFinish';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome',
    component: StepWelcome
  },
  {
    id: 'goals',
    title: 'Goals',
    component: StepGoals
  },
  {
    id: 'health',
    title: 'Health',
    component: StepHealthMetrics
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    component: StepNutritionProfile
  },
  {
    id: 'finish',
    title: 'Complete',
    component: StepFinish
  }
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const navigate = useNavigate();
  const { addPoints, completeAchievement } = useGamificationStore();
  
  const StepComponent = steps[currentStep].component;
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const updateFormData = (data: Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Complete profile achievement
      completeAchievement('complete_profile');
      
      // Award points for completing onboarding
      addPoints(50, 'achievement', 'Completed onboarding process');
      
      // Mark onboarding as completed in localStorage
      localStorage.setItem('onboardingCompleted', 'true');
      
      navigate('/dashboard');
    }
  };

  const back = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const skipToEnd = () => {
    setCurrentStep(steps.length - 1);
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar progress={progress} />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= index
                    ? 'bg-biowellGreen text-black'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs text-gray-400 mt-2">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl"
        >
          <AnimatePresence mode="wait">
            <StepComponent 
              next={next} 
              back={back} 
              skip={skipToEnd}
              formData={formData}
              updateFormData={updateFormData}
            />
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 ? (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={back}
              className="flex items-center px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </motion.button>
          ) : (
            <div />
          )}
          
          {currentStep !== steps.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={next}
              className="flex items-center px-6 py-3 rounded-lg bg-biowellGreen text-black hover:bg-opacity-90 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}