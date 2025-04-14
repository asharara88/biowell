import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Activity, Dumbbell, Heart, Plane, Brain } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepLifestyleSnapshotProps {
  next: () => void;
  back: () => void;
}

export default function StepLifestyleSnapshot({ next, back }: StepLifestyleSnapshotProps) {
  const { data, setData } = useOnboarding();
  const [lifestyle, setLifestyle] = useState({
    workHours: data.workHours || '',
    jobType: data.jobType || 'Sedentary',
    exerciseFrequency: data.exerciseFrequency || '',
    socialCommitments: data.socialCommitments || '',
    travel: data.travel || '',
    hobbies: data.hobbies || '',
    stressLevel: data.stressLevel || '5'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLifestyle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setData({
      workHours: lifestyle.workHours,
      jobType: lifestyle.jobType,
      exerciseFrequency: lifestyle.exerciseFrequency,
      socialCommitments: lifestyle.socialCommitments,
      travel: lifestyle.travel,
      hobbies: lifestyle.hobbies,
      stressLevel: lifestyle.stressLevel
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
        Lifestyle Snapshot
      </h2>
      <p className="text-gray-400 mb-6">
        Tell us about your daily routine and lifestyle factors
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Briefcase className="w-5 h-5 text-biowellGreen mr-2" />
              Work hours
            </label>
            <input
              type="text"
              name="workHours"
              value={lifestyle.workHours}
              onChange={handleChange}
              placeholder="Start-End, Days/week"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Activity className="w-5 h-5 text-biowellGreen mr-2" />
              Job type
            </label>
            <select
              name="jobType"
              value={lifestyle.jobType}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Active">Active</option>
              <option value="Mixed">Mixed</option>
            </select>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Dumbbell className="w-5 h-5 text-biowellGreen mr-2" />
              Exercise frequency
            </label>
            <input
              type="text"
              name="exerciseFrequency"
              value={lifestyle.exerciseFrequency}
              onChange={handleChange}
              placeholder="X times/week"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Heart className="w-5 h-5 text-biowellGreen mr-2" />
              Social commitments
            </label>
            <input
              type="text"
              name="socialCommitments"
              value={lifestyle.socialCommitments}
              onChange={handleChange}
              placeholder="Hours/week"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Plane className="w-5 h-5 text-biowellGreen mr-2" />
              Travel
            </label>
            <input
              type="text"
              name="travel"
              value={lifestyle.travel}
              onChange={handleChange}
              placeholder="Days/month"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <label className="flex items-center text-gray-300">
              <Activity className="w-5 h-5 text-biowellGreen mr-2" />
              Hobbies
            </label>
            <input
              type="text"
              name="hobbies"
              value={lifestyle.hobbies}
              onChange={handleChange}
              placeholder="List main activities"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
            />
          </motion.div>
        </div>

        <motion.div variants={item} className="space-y-4">
          <label className="flex items-center text-gray-300">
            <Brain className="w-5 h-5 text-biowellGreen mr-2" />
            Current stress level (1-10)
          </label>
          <div className="flex items-center">
            <span className="text-gray-400 mr-4">Low (1)</span>
            <input
              type="range"
              name="stressLevel"
              min="1"
              max="10"
              value={lifestyle.stressLevel}
              onChange={handleChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-biowellGreen"
            />
            <span className="text-gray-400 ml-4">High (10)</span>
          </div>
          <div className="text-center text-white font-medium">
            {lifestyle.stressLevel}
          </div>
        </motion.div>

        <motion.div variants={item} className="pt-4">
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