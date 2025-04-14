import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Award, 
  Target, 
  Flame, 
  Gift, 
  Users,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useGamificationStore } from '../../store/gamificationStore';
import LevelProgressBar from '../../components/gamification/LevelProgressBar';
import AchievementCard from '../../components/gamification/AchievementCard';
import ChallengeCard from '../../components/gamification/ChallengeCard';
import StreakDisplay from '../../components/gamification/StreakDisplay';
import ActivityFeed from '../../components/gamification/ActivityFeed';
import DailyCheckInCard from '../../components/gamification/DailyCheckInCard';
import LeaderboardCard from '../../components/gamification/LeaderboardCard';
import PointsHistoryCard from '../../components/gamification/PointsHistoryCard';
import LevelUpModal from '../../components/gamification/LevelUpModal';
import AchievementModal from '../../components/gamification/AchievementModal';
import ChallengeModal from '../../components/gamification/ChallengeModal';

export default function GamificationPage() {
  const { 
    userProgress, 
    levels, 
    availableAchievements, 
    availableChallenges,
    transactions,
    completeAchievement,
    startChallenge,
    updateChallengeProgress,
    completeChallenge,
    claimReward
  } = useGamificationStore();
  
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(availableAchievements[0]);
  
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(availableChallenges[0]);
  
  const [expandedSections, setExpandedSections] = useState({
    achievements: true,
    challenges: true,
    rewards: true
  });

  // Get current level details
  const currentLevelDetails = levels.find(l => l.level === userProgress.level);
  
  // Filter achievements by unlocked status
  const unlockedAchievements = availableAchievements.filter(a => a.unlocked);
  const lockedAchievements = availableAchievements.filter(a => !a.unlocked);
  
  // Filter challenges by active status
  const activeChallenges = availableChallenges.filter(c => 
    new Date(c.startDate) <= new Date() && 
    new Date(c.endDate) >= new Date() &&
    !c.completed
  );
  
  // Get rewards for current level
  const currentLevelRewards = currentLevelDetails?.rewards || [];
  
  // Mock leaderboard data with a mix of Arabic and Western names
  const leaderboardEntries = [
    { userId: '1', username: 'محمد الحسن', avatar: undefined, score: 3250, rank: 1 },
    { userId: '2', username: 'Sarah Johnson', avatar: undefined, score: 2980, rank: 2 },
    { userId: '3', username: 'فاطمة الزهراء', avatar: undefined, score: 2750, rank: 3 },
    { userId: '4', username: 'David Miller', avatar: undefined, score: 2500, rank: 4 },
    { userId: '550e8400-e29b-41d4-a716-446655440000', username: 'You', avatar: undefined, score: userProgress.totalPoints, rank: 5 },
    { userId: '6', username: 'عبدالله محمود', avatar: undefined, score: 2100, rank: 6 },
    { userId: '7', username: 'Emma Wilson', avatar: undefined, score: 1950, rank: 7 },
    { userId: '8', username: 'أحمد خالد', avatar: undefined, score: 1800, rank: 8 },
    { userId: '9', username: 'Olivia Parker', avatar: undefined, score: 1650, rank: 9 },
    { userId: '10', username: 'ياسمين علي', avatar: undefined, score: 1500, rank: 10 },
    { userId: '11', username: 'Michael Brown', avatar: undefined, score: 1450, rank: 11 },
    { userId: '12', username: 'نور الهدى', avatar: undefined, score: 1400, rank: 12 },
    { userId: '13', username: 'James Wilson', avatar: undefined, score: 1350, rank: 13 },
    { userId: '14', username: 'سارة المهدي', avatar: undefined, score: 1300, rank: 14 },
    { userId: '15', username: 'Sophia Garcia', avatar: undefined, score: 1250, rank: 15 }
  ];

  const toggleSectionExpanded = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAchievementClick = (achievement: typeof availableAchievements[0]) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  const handleChallengeClick = (challenge: typeof availableChallenges[0]) => {
    setSelectedChallenge(challenge);
    setShowChallengeModal(true);
  };

  const handleStartChallenge = () => {
    startChallenge(selectedChallenge.id);
    setShowChallengeModal(false);
  };

  const handleContinueChallenge = () => {
    // Simulate progress update
    updateChallengeProgress(selectedChallenge.id, selectedChallenge.progress + 1);
    setShowChallengeModal(false);
  };

  const handleClaimReward = (rewardId: string) => {
    claimReward(rewardId);
  };

  const handleClaimLevelRewards = (rewardIds: string[]) => {
    rewardIds.forEach(id => claimReward(id));
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-16">
      <Helmet>
        <title>Wellness Journey | BIOWELL</title>
        <meta name="description" content="Track your wellness journey, earn rewards, and complete challenges to improve your health and wellness." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Wellness Journey</h1>
            <p className="text-gray-400">Track your progress, earn rewards, and complete challenges</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors">
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <LevelProgressBar 
              currentLevel={userProgress.level}
              totalPoints={userProgress.totalPoints}
              levels={levels}
            />
            
            {/* Daily Check-in */}
            <DailyCheckInCard />
            
            {/* Achievements Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div 
                className="flex items-center justify-between mb-6 cursor-pointer"
                onClick={() => toggleSectionExpanded('achievements')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-400/10 rounded-lg mr-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Achievements</h2>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">
                    {unlockedAchievements.length}/{availableAchievements.length} unlocked
                  </span>
                  {expandedSections.achievements ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedSections.achievements && (
                <>
                  {unlockedAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {unlockedAchievements.slice(0, 4).map(achievement => (
                        <AchievementCard 
                          key={achievement.id}
                          achievement={achievement}
                          onClick={() => handleAchievementClick(achievement)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 mb-6">
                      <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No achievements unlocked yet</p>
                      <p className="text-sm text-gray-500">Complete activities to earn achievements</p>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-medium text-white mb-4">Next Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lockedAchievements.slice(0, 4).map(achievement => (
                      <AchievementCard 
                        key={achievement.id}
                        achievement={achievement}
                      />
                    ))}
                  </div>
                  
                  {(unlockedAchievements.length > 4 || lockedAchievements.length > 4) && (
                    <button className="w-full mt-6 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      View All Achievements
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Challenges Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div 
                className="flex items-center justify-between mb-6 cursor-pointer"
                onClick={() => toggleSectionExpanded('challenges')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-400/10 rounded-lg mr-3">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Challenges</h2>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">
                    {activeChallenges.length} active
                  </span>
                  {expandedSections.challenges ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedSections.challenges && (
                <>
                  {activeChallenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeChallenges.map(challenge => (
                        <ChallengeCard 
                          key={challenge.id}
                          challenge={challenge}
                          onStart={() => handleChallengeClick(challenge)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No active challenges</p>
                      <p className="text-sm text-gray-500">Check back later for new challenges</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Rewards Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div 
                className="flex items-center justify-between mb-6 cursor-pointer"
                onClick={() => toggleSectionExpanded('rewards')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-pink-400/10 rounded-lg mr-3">
                    <Gift className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Rewards</h2>
                </div>
                
                {expandedSections.rewards ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections.rewards && (
                <>
                  <h3 className="text-lg font-medium text-white mb-4">Current Level Rewards</h3>
                  
                  {currentLevelRewards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentLevelRewards.map(reward => (
                        <div 
                          key={reward.id}
                          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                        >
                          <div className="flex items-center mb-3">
                            <Award className="w-5 h-5 text-biowellGreen mr-2" />
                            <h4 className="text-white font-medium">{reward.title}</h4>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                          <button
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={reward.claimed}
                            className={`w-full py-2 rounded-lg font-medium ${
                              reward.claimed 
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                : 'bg-biowellGreen text-black hover:bg-opacity-90 transition-colors'
                            }`}
                          >
                            {reward.claimed ? 'Claimed' : 'Claim Reward'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No rewards available at your current level</p>
                      <p className="text-sm text-gray-500">Level up to unlock more rewards</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Streak Display */}
            <StreakDisplay streakData={userProgress.streak} />
            
            {/* Leaderboard */}
            <LeaderboardCard 
              entries={leaderboardEntries}
              currentUserId={userProgress.userId}
            />
            
            {/* Activity Feed */}
            <ActivityFeed activities={userProgress.activityLog} />
            
            {/* Points History */}
            <PointsHistoryCard transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LevelUpModal 
        isOpen={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        level={selectedLevel}
        onClaimRewards={handleClaimLevelRewards}
      />
      
      <AchievementModal 
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        achievement={selectedAchievement}
        onShare={() => completeAchievement('first_share')}
      />
      
      <ChallengeModal 
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        challenge={selectedChallenge}
        onStart={handleStartChallenge}
        onContinue={handleContinueChallenge}
      />
    </div>
  );
}