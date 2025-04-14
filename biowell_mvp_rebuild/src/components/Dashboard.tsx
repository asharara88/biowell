import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Heart, TrendingUp, Watch, RefreshCw, Battery, Zap, Moon } from 'lucide-react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorAlert } from './ErrorAlert';
import { useTranslation } from '../hooks/useTranslation';
import PersonalCoachChat from './PersonalCoachChat';
import { Link } from 'react-router-dom';
import { useGamificationStore } from '../store/gamificationStore';
import LevelProgressBar from './gamification/LevelProgressBar';
import DailyCheckInCard from './gamification/DailyCheckInCard';
import GoalSelectionWidget from './GoalSelectionWidget';
import { toast } from 'react-toastify';

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function Dashboard() {
  const [wearableData, setWearableData] = useState<any>(null);
  const [cgmData, setCgmData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler('Dashboard');
  const [isRetrying, setIsRetrying] = useState(false);
  const { t, language } = useTranslation();
  const { userProgress, levels } = useGamificationStore();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setIsRetrying(true);
      clearError();
      
      // Simulate API call with mock data
      const mockWearableData = {
        metrics: {
          heartRate: 72,
          steps: 8432,
          energyLevel: 85,
          batteryLevel: 90,
          sleepScore: 87
        },
        last_sync: new Date().toISOString()
      };
      
      const mockCGMData = {
        glucose: 92,
        trend: 'stable'
      };
      
      setWearableData(mockWearableData);
      setCgmData(mockCGMData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      handleError(new Error(`Failed to fetch health data: ${errorMessage}`));
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
    toast.info('Dashboard refreshed');
  };

  if (loading && !isRetrying) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biowellGreen"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {t('dashboard.actions.refresh')}
            </button>
          </div>
        </div>

        {error.show && (
          <ErrorAlert 
            message={error.message} 
            code={error.code} 
            show={error.show} 
            onClose={clearError} 
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <LevelProgressBar 
              currentLevel={userProgress.level}
              totalPoints={userProgress.totalPoints}
              levels={levels}
            />
            
            {/* Daily Check-in */}
            <DailyCheckInCard />
            
            {/* Goals Widget */}
            <GoalSelectionWidget />
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Heart className="text-red-400" />}
                title={t('dashboard.stats.heartRate')}
                value={wearableData?.metrics.heartRate || '--'}
                unit="bpm"
              />
              <StatCard
                icon={<Activity className="text-green-400" />}
                title={t('dashboard.stats.steps')}
                value={wearableData?.metrics.steps?.toLocaleString() || '--'}
              />
              <StatCard
                icon={<TrendingUp className="text-blue-400" />}
                title={t('dashboard.stats.glucose')}
                value={cgmData?.glucose || '--'}
                unit="mg/dL"
                trend={cgmData?.trend}
              />
              <StatCard
                icon={<Watch className="text-purple-400" />}
                title={t('dashboard.stats.lastSync')}
                value={wearableData?.last_sync ? new Date(wearableData.last_sync).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US') : '--'}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<Zap className="text-yellow-400" />}
                title={t('dashboard.stats.energyLevel')}
                value={wearableData?.metrics.energyLevel || '--'}
                unit="/100"
              />
              <StatCard
                icon={<Moon className="text-indigo-400" />}
                title={t('dashboard.stats.sleepScore')}
                value={wearableData?.metrics.sleepScore || '--'}
                unit="/100"
              />
              <StatCard
                icon={<Battery className="text-green-400" />}
                title={t('dashboard.stats.deviceBattery')}
                value={wearableData?.metrics.batteryLevel || '--'}
                unit="%"
              />
            </div>
          </div>

          {/* Health Consultant Section */}
          <div className="lg:col-span-1">
            <PersonalCoachChat />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
}

function StatCard({ icon, title, value, unit, trend }: StatCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${(icon as React.ReactElement).props.className}` })}
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      <div className="text-xl font-bold text-white">
        {value} {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
      {trend && (
        <span className={`text-sm ${
          trend === 'rising' ? 'text-green-400' :
          trend === 'falling' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {t(`dashboard.trends.${trend}`)}
        </span>
      )}
    </div>
  );
}