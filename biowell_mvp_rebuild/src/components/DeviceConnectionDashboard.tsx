import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Watch, 
  Activity, 
  Scale, 
  ShoppingCart, 
  ArrowRight, 
  CheckCircle, 
  Smartphone,
  Loader2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DeviceConnection from './DeviceConnection';
import { toast } from 'react-toastify';

interface DeviceConnectionDashboardProps {
  onDeviceConnect?: (deviceType: string, deviceName: string, connected: boolean) => void;
  className?: string;
}

const DeviceConnectionDashboard: React.FC<DeviceConnectionDashboardProps> = ({ 
  onDeviceConnect,
  className = ''
}) => {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [showDeviceConnector, setShowDeviceConnector] = useState(false);
  const [activeTab, setActiveTab] = useState<'wearables' | 'cgm' | 'scale'>('wearables');
  const [isOrdering, setIsOrdering] = useState(false);

  const handleDeviceConnect = (deviceType: string, deviceName: string, connected: boolean) => {
    if (connected) {
      setConnectedDevices(prev => [...prev, deviceName]);
      toast.success(`${deviceName} connected successfully!`);
    } else {
      setConnectedDevices(prev => prev.filter(device => device !== deviceName));
      toast.info(`${deviceName} disconnected`);
    }
    
    if (onDeviceConnect) {
      onDeviceConnect(deviceType, deviceName, connected);
    }
  };

  const handleOrderCGM = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      toast.success('Redirecting to Freestyle Libre CGM in the Wellness Shop');
      // In a real app, this would navigate to the specific product page
    }, 1500);
  };

  const handleOrderScale = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      toast.success('Redirecting to Smart Scales in the Wellness Shop');
      // In a real app, this would navigate to the specific product page
    }, 1500);
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6">Connect Your Devices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wearables Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Watch className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">Wearables</h3>
              <p className="text-sm text-gray-400">Fitness trackers, watches</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Connect your fitness wearables to track activity, sleep, and more.
          </p>
          
          <button
            onClick={() => {
              setShowDeviceConnector(true);
              setActiveTab('wearables');
            }}
            className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Connect Wearable
          </button>
        </motion.div>
        
        {/* CGM Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">CGM</h3>
              <p className="text-sm text-gray-400">Continuous Glucose Monitor</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Track your glucose levels in real-time with a CGM device.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowDeviceConnector(true);
                setActiveTab('cgm');
              }}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center"
            >
              Connect
            </button>
            
            <button
              onClick={handleOrderCGM}
              disabled={isOrdering}
              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isOrdering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              Order
            </button>
          </div>
        </motion.div>
        
        {/* Smart Scale Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">Smart Scale</h3>
              <p className="text-sm text-gray-400">Body composition tracking</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Track weight, body fat, muscle mass, and more metrics.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowDeviceConnector(true);
                setActiveTab('scale');
              }}
              className="flex-1 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center"
            >
              Connect
            </button>
            
            <button
              onClick={handleOrderScale}
              disabled={isOrdering}
              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isOrdering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              Order
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Connected Devices Section */}
      {connectedDevices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Connected Devices</h3>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-wrap gap-3">
              {connectedDevices.map(device => (
                <div key={device} className="bg-biowellGreen/10 text-biowellGreen px-3 py-1.5 rounded-full text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  {device}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Device Connector */}
      {showDeviceConnector && (
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Connect Your {
              activeTab === 'wearables' ? 'Wearable' : 
              activeTab === 'cgm' ? 'CGM Device' : 
              'Smart Scale'
            }</h3>
            <button
              onClick={() => setShowDeviceConnector(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <DeviceConnection onConnect={handleDeviceConnect} />
        </div>
      )}
      
      {/* Shop Link */}
      <div className="bg-gradient-to-r from-biowellGreen/20 to-biowellBlue/20 rounded-lg p-5 border border-biowellGreen/30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Need New Devices?</h3>
            <p className="text-gray-300 text-sm">
              Explore our curated selection of health and wellness devices.
            </p>
          </div>
          
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            Visit Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnectionDashboard;