import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  UserProgress, 
  Achievement, 
  Challenge, 
  Reward, 
  Level, 
  ActivityLogEntry,
  GamificationSettings,
  PointsTransaction
} from '../types/gamification';

interface GamificationState {
  userProgress: UserProgress;
  levels: Level[];
  availableAchievements: Achievement[];
  availableChallenges: Challenge[];
  settings: GamificationSettings;
  transactions: PointsTransaction[];
  
  // Actions
  addPoints: (amount: number, source: PointsTransaction['source'], description: string, metadata?: Record<string, any>) => void;
  spendPoints: (amount: number, description: string, metadata?: Record<string, any>) => boolean;
  completeAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  startChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  updateStreak: (completed: boolean) => void;
  claimReward: (rewardId: string) => void;
  updateSettings: (settings: Partial<GamificationSettings>) => void;
  resetProgress: () => void;
}

// Define levels
const gamificationLevels: Level[] = [
  {
    level: 1,
    title: 'Wellness Novice',
    minPoints: 0,
    maxPoints: 99,
    icon: 'seedling',
    rewards: [
      {
        id: 'welcome_badge',
        title: 'Welcome Badge',
        description: 'Your first step on your wellness journey',
        type: 'badge',
        icon: 'award',
        claimed: false
      }
    ]
  },
  {
    level: 2,
    title: 'Health Explorer',
    minPoints: 100,
    maxPoints: 299,
    icon: 'compass',
    rewards: [
      {
        id: 'explorer_badge',
        title: 'Explorer Badge',
        description: 'You\'ve begun exploring your wellness potential',
        type: 'badge',
        icon: 'map',
        claimed: false
      }
    ]
  },
  {
    level: 3,
    title: 'Wellness Enthusiast',
    minPoints: 300,
    maxPoints: 599,
    icon: 'zap',
    rewards: [
      {
        id: 'enthusiast_badge',
        title: 'Enthusiast Badge',
        description: 'Your enthusiasm for wellness is growing',
        type: 'badge',
        icon: 'zap',
        claimed: false
      },
      {
        id: 'custom_theme',
        title: 'Custom Theme',
        description: 'Unlock custom app themes',
        type: 'feature',
        icon: 'palette',
        claimed: false
      }
    ]
  },
  {
    level: 4,
    title: 'Wellness Adept',
    minPoints: 600,
    maxPoints: 999,
    icon: 'star',
    rewards: [
      {
        id: 'adept_badge',
        title: 'Adept Badge',
        description: 'You\'re becoming adept at maintaining your wellness',
        type: 'badge',
        icon: 'star',
        claimed: false
      }
    ]
  },
  {
    level: 5,
    title: 'Health Champion',
    minPoints: 1000,
    maxPoints: 1499,
    icon: 'award',
    rewards: [
      {
        id: 'champion_badge',
        title: 'Champion Badge',
        description: 'You\'re a champion of health and wellness',
        type: 'badge',
        icon: 'award',
        claimed: false
      },
      {
        id: 'premium_content',
        title: 'Premium Content',
        description: 'Unlock premium wellness content',
        type: 'content',
        icon: 'book-open',
        claimed: false
      }
    ]
  },
  {
    level: 6,
    title: 'Wellness Master',
    minPoints: 1500,
    maxPoints: 2499,
    icon: 'shield',
    rewards: [
      {
        id: 'master_badge',
        title: 'Master Badge',
        description: 'You\'ve mastered the art of wellness',
        type: 'badge',
        icon: 'shield',
        claimed: false
      }
    ]
  },
  {
    level: 7,
    title: 'Health Guru',
    minPoints: 2500,
    maxPoints: 3999,
    icon: 'sun',
    rewards: [
      {
        id: 'guru_badge',
        title: 'Guru Badge',
        description: 'Your wellness wisdom is inspirational',
        type: 'badge',
        icon: 'sun',
        claimed: false
      },
      {
        id: 'exclusive_features',
        title: 'Exclusive Features',
        description: 'Unlock exclusive app features',
        type: 'feature',
        icon: 'gift',
        claimed: false
      }
    ]
  },
  {
    level: 8,
    title: 'Wellness Sage',
    minPoints: 4000,
    maxPoints: 5999,
    icon: 'crown',
    rewards: [
      {
        id: 'sage_badge',
        title: 'Sage Badge',
        description: 'Your wellness journey has reached sage status',
        type: 'badge',
        icon: 'crown',
        claimed: false
      }
    ]
  },
  {
    level: 9,
    title: 'Health Legend',
    minPoints: 6000,
    maxPoints: 9999,
    icon: 'trophy',
    rewards: [
      {
        id: 'legend_badge',
        title: 'Legend Badge',
        description: 'Your commitment to wellness is legendary',
        type: 'badge',
        icon: 'trophy',
        claimed: false
      },
      {
        id: 'premium_discount',
        title: '25% Discount',
        description: '25% off your next supplement order',
        type: 'discount',
        icon: 'percent',
        claimed: false
      }
    ]
  },
  {
    level: 10,
    title: 'Wellness Immortal',
    minPoints: 10000,
    maxPoints: Infinity,
    icon: 'infinity',
    rewards: [
      {
        id: 'immortal_badge',
        title: 'Immortal Badge',
        description: 'You\'ve reached the pinnacle of wellness achievement',
        type: 'badge',
        icon: 'infinity',
        claimed: false
      },
      {
        id: 'lifetime_feature',
        title: 'Lifetime Premium',
        description: 'Unlock all premium features permanently',
        type: 'feature',
        icon: 'key',
        claimed: false
      }
    ]
  }
];

// Define achievements
const initialAchievements: Achievement[] = [
  // Habit achievements
  {
    id: 'first_habit',
    title: 'First Step',
    description: 'Complete your first habit',
    icon: 'footprints',
    category: 'habit',
    points: 10,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'habit_streak_3',
    title: 'Habit Builder',
    description: 'Complete the same habit 3 days in a row',
    icon: 'repeat',
    category: 'habit',
    points: 25,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'habit_streak_7',
    title: 'Habit Master',
    description: 'Complete the same habit 7 days in a row',
    icon: 'calendar-check',
    category: 'habit',
    points: 50,
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'habit_streak_30',
    title: 'Habit Champion',
    description: 'Complete the same habit 30 days in a row',
    icon: 'trophy',
    category: 'habit',
    points: 200,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'habit_variety',
    title: 'Wellness Explorer',
    description: 'Complete 5 different habits',
    icon: 'compass',
    category: 'habit',
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: 'uncommon'
  },
  
  // Streak achievements
  {
    id: 'first_streak',
    title: 'Streak Starter',
    description: 'Start your first daily streak',
    icon: 'flame',
    category: 'streak',
    points: 15,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'calendar',
    category: 'streak',
    points: 75,
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: 'calendar-days',
    category: 'streak',
    points: 250,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'streak_90',
    title: 'Quarterly Champion',
    description: 'Maintain a 90-day streak',
    icon: 'award',
    category: 'streak',
    points: 500,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'streak_365',
    title: 'Year of Wellness',
    description: 'Maintain a 365-day streak',
    icon: 'crown',
    category: 'streak',
    points: 1000,
    unlocked: false,
    rarity: 'legendary'
  },
  
  // Milestone achievements
  {
    id: 'first_supplement',
    title: 'Supplement Starter',
    description: 'Add your first supplement to your stack',
    icon: 'pill',
    category: 'milestone',
    points: 20,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'connect_device',
    title: 'Connected Wellness',
    description: 'Connect your first wearable device',
    icon: 'activity',
    category: 'milestone',
    points: 50,
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'complete_profile',
    title: 'Profile Perfectionist',
    description: 'Complete your wellness profile',
    icon: 'user-check',
    category: 'milestone',
    points: 30,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'first_cgm',
    title: 'Glucose Guardian',
    description: 'Connect your first CGM device',
    icon: 'activity',
    category: 'milestone',
    points: 75,
    unlocked: false,
    rarity: 'rare'
  },
  
  // Challenge achievements
  {
    id: 'first_challenge',
    title: 'Challenger',
    description: 'Complete your first challenge',
    icon: 'target',
    category: 'challenge',
    points: 50,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'challenge_streak_3',
    title: 'Challenge Enthusiast',
    description: 'Complete 3 challenges',
    icon: 'flag',
    category: 'challenge',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    rarity: 'uncommon'
  },
  {
    id: 'challenge_streak_10',
    title: 'Challenge Master',
    description: 'Complete 10 challenges',
    icon: 'medal',
    category: 'challenge',
    points: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rarity: 'rare'
  },
  
  // Social achievements
  {
    id: 'first_share',
    title: 'Wellness Advocate',
    description: 'Share your first achievement',
    icon: 'share',
    category: 'social',
    points: 25,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'invite_friend',
    title: 'Wellness Ambassador',
    description: 'Invite a friend to join BIOWELL',
    icon: 'users',
    category: 'social',
    points: 100,
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'team_challenge',
    title: 'Team Player',
    description: 'Participate in a team challenge',
    icon: 'users',
    category: 'social',
    points: 75,
    unlocked: false,
    rarity: 'uncommon'
  }
];

// Define challenges
const initialChallenges: Challenge[] = [
  {
    id: 'daily_steps',
    title: 'Step Master',
    description: 'Reach 10,000 steps in a day',
    category: 'daily',
    difficulty: 'medium',
    points: 50,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 10000
  },
  {
    id: 'water_intake',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water today',
    category: 'daily',
    difficulty: 'easy',
    points: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 8
  },
  {
    id: 'meditation_week',
    title: 'Mindfulness Master',
    description: 'Complete 5 meditation sessions this week',
    category: 'weekly',
    difficulty: 'medium',
    points: 100,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'sleep_quality',
    title: 'Sleep Champion',
    description: 'Achieve 7+ hours of sleep for 5 consecutive nights',
    category: 'weekly',
    difficulty: 'hard',
    points: 150,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'nutrition_tracking',
    title: 'Nutrition Tracker',
    description: 'Log all your meals for 7 consecutive days',
    category: 'weekly',
    difficulty: 'medium',
    points: 120,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'monthly_workout',
    title: 'Fitness Fanatic',
    description: 'Complete 20 workouts this month',
    category: 'monthly',
    difficulty: 'hard',
    points: 300,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    completed: false,
    progress: 0,
    maxProgress: 20
  }
];

// Initial state
const initialUserProgress: UserProgress = {
  userId: '550e8400-e29b-41d4-a716-446655440000', // Demo user ID
  totalPoints: 0,
  level: 1,
  achievements: [],
  rewards: [],
  challenges: [],
  streak: {
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    milestones: [],
    weeklyStreak: 0
  },
  activityLog: []
};

const initialSettings: GamificationSettings = {
  pointsMultiplier: 1.0,
  streakBonusEnabled: true,
  challengesEnabled: true,
  socialFeaturesEnabled: true,
  notificationsEnabled: true,
  leaderboardEnabled: true
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      userProgress: initialUserProgress,
      levels: gamificationLevels,
      availableAchievements: initialAchievements,
      availableChallenges: initialChallenges,
      settings: initialSettings,
      transactions: [],
      
      addPoints: (amount, source, description, metadata) => {
        const { userProgress, levels, settings } = get();
        
        // Apply points multiplier
        const adjustedAmount = Math.round(amount * settings.pointsMultiplier);
        
        // Apply streak bonus if enabled
        let bonusPoints = 0;
        if (settings.streakBonusEnabled && userProgress.streak.currentStreak > 0) {
          // 5% bonus for each day of streak, capped at 50%
          const streakBonus = Math.min(userProgress.streak.currentStreak * 0.05, 0.5);
          bonusPoints = Math.round(adjustedAmount * streakBonus);
        }
        
        const totalAmount = adjustedAmount + bonusPoints;
        const newTotalPoints = userProgress.totalPoints + totalAmount;
        
        // Determine new level
        let newLevel = userProgress.level;
        for (const level of levels) {
          if (newTotalPoints >= level.minPoints && newTotalPoints <= level.maxPoints) {
            newLevel = level.level;
            break;
          }
        }
        
        // Check if level up occurred
        const didLevelUp = newLevel > userProgress.level;
        
        // Create transaction record
        const transaction: PointsTransaction = {
          id: crypto.randomUUID(),
          userId: userProgress.userId,
          amount: totalAmount,
          type: 'earned',
          source,
          description,
          timestamp: new Date().toISOString(),
          metadata: {
            ...metadata,
            baseAmount: amount,
            multiplier: settings.pointsMultiplier,
            bonusPoints,
            streakBonus: settings.streakBonusEnabled && userProgress.streak.currentStreak > 0
          }
        };
        
        // Create activity log entry
        const activityEntry: ActivityLogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type: source as ActivityLogEntry['type'],
          description,
          points: totalAmount
        };
        
        // If level up occurred, add level up activity
        const activityEntries = [activityEntry];
        if (didLevelUp) {
          activityEntries.push({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            type: 'level_up',
            description: `Leveled up to ${newLevel}: ${levels.find(l => l.level === newLevel)?.title}`,
            points: 0
          });
        }
        
        set(state => ({
          userProgress: {
            ...state.userProgress,
            totalPoints: newTotalPoints,
            level: newLevel,
            activityLog: [...activityEntries, ...state.userProgress.activityLog].slice(0, 100) // Keep last 100 activities
          },
          transactions: [transaction, ...state.transactions]
        }));
        
        return { totalAmount, didLevelUp, newLevel };
      },
      
      spendPoints: (amount, description, metadata) => {
        const { userProgress } = get();
        
        // Check if user has enough points
        if (userProgress.totalPoints < amount) {
          return false;
        }
        
        // Create transaction record
        const transaction: PointsTransaction = {
          id: crypto.randomUUID(),
          userId: userProgress.userId,
          amount,
          type: 'spent',
          source: 'system',
          description,
          timestamp: new Date().toISOString(),
          metadata
        };
        
        // Create activity log entry
        const activityEntry: ActivityLogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type: 'reward',
          description,
          points: -amount
        };
        
        set(state => ({
          userProgress: {
            ...state.userProgress,
            totalPoints: state.userProgress.totalPoints - amount,
            activityLog: [activityEntry, ...state.userProgress.activityLog].slice(0, 100)
          },
          transactions: [transaction, ...state.transactions]
        }));
        
        return true;
      },
      
      completeAchievement: (achievementId) => {
        const { userProgress, availableAchievements, addPoints } = get();
        
        // Find the achievement
        const achievement = availableAchievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) {
          return;
        }
        
        // Mark achievement as unlocked
        const updatedAchievement: Achievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        
        // Add points
        addPoints(
          achievement.points, 
          'achievement', 
          `Unlocked achievement: ${achievement.title}`,
          { achievementId }
        );
        
        // Update state
        set(state => ({
          userProgress: {
            ...state.userProgress,
            achievements: [...state.userProgress.achievements, updatedAchievement]
          },
          availableAchievements: state.availableAchievements.map(a => 
            a.id === achievementId ? updatedAchievement : a
          )
        }));
      },
      
      updateAchievementProgress: (achievementId, progress) => {
        const { availableAchievements, completeAchievement } = get();
        
        // Find the achievement
        const achievement = availableAchievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) {
          return;
        }
        
        // Update progress
        const updatedAchievement: Achievement = {
          ...achievement,
          progress
        };
        
        // Check if achievement is completed
        if (achievement.maxProgress && progress >= achievement.maxProgress) {
          completeAchievement(achievementId);
          return;
        }
        
        // Update state
        set(state => ({
          availableAchievements: state.availableAchievements.map(a => 
            a.id === achievementId ? updatedAchievement : a
          )
        }));
      },
      
      startChallenge: (challengeId) => {
        const { availableChallenges } = get();
        
        // Find the challenge
        const challenge = availableChallenges.find(c => c.id === challengeId);
        if (!challenge) {
          return;
        }
        
        // Add challenge to user progress
        set(state => ({
          userProgress: {
            ...state.userProgress,
            challenges: [...state.userProgress.challenges, challenge]
          }
        }));
      },
      
      updateChallengeProgress: (challengeId, progress) => {
        const { userProgress, completeChallenge } = get();
        
        // Find the challenge
        const challenge = userProgress.challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.completed) {
          return;
        }
        
        // Update progress
        const updatedChallenge: Challenge = {
          ...challenge,
          progress
        };
        
        // Check if challenge is completed
        if (progress >= challenge.maxProgress) {
          completeChallenge(challengeId);
          return;
        }
        
        // Update state
        set(state => ({
          userProgress: {
            ...state.userProgress,
            challenges: state.userProgress.challenges.map(c => 
              c.id === challengeId ? updatedChallenge : c
            )
          }
        }));
      },
      
      completeChallenge: (challengeId) => {
        const { userProgress, addPoints } = get();
        
        // Find the challenge
        const challenge = userProgress.challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.completed) {
          return;
        }
        
        // Mark challenge as completed
        const updatedChallenge: Challenge = {
          ...challenge,
          completed: true,
          progress: challenge.maxProgress
        };
        
        // Add points
        addPoints(
          challenge.points, 
          'challenge', 
          `Completed challenge: ${challenge.title}`,
          { challengeId }
        );
        
        // Update state
        set(state => ({
          userProgress: {
            ...state.userProgress,
            challenges: state.userProgress.challenges.map(c => 
              c.id === challengeId ? updatedChallenge : c
            )
          }
        }));
        
        // Check for challenge-related achievements
        const { completeAchievement, updateAchievementProgress, availableAchievements } = get();
        
        // First challenge achievement
        const firstChallengeAchievement = availableAchievements.find(a => a.id === 'first_challenge');
        if (firstChallengeAchievement && !firstChallengeAchievement.unlocked) {
          completeAchievement('first_challenge');
        }
        
        // Challenge streak achievements
        const completedChallenges = get().userProgress.challenges.filter(c => c.completed).length;
        
        if (completedChallenges >= 3) {
          updateAchievementProgress('challenge_streak_3', completedChallenges);
        }
        
        if (completedChallenges >= 10) {
          updateAchievementProgress('challenge_streak_10', completedChallenges);
        }
      },
      
      updateStreak: (completed) => {
        const { userProgress, addPoints, completeAchievement } = get();
        const { streak } = userProgress;
        
        const today = new Date();
        const lastCompleted = streak.lastCompletedAt ? new Date(streak.lastCompletedAt) : null;
        
        // If not completed, reset streak
        if (!completed) {
          set(state => ({
            userProgress: {
              ...state.userProgress,
              streak: {
                ...state.userProgress.streak,
                currentStreak: 0,
                lastCompletedAt: null
              }
            }
          }));
          return;
        }
        
        // Calculate new streak
        let newStreak = streak.currentStreak;
        let newWeeklyStreak = streak.weeklyStreak;
        
        if (!lastCompleted) {
          // First time completing
          newStreak = 1;
          newWeeklyStreak = 1;
          
          // First streak achievement
          completeAchievement('first_streak');
        } else {
          const daysSinceLastCompleted = Math.floor(
            (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSinceLastCompleted <= 1) {
            // Streak continues
            newStreak += 1;
            
            // Check if it's a new day of the week
            const lastDay = lastCompleted.getDay();
            const today = new Date().getDay();
            if (lastDay !== today) {
              newWeeklyStreak += 1;
            }
          } else {
            // Streak broken
            newStreak = 1;
            newWeeklyStreak = 1;
          }
        }
        
        // Calculate streak milestones
        const newMilestones = [...streak.milestones];
        const milestonesToCheck = [7, 30, 90, 365];
        
        for (const milestone of milestonesToCheck) {
          if (newStreak >= milestone && !newMilestones.includes(milestone)) {
            newMilestones.push(milestone);
          }
        }
        
        // Award streak points (base + bonus for longer streaks)
        const basePoints = 10;
        const streakBonus = Math.min(Math.floor(newStreak / 5) * 5, 50); // +5 points per 5 days, max +50
        const totalPoints = basePoints + streakBonus;
        
        addPoints(
          totalPoints,
          'streak',
          `Daily streak: ${newStreak} days`,
          { streakDays: newStreak, streakBonus }
        );
        
        // Update state
        set(state => ({
          userProgress: {
            ...state.userProgress,
            streak: {
              currentStreak: newStreak,
              bestStreak: Math.max(state.userProgress.streak.bestStreak, newStreak),
              lastCompletedAt: today.toISOString(),
              milestones: newMilestones,
              weeklyStreak: newWeeklyStreak
            }
          }
        }));
        
        // Check for streak-related achievements
        if (newStreak >= 7) {
          completeAchievement('streak_7');
        }
        
        if (newStreak >= 30) {
          completeAchievement('streak_30');
        }
        
        if (newStreak >= 90) {
          completeAchievement('streak_90');
        }
        
        if (newStreak >= 365) {
          completeAchievement('streak_365');
        }
      },
      
      claimReward: (rewardId) => {
        const { userProgress, levels } = get();
        
        // Find the reward in the user's current level
        const currentLevel = levels.find(l => l.level === userProgress.level);
        if (!currentLevel) return;
        
        const reward = currentLevel.rewards.find(r => r.id === rewardId);
        if (!reward || reward.claimed) return;
        
        // Mark reward as claimed
        const updatedReward: Reward = {
          ...reward,
          claimed: true,
          claimedAt: new Date().toISOString()
        };
        
        // Update state
        set(state => ({
          userProgress: {
            ...state.userProgress,
            rewards: [...state.userProgress.rewards, updatedReward]
          },
          levels: state.levels.map(l => 
            l.level === userProgress.level
              ? {
                  ...l,
                  rewards: l.rewards.map(r => 
                    r.id === rewardId ? updatedReward : r
                  )
                }
              : l
          )
        }));
        
        // Add activity log entry
        const activityEntry: ActivityLogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type: 'reward',
          description: `Claimed reward: ${reward.title}`,
          points: 0
        };
        
        set(state => ({
          userProgress: {
            ...state.userProgress,
            activityLog: [activityEntry, ...state.userProgress.activityLog].slice(0, 100)
          }
        }));
      },
      
      updateSettings: (newSettings) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        }));
      },
      
      resetProgress: () => {
        set({
          userProgress: initialUserProgress,
          availableAchievements: initialAchievements,
          availableChallenges: initialChallenges,
          transactions: []
        });
      }
    }),
    {
      name: 'biowell-gamification',
      partialize: (state) => ({
        userProgress: state.userProgress,
        settings: state.settings,
        transactions: state.transactions
      })
    }
  )
);