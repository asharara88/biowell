import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CoachState {
  selectedGoal: string | null;
  recentTopics: string[];
  preferences: {
    tone: 'friendly' | 'professional' | 'motivational';
    detailLevel: 'standard' | 'detailed';
    language: 'en' | 'ar';
  };
  
  // Actions
  setSelectedGoal: (goal: string | null) => void;
  addRecentTopic: (topic: string) => void;
  clearRecentTopics: () => void;
  updatePreferences: (preferences: Partial<CoachState['preferences']>) => void;
}

export const useCoachStore = create<CoachState>()(
  persist(
    (set) => ({
      selectedGoal: null,
      recentTopics: [],
      preferences: {
        tone: 'friendly',
        detailLevel: 'standard',
        language: 'en'
      },
      
      setSelectedGoal: (goal) => set({ selectedGoal: goal }),
      
      addRecentTopic: (topic) => set((state) => {
        // Add to the beginning and remove duplicates
        const filteredTopics = state.recentTopics.filter(t => t !== topic);
        return {
          recentTopics: [topic, ...filteredTopics].slice(0, 10) // Keep only 10 most recent
        };
      }),
      
      clearRecentTopics: () => set({ recentTopics: [] }),
      
      updatePreferences: (preferences) => set((state) => ({
        preferences: {
          ...state.preferences,
          ...preferences
        }
      }))
    }),
    {
      name: 'coach-store',
      partialize: (state) => ({
        recentTopics: state.recentTopics,
        preferences: state.preferences
      })
    }
  )
);