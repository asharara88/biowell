import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Watch, Activity, Scale, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

interface DeviceConnectionProps {
  onConnect?: (deviceType: string, deviceName: string, connected: boolean) => void;
}

interface Device {
  id: string;
  name: string;
  type: 'wearable' | 'cgm' | 'scale';
  icon: React.ReactNode;
  connected: boolean;
  connecting: boolean;
}

export default function DeviceConnection({ onConnect }: DeviceConnectionProps) {
  const [devices, setDevices] = useState<Device[]>([
    // Wearables
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      type: 'wearable',
      icon: <Watch className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      type: 'wearable',
      icon: <Watch className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'garmin',
      name: 'Garmin',
      type: 'wearable',
      icon: <Watch className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      type: 'wearable',
      icon: <Activity className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    // CGM Devices
    {
      id: 'freestyle-libre',
      name: 'Freestyle Libre CGM',
      type: 'cgm',
      icon: <Activity className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'dexcom',
      name: 'Dexcom CGM',
      type: 'cgm',
      icon: <Activity className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    // Smart Scales
    {
      id: 'withings-scale',
      name: 'Withings Scale',
      type: 'scale',
      icon: <Scale className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'renpho-scale',
      name: 'Renpho Scale',
      type: 'scale',
      icon: <Scale className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'eufy-scale',
      name: 'Eufy Smart Scale',
      type: 'scale',
      icon: <Scale className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'fitindex-scale',
      name: 'FITINDEX Scale',
      type: 'scale',
      icon: <Scale className="w-6 h-6" />,
      connected: false,
      connecting: false
    },
    {
      id: 'tanita-scale',
      name: 'Tanita Scale',
      type: 'scale',
      icon: <Scale className="w-6 h-6" />,
      connected: false,
      connecting: false
    }
  ]);

  const [activeTab, setActiveTab] = useState<'wearable' | 'cgm' | 'scale'>('wearable');
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const handleConnect = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      if (device.connected) {
        // Disconnect flow
        setDevices(prev => prev.map(d => 
          d.id === deviceId 
            ? { ...d, connecting: true }
            : d
        ));

        // Simulate API call delay
        setTimeout(() => {
          setDevices(prev => prev.map(d => 
            d.id === deviceId 
              ? { ...d, connecting: false, connected: false }
              : d
          ));
          
          if (onConnect) onConnect(device.type, device.name, false);
        }, 1000);
      } else {
        // Connect flow
        setDevices(prev => prev.map(d => 
          d.id === deviceId 
            ? { ...d, connecting: true }
            : d
        ));

        // Simulate API call delay
        setTimeout(() => {
          setDevices(prev => prev.map(d => 
            d.id === deviceId 
              ? { ...d, connecting: false, connected: true }
              : d
          ));
          
          if (onConnect) onConnect(device.type, device.name, true);
        }, 1500);
      }
    }
  };

  const toggleInfo = (deviceId: string | null) => {
    setShowInfo(deviceId === showInfo ? null : deviceId);
  };

  const filteredDevices = devices.filter(device => device.type === activeTab);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('wearable')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'wearable' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Watch className="w-4 h-4" />
          Wearables
        </button>
        <button
          onClick={() => setActiveTab('cgm')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'cgm' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          CGM
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'scale' 
              ? 'text-biowellGreen border-b-2 border-biowellGreen' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          Smart Scales
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDevices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600 flex items-center justify-between relative"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-600 mr-3">
                {device.icon}
              </div>
              <div>
                <h4 className="text-white font-medium">{device.name}</h4>
                <p className="text-sm text-gray-400">{device.type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleInfo(device.id)}
                className="p-1.5 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleConnect(device.id)}
                disabled={device.connecting}
                className={`px-3 py-1.5 rounded-lg flex items-center ${
                  device.connected
                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                    : 'bg-biowellGreen/20 text-biowellGreen hover:bg-biowellGreen/30'
                } transition-colors`}
              >
                {device.connecting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : device.connected ? (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Connect
                  </>
                )}
              </button>
            </div>

            {showInfo === device.id && (
              <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 z-10 shadow-lg">
                <h5 className="text-white font-medium mb-2">About {device.name}</h5>
                <p className="text-sm text-gray-400 mb-2">
                  {device.type === 'wearable' && 'Track activity, sleep, and heart rate metrics.'}
                  {device.type === 'cgm' && 'Monitor glucose levels in real-time.'}
                  {device.type === 'scale' && 'Track weight, body composition, and other metrics.'}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => toggleInfo(null)}
                    className="text-sm text-biowellGreen hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <p className="text-sm text-gray-400 mt-4">
        Connecting your devices allows us to provide more accurate and personalized recommendations based on your real-time health data.
      </p>
    </div>
  );
}