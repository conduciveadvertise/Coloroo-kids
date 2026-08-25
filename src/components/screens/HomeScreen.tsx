import React, { useState } from 'react';
import {
  Sparkles, motion } from 'motion/react';
import {
  Sparkles, Play, Flame, Star, ShieldCheck, Heart } from 'lucide-react';
import {
  Sparkles, ScreenType, ChildProfile, BuddyState, StreakData } from '../../types';
import {
  Sparkles, COLORING_PAGES } from '../../data/coloringPages';
import {
  Sparkles, BUDDY_LIST } from '../../data/buddyAndMissionsData';
import {
  Sparkles, sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface HomeScreenProps {
  profile: ChildProfile;
  buddy: BuddyState;
  streakData: StreakData;
  allMissionsCompleted: boolean;
  onNavigate: (screen: ScreenType) => void;
  onSelectColoringPage: (pageId: string) => void;
  onAddStars: (amount: number) => void;
  onOpenParentGate: () => void;
  onOpenMissionsModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  buddy,
  streakData,
  allMissionsCompleted,
  onNavigate,
  onSelectColoringPage,
  onAddStars,
  onOpenParentGate,
  onOpenMissionsModal
}) => {
  const [chestOpened, setChestOpened] = useState(false);
  const featuredPage = COLORING_PAGES[0];
  const buddyDef = BUDDY_LIST.find(b => b.type === buddy.type) || BUDDY_LIST[0];

  const handleOpenChest = () => {
    if (chestOpened) return;
    setChestOpened(true);
    sound.playFanfare();
    const bonus = allMissionsCompleted ? 15 : 5;
    sound.speak(`Woohoo! Daily chest opened! +${bonus} bonus stars for you!`);
    onAddStars(bonus);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    } catch {}
  };

  const cards = [
    {
      id: 'speak-repeat',
      type: 'screen' as const,
      tag: '🗣️ SPEAK & REPEAT',
      badge: 'Reading',
      title: 'Speak & Repeat',
      desc: 'Listen, practice & speak aloud!',
      iconEmoji: '🗣️',
      secondaryEmoji: '📖',
      btnText: 'Practice Speaking',
      borderBottom: 'border-b-[#E67E22]',
      badgeBg: 'bg-[#E67E22]',
      bgGradient: 'from-[#f39c12] via-[#e67e22] to-[#d35400]',
      btnBg: 'bg-[#E67E22] hover:bg-[#d35400]'
    },
    {
      id: 'ai-buddy',
      type: 'screen' as const,
      tag: '🤖 AI BUDDY',
      badge: 'Live AI',
      title: 'AI Buddy',
      desc: 'Talk to Buddy • Ask anything!',
      iconEmoji: '🤖',
      secondaryEmoji: '✨',
      btnText: 'Talk to Buddy',
      borderBottom: 'border-b-[#5F27CD]',
      badgeBg: 'bg-[#5F27CD]',
      bgGradient: 'from-[#a29bfe] via-[#6c5ce7] to-[#5f27cd]',
      btnBg: 'bg-[#5F27CD] hover:bg-[#341f97]'
    },
    {
      id: 'coloring',
      type: 'screen' as const,
      tag: '🎨 PAINT STUDIO',
      badge: `${COLORING_PAGES.length} Artworks`,
      title: 'Coloring Studio',
      desc: 'Magic watercolors, glitters & brushes',
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
      tag: '🔤 LEARN & PLAY',
      badge: '5 Topics',
      title: 'Learn & Play',
      desc: 'Phonics sounds, counting & animals',
      iconEmoji: '🚀',
      secondaryEmoji: 'ABC',
      btnText: 'Explore Lessons',
      borderBottom: 'border-b-[#E84118]',
      badgeBg: 'bg-[#E84118]',
      bgGradient: 'from-[#ff7675] via-[#e17055] to-[#d63031]',
      btnBg: 'bg-[#E84118] hover:bg-[#c23616]'
    },
    {
      id: 'challenges',
      type: 'screen' as const,
      tag: '🏆 COLOR QUESTS',
      badge: '4 Modes',
      title: 'Color Challenges',
      desc: 'Timed color mixes & speed puzzles',
      iconEmoji: '⚡',
      secondaryEmoji: '🎯',
      btnText: 'Play Challenges',
      borderBottom: 'border-b-[#FF9F43]',
      badgeBg: 'bg-[#FF9F43]',
      bgGradient: 'from-[#ff9f43] via-[#ee5253] to-[#ff6b6b]',
      btnBg: 'bg-[#FF9F43] hover:bg-[#ee5253]'
    },
    {
      id: 'games',
      type: 'screen' as const,
      tag: '🎮 ARCADE FUN',
      badge: '5 Mini-Games',
      title: 'Arcade Games',
      desc: 'Balloon math, memory & shape sorter',
      iconEmoji: '🎈',
      secondaryEmoji: '🧩',
      btnText: 'Play Mini-Games',
      borderBottom: 'border-b-[#E67E22]',
      badgeBg: 'bg-[#E67E22]',
      bgGradient: 'from-[#fdcb6e] via-[#f39c12] to-[#e67e22]',
      btnBg: 'bg-[#E67E22] hover:bg-[#d35400]'
    },
    {
      id: 'adventure',
      type: 'screen' as const,
      tag: '🗺️ ADVENTURE WORLD',
      badge: '4 Worlds',
      title: 'Adventure World',
      desc: 'Explore magical lands & unlock rewards',
      iconEmoji: '🏰',
      secondaryEmoji: '🌟',
      btnText: 'Start Adventure',
      borderBottom: 'border-b-[#10AC84]',
      badgeBg: 'bg-[#10AC84]',
      bgGradient: 'from-[#1dd1a1] via-[#10ac84] to-[#01a3a4]',
      btnBg: 'bg-[#10AC84] hover:bg-[#0f8b6b]'
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
              <button
                onClick={() => { sound.playPop(); onOpenMissionsModal(); }}
                className="bg-white hover:bg-amber-50 text-purple-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm border border-purple-100 cursor-pointer active:scale-95"
              >
                <Flame className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                <span>{streakData.currentStreak} Day Streak! 🔥</span>
              </button>
            </div>
            <h1 className="text-sm sm:text-lg font-black text-purple-950 font-['Fredoka'] tracking-wide mt-0.5 leading-tight">
              Welcome Back, <span className="text-purple-600">{profile.name}!</span> 👋
            </h1>
          </div>
        </div>

        {/* Right Shortcuts: Buddy Sanctuary, Stars, Parents */}
        <div className="flex items-center gap-2">
          {/* Buddy Shortcut */}
          <button
            onClick={() => { sound.playPop(); onNavigate('buddy'); }}
            className="flex items-center gap-1.5 bg-white hover:bg-pink-50 px-2.5 py-1 rounded-2xl border-2 border-purple-100 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <span className="text-base">{buddyDef.emoji}</span>
            <span className="text-[10px] font-black text-purple-900 hidden sm:inline">Lv.{buddy.level}</span>
          </button>

          {/* Stars */}
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-2xl border-2 border-purple-100 shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka']">
              {profile.stars}
            </span>
          </div>

          {/* Parents Button */}
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

      {/* Main Horizontal Carousel */}
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
                } else if (card.id === 'speak-repeat') {
              onNavigate('speak-repeat');
            } else if (card.id === 'ai-buddy') {
              onNavigate('ai-buddy');
            } else if (card.id === 'coloring') {
                  onSelectColoringPage(featuredPage.id);
                } else {
                  onNavigate(card.id as ScreenType);
                }
              }}
              className={`min-w-[230px] sm:min-w-[260px] max-w-[290px] flex-1 bg-white rounded-[26px] p-3 border-2 border-purple-100 border-b-[7px] ${card.borderBottom} shadow-lg hover:shadow-xl flex flex-col justify-between cursor-pointer snap-center transition-all shrink-0`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`${card.badgeBg} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}>
                  {card.tag}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              </div>

              <div className={`h-22 sm:h-26 rounded-2xl bg-gradient-to-br ${card.bgGradient} flex items-center justify-center shadow-inner my-1 border border-white/40 relative overflow-hidden`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl drop-shadow-md">{card.iconEmoji}</span>
                  <span className="text-xl sm:text-2xl drop-shadow-sm font-black text-white font-['Fredoka']">{card.secondaryEmoji}</span>
                </div>
              </div>

              <div className="my-0.5">
                <h3 className="text-sm sm:text-base font-black text-slate-800 font-['Fredoka'] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 line-clamp-1 leading-tight mt-0.5">
                  {card.desc}
                </p>
              </div>

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
            {chestOpened ? 'Reward Claimed!' : allMissionsCompleted ? 'Super Chest (+15 ⭐)' : 'Daily Chest (+5 ⭐)'}
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
              className="px-2 py-0.5 rounded-lg bg-white hover:bg-purple-50 text-purple-900 text-[9px] font-bold border border-purple-100 shadow-sm whitespace-nowrap cursor-pointer"
            >
              🎨 {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
