import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { Pill, Brain, Calendar } from 'lucide-react';

interface WellnessStackProps {
  title: string;
  supplements?: string[];
  habits?: string[];
  coachingFocus?: string[];
  className?: string;
}

export default function WellnessStack({
  title,
  supplements = [],
  habits = [],
  coachingFocus = [],
  className = ''
}: WellnessStackProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 ${className}`}
    >
      <h3 className="font-semibold text-xl text-center text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {/* Supplements Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-5 h-5 text-biowellGreen" />
            <h4 className="text-lg font-semibold text-white">
              {t('stacks.components.supplements')}
            </h4>
          </div>
          <ul className="space-y-1">
            {supplements.map((supplement, index) => (
              <li key={index} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen"></span>
                {supplement}
              </li>
            ))}
          </ul>
        </div>

        {/* Habits Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-biowellBlue" />
            <h4 className="text-lg font-semibold text-white">
              {t('stacks.components.habits')}
            </h4>
          </div>
          <ul className="space-y-1">
            {habits.map((habit, index) => (
              <li key={index} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellBlue"></span>
                {habit}
              </li>
            ))}
          </ul>
        </div>

        {/* Coaching Focus Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-biowellLightBlue" />
            <h4 className="text-lg font-semibold text-white">
              {t('stacks.components.coachFocus')}
            </h4>
          </div>
          <ul className="space-y-1">
            {coachingFocus.map((focus, index) => (
              <li key={index} className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellLightBlue"></span>
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="mt-6 w-full bg-biowellGreen text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 font-medium">
        {t('common.learnMore')}
      </button>
    </motion.div>
  );
}