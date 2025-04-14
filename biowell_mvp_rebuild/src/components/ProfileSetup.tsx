import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeviceConnection from './DeviceConnection';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  const handleDeviceConnect = (deviceType: string, deviceName: string, connected: boolean) => {
    if (connected) {
      setConnectedDevices(prev => [...prev, deviceName]);
    } else {
      setConnectedDevices(prev => prev.filter(device => device !== deviceName));
    }
  };

  const handleContinue = () => {
    // In a real app, you would save the connected devices to the user's profile
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black pt-16 px-4 pb-16">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-white mb-6">Welcome to BIOWELL</h1>
          <p className="text-gray-400 mb-8">
            Connect your devices to get personalized recommendations based on your health data.
            This step is optional - you can always connect devices later.
          </p>
          
          <DeviceConnection onConnect={handleDeviceConnect} />
          
          {connectedDevices.length > 0 && (
            <div className="mt-6 p-4 bg-biowellGreen/10 border border-biowellGreen/20 rounded-lg">
              <h3 className="text-biowellGreen font-medium mb-2">Connected Devices:</h3>
              <div className="flex flex-wrap gap-2">
                {connectedDevices.map(device => (
                  <div key={device} className="bg-biowellGreen/20 text-biowellGreen px-3 py-1 rounded-full text-sm">
                    {device}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={handleSkip}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Skip for Now
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}