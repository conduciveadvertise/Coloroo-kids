import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Flame, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { ScreenType, ChildProfile } from '../../types';
import { COLORING_PAGES } from '../../data/coloringPages';
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
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch {}
  };

  const cards = [
    {
      id: 'coloring',
      type: 'screen' as const,
      tag: '🎨 PAINT STUDIO',
      badge: '6 Artworks',
      title: 'Coloring Studio',
      desc: 'Magic watercolors & glitters',
      iconEmoji: '🎨',
      secondaryEmoji: '🖌️',
      btnText: 'Start Coloring',
      borderBottom: 'border-b-[#00A8FF]',
      badgeBg: 'bg-[#00A8FF]',
      bgGradient: 'from-[#00d2d3] via-[#00cec9] to-[#0984e3]',
      btnBg: 'bg-[#00A8FF] hover:bg-[#0097e6]'
    },
    {
      id: 'learning',
      type: 'screen' as const,
      tag: '🔤 PHONICS & MATH',
      badge: '5 Topics',
      title: 'Learn & Play',
      desc: 'Phonics sounds & counting',
      iconEmoji: '🚀',
      secondaryEmoji: 'ABC',
      btnText: 'Explore Lessons',
      borderBottom: 'border-b-[#E84118]',
      badgeBg: 'bg-[#E84118]',
      bgGradient: 'from-[#ff7675] via-[#e17055] to-[#d63031]',
      btnBg: 'bg-[#E84118] hover:bg-[#c23616]'
    },
    {
      id: 'games',
      type: 'screen' as const,
      tag: '🎮 ARCADE FUN',
      badge: '3 Games',
      title: 'Arcade Games',
      desc: 'Memory cards, balloons & puzzle',
      iconEmoji: '🎈',
      secondaryEmoji: '🧩',
      btnText: 'Play Mini-Games',
      borderBottom: 'border-b-[#E67E22]',
      badgeBg: 'bg-[#E67E22]',
      bgGradient: 'from-[#fdcb6e] via-[#f39c12] to-[#e67e22]',
      btnBg: 'bg-[#E67E22] hover:bg-[#d35400]'
    },
    {
      id: 'parent',
      type: 'parent' as const,
      tag: '🔒 PARENTS ZONE',
      badge: 'Protected',
      title: 'Parents Dashboard',
      desc: 'Screen timer, PIN & child progress',
      iconEmoji: '⚙️',
      secondaryEmoji: '🛡️',
      btnText: 'Open Settings',
      borderBottom: 'border-b-[#6C5CE7]',
      badgeBg: 'bg-[#6C5CE7]',
      bgGradient: 'from-[#a29bfe] via-[#6c5ce7] to-[#4834d4]',
      btnBg: 'bg-[#6C5CE7] hover:bg-[#4834d4]'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3.5 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-white text-xl font-black italic border-2 border-white transform -rotate-3">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="bg-white text-purple-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm border border-purple-100">
                <Flame className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                3 Day Streak! 🔥
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-black text-purple-950 font-['Fredoka'] tracking-wide mt-0.5 leading-tight">
              Welcome Back, <span className="text-purple-600">{profile.name}!</span> 👋
            </h1>
          </div>
        </div>

        {/* Right Stars & Parents Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-2xl border-2 border-purple-100 shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka']">
              {profile.stars}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onOpenParentGate();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-[10px] sm:text-xs border-2 border-white shadow-sm cursor-pointer active:scale-95 transition-transform"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PARENTS</span>
          </button>
        </div>
      </div>

      {/* Main Horizontal Scrolling Cards Carousel */}
      <div className="flex-1 flex items-center min-h-0 py-1">
        <div className="w-full h-full flex gap-3 overflow-x-auto overflow-y-hidden py-1 px-0.5 items-stretch no-scrollbar scroll-smooth snap-x snap-mandatory">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playPop();
                if (card.type === 'parent') {
                  onOpenParentGate();
                } else if (card.id === 'coloring') {
                  onSelectColoringPage(featuredPage.id);
                } else {
                  onNavigate(card.id as ScreenType);
                }
              }}
              className={`min-w-[240px] sm:min-w-[280px] max-w-[320px] flex-1 bg-white rounded-[26px] p-3 border-2 border-purple-100 border-b-[7px] ${card.borderBottom} shadow-lg hover:shadow-xl flex flex-col justify-between cursor-pointer snap-center transition-all shrink-0`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-1">
                <span className={`${card.badgeBg} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}>
                  {card.tag}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              </div>

              {/* Showcase Stage */}
              <div className={`h-24 sm:h-28 rounded-2xl bg-gradient-to-br ${card.bgGradient} flex items-center justify-center shadow-inner my-1 border border-white/40 relative overflow-hidden`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl drop-shadow-md">{card.iconEmoji}</span>
                  <span className="text-2xl drop-shadow-sm font-black text-white font-['Fredoka']">{card.secondaryEmoji}</span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="my-0.5">
                <h3 className="text-sm sm:text-base font-black text-slate-800 font-['Fredoka'] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 line-clamp-1 leading-tight mt-0.5">
                  {card.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-1.5 sm:py-2 rounded-xl sm:rounded-2xl ${card.btnBg} text-white font-black text-[10px] sm:text-xs shadow-md flex items-center justify-center gap-1 border-2 border-white cursor-pointer active:scale-95 transition-transform`}
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{card.btnText}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Shortcuts Tray */}
      <div className="shrink-0 pt-1 border-t border-purple-100 flex items-center justify-between gap-2">
        <motion.button
          onClick={handleOpenChest}
          disabled={chestOpened}
          whileTap={!chestOpened ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all cursor-pointer ${
            chestOpened
              ? 'bg-white text-slate-400 border-purple-100'
              : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 border-white shadow-sm'
          }`}
        >
          <span className="text-xs">🎁</span>
          <span className="text-[10px] font-black font-['Fredoka']">
            {chestOpened ? 'Reward Claimed!' : 'Daily Chest (+3 ⭐)'}
          </span>
        </motion.button>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-purple-900 hidden sm:inline">Quick Paint:</span>
          {COLORING_PAGES.slice(1, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playPop();
                onSelectColoringPage(p.id);
              }}
              className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-50 text-purple-900 text-[9px] font-bold border border-purple-100 shadow-sm whitespace-nowrap"
            >
              🎨 {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
