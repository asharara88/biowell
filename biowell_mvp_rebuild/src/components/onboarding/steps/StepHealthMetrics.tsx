import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Scale, Activity, User, AlertCircle } from 'lucide-react';
import DeviceConnection from '../../DeviceConnection';

interface StepHealthMetricsProps {
  next: () => void;
  back: () => void;
  formData: Record<string, unknown>;
  updateFormData: (data: Record<string, unknown>) => void;
  skip?: () => void;
}

export default function StepHealthMetrics({ next, formData, updateFormData, skip }: StepHealthMetricsProps) {
  const [metrics, setMetrics] = useState({
    age: formData.age as string || '',
    height: formData.height as string || '',
    weight: formData.weight as string || '',
    gender: formData.gender as string || '',
  });
  
  const [connectedDevices, setConnectedDevices] = useState<string[]>(
    (formData.connectedDevices as string[]) || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeviceConnector, setShowDeviceConnector] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGenderSelect = (gender: string) => {
    setMetrics(prev => ({ ...prev, gender }));
    
    // Clear error when field is edited
    if (errors.gender) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gender;
        return newErrors;
      });
    }
  };
  
  const handleDeviceConnect = (deviceType: string, deviceName: string, connected: boolean) => {
    if (connected) {
      setConnectedDevices(prev => [...prev, deviceName]);
    } else {
      setConnectedDevices(prev => prev.filter(device => device !== deviceName));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!metrics.age) newErrors.age = 'Age is required';
    if (!metrics.height) newErrors.height = 'Height is required';
    if (!metrics.weight) newErrors.weight = 'Weight is required';
    if (!metrics.gender) newErrors.gender = 'Gender is required';
    
    // Numeric validation
    if (metrics.age && (isNaN(Number(metrics.age)) || Number(metrics.age) <= 0 || Number(metrics.age) > 120)) {
      newErrors.age = 'Please enter a valid age between 1-120';
    }
    
    if (metrics.height && (isNaN(Number(metrics.height)) || Number(metrics.height) <= 0 || Number(metrics.height) > 300)) {
      newErrors.height = 'Please enter a valid height in cm (30-300)';
    }
    
    if (metrics.weight && (isNaN(Number(metrics.weight)) || Number(metrics.weight) <= 0 || Number(metrics.weight) > 500)) {
      newErrors.weight = 'Please enter a valid weight in kg (1-500)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateFormData({
        age: metrics.age,
        height: metrics.height,
        weight: metrics.weight,
        gender: metrics.gender,
        connectedDevices
      });
      next();
    }
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
        Basic Health Information
      </h2>
      <p className="text-gray-400 mb-6">
        Share some basic information to help us personalize your experience
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="bg-gray-800 p-5 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Required Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={item} className="space-y-2">
              <label className="block text-gray-300 mb-2">
                <Activity className="w-5 h-5 text-biowellGreen mr-2 inline-block" />
                Age (Years)
              </label>
              <input
                type="number"
                name="age"
                value={metrics.age}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                  errors.age ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-biowellGreen'
                } focus:outline-none`}
                placeholder="E.g., 35"
                required
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.age}
                </p>
              )}
            </motion.div>

            <motion.div variants={item} className="space-y-2">
              <label className="block text-gray-300 mb-2">
                <Ruler className="w-5 h-5 text-biowellGreen mr-2 inline-block" />
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={metrics.height}
                onChange={handleChange}
                placeholder="E.g., 175"
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                  errors.height ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-biowellGreen'
                } focus:outline-none`}
                required
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.height}
                </p>
              )}
            </motion.div>

            <motion.div variants={item} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 mb-2">
                  <Scale className="w-5 h-5 text-biowellGreen mr-2 inline-block" />
                  Weight (kg)
                </label>
              </div>
              <input
                type="number"
                name="weight"
                value={metrics.weight}
                onChange={handleChange}
                placeholder="E.g., 70"
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 border ${
                  errors.weight ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-biowellGreen'
                } focus:outline-none`}
                required
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.weight}
                </p>
              )}
            </motion.div>

            <motion.div variants={item} className="space-y-2">
              <label className="block text-gray-300 mb-2">
                <User className="w-5 h-5 text-biowellGreen mr-2 inline-block" />
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => handleGenderSelect('Male')}
                  className={`py-3 px-4 rounded-lg text-center transition-colors ${
                    metrics.gender === 'Male'
                      ? 'bg-biowellGreen/20 border-2 border-biowellGreen text-white'
                      : errors.gender 
                        ? 'bg-gray-700 border-2 border-red-500 text-gray-300'
                        : 'bg-gray-700 border-2 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderSelect('Female')}
                  className={`py-3 px-4 rounded-lg text-center transition-colors ${
                    metrics.gender === 'Female'
                      ? 'bg-biowellGreen/20 border-2 border-biowellGreen text-white'
                      : errors.gender 
                        ? 'bg-gray-700 border-2 border-red-500 text-gray-300'
                        : 'bg-gray-700 border-2 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Female
                </button>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.gender}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Device Connection (Optional) */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Connect Devices (Optional)</h3>
            <button 
              onClick={() => setShowDeviceConnector(!showDeviceConnector)}
              className="text-sm bg-biowellGreen/20 text-biowellGreen px-3 py-1.5 rounded-lg"
            >
              {showDeviceConnector ? 'Hide Devices' : 'Show Devices'}
            </button>
          </div>
          
          {showDeviceConnector && (
            <DeviceConnection onConnect={handleDeviceConnect} />
          )}
          
          {connectedDevices.length > 0 && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-2">Connected Devices:</h4>
              <div className="flex flex-wrap gap-2">
                {connectedDevices.map(device => (
                  <div key={device} className="bg-biowellGreen/20 text-biowellGreen px-3 py-1 rounded-full text-sm flex items-center">
                    {device}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="pt-4">
          <p className="text-sm text-gray-400 mb-4">
            This information helps us create personalized recommendations. You can update these values anytime in your profile settings.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-biowellGreen text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Continue
            </button>
            {skip && (
              <button
                onClick={skip}
                className="px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Skip for Now
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}