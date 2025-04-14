import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Activity, 
  Brain, 
  Scale, 
  Dumbbell, 
  Heart, 
  Clock, 
  Briefcase, 
  Plane, 
  Utensils, 
  Pill,
  ArrowRight,
  CheckSquare,
  Square,
  User
} from 'lucide-react';

interface WellnessFormData {
  // Wellness Priorities
  sleepPriorities: string[];
  physicalPriorities: string[];
  mentalPriorities: string[];
  
  // Lifestyle
  workHours: string;
  jobType: string;
  exerciseFrequency: string;
  socialCommitments: string;
  travel: string;
  hobbies: string;
  stressLevel: string;
  
  // Health Metrics
  age: string;
  height: string;
  weight: string;
  gender: string;
  bodyFat: string;
  restingHeartRate: string;
  averageSleep: string;
  stepsPerDay: string;
  
  // Nutrition
  mealsPerDay: string;
  dietaryStyle: string;
  foodRestrictions: string;
  mealTimes: string;
  currentSupplements: string;
}

interface WellnessProfileFormProps {
  onSubmit: (data: WellnessFormData) => void;
}

export default function WellnessProfileForm({ onSubmit }: WellnessProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WellnessFormData>({
    // Wellness Priorities
    sleepPriorities: [],
    physicalPriorities: [],
    mentalPriorities: [],
    
    // Lifestyle
    workHours: '',
    jobType: 'Sedentary',
    exerciseFrequency: '',
    socialCommitments: '',
    travel: '',
    hobbies: '',
    stressLevel: '5',
    
    // Health Metrics
    age: '',
    height: '',
    weight: '',
    gender: '',
    bodyFat: '',
    restingHeartRate: '',
    averageSleep: '',
    stepsPerDay: '',
    
    // Nutrition
    mealsPerDay: '',
    dietaryStyle: 'Omnivore',
    foodRestrictions: '',
    mealTimes: '',
    currentSupplements: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'sleepPriorities' | 'physicalPriorities' | 'mentalPriorities', value: string) => {
    setFormData(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [category]: newValues };
    });
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderCheckbox = (
    category: 'sleepPriorities' | 'physicalPriorities' | 'mentalPriorities',
    value: string,
    label: string
  ) => {
    const isChecked = formData[category].includes(value);
    return (
      <div className="flex items-center mb-2">
        <button
          type="button"
          onClick={() => handleCheckboxChange(category, value)}
          className="flex items-center focus:outline-none"
        >
          {isChecked ? (
            <CheckSquare className="w-5 h-5 text-biowellGreen mr-2" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 mr-2" />
          )}
          <span className="text-gray-300">{label}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Personalized Wellness Profile</h2>
      
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step}
              className={`relative flex flex-col items-center ${
                step <= currentStep ? 'text-biowellGreen' : 'text-gray-500'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step <= currentStep ? 'border-biowellGreen bg-biowellGreen/10' : 'border-gray-700'
              }`}>
                {step}
              </div>
              <div className="text-xs mt-2 text-center">
                {step === 1 && 'Priorities'}
                {step === 2 && 'Lifestyle'}
                {step === 3 && 'Health'}
                {step === 4 && 'Nutrition'}
              </div>
              {step < 4 && (
                <div className={`absolute top-5 left-full w-full h-0.5 -z-10 ${
                  step < currentStep ? 'bg-biowellGreen' : 'bg-gray-700'
                }`} style={{ width: 'calc(100% - 2.5rem)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Wellness Priorities */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">1. WELLNESS PRIORITIES</h3>
            <p className="text-gray-400 mb-6">Select up to 3 primary goals, ranking them in order of importance (1 = highest priority)</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sleep Priorities */}
              <div className="bg-gray-800 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <Moon className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="text-lg font-medium text-white">Sleep</h4>
                </div>
                
                {renderCheckbox('sleepPriorities', 'fall_asleep_faster', 'Fall asleep faster')}
                {renderCheckbox('sleepPriorities', 'improve_sleep_quality', 'Improve sleep quality')}
                {renderCheckbox('sleepPriorities', 'better_morning_energy', 'Better morning energy')}
                {renderCheckbox('sleepPriorities', 'consistent_sleep', 'Consistent sleep schedule')}
              </div>
              
              {/* Physical Priorities */}
              <div className="bg-gray-800 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="text-lg font-medium text-white">Physical</h4>
                </div>
                
                {renderCheckbox('physicalPriorities', 'weight_management', 'Weight management')}
                {renderCheckbox('physicalPriorities', 'muscle_building', 'Muscle building')}
                {renderCheckbox('physicalPriorities', 'cardio_fitness', 'Cardio fitness')}
                {renderCheckbox('physicalPriorities', 'strength_gains', 'Strength gains')}
                {renderCheckbox('physicalPriorities', 'sports_performance', 'Sports performance')}
                {renderCheckbox('physicalPriorities', 'flexibility', 'Flexibility/mobility')}
              </div>
              
              {/* Mental Priorities */}
              <div className="bg-gray-800 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <Brain className="w-5 h-5 text-purple-400 mr-2" />
                  <h4 className="text-lg font-medium text-white">Mental</h4>
                </div>
                
                {renderCheckbox('mentalPriorities', 'stress_reduction', 'Stress reduction')}
                {renderCheckbox('mentalPriorities', 'enhanced_focus', 'Enhanced focus')}
                {renderCheckbox('mentalPriorities', 'emotional_wellbeing', 'Emotional wellbeing')}
                {renderCheckbox('mentalPriorities', 'less_anxiety', 'Less anxiety')}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Lifestyle Snapshot */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">2. LIFESTYLE SNAPSHOT</h3>
            <p className="text-gray-400 mb-6">Tell us about your daily routine and lifestyle factors</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Briefcase className="w-5 h-5 text-biowellGreen mr-2" />
                    Work hours (e.g., 9-5, 5 days/week)
                  </label>
                  <input
                    type="text"
                    name="workHours"
                    value={formData.workHours}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="Start-End, Days/week"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Activity className="w-5 h-5 text-biowellGreen mr-2" />
                    Job type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                  >
                    <option value="Sedentary">Sedentary</option>
                    <option value="Active">Active</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Dumbbell className="w-5 h-5 text-biowellGreen mr-2" />
                    Exercise frequency (times/week)
                  </label>
                  <input
                    type="text"
                    name="exerciseFrequency"
                    value={formData.exerciseFrequency}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 3"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Heart className="w-5 h-5 text-biowellGreen mr-2" />
                    Social commitments (hours/week)
                  </label>
                  <input
                    type="text"
                    name="socialCommitments"
                    value={formData.socialCommitments}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 10"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Plane className="w-5 h-5 text-biowellGreen mr-2" />
                    Travel (days/month)
                  </label>
                  <input
                    type="text"
                    name="travel"
                    value={formData.travel}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 5"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Activity className="w-5 h-5 text-biowellGreen mr-2" />
                    Hobbies (main activities)
                  </label>
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., reading, hiking, cooking"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
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
                      value={formData.stressLevel}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-biowellGreen"
                    />
                    <span className="text-gray-400 ml-4">High (10)</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-white font-medium">{formData.stressLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Health Metrics */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">3. HEALTH METRICS</h3>
            <p className="text-gray-400 mb-6">Share your health metrics for more personalized recommendations</p>
            
            <div className="bg-gray-800 p-5 rounded-lg mb-6">
              <h4 className="text-lg font-medium text-white mb-4">Required Information</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Age (Years)</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 35"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Height (ft/in or cm)</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 5'10 or 178cm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Weight (lbs or kg)</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 160lbs or 73kg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <User className="w-5 h-5 text-biowellGreen mr-2" />
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('Male')}
                      className={`py-3 px-4 rounded-lg text-center transition-colors ${
                        formData.gender === 'Male'
                          ? 'bg-biowellGreen/20 border-2 border-biowellGreen text-white'
                          : 'bg-gray-700 border-2 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('Female')}
                      className={`py-3 px-4 rounded-lg text-center transition-colors ${
                        formData.gender === 'Female'
                          ? 'bg-biowellGreen/20 border-2 border-biowellGreen text-white'
                          : 'bg-gray-700 border-2 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Optional Information (if available)</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Body fat %</label>
                  <input
                    type="text"
                    name="bodyFat"
                    value={formData.bodyFat}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 18%"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Resting heart rate (BPM)</label>
                  <input
                    type="text"
                    name="restingHeartRate"
                    value={formData.restingHeartRate}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 65"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Average sleep duration (Hours)</label>
                  <input
                    type="text"
                    name="averageSleep"
                    value={formData.averageSleep}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 7.5"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Steps per day</label>
                  <input
                    type="text"
                    name="stepsPerDay"
                    value={formData.stepsPerDay}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 8000"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 4: Nutrition Profile */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">4. NUTRITION PROFILE</h3>
            <p className="text-gray-400 mb-6">Tell us about your eating habits and preferences</p>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Utensils className="w-5 h-5 text-biowellGreen mr-2" />
                    Meals per day
                  </label>
                  <input
                    type="text"
                    name="mealsPerDay"
                    value={formData.mealsPerDay}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                    placeholder="E.g., 3"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Leaf className="w-5 h-5 text-biowellGreen mr-2" />
                    Dietary style
                  </label>
                  <select
                    name="dietaryStyle"
                    value={formData.dietaryStyle}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                  >
                    <option value="Omnivore">Omnivore</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Pescatarian">Pescatarian</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Utensils className="w-5 h-5 text-biowellGreen mr-2" />
                  Food restrictions or allergies
                </label>
                <textarea
                  name="foodRestrictions"
                  value={formData.foodRestrictions}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none resize-none h-24"
                  placeholder="List any food restrictions or allergies"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Clock className="w-5 h-5 text-biowellGreen mr-2" />
                  Preferred meal times
                </label>
                <input
                  type="text"
                  name="mealTimes"
                  value={formData.mealTimes}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                  placeholder="E.g., Breakfast 7-8am, Lunch 12-1pm, Dinner 6-7pm"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Pill className="w-5 h-5 text-biowellGreen mr-2" />
                  Current supplements
                </label>
                <textarea
                  name="currentSupplements"
                  value={formData.currentSupplements}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none resize-none h-24"
                  placeholder="List any supplements you currently take"
                ></textarea>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
            >
              Create My Wellness Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}