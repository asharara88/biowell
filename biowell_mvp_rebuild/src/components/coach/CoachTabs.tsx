import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sliders, Sparkles, Target, Activity } from 'lucide-react';
import CoachChat from './CoachChat';
import CoachSettings from './CoachSettings';
import CoachInsights from './CoachInsights';
import CoachGoals from './CoachGoals';
import { useTranslation } from '../../hooks/useTranslation';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function CoachTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('chat');

  const tabs: Tab[] = [
    {
      id: 'chat',
      label: t('coach.tabs.chat') || 'Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      component: <CoachChat />
    },
    {
      id: 'insights',
      label: t('coach.tabs.insights') || 'Insights',
      icon: <Sparkles className="w-5 h-5" />,
      component: <CoachInsights />
    },
    {
      id: 'goals',
      label: t('coach.tabs.goals') || 'Goals',
      icon: <Target className="w-5 h-5" />,
      component: <CoachGoals />
    },
    {
      id: 'settings',
      label: t('coach.tabs.settings') || 'Settings',
      icon: <Sliders className="w-5 h-5" />,
      component: <CoachSettings />
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-biowellGreen border-b-2 border-biowellGreen'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {React.cloneElement(tab.icon as React.ReactElement, {
              className: `w-5 h-5 ${activeTab === tab.id ? 'text-biowellGreen' : ''}`
            })}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {tabs.find(tab => tab.id === activeTab)?.component}
        </motion.div>
      </div>
    </div>
  );
}