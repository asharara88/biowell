import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Watch, Activity, Loader2, CheckCircle, AlertCircle, Scale } from 'lucide-react';

interface DeviceConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deviceType: 'wearable' | 'cgm' | 'scale';
  deviceName: string;
}

export default function DeviceConnectionModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  deviceType, 
  deviceName 
}: DeviceConnectionModalProps) {
  const [step, setStep] = useState(1);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (connecting) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [connecting]);

  useEffect(() => {
    if (progress === 100) {
      // 80% chance of success for demo purposes
      if (Math.random() > 0.2) {
        setConnected(true);
        setStep(3);
      } else {
        setError('Unable to connect to device. Please ensure your device is nearby and in pairing mode.');
      }
      setConnecting(false);
      setProgress(0);
    }
  }, [progress]);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'wearable':
        return <Watch className="w-6 h-6 text-biowellGreen" />;
      case 'cgm':
        return <Activity className="w-6 h-6 text-biowellGreen" />;
      case 'scale':
        return <Scale className="w-6 h-6 text-biowellGreen" />;
      default:
        return <Smartphone className="w-6 h-6 text-biowellGreen" />;
    }
  };

  const handleConnect = () => {
    setConnecting(true);
    setError(null);
  };

  const handleClose = () => {
    if (connected) {
      onSuccess();
    }
    setStep(1);
    setConnecting(false);
    setConnected(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-800 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-biowellGreen/10 flex items-center justify-center">
              {getDeviceIcon()}
            </div>
            <h3 className="text-xl font-semibold text-white">Connect {deviceName}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Connecting your {deviceName} allows us to provide more personalized recommendations based on your real-time health data.
              </p>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Before you connect:</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-biowellGreen text-xs">1</span>
                    </div>
                    Ensure your device is turned on and nearby
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-biowellGreen text-xs">2</span>
                    </div>
                    Enable Bluetooth on your device
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-biowellGreen text-xs">3</span>
                    </div>
                    Put your device in pairing mode if required
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Click the button below to start scanning for your {deviceName}.
              </p>
              
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-200 p-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex flex-col items-center py-6">
                {connecting ? (
                  <div className="w-full max-w-xs">
                    <div className="flex flex-col items-center mb-4">
                      <Loader2 className="w-12 h-12 text-biowellGreen animate-spin mb-4" />
                      <p className="text-gray-300">Scanning for devices...</p>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-biowellGreen h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      {progress < 30 ? 'Searching for devices...' : 
                       progress < 60 ? 'Device found, establishing connection...' : 
                       'Authenticating...'}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="px-8 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    Start Scanning
                  </button>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  disabled={connecting}
                >
                  Back
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  disabled={connecting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="py-6">
                <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Successfully Connected!
                </h4>
                <p className="text-gray-300">
                  Your {deviceName} has been successfully connected to BIOWELL.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg text-left">
                <h5 className="text-white font-medium mb-2">What's Next:</h5>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 mt-0.5" />
                    We'll sync your historical data
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 mt-0.5" />
                    Your metrics will be analyzed for personalized recommendations
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 mt-0.5" />
                    Real-time data will be used to optimize your wellness plan
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}