import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, ChildProfile, ParentSettings, SavedArtwork } from './types';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredArtworks, 
  saveStoredArtworks, 
  getStoredParentSettings, 
  saveStoredParentSettings 
} from './services/storage';
import { sound } from './services/soundEffects';
import { NavigationDock } from './components/NavigationDock';
import { TabletStatusBar } from './components/TabletStatusBar';
import { HomeScreen } from './components/screens/HomeScreen';
import { ColoringScreen } from './components/screens/ColoringScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { ParentDashboard } from './components/screens/ParentDashboard';
import { ParentGateModal } from './components/ParentGateModal';
import { CelebrationModal } from './components/CelebrationModal';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedColoringPageId, setSelectedColoringPageId] = useState<string>('roo-artist');

  // Stored State
  const [profile, setProfile] = useState<ChildProfile>(getStoredProfile);
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>(getStoredArtworks);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(getStoredParentSettings);

  // Tablet UI & Audio State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTabletFrame, setIsTabletFrame] = useState<boolean>(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number>(25);

  // Modal State
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    starsEarned?: number;
    unlockedStickerEmoji?: string;
    pendingArtwork?: SavedArtwork | null;
  }>({
    isOpen: false,
    starsEarned: 3,
    pendingArtwork: null
  });

  // Lock screen orientation to landscape for native Expo mobile/tablet
  useEffect(() => {
    try {
      import('expo-screen-orientation').then((ScreenOrientation) => {
        if (ScreenOrientation && typeof ScreenOrientation.lockAsync === 'function') {
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
        }
      }).catch(() => {});
    } catch {}
  }, []);

  // Sync storage on state change
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredArtworks(savedArtworks);
  }, [savedArtworks]);

  useEffect(() => {
    saveStoredParentSettings(parentSettings);
    sound.volume = parentSettings.soundVolume;
    sound.voiceEnabled = parentSettings.speechNarratorEnabled;
  }, [parentSettings]);

  // Audio mute/unmute
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playPop();
  };

  // Add Stars handler
  const handleAddStars = (amount: number) => {
    setProfile(prev => {
      const nextStars = prev.stars + amount;
      const nextLevel = Math.floor(nextStars / 8) + 1;
      return {
        ...prev,
        stars: nextStars,
        level: Math.max(prev.level, nextLevel)
      };
    });
  };

  // Open coloring page from home or gallery
  const handleSelectColoringPage = (pageId: string) => {
    setSelectedColoringPageId(pageId);
    setCurrentScreen('coloring');
  };

  // Finish coloring session
  const handleFinishColoring = (artwork: SavedArtwork) => {
    handleAddStars(3);
    setProfile(prev => ({
      ...prev,
      completedColorings: prev.completedColorings + 1
    }));

    setCelebrationState({
      isOpen: true,
      title: "Superstar Artist!",
      subtitle: `You finished painting "${artwork.pageTitle}"!`,
      starsEarned: 3,
      unlockedStickerEmoji: "🎨",
      pendingArtwork: artwork
    });
  };

  const handleSaveCelebratedArt = () => {
    if (celebrationState.pendingArtwork) {
      setSavedArtworks(prev => [celebrationState.pendingArtwork!, ...prev]);
    }
    setCelebrationState(prev => ({ ...prev, isOpen: false }));
    setCurrentScreen('trophies');
  };

  return (
    <div className="w-screen h-screen bg-[#F3E8FF] flex items-center justify-center overflow-hidden p-0 sm:p-2 md:p-3 select-none relative">
      {/* Artistic Flair Ambient Glowing Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[450px] h-[450px] bg-rose-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-16 right-[-20px] opacity-15 transform rotate-12 pointer-events-none text-9xl hidden xl:block select-none">
        🦄
      </div>

      {/* Landscape Container Frame (Optional Android Tablet Bezel Wrapper) */}
      <div 
        id="coloroo-tablet-viewport"
        className={`w-full h-full transition-all duration-300 flex flex-col overflow-hidden relative z-10 ${
          isTabletFrame
            ? 'max-w-[1240px] max-h-[800px] aspect-[16/10] rounded-[40px] border-[14px] border-[#5B21B6] shadow-[0_25px_60px_-15px_rgba(91,33,182,0.35)] ring-4 ring-purple-200'
            : 'max-w-none max-h-none rounded-none sm:rounded-3xl border-0 sm:border-2 border-purple-200 shadow-2xl'
        } bg-[#F3E8FF]`}
      >
        {/* Top Tablet Status Header */}
        <TabletStatusBar
          profile={profile}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenProfile={() => setIsParentGateOpen(true)}
          isTabletFrame={isTabletFrame}
          onToggleTabletFrame={() => setIsTabletFrame(!isTabletFrame)}
          onOpenParentGate={() => setIsParentGateOpen(true)}
          remainingMinutes={remainingMinutes}
        />

        {/* Main Landscape Workspace: Left Navigation Dock + Screen Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Navigation Dock (Adapted for Landscape) */}
          <NavigationDock
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenParentGate={() => setIsParentGateOpen(true)}
            orientation="vertical-left"
          />

          {/* Active Screen View with Smooth Transitions */}
          <main className="flex-1 h-full flex flex-col overflow-hidden relative bg-[#F3E8FF]/60">
            <AnimatePresence mode="wait">
              {currentScreen === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <HomeScreen
                    profile={profile}
                    onNavigate={(screen) => setCurrentScreen(screen)}
                    onSelectColoringPage={handleSelectColoringPage}
                    onAddStars={handleAddStars}
                  />
                </motion.div>
              )}

              {currentScreen === 'coloring' && (
                <motion.div
                  key="coloring"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <ColoringScreen
                    initialPageId={selectedColoringPageId}
                    onFinishColoring={handleFinishColoring}
                    onBack={() => setCurrentScreen('home')}
                    userStars={profile.stars}
                  />
                </motion.div>
              )}

              {currentScreen === 'learning' && (
                <motion.div
                  key="learning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <LearningScreen
                    onBack={() => setCurrentScreen('home')}
                    onAddStars={handleAddStars}
                  />
                </motion.div>
              )}

              {currentScreen === 'games' && (
                <motion.div
                  key="games"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <GamesScreen
                    onBack={() => setCurrentScreen('home')}
                    onAddStars={handleAddStars}
                  />
                </motion.div>
              )}

              {currentScreen === 'trophies' && (
                <motion.div
                  key="trophies"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <TrophyScreen
                    profile={profile}
                    onBack={() => setCurrentScreen('home')}
                  />
                </motion.div>
              )}

              {currentScreen === 'parent' && (
                <motion.div
                  key="parent"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col overflow-hidden"
                >
                  <ParentDashboard
                    profile={profile}
                    settings={parentSettings}
                    savedArtworks={savedArtworks}
                    onUpdateSettings={setParentSettings}
                    onUpdateProfile={setProfile}
                    onBack={() => setCurrentScreen('home')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Parental Verification Gate Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setCurrentScreen('parent');
        }}
        requiredPin={parentSettings.pinCode}
      />

      {/* Celebration Confetti & Stars Modal */}
      <CelebrationModal
        isOpen={celebrationState.isOpen}
        title={celebrationState.title}
        subtitle={celebrationState.subtitle}
        starsEarned={celebrationState.starsEarned}
        unlockedStickerEmoji={celebrationState.unlockedStickerEmoji}
        onClose={() => setCelebrationState(prev => ({ ...prev, isOpen: false }))}
        onContinue={() => {
          setCelebrationState(prev => ({ ...prev, isOpen: false }));
          setCurrentScreen('coloring');
        }}
        onSave={handleSaveCelebratedArt}
      />
    </div>
  );
}
