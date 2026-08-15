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
  CheckCircle2, 
  Volume2
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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const activityCards = [
    {
      id: 'coloring' as ScreenType,
      title: 'Coloring Studio',
      subtitle: '6+ Magical Artworks',
      icon: Palette,
      gradient: 'from-[#6C5CE7] to-[#A29BFE]',
      accentColor: '#FFEAA7',
      bgTag: 'bg-[#5742CD]',
      btnText: 'Paint Now',
      emoji: '🎨'
    },
    {
      id: 'learning' as ScreenType,
      title: 'Learn & Play',
      subtitle: 'Phonics, Math & Animals',
      icon: Sparkles,
      gradient: 'from-[#00CEC9] to-[#81ECEC]',
      accentColor: '#2D3436',
      bgTag: 'bg-[#00B894]',
      btnText: 'Explore',
      emoji: '🔤'
    },
    {
      id: 'games' as ScreenType,
      title: 'Arcade Mini-Games',
      subtitle: 'Memory, Balloons & Puzzles',
      icon: Gamepad2,
      gradient: 'from-[#FFA502] to-[#FDCB6E]',
      accentColor: '#2D3436',
      bgTag: 'bg-[#E67E22]',
      btnText: 'Play Games',
      emoji: '🎈'
    },
    {
      id: 'trophies' as ScreenType,
      title: 'Sticker Trophy Room',
      subtitle: '12 Collectibles & Badges',
      icon: Award,
      gradient: 'from-[#FD79A8] to-[#FF7675]',
      accentColor: '#FFFFFF',
      bgTag: 'bg-[#E84393]',
      btnText: 'View Badges',
      emoji: '⭐'
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto kids-scrollbar p-2.5 sm:p-3.5 md:p-5 flex flex-col justify-between select-none">
      {/* Top Banner Row: Greeting + Daily Streak + Mascot */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 sm:gap-3 mb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="bg-white text-purple-900 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-purple-100">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500" />
              3 Day Art Streak! 🔥
            </span>
            <span className="text-purple-600 text-[10px] sm:text-xs font-bold">
              Today's Adventure
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-purple-900 font-['Fredoka'] tracking-wide">
            Welcome Back, <span className="text-purple-600">{profile.name}!</span> 👋
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            What colorful masterpiece would you like to create and explore today?
          </p>
        </div>

        {/* Mascot Roo interactive header greeting */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <MascotRoo
            size="sm"
            message="Ready to make some colorful magic?"
          />
        </div>
      </div>

      {/* Main Landscape Content Grid: 4 Artistic Flair Activity Cards with 8px Bottom Slab Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 my-auto py-1">
        {/* 1. Coloring Studio (Cyan Card) */}
        <motion.div
          id="home-card-coloring"
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('coloring');
          }}
          className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3 sm:p-3.5 md:p-4 shadow-xl border-b-[6px] sm:border-b-[8px] border-cyan-500 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer group artistic-card"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-cyan-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                🎨 Paint Studio
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-600">
                6 Pages
              </span>
            </div>

            {/* Inner Stage Preview */}
            <div className="bg-cyan-50 h-24 sm:h-28 md:h-32 lg:h-36 rounded-[18px] sm:rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-cyan-100/70 transition-colors">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white/80 shadow-md border-2 border-cyan-200 flex items-center justify-center p-2 group-hover:rotate-3 transition-transform">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
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

            <div className="mt-2 sm:mt-2.5">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                Coloring Studio
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight">
                Magic watercolors, glitters & stamps
              </p>
            </div>
          </div>

          {/* Progress & Action */}
          <div className="mt-2 sm:mt-2.5">
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
              className="w-full py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-white font-black text-[11px] sm:text-xs md:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Coloring</span>
            </button>
          </div>
        </motion.div>

        {/* 2. Learn & Play (Rose Card) */}
        <motion.div
          key="learning"
          id="home-card-learning"
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('learning');
          }}
          className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3 sm:p-3.5 md:p-4 shadow-xl border-b-[6px] sm:border-b-[8px] border-rose-400 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer group artistic-card"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                🔤 Phonics & Math
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-rose-500">
                4 Tracks
              </span>
            </div>

            {/* Inner Stage Preview */}
            <div className="bg-rose-50 h-24 sm:h-28 md:h-32 lg:h-36 rounded-[18px] sm:rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-rose-100/70 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl md:text-4xl">🚀</span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-500 font-['Fredoka']">ABC</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-2.5">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                Learn & Play
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight">
                Phonics sounds, counting & shapes
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5">
            <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-rose-500 h-full rounded-full w-1/2" />
            </div>
            <button
              className="w-full py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-[11px] sm:text-xs md:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Lessons</span>
            </button>
          </div>
        </motion.div>

        {/* 3. Arcade Games (Amber Card) */}
        <motion.div
          key="games"
          id="home-card-games"
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('games');
          }}
          className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3 sm:p-3.5 md:p-4 shadow-xl border-b-[6px] sm:border-b-[8px] border-amber-400 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer group artistic-card"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                🎮 Arcade Fun
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-600">
                3 Games
              </span>
            </div>

            {/* Inner Stage Preview */}
            <div className="bg-amber-50 h-24 sm:h-28 md:h-32 lg:h-36 rounded-[18px] sm:rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-amber-100/70 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl md:text-4xl">🎈</span>
                <span className="text-2xl sm:text-3xl md:text-4xl">🧩</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-2.5">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                Arcade Games
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight">
                Balloon pop, memory & puzzle match
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5">
            <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-amber-400 h-full rounded-full w-4/5" />
            </div>
            <button
              className="w-full py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black text-[11px] sm:text-xs md:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Play Mini-Games</span>
            </button>
          </div>
        </motion.div>

        {/* 4. Trophy Room (Purple Card) */}
        <motion.div
          key="trophies"
          id="home-card-trophies"
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playPop();
            onNavigate('trophies');
          }}
          className="bg-white rounded-[24px] sm:rounded-[30px] md:rounded-[36px] p-3 sm:p-3.5 md:p-4 shadow-xl border-b-[6px] sm:border-b-[8px] border-purple-500 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer group artistic-card"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="bg-purple-600 text-white text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                🏆 Sticker Book
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-purple-600">
                12 Badges
              </span>
            </div>

            {/* Inner Stage Preview */}
            <div className="bg-purple-50 h-24 sm:h-28 md:h-32 lg:h-36 rounded-[18px] sm:rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-purple-100/70 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl md:text-4xl animate-bounce-gentle">⭐</span>
                <span className="text-2xl sm:text-3xl md:text-4xl">👑</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-2.5">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 font-['Fredoka'] mb-0.5 leading-tight">
                Trophies & Badges
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 leading-tight">
                Collect stickers, awards & stamps
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5">
            <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-purple-600 h-full rounded-full w-2/3" />
            </div>
            <button
              className="w-full py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-[11px] sm:text-xs md:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Badges</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Daily Treasure Chest + Quick Coloring Thumbnails */}
      <div className="mt-2 pt-2 border-t-2 border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        {/* Daily Mystery Chest */}
        <motion.button
          id="daily-chest-btn"
          onClick={handleOpenChest}
          disabled={chestOpened}
          whileHover={!chestOpened ? { scale: 1.04 } : {}}
          whileTap={!chestOpened ? { scale: 0.95 } : {}}
          className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
            chestOpened
              ? 'bg-white border-purple-100 text-slate-400 shadow-sm'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 border-white text-slate-900 shadow-lg animate-bounce-gentle'
          }`}
        >
          <Gift className={`w-5 h-5 ${chestOpened ? 'text-purple-400' : 'text-slate-900 fill-amber-300'}`} />
          <div className="text-left">
            <span className="text-[11px] sm:text-xs font-black block font-['Fredoka'] leading-tight">
              {chestOpened ? '⭐ Daily Reward Claimed!' : '🎁 Tap Daily Treasure Chest!'}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-700 leading-none">
              {chestOpened ? 'Come back tomorrow for more' : 'Win 3 Free Bonus Stars!'}
            </span>
          </div>
        </motion.button>

        {/* Quick Coloring Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] sm:text-xs font-bold text-purple-900 whitespace-nowrap hidden md:inline">
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
              className="px-2.5 sm:px-3 py-1 rounded-xl sm:rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 text-[10px] sm:text-xs font-bold border-2 border-purple-100 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>🎨</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
