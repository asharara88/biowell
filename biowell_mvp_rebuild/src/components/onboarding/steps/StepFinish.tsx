import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Brain, Moon, Utensils, ArrowRight, Target, Sparkles, Heart, Activity } from 'lucide-react';

interface StepFinishProps {
  next: () => void;
  formData: Record<string, unknown>;
}

export default function StepFinish({ next, formData }: StepFinishProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getGoalIcon = () => {
    switch (formData.goal) {
      case 'sleep':
        return <Moon className="w-5 h-5 text-blue-400" />;
      case 'cognitive':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'energy':
        return <Activity className="w-5 h-5 text-yellow-400" />;
      case 'fitness':
        return <Heart className="w-5 h-5 text-red-400" />;
      default:
        return <Target className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-biowellGreen bg-opacity-10 flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-biowellGreen" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Your Profile is Ready!
        </h2>
        <p className="text-gray-400">
          We've created your personalized wellness plan
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 mb-8"
      >
        {/* Profile Summary */}
        <motion.div
          variants={item}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Profile</h3>
            <div className="flex items-center text-sm text-gray-400">
              <Sparkles className="w-4 h-4 mr-1 text-biowellGreen" />
              Personalized
            </div>
          </div>

          <div className="space-y-4">
            {formData.goal && (
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center">
                  {getGoalIcon()}
                  <span className="ml-2 text-gray-300">Primary Goal</span>
                </div>
                <span className="text-white font-medium capitalize">{String(formData.goal)}</span>
              </div>
            )}

            {formData.height && formData.weight && (
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="ml-2 text-gray-300">Biometrics</span>
                </div>
                <span className="text-white font-medium">{formData.height}cm, {formData.weight}kg</span>
              </div>
            )}

            {formData.dietType && (
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 text-green-400" />
                  <span className="ml-2 text-gray-300">Diet Type</span>
                </div>
                <span className="text-white font-medium capitalize">{String(formData.dietType)}</span>
              </div>
            )}

            {formData.connectedDevices && Array.isArray(formData.connectedDevices) && formData.connectedDevices.length > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span className="ml-2 text-gray-300">Connected Devices</span>
                </div>
                <span className="text-white font-medium">{formData.connectedDevices.length} device(s)</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          variants={item}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">What's Next</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center mr-3">
                <Brain className="w-4 h-4 text-blue-400" />
              </div>
              Meet your AI Health Consultant
            </li>
            <li className="flex items-center text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              Set your first wellness goals
            </li>
            <li className="flex items-center text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center mr-3">
                <Sparkles className="w-4 h-4 text-green-400" />
              </div>
              Get personalized recommendations
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.button
        variants={item}
        onClick={next}
        className="w-full bg-biowellGreen text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
      >
        Start Your Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </motion.button>
    </div>
  );
}