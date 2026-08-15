import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
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
import { HomeScreen } from './components/screens/HomeScreen';
import { ColoringScreen } from './components/screens/ColoringScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { ParentDashboard } from './components/screens/ParentDashboard';
import { ParentGateModal } from './components/ParentGateModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedColoringPageId, setSelectedColoringPageId] = useState<string>('roo-artist');
  const [profile, setProfile] = useState<ChildProfile>(getStoredProfile);
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>(getStoredArtworks);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(getStoredParentSettings);
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);

  useEffect(() => { saveStoredProfile(profile); }, [profile]);
  useEffect(() => { saveStoredArtworks(savedArtworks); }, [savedArtworks]);
  useEffect(() => {
    saveStoredParentSettings(parentSettings);
    sound.volume = parentSettings.soundVolume;
    sound.voiceEnabled = parentSettings.speechNarratorEnabled;
  }, [parentSettings]);

  const handleAddStars = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      stars: prev.stars + amount,
      level: Math.floor((prev.stars + amount) / 8) + 1
    }));
  };

  return (
    <div className="w-screen h-screen bg-[#F3E8FF] overflow-hidden select-none fixed inset-0 z-50">
      <main className="w-full h-full relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen
              profile={profile}
              onNavigate={setCurrentScreen}
              onSelectColoringPage={(id) => {
                setSelectedColoringPageId(id);
                setCurrentScreen('coloring');
              }}
              onAddStars={handleAddStars}
              onOpenParentGate={() => setIsParentGateOpen(true)}
            />
          )}

          {currentScreen === 'coloring' && (
            <ColoringScreen
              initialPageId={selectedColoringPageId}
              onFinishColoring={() => setCurrentScreen('home')}
              onBack={() => setCurrentScreen('home')}
              userStars={profile.stars}
            />
          )}

          {currentScreen === 'learning' && (
            <LearningScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={handleAddStars}
            />
          )}

          {currentScreen === 'games' && (
            <GamesScreen
              onBack={() => setCurrentScreen('home')}
              onAddStars={handleAddStars}
            />
          )}

          {currentScreen === 'trophies' && (
            <TrophyScreen
              profile={profile}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'parent' && (
            <ParentDashboard
              profile={profile}
              settings={parentSettings}
              savedArtworks={savedArtworks}
              onUpdateSettings={setParentSettings}
              onUpdateProfile={setProfile}
              onBack={() => setCurrentScreen('home')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Parental Gate Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setCurrentScreen('parent');
        }}
        requiredPin={parentSettings.pinCode}
      />
    </div>
  );
}
