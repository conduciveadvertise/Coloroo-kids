import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Sparkles, 
  Gamepad2, 
  Award, 
  Play, 
  Gift, 
  Flame, 
  ShieldCheck, 
  Home as HomeIcon,
  ChevronRight
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
  onOpenParentGate: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onSelectColoringPage,
  onAddStars,
  onOpenParentGate
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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const navItems = [
    { id: 'home' as ScreenType, label: 'HOME', emoji: '🏠', active: true },
    { id: 'coloring' as ScreenType, label: 'STUDIO', emoji: '🎨', active: false },
    { id: 'learning' as ScreenType, label: 'LEARN', emoji: '🚀', active: false },
    { id: 'games' as ScreenType, label: 'GAMES', emoji: '🎮', active: false },
    { id: 'trophies' as ScreenType, label: 'REWARDS', emoji: '🏆', active: false },
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-row overflow-hidden select-none bg-[#F3E8FF]">
      
      {/* 1. FIXED LEFT NAVIGATION SIDEBAR */}
      <aside 
        id="home-left-navigation"
        className="w-18 sm:w-20 md:w-24 lg:w-26 bg-white/95 backdrop-blur-md border-r-2 md:border-r-3 border-purple-100 shadow-lg flex flex-col items-center justify-between py-2 sm:py-3 px-1 sm:px-1.5 shrink-0 z-20 overflow-y-auto no-scrollbar"
      >
        {/* Top Logo Mini Badge */}
        <div className="flex flex-col items-center mb-1 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-md border-2 border-white flex items-center justify-center text-white text-lg sm:text-xl font-black italic transform -rotate-3">
            C
          </div>
          <span className="text-[9px] sm:text-[10px] font-black tracking-wider text-purple-900 mt-0.5 text-center font-['Fredoka']">
            COLOROO
          </span>
        </div>

        {/* Navigation Item Buttons */}
        <nav className="flex flex-col gap-1.5 sm:gap-2 w-full items-center my-auto">
          {navItems.map((item) => {
            const isActive = item.active;

            return (
              <motion.button
                key={item.id}
                id={`home-nav-${item.id}`}
                onClick={() => {
                  sound.playPop();
                  if (item.id !== 'home') onNavigate(item.id);
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="group flex flex-col items-center gap-0.5 cursor-pointer w-full py-0.5"
              >
                <div 
                  className={`w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-150 relative ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md transform rotate-2 border-2 border-white'
                      : 'bg-purple-50 text-slate-500 hover:bg-purple-100'
                  }`}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">{item.emoji}</span>
                  {isActive && (
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-4 sm:h-5 bg-purple-600 rounded-l-full shadow-xs" />
                  )}
                </div>
                <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-wider uppercase leading-none ${
                  isActive ? 'text-purple-900' : 'text-slate-400 group-hover:text-purple-700'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Parent Button */}
        <div className="pt-1.5 border-t border-purple-100 w-full flex flex-col items-center shrink-0">
          <motion.button
            id="home-nav-parents"
            onClick={() => {
              sound.playPop();
              onOpenParentGate();
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-0.5 cursor-pointer w-full"
            title="Parent Area"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[7px] sm:text-[8px] font-bold text-amber-700 uppercase leading-none">
              Parents
            </span>
          </motion.button>
        </div>
      </aside>

      {/* 2. MAIN HOME SCROLLABLE CONTENT AREA (Beside Left Navigation) */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto kids-scrollbar p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4 select-none">
        
        {/* Top Greeting Banner: Greeting + Daily Streak + Mascot */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white text-purple-900 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-purple-100">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500" />
                3 Day Art Streak! 🔥
              </span>
              <span className="text-purple-600 text-[10px] sm:text-xs font-bold">
                Today's Adventure
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-purple-900 font-['Fredoka'] tracking-wide">
              Welcome Back, <span className="text-purple-600">{profile.name}!</span> 👋
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              What colorful masterpiece would you like to create and explore today?
            </p>
          </div>

          {/* Mascot Roo interactive header greeting */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <MascotRoo
              size="sm"
              message="Ready to make some colorful magic?"
            />
          </div>
        </div>

        {/* 4 MAIN ACTIVITY CARDS IN 2-COLUMN LANDSCAPE LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          
          {/* Card 1: Coloring Studio (Cyan Card) */}
          <motion.div
            id="home-card-coloring"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playPop();
              onNavigate('coloring');
            }}
            className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3.5 sm:p-4 md:p-5 shadow-lg border-b-[6px] sm:border-b-[8px] border-cyan-500 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group artistic-card"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-cyan-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  🎨 Paint Studio
                </span>
                <span className="text-xs font-bold text-cyan-600">
                  6 Artworks
                </span>
              </div>

              {/* Inner Stage Preview */}
              <div className="bg-cyan-50 h-28 sm:h-32 md:h-36 rounded-[20px] sm:rounded-[24px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-cyan-100/70 transition-colors">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-white/90 shadow-md border-2 border-cyan-200 flex items-center justify-center p-2 group-hover:rotate-3 transition-transform">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xs">
                    <circle cx="100" cy="100" r="75" fill="#FFEAA7" />
                    <ellipse cx="100" cy="65" rx="42" ry="18" fill="#FF7675" transform="rotate(-5 100 65)" />
                    <circle cx="112" cy="46" r="6" fill="#D63031" />
                    <circle cx="78" cy="100" r="8" fill="#2D3436" />
                    <circle cx="122" cy="100" r="8" fill="#2D3436" />
                    <circle cx="65" cy="115" r="9" fill="#FD79A8" opacity="0.8" />
                    <circle cx="135" cy="115" r="9" fill="#FD79A8" opacity="0.8" />
                    <path d="M 85 120 Q 100 135 115 120" stroke="#2D3436" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                  Coloring Studio
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-tight">
                  Magic watercolors, glow pens, glitter rollers & stickers
                </p>
              </div>
            </div>

            {/* Progress & Action */}
            <div className="mt-3">
              <div className="w-full bg-cyan-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-cyan-500 h-full rounded-full w-3/4" />
              </div>
              <button
                id="hero-play-coloroo-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPop();
                  onSelectColoringPage(featuredPage.id);
                }}
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Coloring</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2: Learn & Play (Rose Card) */}
          <motion.div
            key="learning"
            id="home-card-learning"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playPop();
              onNavigate('learning');
            }}
            className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3.5 sm:p-4 md:p-5 shadow-lg border-b-[6px] sm:border-b-[8px] border-rose-400 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group artistic-card"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  🔤 Phonics & Math
                </span>
                <span className="text-xs font-bold text-rose-500">
                  5 Topics
                </span>
              </div>

              {/* Inner Stage Preview */}
              <div className="bg-rose-50 h-28 sm:h-32 md:h-36 rounded-[20px] sm:rounded-[24px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-rose-100/70 transition-colors">
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <span className="text-3xl sm:text-4xl md:text-5xl">🚀</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-rose-500 font-['Fredoka']">ABC</span>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                  Learn & Play
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-tight">
                  Phonics A-Z, Math 1-20, Number Names 1-50 & Shapes
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-rose-500 h-full rounded-full w-4/5" />
              </div>
              <button
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Lessons</span>
              </button>
            </div>
          </motion.div>

          {/* Card 3: Arcade Mini-Games (Amber Card) */}
          <motion.div
            key="games"
            id="home-card-games"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playPop();
              onNavigate('games');
            }}
            className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3.5 sm:p-4 md:p-5 shadow-lg border-b-[6px] sm:border-b-[8px] border-amber-400 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group artistic-card"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  🎮 Arcade Fun
                </span>
                <span className="text-xs font-bold text-amber-600">
                  3 Games
                </span>
              </div>

              {/* Inner Stage Preview */}
              <div className="bg-amber-50 h-28 sm:h-32 md:h-36 rounded-[20px] sm:rounded-[24px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-amber-100/70 transition-colors">
                <div className="flex items-center gap-3 group-hover:scale-110 transition-transform">
                  <span className="text-3xl sm:text-4xl md:text-5xl">🎈</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl">🧩</span>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                  Arcade Games
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-tight">
                  Balloon pop, memory match cards & jigsaw puzzles
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-400 h-full rounded-full w-4/5" />
              </div>
              <button
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Mini-Games</span>
              </button>
            </div>
          </motion.div>

          {/* Card 4: Sticker Trophy Room (Purple Card) */}
          <motion.div
            key="trophies"
            id="home-card-trophies"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playPop();
              onNavigate('trophies');
            }}
            className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3.5 sm:p-4 md:p-5 shadow-lg border-b-[6px] sm:border-b-[8px] border-purple-500 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group artistic-card"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  🏆 Sticker Book
                </span>
                <span className="text-xs font-bold text-purple-600">
                  12 Badges
                </span>
              </div>

              {/* Inner Stage Preview */}
              <div className="bg-purple-50 h-28 sm:h-32 md:h-36 rounded-[20px] sm:rounded-[24px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-purple-100/70 transition-colors">
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <span className="text-3xl sm:text-4xl md:text-5xl animate-bounce-gentle">⭐</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl">👑</span>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                  Trophies & Badges
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-tight">
                  Collect stickers, unlock milestone badges & decorate
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-purple-600 h-full rounded-full w-2/3" />
              </div>
              <button
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
              >
                <Award className="w-4 h-4" />
                <span>View Badges</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Row: Daily Treasure Chest + Quick Coloring Thumbnails */}
        <div className="mt-1 pt-3 border-t-2 border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          {/* Daily Mystery Chest */}
          <motion.button
            id="daily-chest-btn"
            onClick={handleOpenChest}
            disabled={chestOpened}
            whileHover={!chestOpened ? { scale: 1.04 } : {}}
            whileTap={!chestOpened ? { scale: 0.95 } : {}}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer ${
              chestOpened
                ? 'bg-white border-purple-100 text-slate-400 shadow-xs'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 border-white text-slate-900 shadow-lg animate-bounce-gentle'
            }`}
          >
            <Gift className={`w-5 h-5 ${chestOpened ? 'text-purple-400' : 'text-slate-900 fill-amber-300'}`} />
            <div className="text-left">
              <span className="text-xs font-black block font-['Fredoka'] leading-tight">
                {chestOpened ? '⭐ Daily Reward Claimed!' : '🎁 Tap Daily Treasure Chest!'}
              </span>
              <span className="text-[10px] font-semibold text-slate-700 leading-none">
                {chestOpened ? 'Come back tomorrow for more' : 'Win 3 Free Bonus Stars!'}
              </span>
            </div>
          </motion.button>

          {/* Quick Coloring Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-purple-900 whitespace-nowrap hidden md:inline">
              Quick Paint:
            </span>
            {COLORING_PAGES.slice(1, 4).map((p) => (
              <button
                key={p.id}
                id={`quick-page-${p.id}`}
                onClick={() => {
                  sound.playPop();
                  onSelectColoringPage(p.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 text-xs font-bold border-2 border-purple-100 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>🎨</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
