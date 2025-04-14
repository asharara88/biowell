import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Moon, Brain, Scale, Ruler } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepBiometricsProps {
  next: () => void;
  back: () => void;
}

export default function StepBiometrics({ next, back }: StepBiometricsProps) {
  const { data, setData } = useOnboarding();
  const [biometrics, setBiometrics] = useState({
    height: data.height || '',
    weight: data.weight || '',
    age: data.age || '',
    restingHeartRate: data.restingHeartRate || '',
    sleepDuration: data.sleepDuration || '',
    stressLevel: data.stressLevel || '3'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBiometrics(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setData({
      height: biometrics.height,
      weight: biometrics.weight,
      age: biometrics.age,
      restingHeartRate: biometrics.restingHeartRate,
      sleepDuration: biometrics.sleepDuration,
      stressLevel: biometrics.stressLevel
    });
    next();
  };

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Your Health Metrics
      </h2>
      <p className="text-gray-400 mb-8">
        Share your current health metrics to help us personalize your recommendations
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-6">
          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Ruler className="w-5 h-5 text-biowellGreen mr-2" />
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={biometrics.height}
              onChange={handleChange}
              placeholder="e.g., 175"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Scale className="w-5 h-5 text-biowellGreen mr-2" />
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={biometrics.weight}
              onChange={handleChange}
              placeholder="e.g., 70"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Activity className="w-5 h-5 text-biowellGreen mr-2" />
              Age
            </label>
            <input
              type="number"
              name="age"
              value={biometrics.age}
              onChange={handleChange}
              placeholder="e.g., 35"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Heart className="w-5 h-5 text-biowellGreen mr-2" />
              Resting Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="restingHeartRate"
              value={biometrics.restingHeartRate}
              onChange={handleChange}
              placeholder="e.g., 65"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>
        </div>

        <motion.div variants={item} className="space-y-2">
          <label className="flex items-center text-gray-300">
            <Moon className="w-5 h-5 text-biowellGreen mr-2" />
            Average Sleep Duration (hours)
          </label>
          <input
            type="number"
            name="sleepDuration"
            value={biometrics.sleepDuration}
            onChange={handleChange}
            placeholder="e.g., 7.5"
            step="0.5"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
          />
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <label className="flex items-center text-gray-300">
            <Brain className="w-5 h-5 text-biowellGreen mr-2" />
            Stress Level (1-10)
          </label>
          <div className="flex items-center">
            <span className="text-gray-400 mr-4">Low</span>
            <input
              type="range"
              name="stressLevel"
              min="1"
              max="10"
              value={biometrics.stressLevel}
              onChange={handleChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-biowellGreen"
            />
            <span className="text-gray-400 ml-4">High</span>
          </div>
          <div className="text-center text-white font-medium">
            {biometrics.stressLevel}
          </div>
        </motion.div>

        <motion.div variants={item} className="pt-4">
          <p className="text-sm text-gray-400 mb-4">
            This information helps us create personalized recommendations. You can update these values anytime in your profile settings.
          </p>
          <button
            onClick={handleSubmit}
            className="w-full bg-biowellGreen text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}