import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, Brain, Moon, TrendingUp, Clock } from 'lucide-react';

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  metrics: {
    current: number;
    change: number;
    unit: string;
  }[];
}

const tabs: TabData[] = [
  {
    id: 'today',
    label: 'Today',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-blue-400',
    metrics: [
      { current: 8500, change: 12, unit: 'steps' },
      { current: 68, change: -5, unit: 'bpm' },
      { current: 85, change: 8, unit: '%' }
    ]
  },
  {
    id: 'trends',
    label: 'Trends',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-green-400',
    metrics: [
      { current: 82, change: 15, unit: '%' },
      { current: 7.5, change: 0.5, unit: 'hrs' },
      { current: 92, change: 5, unit: '%' }
    ]
  }
];

interface DashboardTabsProps {
  onTabChange?: (tab: string) => void;
}

export default function DashboardTabs({ onTabChange }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState('today');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center px-6 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-biowellGreen text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-black' : tab.color}>
              {tab.icon}
            </span>
            <span className="ml-2 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="grid grid-cols-3 gap-6">
            {tabs.find(t => t.id === activeTab)?.metrics.map((metric, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <Activity className="w-4 h-4 text-blue-400" />
                    ) : index === 1 ? (
                      <Heart className="w-4 h-4 text-red-400" />
                    ) : (
                      <Brain className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-gray-400">
                      {index === 0 ? 'Activity' : index === 1 ? 'Heart Rate' : 'Progress'}
                    </span>
                  </div>
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {metric.current}
                    <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
                  </div>
                  <div className={`flex items-center text-sm ${
                    metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      metric.change < 0 ? 'transform rotate-180' : ''
                    }`} />
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}