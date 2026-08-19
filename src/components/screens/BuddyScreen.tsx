import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Heart,
  Sparkles,
  Star,
  Award,
  Utensils,
  Play,
  RotateCcw
} from 'lucide-react';
import { BuddyState, BuddyType } from '../../types';
import { BUDDY_LIST } from '../../data/buddyAndMissionsData';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface BuddyScreenProps {
  buddy: BuddyState;
  userStars: number;
  onUpdateBuddy: (newBuddy: BuddyState) => void;
  onSpendStars: (amount: number) => boolean;
  onBack: () => void;
}

export const BuddyScreen: React.FC<BuddyScreenProps> = ({
  buddy,
  userStars,
  onUpdateBuddy,
  onSpendStars,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'choose'>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentDef = BUDDY_LIST.find(b => b.type === buddy.type) || BUDDY_LIST[0];

  const handleFeedBuddy = () => {
    if (userStars < 20) {
      sound.playPop();
      sound.speak("Earn more stars by playing to feed your buddy!");
      setToastMessage("Need 20 Stars to Feed 🍎");
      setTimeout(() => setToastMessage(null), 1800);
      return;
    }

    const spent = onSpendStars(20);
    if (!spent) return;

    sound.playCorrect();
    sound.speak(`Yummy! ${currentDef.name} loves the treat!`);
    try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch {}

    const newXp = buddy.xp + 25;
    let nextLevel = buddy.level;
    let nextXpToNext = buddy.xpToNextLevel;

    if (newXp >= buddy.xpToNextLevel) {
      nextLevel += 1;
      nextXpToNext += 100;
      sound.playFanfare();
      sound.speak(`Level up! ${currentDef.name} is now Level ${nextLevel}!`);
    }

    onUpdateBuddy({
      ...buddy,
      level: nextLevel,
      xp: newXp,
      xpToNextLevel: nextXpToNext,
      happiness: 'excited',
      timesFed: buddy.timesFed + 1
    });

    setToastMessage(`Fed ${currentDef.favoriteFood}! +25 XP ⭐`);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handlePlayWithBuddy = () => {
    sound.playPop();
    sound.speak(currentDef.quote);
    onUpdateBuddy({ ...buddy, happiness: 'excited' });
    setToastMessage(`" ${currentDef.quote} "`);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleSelectBuddyType = (type: BuddyType) => {
    sound.playPop();
    const chosen = BUDDY_LIST.find(b => b.type === type)!;
    sound.speak(`You chose ${chosen.name}!`);
    onUpdateBuddy({
      ...buddy,
      type,
      name: chosen.name
    });
    setActiveTab('home');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">Home</span>
          </button>
          <h1 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
            🐾 My Learning Buddy
          </h1>
        </div>

        {/* Action Tabs & User Stars */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
            <button
              onClick={() => { sound.playPop(); setActiveTab('home'); }}
              className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              Buddy Home
            </button>
            <button
              onClick={() => { sound.playPop(); setActiveTab('choose'); }}
              className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                activeTab === 'choose' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              Change Buddy
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-2xl border-2 border-purple-100 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-purple-950">{userStars}</span>
          </div>
        </div>
      </div>

      {/* Main Buddy Sanctuary Container */}
      <div className="flex-1 bg-white rounded-[26px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* VIEW 1: BUDDY HOME */}
        {activeTab === 'home' && (
          <div className="w-full h-full flex items-center justify-around px-4">
            {/* Left: Buddy Large Avatar Stage */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-[36px] bg-gradient-to-br from-purple-100 to-pink-50 border-4 border-purple-200 shadow-inner flex flex-col items-center justify-center relative cursor-pointer"
                onClick={handlePlayWithBuddy}
              >
                <span className="text-7xl sm:text-8xl drop-shadow-md animate-bounce-gentle">
                  {currentDef.emoji}
                </span>
                <span className="absolute bottom-2 bg-white/80 backdrop-blur-sm text-[9px] font-black text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-100">
                  Tap to interact!
                </span>
              </motion.div>
              <h2 className="text-lg sm:text-xl font-black text-purple-950 font-['Fredoka'] mt-1.5">
                {currentDef.name}
              </h2>
            </div>

            {/* Right: Progression & Actions */}
            <div className="w-72 sm:w-80 flex flex-col gap-2.5">
              {/* Level & XP Card */}
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-purple-950 font-['Fredoka']">
                    Level {buddy.level} Buddy
                  </span>
                  <span className="text-[10px] font-black text-purple-600">
                    {buddy.xp} / {buddy.xpToNextLevel} XP
                  </span>
                </div>
                <div className="h-3 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (buddy.xp / buddy.xpToNextLevel) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[9px] font-bold text-slate-500">
                  <span>Mood: {buddy.happiness === 'excited' ? '🎉 Super Happy' : '😊 Happy'}</span>
                  <span>Times Fed: {buddy.timesFed} 🍏</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFeedBuddy}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-slate-900 font-black text-xs shadow-md border-2 border-white flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Feed (20 ⭐)</span>
                </button>

                <button
                  onClick={handlePlayWithBuddy}
                  className="py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md border-2 border-white flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play / Talk</span>
                </button>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400">
                  Earn XP by completing Color Challenges, Arcade Games & Adventure Quests!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CHOOSE / CHANGE BUDDY */}
        {activeTab === 'choose' && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="text-center">
              <h2 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
                Choose Your Starter Learning Buddy! 🐾
              </h2>
              <p className="text-[10px] text-slate-400 font-bold">Pick your favorite companion for daily learning:</p>
            </div>

            <div className="grid grid-cols-5 gap-2 flex-1 items-center my-1">
              {BUDDY_LIST.map(b => (
                <motion.button
                  key={b.type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectBuddyType(b.type)}
                  className={`h-36 rounded-3xl p-2 flex flex-col items-center justify-between border-3 cursor-pointer shadow-md transition-all ${
                    buddy.type === b.type
                      ? 'bg-purple-100 border-purple-600 ring-4 ring-purple-200'
                      : 'bg-white border-purple-100 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-4xl drop-shadow">{b.emoji}</span>
                  <div className="text-center">
                    <h3 className="text-xs font-black text-purple-950 font-['Fredoka'] leading-tight">{b.name}</h3>
                    <span className="text-[8px] text-slate-500 font-bold block mt-0.5">{b.favoriteFood}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    buddy.type === b.type ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {buddy.type === b.type ? 'Active' : 'Choose'}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">You can switch buddies anytime without losing your Level or Stars!</span>
            </div>
          </div>
        )}

        {/* Toast Toast Notice */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-900 text-white px-5 py-1.5 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border-2 border-amber-300 z-50 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
