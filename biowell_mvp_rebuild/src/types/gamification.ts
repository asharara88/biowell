export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'habit' | 'streak' | 'milestone' | 'challenge' | 'social';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  rewards: Reward[];
  icon: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'feature' | 'discount' | 'content' | 'virtual';
  icon: string;
  claimed: boolean;
  claimedAt?: string;
  expiresAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  participants?: number;
  leaderboard?: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
}

export interface Streak {
  currentStreak: number;
  bestStreak: number;
  lastCompletedAt: string | null;
  milestones: number[];
  weeklyStreak: number;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  rewards: Reward[];
  challenges: Challenge[];
  streak: Streak;
  activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'achievement' | 'level_up' | 'challenge' | 'streak' | 'habit' | 'reward';
  description: string;
  points: number;
  metadata?: Record<string, any>;
}

export interface GamificationSettings {
  pointsMultiplier: number;
  streakBonusEnabled: boolean;
  challengesEnabled: boolean;
  socialFeaturesEnabled: boolean;
  notificationsEnabled: boolean;
  leaderboardEnabled: boolean;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'expired';
  source: 'habit' | 'streak' | 'challenge' | 'achievement' | 'reward' | 'system';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}