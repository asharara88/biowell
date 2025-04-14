import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Brain, 
  Zap, 
  Smartphone, 
  Watch, 
  Loader2,
  ArrowRight,
  CheckCircle,
  X,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DeviceConnectionDashboard from './DeviceConnectionDashboard';
import { toast } from 'react-toastify';

interface WellnessDeviceHubProps {
  className?: string;
}

const WellnessDeviceHub: React.FC<WellnessDeviceHubProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'metrics' | 'insights'>('devices');
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeviceConnect = (deviceType: string, deviceName: string, connected: boolean) => {
    if (connected) {
      setConnectedDevices(prev => [...prev, deviceName]);
    } else {
      setConnectedDevices(prev => prev.filter(device => device !== deviceName));
    }
  };

  const handleSyncData = () => {
    if (connectedDevices.length === 0) {
      toast.warning('No devices connected to sync');
      return;
    }

    setIsLoading(true);
    
    // Simulate data syncing
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Device data synced successfully');
    }, 2000);
  };

  return (
    <div className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${className}`}>
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === 'devices' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === 'metrics' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Health Metrics
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === 'insights' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'devices' && (
          <DeviceConnectionDashboard onDeviceConnect={handleDeviceConnect} />
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Your Health Metrics</h2>
              
              <button
                onClick={handleSyncData}
                disabled={isLoading || connectedDevices.length === 0}
                className="px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    Sync Data
                  </>
                )}
              </button>
            </div>

            {connectedDevices.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">No Devices Connected</h3>
                <p className="text-gray-400 mb-4">
                  Connect your devices to see your health metrics here.
                </p>
                <button
                  onClick={() => setActiveTab('devices')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Connect Devices
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Heart Rate Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Heart Rate</h3>
                      <p className="text-sm text-gray-400">Last 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-white">72</div>
                      <div className="text-sm text-gray-400">Avg BPM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm">65 min</div>
                      <div className="text-gray-400 text-xs">Resting</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 text-sm">142 max</div>
                      <div className="text-gray-400 text-xs">Active</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Sleep Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Moon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Sleep</h3>
                      <p className="text-sm text-gray-400">Last night</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-white">7.5</div>
                      <div className="text-sm text-gray-400">Hours</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 text-sm">1.2h</div>
                      <div className="text-gray-400 text-xs">Deep</div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 text-sm">1.8h</div>
                      <div className="text-gray-400 text-xs">REM</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Activity Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Activity</h3>
                      <p className="text-sm text-gray-400">Today</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-white">8,432</div>
                      <div className="text-sm text-gray-400">Steps</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm">3.2 mi</div>
                      <div className="text-gray-400 text-xs">Distance</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-sm">385 kcal</div>
                      <div className="text-gray-400 text-xs">Active</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Glucose Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Glucose</h3>
                      <p className="text-sm text-gray-400">Last 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-white">92</div>
                      <div className="text-sm text-gray-400">Avg mg/dL</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm">85 min</div>
                      <div className="text-gray-400 text-xs">Low</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 text-sm">115 max</div>
                      <div className="text-gray-400 text-xs">High</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link
                to="/wellness-profile"
                className="inline-flex items-center text-biowellGreen hover:text-biowellGreen/80 transition-colors"
              >
                View detailed health metrics
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Health Insights</h2>
            
            {connectedDevices.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
                <p className="text-gray-400 mb-4">
                  Connect your devices to receive personalized health insights.
                </p>
                <button
                  onClick={() => setActiveTab('devices')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Connect Devices
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Sleep Optimization</h3>
                      <p className="text-sm text-gray-400">Based on your sleep patterns</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">
                    Your deep sleep duration has decreased by 15% this week. Consider these adjustments:
                  </p>
                  
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Maintain a consistent sleep schedule, even on weekends</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Reduce blue light exposure 2 hours before bedtime</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Consider magnesium glycinate supplementation (300-400mg before bed)</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Activity Pattern</h3>
                      <p className="text-sm text-gray-400">Based on your movement data</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">
                    Your activity levels peak in the morning but drop significantly after 2pm. Consider:
                  </p>
                  
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Schedule short 5-minute movement breaks every hour in the afternoon</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Try a brief afternoon walk to boost energy and focus</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">Glucose Stability</h3>
                      <p className="text-sm text-gray-400">Based on your CGM data</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">
                    Your glucose variability is higher than optimal. To improve stability:
                  </p>
                  
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Consider protein and fiber with each meal to slow glucose absorption</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Take a 10-minute walk after meals to reduce glucose spikes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span>Consider berberine supplementation (500mg with meals)</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link
                to="/coach"
                className="inline-flex items-center text-biowellGreen hover:text-biowellGreen/80 transition-colors"
              >
                Get personalized recommendations from your Health Consultant
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessDeviceHub;