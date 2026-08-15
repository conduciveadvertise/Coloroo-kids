import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, ChildProfile, ParentSettings, SavedArtwork } from './types';
import { getStoredProfile, saveStoredProfile, getStoredArtworks, saveStoredArtworks, getStoredParentSettings, saveStoredParentSettings } from './services/storage';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedColoringPageId, setSelectedColoringPageId] = useState<string>('roo-artist');
  const [profile, setProfile] = useState<ChildProfile>(getStoredProfile);
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>(getStoredArtworks);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(getStoredParentSettings);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTabletFrame, setIsTabletFrame] = useState<boolean>(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);

  useEffect(() => { saveStoredProfile(profile); }, [profile]);
  useEffect(() => { saveStoredArtworks(savedArtworks); }, [savedArtworks]);
  useEffect(() => { saveStoredParentSettings(parentSettings); }, [parentSettings]);

  // Fullscreen Screens List
  const isFullscreen = ['coloring', 'learning', 'games', 'trophies'].includes(currentScreen);

  return (
    <div className="w-full h-[100dvh] bg-[#F3E8FF] flex flex-col overflow-hidden relative select-none">
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden relative">
        
        {!isFullscreen && (
            <div className="shrink-0">
              <TabletStatusBar
                profile={profile}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                onOpenProfile={() => setIsParentGateOpen(true)}
                isTabletFrame={isTabletFrame}
                onToggleTabletFrame={() => setIsTabletFrame(!isTabletFrame)}
                onOpenParentGate={() => setIsParentGateOpen(true)}
                remainingMinutes={25}
              />
            </div>
        )}

        <main className="flex-1 overflow-hidden relative bg-[#F3E8FF]/60">
           <div className="w-full h-full">
              {currentScreen === 'home' && <HomeScreen profile={profile} onNavigate={setCurrentScreen} onSelectColoringPage={(id) => { setSelectedColoringPageId(id); setCurrentScreen('coloring'); }} onAddStars={() => {}} />}
              {currentScreen === 'coloring' && <ColoringScreen initialPageId={selectedColoringPageId} onFinishColoring={() => {}} onBack={() => setCurrentScreen('home')} userStars={profile.stars} />}
              {currentScreen === 'learning' && <LearningScreen onBack={() => setCurrentScreen('home')} onAddStars={() => {}} />}
              {currentScreen === 'games' && <GamesScreen onBack={() => setCurrentScreen('home')} onAddStars={() => {}} />}
              {currentScreen === 'trophies' && <TrophyScreen profile={profile} onBack={() => setCurrentScreen('home')} />}
              {currentScreen === 'parent' && <ParentDashboard profile={profile} settings={parentSettings} savedArtworks={savedArtworks} onUpdateSettings={setParentSettings} onUpdateProfile={setProfile} onBack={() => setCurrentScreen('home')} />}
           </div>
        </main>

        {!isFullscreen && (
          <div className="shrink-0 z-50">
            <NavigationDock
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
              onOpenParentGate={() => setIsParentGateOpen(true)}
              orientation="horizontal-bottom"
            />
          </div>
        )}
      </div>
    </div>
  );
}
