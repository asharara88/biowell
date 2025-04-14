import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StepWelcomeProps {
  next: () => void;
  updateFormData: (data: Record<string, unknown>) => void;
}

export default function StepWelcome({ next, updateFormData }: StepWelcomeProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-biowellGreen bg-opacity-10 flex items-center justify-center"
      >
        <Sparkles className="w-10 h-10 text-biowellGreen" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white mb-4"
      >
        Welcome to BIOWELL
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-300 mb-8"
      >
        Let's create your personalized wellness profile in just a few simple steps.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6 mb-8 text-left"
      >
        <h3 className="text-xl font-semibold text-white mb-4">What to expect:</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-biowellGreen font-semibold">1</span>
            </div>
            <span className="text-gray-300">Set your health and wellness goals</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-biowellGreen font-semibold">2</span>
            </div>
            <span className="text-gray-300">Share basic health information</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-biowellGreen font-semibold">3</span>
            </div>
            <span className="text-gray-300">Tell us about your nutrition preferences</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-biowellGreen font-semibold">4</span>
            </div>
            <span className="text-gray-300">Receive your personalized wellness plan</span>
          </li>
        </ul>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 mb-8 text-sm"
      >
        This will take about 2 minutes to complete. Your information helps us create a truly personalized experience.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        onClick={next}
        className="w-full bg-biowellGreen text-black font-semibold py-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
      >
        Let's Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </motion.button>
    </div>
  );
}