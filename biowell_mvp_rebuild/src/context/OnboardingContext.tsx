import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  goal?: string;
  sleepPattern?: string;
  nutritionFocus?: string;
  
  // Biometrics
  height?: string;
  weight?: string;
  age?: string;
  restingHeartRate?: string;
  sleepDuration?: string;
  stressLevel?: string;
  
  // Nutrition
  dietType?: string;
  dietaryRestrictions?: string[];
  mealFrequency?: string;
  
  // Cognitive
  cognitiveGoals?: string[];
  mentalChallenges?: string;
  
  // Wearables
  connectedDevices?: string[];
  
  // Additional preferences
  supplementPreferences?: string[];
  exerciseFrequency?: string;
  exerciseIntensity?: string;
}

interface OnboardingContextProps {
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<OnboardingData>({});

  const setData = (updates: Partial<OnboardingData>) => {
    setDataState(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setDataState({});
  };

  return (
    <OnboardingContext.Provider value={{ data, setData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
};