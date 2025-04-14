import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/client';
import { useGamificationStore } from '../store/gamificationStore';
import { toast } from 'react-toastify';

interface UserContextType {
  goals: string;
  trackingMethod: string;
  setGoals: (goal: string) => void;
  setTrackingMethod: (method: string) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  saveUserPreferences: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState('Sleep');
  const [trackingMethod, setTrackingMethod] = useState('manual');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addPoints, completeAchievement } = useGamificationStore();

  // Load user preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // First check localStorage
        const savedGoals = localStorage.getItem('userGoals');
        const savedTrackingMethod = localStorage.getItem('userTrackingMethod');
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');

        if (savedGoals) setGoals(savedGoals);
        if (savedTrackingMethod) setTrackingMethod(savedTrackingMethod);
        if (onboardingCompleted === 'true') setHasCompletedOnboarding(true);
        
        // Then try to fetch from Supabase for the latest data
        const { data, error } = await supabase
          .from('user_preferences')
          .select('goals, tracking_method')
          .eq('user_id', '550e8400-e29b-41d4-a716-446655440000')
          .maybeSingle();
        
        if (error) {
          console.warn('Error fetching user preferences:', error.message);
          return;
        }
        
        if (data) {
          // Handle goals (could be string or jsonb)
          if (data.goals) {
            let parsedGoals;
            if (typeof data.goals === 'string') {
              try {
                parsedGoals = JSON.parse(data.goals);
              } catch (e) {
                parsedGoals = { primary: data.goals };
              }
            } else {
              parsedGoals = data.goals;
            }
            
            if (parsedGoals.primary) {
              setGoals(parsedGoals.primary);
              localStorage.setItem('userGoals', parsedGoals.primary);
            }
          }
          
          // Handle tracking method
          if (data.tracking_method) {
            setTrackingMethod(data.tracking_method);
            localStorage.setItem('userTrackingMethod', data.tracking_method);
          }
          
          // If we have data, user has completed onboarding
          setHasCompletedOnboarding(true);
          localStorage.setItem('onboardingCompleted', 'true');
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);

  // Save user preferences to Supabase and localStorage
  const saveUserPreferences = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userGoals', goals);
      localStorage.setItem('userTrackingMethod', trackingMethod);
      
      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
          goals: JSON.stringify({ primary: goals }),
          tracking_method: trackingMethod
        });

      if (error) throw error;

      // Mark onboarding as completed
      localStorage.setItem('onboardingCompleted', 'true');
      setHasCompletedOnboarding(true);
      
      // Award points for completing onboarding
      addPoints(50, 'achievement', 'Completed onboarding process');
      
      // Complete profile achievement
      completeAchievement('complete_profile');
      
      toast.success('Preferences saved successfully!');
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving user preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      goals, 
      trackingMethod, 
      setGoals, 
      setTrackingMethod,
      hasCompletedOnboarding,
      setHasCompletedOnboarding,
      saveUserPreferences,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};