import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Ruler, 
  Weight, 
  Watch, 
  Activity, 
  Target, 
  Clock, 
  Utensils, 
  Bell, 
  ArrowRight, 
  Loader2, 
  CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useGamificationStore } from '../store/gamificationStore';
import { supabase } from '../api/client';
import { toast } from 'react-toastify';
import DeviceConnection from './DeviceConnection';

interface FitnessProfileData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  age: string;
  height: string;
  weight: string;
  
  // Device Connections
  connectedDevices: string[];
  
  // Fitness Goals
  goals: string[];
  otherGoal: string;
  
  // Preferences
  workoutDays: string[];
  workoutTime: string;
  workoutDuration: string;
  exercisePreferences: string[];
  dietaryRestrictions: string;
  notificationPreferences: string[];
}

const FitnessProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setGoals, setTrackingMethod } = useUser();
  const { addPoints, completeAchievement } = useGamificationStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeviceConnector, setShowDeviceConnector] = useState(false);
  const [formData, setFormData] = useState<FitnessProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: '',
    height: '',
    weight: '',
    connectedDevices: [],
    goals: [],
    otherGoal: '',
    workoutDays: [],
    workoutTime: '',
    workoutDuration: '30',
    exercisePreferences: [],
    dietaryRestrictions: '',
    notificationPreferences: []
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name] as string[];
      return {
        ...prev,
        [name]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };
  
  const handleDeviceConnect = (deviceType: string, deviceName: string, connected: boolean) => {
    if (connected) {
      setFormData(prev => ({
        ...prev,
        connectedDevices: [...prev.connectedDevices, deviceName]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        connectedDevices: prev.connectedDevices.filter(device => device !== deviceName)
      }));
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Determine primary goal (first selected goal)
      const primaryGoal = formData.goals.length > 0 ? formData.goals[0] : 'General Fitness';
      
      // Determine tracking method based on connected devices
      const trackingMethod = formData.connectedDevices.length > 0 ? 'wearable' : 'manual';
      
      // Update context values
      setGoals(primaryGoal);
      setTrackingMethod(trackingMethod);
      
      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
          goals: JSON.stringify({
            primary: primaryGoal,
            all: formData.goals,
            other: formData.otherGoal
          }),
          tracking_method: trackingMethod
        });
      
      if (error) throw error;
      
      // Save to localStorage
      localStorage.setItem('userGoals', primaryGoal);
      localStorage.setItem('userTrackingMethod', trackingMethod);
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Save user profile data
      const { error: profileError } = await supabase
        .from('users')
        .update({
          // We can't update the email field as it's linked to auth
          // But we can store the rest of the profile data
          // In a real app, you'd have a separate profiles table
          updated_at: new Date().toISOString()
        })
        .eq('id', '550e8400-e29b-41d4-a716-446655440000');
      
      if (profileError) {
        console.warn('Error updating user profile:', profileError);
      }
      
      // Award points for completing profile setup
      addPoints(50, 'milestone', 'Completed fitness profile setup');
      
      // Complete profile achievement
      completeAchievement('complete_profile');
      
      toast.success('Profile setup completed successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing profile setup:', error);
      toast.error('Failed to complete profile setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step}
            className={`flex flex-col items-center ${step <= currentStep ? 'opacity-100' : 'opacity-50'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? 'bg-biowellGreen text-black'
                  : step < currentStep
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step
              )}
            </div>
            <span className="text-xs text-gray-400 mt-2">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Smart Scale'}
              {step === 3 && 'Wearables'}
              {step === 4 && 'Goals'}
              {step === 5 && 'Preferences'}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black pt-16 pb-16 px-4">
      <div className="max-w-3xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-800 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-white mb-6">Fitness Profile Setup</h1>
          
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">1. Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Age
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="30"
                        min="18"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ruler className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="175"
                        min="100"
                        max="250"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Current Weight (kg)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Weight className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="70"
                        min="30"
                        max="300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Smart Scale Connection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">2. Smart Scale Connection</h2>
                
                <p className="text-gray-400 mb-6">
                  Connect your smart scale to automatically track your weight and body composition metrics.
                  This step is optional - you can always connect devices later.
                </p>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Select Your Smart Scale</h3>
                  
                  <div className="space-y-4">
                    {['Withings Body+', 'Renpho Smart Scale', 'Eufy Smart Scale', 'Fitbit Aria', 'None/Skip'].map((scale) => (
                      <label key={scale} className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                        <input
                          type="radio"
                          name="smartScale"
                          value={scale}
                          className="form-radio h-5 w-5 text-biowellGreen"
                        />
                        <span className="ml-3 text-white">{scale}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Pairing Instructions</h3>
                  
                  <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                    <li>Ensure your scale is powered on and in pairing mode</li>
                    <li>Enable Bluetooth on your device</li>
                    <li>Place the scale on a flat, hard surface</li>
                    <li>Follow your scale's specific pairing instructions</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      For demo purposes, we'll skip the actual pairing process. In a real application, 
                      this would connect to your device via Bluetooth.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Wearable Device Setup */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">3. Wearable Device Setup</h2>
                
                <p className="text-gray-400 mb-6">
                  Connect your fitness wearables to track activity, sleep, heart rate, and more.
                  This step is optional - you can always connect devices later.
                </p>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Connect Devices</h3>
                    <button 
                      type="button"
                      onClick={() => setShowDeviceConnector(!showDeviceConnector)}
                      className="text-sm bg-biowellGreen/20 text-biowellGreen px-3 py-1.5 rounded-lg"
                    >
                      {showDeviceConnector ? 'Hide Devices' : 'Show Devices'}
                    </button>
                  </div>
                  
                  {showDeviceConnector ? (
                    <DeviceConnection onConnect={handleDeviceConnect} />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Watch className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Click "Show Devices" to connect your wearables</p>
                    </div>
                  )}
                </div>
                
                {formData.connectedDevices.length > 0 && (
                  <div className="bg-biowellGreen/10 p-4 rounded-lg border border-biowellGreen/30">
                    <h4 className="text-biowellGreen font-medium mb-2">Connected Devices:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.connectedDevices.map(device => (
                        <div key={device} className="bg-biowellGreen/20 text-biowellGreen px-3 py-1 rounded-full text-sm flex items-center">
                          {device}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Step 4: Fitness Goals */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">4. Fitness Goals</h2>
                
                <p className="text-gray-400 mb-6">
                  Select all fitness goals that apply to you. This will help us personalize your experience.
                </p>
                
                <div className="space-y-3">
                  {[
                    { id: 'weight_loss', label: 'Weight Loss' },
                    { id: 'muscle_gain', label: 'Muscle Gain' },
                    { id: 'endurance', label: 'Improved Endurance' },
                    { id: 'sleep', label: 'Better Sleep' },
                    { id: 'stress', label: 'Stress Management' },
                    { id: 'energy', label: 'Increased Energy' },
                    { id: 'flexibility', label: 'Improved Flexibility' },
                    { id: 'balance', label: 'Better Balance' }
                  ].map((goal) => (
                    <label 
                      key={goal.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        formData.goals.includes(goal.id)
                          ? 'bg-biowellGreen/20 border border-biowellGreen/50'
                          : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal.id)}
                        onChange={() => handleCheckboxChange('goals', goal.id)}
                        className="form-checkbox h-5 w-5 text-biowellGreen rounded"
                      />
                      <span className="ml-3 text-white">{goal.label}</span>
                    </label>
                  ))}
                  
                  <div className="pt-3">
                    <label className="block text-gray-300 text-sm mb-2">
                      Other Goal (please specify)
                    </label>
                    <input
                      type="text"
                      name="otherGoal"
                      value={formData.otherGoal}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                      placeholder="E.g., Prepare for a marathon"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 5: Preferences */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">5. Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Preferred Workout Days
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label 
                          key={day}
                          className={`flex items-center justify-center p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                            formData.workoutDays.includes(day)
                              ? 'bg-biowellGreen/20 border border-biowellGreen/50 text-white'
                              : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.workoutDays.includes(day)}
                            onChange={() => handleCheckboxChange('workoutDays', day)}
                            className="sr-only"
                          />
                          <span>{day.substring(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">
                        Preferred Workout Time
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          name="workoutTime"
                          value={formData.workoutTime}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">
                        Workout Duration (minutes)
                      </label>
                      <select
                        name="workoutDuration"
                        value={formData.workoutDuration}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="120">120 minutes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Exercise Type Preferences
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Cardio', 'Strength Training', 'HIIT', 'Yoga', 'Pilates', 
                        'Swimming', 'Cycling', 'Running', 'Walking', 'Dance', 
                        'Martial Arts', 'Sports'
                      ].map((exercise) => (
                        <label 
                          key={exercise}
                          className={`flex items-center p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                            formData.exercisePreferences.includes(exercise)
                              ? 'bg-biowellGreen/20 border border-biowellGreen/50 text-white'
                              : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.exercisePreferences.includes(exercise)}
                            onChange={() => handleCheckboxChange('exercisePreferences', exercise)}
                            className="form-checkbox h-4 w-4 text-biowellGreen rounded mr-2"
                          />
                          <span>{exercise}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm">
                      Dietary Restrictions or Preferences
                    </label>
                    <textarea
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none resize-none h-24"
                      placeholder="E.g., vegetarian, gluten-free, low-carb, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Notification Preferences
                    </label>
                    <div className="space-y-3">
                      {[
                        { id: 'email', label: 'Email Notifications' },
                        { id: 'sms', label: 'SMS Notifications' },
                        { id: 'push', label: 'Push Notifications' },
                        { id: 'reminders', label: 'Workout Reminders' },
                        { id: 'progress', label: 'Progress Updates' }
                      ].map((notification) => (
                        <label 
                          key={notification.id}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            checked={formData.notificationPreferences.includes(notification.id)}
                            onChange={() => handleCheckboxChange('notificationPreferences', notification.id)}
                            className="form-checkbox h-5 w-5 text-biowellGreen rounded"
                          />
                          <span className="ml-3 text-white">{notification.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors ${
                    currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.age || !formData.height || !formData.weight)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.age || !formData.height || !formData.weight)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || formData.goals.length === 0}
                  className={`px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center ${
                    isSubmitting || formData.goals.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FitnessProfileSetup;