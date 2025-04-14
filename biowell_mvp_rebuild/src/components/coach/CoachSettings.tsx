import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, MessageSquare, Brain, Sliders, Volume2, Bell, Moon, Sun, Zap } from 'lucide-react';
import { getUserSettings, saveUserSettings } from '../../api/settings';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

interface ToneOption {
  value: 'friendly' | 'professional' | 'motivational';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface DetailOption {
  value: 'standard' | 'detailed';
  label: string;
  description: string;
  icon: React.ReactNode;
}

const toneOptions: ToneOption[] = [
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Casual and encouraging communication style',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and precise communication approach',
    icon: <Brain className="w-5 h-5" />
  },
  {
    value: 'motivational',
    label: 'Motivational',
    description: 'Energetic and inspiring interaction style',
    icon: <Volume2 className="w-5 h-5" />
  }
];

const detailOptions: DetailOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Clear, concise information and recommendations',
    icon: <Sliders className="w-5 h-5" />
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'In-depth analysis and comprehensive explanations',
    icon: <Brain className="w-5 h-5" />
  }
];

const defaultSettings = {
  tone: 'friendly' as const,
  detailLevel: 'standard' as const
};

export default function CoachSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings(DEMO_USER_ID);
        if (userSettings) {
          setSettings(userSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveUserSettings(DEMO_USER_ID, settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-biowellGreen/10 rounded-lg flex items-center justify-center">
            <Sliders className="w-5 h-5 text-biowellGreen" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{t('settings.title') || 'Health Consultant Settings'}</h2>
            <p className="text-sm text-gray-400">{t('settings.subtitle') || 'Customize your experience'}</p>
          </div>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center text-sm text-green-400"
            >
              <Check className="w-4 h-4 mr-1" />
              {t('settings.saved') || 'Saved!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tone Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{t('settings.tone.title') || 'Communication Tone'}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, tone: option.value }))}
                className={`p-4 rounded-lg border ${
                  settings.tone === option.value
                    ? 'border-biowellGreen bg-biowellGreen/10'
                    : 'border-gray-700 hover:border-gray-600'
                } transition-all duration-200`}
              >
                <div className="flex items-center mb-2">
                  <div className={`${
                    settings.tone === option.value ? 'text-biowellGreen' : 'text-gray-400'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="ml-2 font-medium text-white">{option.label}</span>
                </div>
                <p className="text-sm text-gray-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Level Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{t('settings.detail.title') || 'Detail Level'}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {detailOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, detailLevel: option.value }))}
                className={`p-4 rounded-lg border ${
                  settings.detailLevel === option.value
                    ? 'border-biowellGreen bg-biowellGreen/10'
                    : 'border-gray-700 hover:border-gray-600'
                } transition-all duration-200`}
              >
                <div className="flex items-center mb-2">
                  <div className={`${
                    settings.detailLevel === option.value ? 'text-biowellGreen' : 'text-gray-400'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="ml-2 font-medium text-white">{option.label}</span>
                </div>
                <p className="text-sm text-gray-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{t('settings.notifications.title') || 'Notifications'}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-white font-medium">{t('settings.notifications.daily') || 'Daily Reminders'}</p>
                  <p className="text-sm text-gray-400">{t('settings.notifications.dailyDesc') || 'Get daily wellness reminders'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-biowellGreen"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Moon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-white font-medium">{t('settings.notifications.evening') || 'Evening Check-ins'}</p>
                  <p className="text-sm text-gray-400">{t('settings.notifications.eveningDesc') || 'Receive evening wellness check-ins'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-biowellGreen"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-white font-medium">{t('settings.notifications.insights') || 'Insight Alerts'}</p>
                  <p className="text-sm text-gray-400">{t('settings.notifications.insightsDesc') || 'Get notified of new health insights'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-biowellGreen"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Preference */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{t('settings.theme.title') || 'Theme'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="p-4 rounded-lg border border-biowellGreen bg-biowellGreen/10 transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <Moon className="text-biowellGreen w-5 h-5" />
                <span className="ml-2 font-medium text-white">{t('settings.theme.dark') || 'Dark'}</span>
              </div>
              <p className="text-sm text-gray-400">{t('settings.theme.darkDesc') || 'Easier on the eyes in low light'}</p>
            </button>
            
            <button
              className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <Sun className="text-gray-400 w-5 h-5" />
                <span className="ml-2 font-medium text-white">{t('settings.theme.light') || 'Light'}</span>
              </div>
              <p className="text-sm text-gray-400">{t('settings.theme.lightDesc') || 'Better visibility in bright light'}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-biowellGreen text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t('settings.saving') || 'Saving...'}
            </>
          ) : (
            t('settings.saveChanges') || 'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}