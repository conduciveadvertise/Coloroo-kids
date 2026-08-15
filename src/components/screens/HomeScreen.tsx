import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Sparkles,
  Gamepad2,
  Award,
  Play,
  Gift,
  Flame
} from 'lucide-react';
import { ScreenType, ChildProfile } from '../../types';
import { COLORING_PAGES } from '../../data/coloringPages';
import { MascotRoo } from '../MascotRoo';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface HomeScreenProps {
  profile: ChildProfile;
  onNavigate: (screen: ScreenType) => void;
  onSelectColoringPage: (pageId: string) => void;
  onAddStars: (amount: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onSelectColoringPage,
  onAddStars
}) => {
  const [chestOpened, setChestOpened] = useState(false);
  const featuredPage = COLORING_PAGES[0];

  const handleOpenChest = () => {
    if (chestOpened) return;
    setChestOpened(true);
    sound.playFanfare();
    sound.speak("Woohoo! You opened the daily treasure chest! 3 bonus stars for you!");
    onAddStars(3);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-1.5 sm:p-3 select-none overflow-y-auto no-scrollbar">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="bg-white text-purple-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm border border-purple-100">
              <Flame className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
              3 Day Streak! 🔥
            </span>
          </div>
          <h1 className="text-base sm:text-xl font-black text-purple-900 font-['Fredoka'] tracking-wide leading-tight">
            Welcome Back, <span className="text-purple-600">{profile.name}!</span> 👋
          </h1>
        </div>

        <div className="hidden sm:flex items-center shrink-0 scale-90">
          <MascotRoo size="sm" message="Ready to make magic?" />
        </div>
      </div>

      {/* Main Landscape 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 my-auto">
        {/* 1. Coloring Studio */}
        <motion.div
          id="home-card-coloring"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('coloring');
          }}
          className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-b-[4px] border-cyan-500 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="bg-cyan-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                🎨 Paint Studio
              </span>
              <span className="text-[9px] font-bold text-cyan-600">6 Pages</span>
            </div>
            <div className="bg-cyan-50 h-14 sm:h-20 rounded-xl flex items-center justify-center p-1 relative overflow-hidden">
              <span className="text-2xl sm:text-3xl">🎨</span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka'] mt-1 leading-none">
              Coloring Studio
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playPop();
              onSelectColoringPage(featuredPage.id);
            }}
            className="mt-1.5 w-full py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-black text-[10px] sm:text-xs shadow-sm flex items-center justify-center gap-1 border border-white cursor-pointer"
          >
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>Paint</span>
          </button>
        </motion.div>

        {/* 2. Learn & Play */}
        <motion.div
          id="home-card-learning"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('learning');
          }}
          className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-b-[4px] border-rose-400 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="bg-rose-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                🔤 Phonics
              </span>
              <span className="text-[9px] font-bold text-rose-500">4 Tracks</span>
            </div>
            <div className="bg-rose-50 h-14 sm:h-20 rounded-xl flex items-center justify-center p-1 relative overflow-hidden">
              <span className="text-xl sm:text-2xl font-black text-rose-500 font-['Fredoka']">🚀 ABC</span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka'] mt-1 leading-none">
              Learn & Play
            </h3>
          </div>
          <button className="mt-1.5 w-full py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] sm:text-xs shadow-sm flex items-center justify-center gap-1 border border-white cursor-pointer">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Learn</span>
          </button>
        </motion.div>

        {/* 3. Arcade Games */}
        <motion.div
          id="home-card-games"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('games');
          }}
          className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-b-[4px] border-amber-400 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="bg-amber-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                🎮 Games
              </span>
              <span className="text-[9px] font-bold text-amber-600">3 Mini</span>
            </div>
            <div className="bg-amber-50 h-14 sm:h-20 rounded-xl flex items-center justify-center p-1 relative overflow-hidden">
              <span className="text-2xl sm:text-3xl">🎈 🧩</span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka'] mt-1 leading-none">
              Arcade Games
            </h3>
          </div>
          <button className="mt-1.5 w-full py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-[10px] sm:text-xs shadow-sm flex items-center justify-center gap-1 border border-white cursor-pointer">
            <Gamepad2 className="w-2.5 h-2.5" />
            <span>Play</span>
          </button>
        </motion.div>

        {/* 4. Trophy Room */}
        <motion.div
          id="home-card-trophies"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('trophies');
          }}
          className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-b-[4px] border-purple-500 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="bg-purple-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                🏆 Badges
              </span>
              <span className="text-[9px] font-bold text-purple-600">12</span>
            </div>
            <div className="bg-purple-50 h-14 sm:h-20 rounded-xl flex items-center justify-center p-1 relative overflow-hidden">
              <span className="text-2xl sm:text-3xl">⭐ 👑</span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka'] mt-1 leading-none">
              Badges
            </h3>
          </div>
          <button className="mt-1.5 w-full py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] sm:text-xs shadow-sm flex items-center justify-center gap-1 border border-white cursor-pointer">
            <Award className="w-2.5 h-2.5" />
            <span>Badges</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="mt-1 pt-1 border-t border-purple-100 flex items-center justify-between gap-2 shrink-0">
        <motion.button
          onClick={handleOpenChest}
          disabled={chestOpened}
          whileTap={!chestOpened ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
            chestOpened
              ? 'bg-white border-purple-100 text-slate-400'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 border-white text-slate-900 shadow'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black font-['Fredoka']">
            {chestOpened ? 'Reward Claimed!' : 'Daily Chest (+3 ⭐)'}
          </span>
        </motion.button>

        <div className="flex items-center gap-1">
          {COLORING_PAGES.slice(1, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playPop();
                onSelectColoringPage(p.id);
              }}
              className="px-2 py-0.5 rounded-lg bg-white text-purple-900 text-[9px] font-bold border border-purple-100 shadow-sm whitespace-nowrap"
            >
              🎨 {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
