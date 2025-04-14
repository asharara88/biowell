import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Loader2, 
  MessageSquare, 
  Brain, 
  Sliders, 
  Volume2, 
  Bell, 
  Moon, 
  Sun, 
  Zap,
  User,
  Settings,
  Target,
  Globe,
  Shield,
  LogOut
} from 'lucide-react';
import { getUserSettings, saveUserSettings } from '../api/settings';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

export function SettingsPanel() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

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
      toast.success('Settings saved successfully');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.info('You have been signed out');
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center text-sm text-green-400"
              >
                <Check className="w-4 h-4 mr-1" />
                Saved!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-white font-medium">{user?.email || 'Demo User'}</h2>
                  <p className="text-sm text-gray-400">Free Account</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 text-white"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>General Settings</span>
                </Link>
                <Link 
                  to="/settings/goals"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Target className="w-5 h-5 text-gray-400" />
                  <span>Goals & Priorities</span>
                </Link>
                <Link 
                  to="/profile-setup"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span>Language & Region</span>
                </Link>
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span>Privacy & Security</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Health Consultant Communication</h2>
              </div>

              <div className="space-y-8">
                {/* Tone Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Communication Tone</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, tone: option.value }))}
                        className={`p-4 rounded-lg border ${
                          settings.tone === option.value
                            ? 'border-biowellGreen bg-biowellGreen bg-opacity-10'
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
                  <h3 className="text-lg font-semibold text-white mb-4">Detail Level</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {detailOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, detailLevel: option.value }))}
                        className={`p-4 rounded-lg border ${
                          settings.detailLevel === option.value
                            ? 'border-biowellGreen bg-biowellGreen bg-opacity-10'
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
                  <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-white font-medium">Daily Reminders</p>
                          <p className="text-sm text-gray-400">Get daily wellness reminders</p>
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
                          <p className="text-white font-medium">Evening Check-ins</p>
                          <p className="text-sm text-gray-400">Receive evening wellness check-ins</p>
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
                          <p className="text-white font-medium">Insight Alerts</p>
                          <p className="text-sm text-gray-400">Get notified of new health insights</p>
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
                  <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="p-4 rounded-lg border border-biowellGreen bg-biowellGreen/10 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <Moon className="text-biowellGreen w-5 h-5" />
                        <span className="ml-2 font-medium text-white">Dark</span>
                      </div>
                      <p className="text-sm text-gray-400">Easier on the eyes in low light</p>
                    </button>
                    
                    <button
                      className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <Sun className="text-gray-400 w-5 h-5" />
                        <span className="ml-2 font-medium text-white">Light</span>
                      </div>
                      <p className="text-sm text-gray-400">Better visibility in bright light</p>
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-biowellGreen text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}