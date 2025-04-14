import { useEffect, useState } from 'react';
import { useGamificationStore } from '../store/gamificationStore';
import type { Achievement, Challenge, Level } from '../types/gamification';

export function useGamification() {
  const {
    userProgress,
    levels,
    availableAchievements,
    availableChallenges,
    settings,
    transactions,
    addPoints,
    completeAchievement,
    updateAchievementProgress,
    startChallenge,
    updateChallengeProgress,
    completeChallenge,
    updateStreak,
    claimReward
  } = useGamificationStore();

  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState<Challenge | null>(null);

  // Track achievements and show notifications
  useEffect(() => {
    const unlockedAchievements = userProgress.achievements;
    
    // Check for new achievements (last one is the newest)
    if (unlockedAchievements.length > 0) {
      const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1];
      
      // Check if this achievement was just unlocked (within the last 5 seconds)
      if (latestAchievement.unlockedAt) {
        const unlockTime = new Date(latestAchievement.unlockedAt).getTime();
        const now = new Date().getTime();
        
        if (now - unlockTime < 5000) {
          setNewAchievement(latestAchievement);
        }
      }
    }
  }, [userProgress.achievements]);

  // Track level ups
  useEffect(() => {
    // Check activity log for level up events
    const levelUpActivities = userProgress.activityLog.filter(
      activity => activity.type === 'level_up'
    );
    
    if (levelUpActivities.length > 0) {
      const latestLevelUp = levelUpActivities[0]; // First one is the newest
      
      // Check if this level up was recent (within the last 5 seconds)
      const levelUpTime = new Date(latestLevelUp.timestamp).getTime();
      const now = new Date().getTime();
      
      if (now - levelUpTime < 5000) {
        const newLevel = levels.find(l => l.level === userProgress.level);
        if (newLevel) {
          setLevelUp(newLevel);
        }
      }
    }
  }, [userProgress.activityLog, userProgress.level, levels]);

  // Track challenge completions
  useEffect(() => {
    const completedChallenges = userProgress.challenges.filter(c => c.completed);
    
    if (completedChallenges.length > 0) {
      const latestChallenge = completedChallenges[completedChallenges.length - 1];
      
      // Check if this challenge was completed recently
      const challengeActivities = userProgress.activityLog.filter(
        activity => activity.type === 'challenge' && 
                   activity.metadata?.challengeId === latestChallenge.id
      );
      
      if (challengeActivities.length > 0) {
        const latestActivity = challengeActivities[0]; // First one is the newest
        const completionTime = new Date(latestActivity.timestamp).getTime();
        const now = new Date().getTime();
        
        if (now - completionTime < 5000) {
          setChallengeCompleted(latestChallenge);
        }
      }
    }
  }, [userProgress.challenges, userProgress.activityLog]);

  // Helper function to award points for completing a habit
  const awardHabitPoints = (habitName: string, metadata?: Record<string, any>) => {
    const basePoints = 15;
    addPoints(basePoints, 'habit', `Completed habit: ${habitName}`, metadata);
    
    // Check for habit-related achievements
    const firstHabitAchievement = availableAchievements.find(a => a.id === 'first_habit');
    if (firstHabitAchievement && !firstHabitAchievement.unlocked) {
      completeAchievement('first_habit');
    }
    
    // Update habit variety achievement
    const habitVarietyAchievement = availableAchievements.find(a => a.id === 'habit_variety');
    if (habitVarietyAchievement && !habitVarietyAchievement.unlocked) {
      // Get unique habit names from activity log
      const habitActivities = userProgress.activityLog.filter(a => a.type === 'habit');
      const uniqueHabits = new Set(habitActivities.map(a => a.description.replace('Completed habit: ', '')));
      
      updateAchievementProgress('habit_variety', uniqueHabits.size);
    }
  };

  // Helper function to check in daily
  const checkInDaily = () => {
    updateStreak(true);
  };

  // Clear notifications
  const clearNotifications = () => {
    setNewAchievement(null);
    setLevelUp(null);
    setChallengeCompleted(null);
  };

  return {
    // State
    userProgress,
    levels,
    availableAchievements,
    availableChallenges,
    settings,
    transactions,
    
    // Notifications
    newAchievement,
    levelUp,
    challengeCompleted,
    clearNotifications,
    
    // Actions
    addPoints,
    awardHabitPoints,
    completeAchievement,
    updateAchievementProgress,
    startChallenge,
    updateChallengeProgress,
    completeChallenge,
    updateStreak,
    checkInDaily,
    claimReward
  };
}