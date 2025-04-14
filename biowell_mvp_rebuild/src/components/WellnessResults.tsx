import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Pill, 
  Calendar, 
  Clock, 
  Moon, 
  Activity, 
  Brain, 
  Heart, 
  Download,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface WellnessResultsProps {
  data?: {
    name?: string;
    priorities?: string[];
    score?: number;
  };
}

export default function WellnessResults({ data }: WellnessResultsProps) {
  // Sample data for demonstration
  const recommendations = {
    supplements: [
      { name: "Magnesium Glycinate", dosage: "400mg", timing: "Evening", purpose: "Sleep quality, stress reduction" },
      { name: "Vitamin D3", dosage: "5000 IU", timing: "Morning with food", purpose: "Immune support, mood" },
      { name: "Omega-3 (EPA/DHA)", dosage: "2g", timing: "With meals", purpose: "Cognitive function, inflammation" },
      { name: "Ashwagandha", dosage: "600mg", timing: "Evening", purpose: "Stress management, sleep" }
    ],
    habits: [
      { name: "Morning sunlight exposure", frequency: "Daily", duration: "10-15 minutes", impact: "Circadian rhythm, energy" },
      { name: "Post-meal walking", frequency: "After main meals", duration: "5-10 minutes", impact: "Glucose management" },
      { name: "Deep breathing practice", frequency: "2x daily", duration: "5 minutes", impact: "Stress reduction" },
      { name: "Digital sunset", frequency: "Daily", duration: "1 hour before bed", impact: "Sleep quality" }
    ],
    metrics: {
      wellnessScore: 78,
      sleepScore: 72,
      energyScore: 75,
      stressScore: 68,
      nutritionScore: 82
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-biowellGreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-biowellGreen" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Personalized Wellness Blueprint</h2>
        <p className="text-gray-400">
          Based on your profile, we've created a tailored wellness plan to help you achieve your goals.
        </p>
      </div>

      {/* Wellness Score */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Your Wellness Score</h3>
        <div className="flex items-center justify-between">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#1F2937" 
                strokeWidth="10" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#4CAF50" 
                strokeWidth="10" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * recommendations.metrics.wellnessScore / 100)} 
                transform="rotate(-90 50 50)" 
              />
              <text 
                x="50" 
                y="55" 
                textAnchor="middle" 
                fill="white" 
                fontSize="24" 
                fontWeight="bold"
              >
                {recommendations.metrics.wellnessScore}
              </text>
            </svg>
          </div>
          <div className="flex-1 ml-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <Moon className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-gray-300">Sleep</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${recommendations.metrics.sleepScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Activity className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-gray-300">Energy</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${recommendations.metrics.energyScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Brain className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-gray-300">Stress</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full" 
                    style={{ width: `${recommendations.metrics.stressScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Heart className="w-4 h-4 text-red-400 mr-2" />
                  <span className="text-gray-300">Nutrition</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full" 
                    style={{ width: `${recommendations.metrics.nutritionScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Supplement Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Pill className="w-6 h-6 text-biowellGreen mr-2" />
            <h3 className="text-xl font-semibold text-white">Supplement Stack</h3>
          </div>
          
          <div className="space-y-4">
            {recommendations.supplements.map((supplement, index) => (
              <div key={index} className="border-b border-gray-700 pb-3 last:border-0">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">{supplement.name}</h4>
                  <span className="text-biowellGreen">{supplement.dosage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {supplement.timing}
                  </div>
                  <span className="text-gray-400">{supplement.purpose}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Habit Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-biowellGreen mr-2" />
            <h3 className="text-xl font-semibold text-white">Habit Stack</h3>
          </div>
          
          <div className="space-y-4">
            {recommendations.habits.map((habit, index) => (
              <div key={index} className="border-b border-gray-700 pb-3 last:border-0">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">{habit.name}</h4>
                  <span className="text-biowellGreen">{habit.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {habit.duration}
                  </div>
                  <span className="text-gray-400">{habit.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <Download className="w-5 h-5" />
          Download Full Report
        </button>
        
        <Link 
          to="/dashboard" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}