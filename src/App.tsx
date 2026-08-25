import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  ScreenType,
  ChildProfile,
  ParentSettings,
  SavedArtwork,
  BuddyState,
  StreakData,
  DailyMission,
  AchievementBadge,
  ActivityCategory
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredArtworks,
  saveStoredArtworks,
  getStoredParentSettings,
  saveStoredParentSettings,
  getStoredBuddy,
  saveStoredBuddy,
  getStoredStreak,
  updateStreakOnActivity,
  getStoredDailyMissions,
  saveStoredDailyMissions,
  getStoredAchievements,
  saveStoredAchievements,
  logActivityEvent,
  addActiveScreenTimeMinutes
} from './services/storage';
import { sound } from './services/soundEffects';
import { HomeScreen } from './components/screens/HomeScreen';
import { ColoringScreen } from './components/screens/ColoringScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { ColorChallengesScreen } from './components/screens/ColorChallengesScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { AdventureWorldScreen } from './components/screens/AdventureWorldScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { ParentDashboard } from './components/screens/ParentDashboard';
import { BuddyScreen } from './components/screens/BuddyScreen';
import { ParentGateModal } from './components/ParentGateModal';
import { MissionsAndBadgesModal } from './components/screens/MissionsAndBadgesModal';
import { AIBuddyScreen } from './components/screens/AIBuddyScreen';
import { SpeakRepeatScreen } from './components/screens/SpeakRepeatScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedColoringPageId, setSelectedColoringPageId] = useState<string>('roo-artist');

  const [profile, setProfile] = useState<ChildProfile>(getStoredProfile);
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>(getStoredArtworks);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(getStoredParentSettings);
  const [buddy, setBuddy] = useState<BuddyState>(getStoredBuddy);
  const [streakData, setStreakData] = useState<StreakData>(getStoredStreak);
  const [missions, setMissions] = useState<DailyMission[]>(getStoredDailyMissions);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(getStoredAchievements);

  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState<boolean>(false);
  const [showScreenTimeLimitToast, setShowScreenTimeLimitToast] = useState<boolean>(false);

  // Active Screen Time Timer (Tracks active foreground app minutes)
  useEffect(() => {
    let interval: any = null;
    const handleVisibility = () => {
      if (document.hidden) {
        if (interval) clearInterval(interval);
      } else {
        interval = setInterval(() => {
          addActiveScreenTimeMinutes(1);
          setProfile(p => {
            const nextMin = p.todayMinutes + 1;
            if (parentSettings.dailyLimitMinutes > 0 && nextMin >= parentSettings.dailyLimitMinutes) {
              setShowScreenTimeLimitToast(true);
            }
            return { ...p, todayMinutes: nextMin };
          });
        }, 60000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [parentSettings.dailyLimitMinutes]);

  useEffect(() => { saveStoredProfile(profile); }, [profile]);
  useEffect(() => { saveStoredArtworks(savedArtworks); }, [savedArtworks]);
  useEffect(() => { saveStoredBuddy(buddy); }, [buddy]);
  useEffect(() => { saveStoredDailyMissions(missions); }, [missions]);
  useEffect(() => { saveStoredAchievements(achievements); }, [achievements]);

  useEffect(() => {
    saveStoredParentSettings(parentSettings);
    sound.volume = parentSettings.soundVolume;
    sound.voiceEnabled = parentSettings.speechNarratorEnabled;
  }, [parentSettings]);

  // Central Star Economy
  const handleAddStars = (amount: number) => {
    setProfile(prev => {
      const nextStars = prev.stars + amount;
      // Check Star Collector badge
      setAchievements(badges => badges.map(b => {
        if (b.id === 'ach-collector') {
          const isDone = nextStars >= b.target;
          return { ...b, current: nextStars, unlocked: isDone };
        }
        return b;
      }));
      return {
        ...prev,
        stars: nextStars,
        level: Math.floor(nextStars / 10) + 1
      };
    });
  };

  const handleSpendStars = (amount: number): boolean => {
    if (profile.stars < amount) return false;
    setProfile(prev => ({
      ...prev,
      stars: prev.stars - amount
    }));
    return true;
  };

  // Activity Logger & Central Progression Sync
  const recordActivityCompletion = (
    type: 'challenge' | 'arcade' | 'adventure' | 'coloring' | 'learning',
    title: string,
    category: ActivityCategory,
    categoryName: string,
    iconEmoji: string,
    starsEarned = 10
  ) => {
    // 1. Maintain Streak
    const updatedStreak = updateStreakOnActivity();
    setStreakData(updatedStreak);

    // 2. Add Buddy XP
    setBuddy(b => {
      const nextXp = b.xp + 15;
      if (nextXp >= b.xpToNextLevel) {
        sound.speak(`Level up! ${b.name} is now level ${b.level + 1}!`);
        return { ...b, level: b.level + 1, xp: nextXp, xpToNextLevel: b.xpToNextLevel + 100, happiness: 'excited' };
      }
      return { ...b, xp: nextXp, happiness: 'happy' };
    });

    // 3. Update Daily Missions
    setMissions(prev => prev.map(m => {
      if (m.activityType === type && !m.completed) {
        const nextVal = m.current + 1;
        const isDone = nextVal >= m.target;
        return { ...m, current: nextVal, completed: isDone };
      }
      return m;
    }));

    // 4. Log Activity for Parent Dashboard
    logActivityEvent({
      title,
      category,
      categoryName,
      iconEmoji,
      starsEarned
    });

    // 5. Update Achievements
    setAchievements(badges => badges.map(b => {
      if (type === 'challenge' && b.id === 'ach-color') {
        const n = b.current + 1;
        return { ...b, current: n, unlocked: n >= b.target };
      }
      if (type === 'arcade' && b.id === 'ach-brain') {
        const n = b.current + 1;
        return { ...b, current: n, unlocked: n >= b.target };
      }
      if (type === 'adventure' && b.id === 'ach-adventure') {
        const n = b.current + 1;
        return { ...b, current: n, unlocked: n >= b.target };
      }
      if (b.id === 'ach-super') {
        const n = b.current + 1;
        return { ...b, current: n, unlocked: n >= b.target };
      }
      return b;
    }));
  };

  const handleClaimMission = (missionId: string) => {
    const targetMission = missions.find(m => m.id === missionId);
    if (!targetMission || targetMission.claimed) return;

    handleAddStars(targetMission.rewardStars);
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, claimed: true } : m));
  };

  const handleTriggerFullReset = () => {
    setProfile(getStoredProfile());
    setBuddy(getStoredBuddy());
    setStreakData(getStoredStreak());
    setMissions(getStoredDailyMissions());
    setAchievements(getStoredAchievements());
    setSavedArtworks([]);
    setCurrentScreen('home');
  };

  const allMissionsCompleted = missions.every(m => m.completed);

  return (
    <div className="w-screen h-screen bg-[#F3E8FF] overflow-hidden select-none fixed inset-0 z-50">
      <main className="w-full h-full relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen
              key={profile.name + profile.avatar}
              profile={profile}
              buddy={buddy}
              streakData={streakData}
              allMissionsCompleted={allMissionsCompleted}
              onNavigate={setCurrentScreen}
              onSelectColoringPage={(id) => {
                setSelectedColoringPageId(id);
                setCurrentScreen('coloring');
              }}
              onAddStars={handleAddStars}
              onOpenParentGate={() => setIsParentGateOpen(true)}
              onOpenMissionsModal={() => setIsMissionsModalOpen(true)}
            />
          )}

          {currentScreen === 'coloring' && (
            <ColoringScreen
              initialPageId={selectedColoringPageId}
              onFinishColoring={() => {
                recordActivityCompletion('coloring', 'Coloring Artwork', 'art', 'Paint Studio', '🎨', 10);
                setCurrentScreen('home');
              }}
              onBack={() => setCurrentScreen('home')}
              userStars={profile.stars}
            />
          )}

          {currentScreen === 'learning' && (
            <LearningScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={(amt) => {
                handleAddStars(amt);
                recordActivityCompletion('learning', 'Phonics & Math Lesson', 'abc', 'Learn & Play', '🔤', amt);
              }}
            />
          )}

          {currentScreen === 'challenges' && (
            <ColorChallengesScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={(amt) => {
                handleAddStars(amt);
                recordActivityCompletion('challenge', 'Color Quest Challenge', 'colors', 'Color Challenges', '🌈', amt);
              }}
            />
          )}

          {currentScreen === 'games' && (
            <GamesScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={(amt) => {
                handleAddStars(amt);
                recordActivityCompletion('arcade', 'Arcade Mini-Game', 'memory', 'Arcade Fun', '🎮', amt);
              }}
            />
          )}

          {currentScreen === 'adventure' && (
            <AdventureWorldScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={(amt) => {
                handleAddStars(amt);
                recordActivityCompletion('adventure', 'Coloroo Forest Quest', 'adventure', 'Adventure World', '🌳', amt);
              }}
            />
          )}

          {currentScreen === 'buddy' && (
            <BuddyScreen
              buddy={buddy}
              userStars={profile.stars}
              onUpdateBuddy={setBuddy}
              onSpendStars={handleSpendStars}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'trophies' && (
            <TrophyScreen
              profile={profile}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'ai-buddy' && (
            <AIBuddyScreen
              onBack={() => setCurrentScreen('home')}
            />
          )}

                {currentScreen === 'speak-repeat' && (
        <SpeakRepeatScreen
          onBack={() => setCurrentScreen('home')}
          onAddStars={(amount) => {
            setProfile(prev => ({
              ...prev,
              stars: prev.stars + amount
            }));
          }}
        />
      )}
      {currentScreen === 'parent' && (
            <ParentDashboard
              profile={profile}
              settings={parentSettings}
              buddy={buddy}
              streakData={streakData}
              achievements={achievements}
              savedArtworks={savedArtworks}
              onUpdateSettings={setParentSettings}
              onUpdateProfile={setProfile}
              onBack={() => setCurrentScreen('home')}
              onTriggerFullReset={handleTriggerFullReset}
            />
          )}
        </AnimatePresence>
      </main>

      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setCurrentScreen('parent');
        }}
        requiredPin={parentSettings.pinCode}
      />

      <MissionsAndBadgesModal
        isOpen={isMissionsModalOpen}
        streakData={streakData}
        missions={missions}
        achievements={achievements}
        onClaimMission={handleClaimMission}
        onClose={() => setIsMissionsModalOpen(false)}
      />

      {/* Screen Time Friendly Break Reminder Toast */}
      {showScreenTimeLimitToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-purple-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <h4 className="text-xs font-black font-['Fredoka']">Great job learning today!</h4>
            <p className="text-[10px] text-amber-200">Time for a little fun break from the screen.</p>
          </div>
          <button
            onClick={() => setShowScreenTimeLimitToast(false)}
            className="px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold"
          >
            Okay
          </button>
        </div>
      )}
    </div>
  );
}
