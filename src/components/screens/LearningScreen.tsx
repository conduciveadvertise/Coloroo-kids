import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'phonics' | 'counting' | 'numbers' | 'shapes';

// 1. Phonics ABC (26 Letters)
const PHONICS_DATA = [
  { letter: 'A', word: 'Apple', icon: '🍎', phonic: 'Ah', phrase: 'A is for Apple! Ah, ah, Apple' },
  { letter: 'B', word: 'Butterfly', icon: '🦋', phonic: 'Buh', phrase: 'B is for Butterfly! Buh, buh, Butterfly' },
  { letter: 'C', word: 'Cat', icon: '🐱', phonic: 'Kuh', phrase: 'C is for Cat! Kuh, kuh, Cat' },
  { letter: 'D', word: 'Dino', icon: '🦕', phonic: 'Duh', phrase: 'D is for Dino! Duh, duh, Dino' },
  { letter: 'E', word: 'Elephant', icon: '🐘', phonic: 'Eh', phrase: 'E is for Elephant! Eh, eh, Elephant' },
  { letter: 'F', word: 'Frog', icon: '🐸', phonic: 'Fuh', phrase: 'F is for Frog! Fuh, fuh, Frog' },
  { letter: 'G', word: 'Giraffe', icon: '🦒', phonic: 'Guh', phrase: 'G is for Giraffe! Guh, guh, Giraffe' },
  { letter: 'H', word: 'Heart', icon: '💖', phonic: 'Huh', phrase: 'H is for Heart! Huh, huh, Heart' },
  { letter: 'I', word: 'Ice Cream', icon: '🍦', phonic: 'Ih', phrase: 'I is for Ice Cream! Ih, ih, Ice Cream' },
  { letter: 'J', word: 'Jellyfish', icon: '🪼', phonic: 'Juh', phrase: 'J is for Jellyfish! Juh, juh, Jellyfish' },
  { letter: 'K', word: 'Kangaroo', icon: '🦘', phonic: 'Kuh', phrase: 'K is for Kangaroo! Kuh, kuh, Kangaroo' },
  { letter: 'L', word: 'Lion', icon: '🦁', phonic: 'Luh', phrase: 'L is for Lion! Luh, luh, Lion' },
  { letter: 'M', word: 'Moon', icon: '🌙', phonic: 'Muh', phrase: 'M is for Moon! Muh, muh, Moon' },
  { letter: 'N', word: 'Nest', icon: '🪺', phonic: 'Nuh', phrase: 'N is for Nest! Nuh, nuh, Nest' },
  { letter: 'O', word: 'Octopus', icon: '🐙', phonic: 'Aw', phrase: 'O is for Octopus! Aw, aw, Octopus' },
  { letter: 'P', word: 'Penguin', icon: '🐧', phonic: 'Puh', phrase: 'P is for Penguin! Puh, puh, Penguin' },
  { letter: 'Q', word: 'Queen', icon: '👑', phonic: 'Kwuh', phrase: 'Q is for Queen! Kwuh, kwuh, Queen' },
  { letter: 'R', word: 'Rainbow', icon: '🌈', phonic: 'Ruh', phrase: 'R is for Rainbow! Ruh, ruh, Rainbow' },
  { letter: 'S', word: 'Star', icon: '⭐', phonic: 'Suh', phrase: 'S is for Star! Suh, suh, Star' },
  { letter: 'T', word: 'Tiger', icon: '🐯', phonic: 'Tuh', phrase: 'T is for Tiger! Tuh, tuh, Tiger' },
  { letter: 'U', word: 'Unicorn', icon: '🦄', phonic: 'Uh', phrase: 'U is for Unicorn! Uh, uh, Unicorn' },
  { letter: 'V', word: 'Volcano', icon: '🌋', phonic: 'Vuh', phrase: 'V is for Volcano! Vuh, vuh, Volcano' },
  { letter: 'W', word: 'Whale', icon: '🐳', phonic: 'Wuh', phrase: 'W is for Whale! Wuh, wuh, Whale' },
  { letter: 'X', word: 'Xylophone', icon: '🎵', phonic: 'Ks', phrase: 'X is for Xylophone! Ks, ks, Xylophone' },
  { letter: 'Y', word: 'Yo-Yo', icon: '🪀', phonic: 'Yuh', phrase: 'Y is for Yo-Yo! Yuh, yuh, Yo-Yo' },
  { letter: 'Z', word: 'Zebra', icon: '🦓', phonic: 'Zuh', phrase: 'Z is for Zebra! Zuh, zuh, Zebra' },
];

// 2. Math Counting (1-10)
const COUNTING_DATA = [
  { num: 1, word: 'One', emoji: '🍎', name: 'One Apple', repeat: 1 },
  { num: 2, word: 'Two', emoji: '🦆', name: 'Two Ducks', repeat: 2 },
  { num: 3, word: 'Three', emoji: '⭐', name: 'Three Stars', repeat: 3 },
  { num: 4, word: 'Four', emoji: '🚗', name: 'Four Cars', repeat: 4 },
  { num: 5, word: 'Five', emoji: '🎈', name: 'Five Balloons', repeat: 5 },
  { num: 6, word: 'Six', emoji: '🍦', name: 'Six Ice Creams', repeat: 6 },
  { num: 7, word: 'Seven', emoji: '🌸', name: 'Seven Flowers', repeat: 7 },
  { num: 8, word: 'Eight', emoji: '🐱', name: 'Eight Kittens', repeat: 8 },
  { num: 9, word: 'Nine', emoji: '🍓', name: 'Nine Berries', repeat: 9 },
  { num: 10, word: 'Ten', emoji: '🚀', name: 'Ten Rockets', repeat: 10 },
];

// Helper to generate full 1 to 50 Number Names
const numberWords: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  30: 'Thirty', 40: 'Forty', 50: 'Fifty'
};

const getNumberName = (n: number): string => {
  if (numberWords[n]) return numberWords[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  return `${numberWords[tens]} ${numberWords[ones]}`;
};

// 3. Complete 1 to 50 Numbers Data
const NUMBERS_50_DATA = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const name = getNumberName(num);
  const spell = name.toUpperCase().replace(/\s+/g, '-').split('').join('-');
  return { num, name, spell };
});

// 4. Shapes & Colors Data
const SHAPES_DATA = [
  { id: 'circle', name: 'Red Circle', icon: '🔴', color: '#FF7675', desc: 'Round like the shiny sun' },
  { id: 'square', name: 'Blue Square', icon: '🟦', color: '#74B9FF', desc: 'Four equal straight sides' },
  { id: 'triangle', name: 'Green Triangle', icon: '🔺', color: '#55EFC4', desc: 'Three sharp corners' },
  { id: 'star', name: 'Yellow Star', icon: '⭐', color: '#FDCB6E', desc: 'Twinkling in the night sky' },
  { id: 'heart', name: 'Pink Heart', icon: '💖', color: '#FD79A8', desc: 'Full of love and kindness' },
  { id: 'diamond', name: 'Orange Diamond', icon: '🔶', color: '#FFA502', desc: 'Flying high like a kite' },
  { id: 'moon', name: 'Golden Moon', icon: '🌙', color: '#FFEAA7', desc: 'Glowing crescent in the sky' },
  { id: 'hexagon', name: 'Purple Hexagon', icon: '⬢', color: '#A29BFE', desc: 'Six equal sides' },
];

export const LearningScreen: React.FC<LearningScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('phonics');

  const [selectedPhonic, setSelectedPhonic] = useState(PHONICS_DATA[0]);
  const [selectedCounting, setSelectedCounting] = useState(COUNTING_DATA[0]);
  const [selectedNumber, setSelectedNumber] = useState(NUMBERS_50_DATA[0]);
  const [selectedShape, setSelectedShape] = useState(SHAPES_DATA[0]);

  // Tab 1: Phonics Tap Voice
  const handlePhonicClick = (p: typeof PHONICS_DATA[0]) => {
    setSelectedPhonic(p);
    sound.speak(`${p.letter}! ${p.word}! Sound: ${p.phonic}`);
  };

  // Tab 2: Counting Tap Voice
  const handleCountingClick = (c: typeof COUNTING_DATA[0]) => {
    setSelectedCounting(c);
    sound.speak(`${c.num}! ${c.name}`);
  };

  // Tab 3: Numbers 1-50 Tap Voice
  const handleNumberClick = (n: typeof NUMBERS_50_DATA[0]) => {
    setSelectedNumber(n);
    sound.speak(`Number ${n.num}! ${n.name}`);
  };

  // Tab 4: Shapes Tap Voice
  const handleShapeClick = (s: typeof SHAPES_DATA[0]) => {
    setSelectedShape(s);
    sound.speak(`${s.name}! ${s.desc}`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Bar with Tabs */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
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
          <h1 className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
            Learn & Play 🌟
          </h1>
        </div>

        {/* 4 Tab Switchers */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'phonics' as TabType, label: '🔤 Phonics ABC' },
            { id: 'counting' as TabType, label: '🔢 Counting' },
            { id: 'numbers' as TabType, label: '📝 Numbers (1–50)' },
            { id: 'shapes' as TabType, label: '🔷 Shapes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex gap-2.5 sm:gap-3 min-h-0 items-stretch my-0.5">

        {/* ================= TAB 1: PHONICS ABC ================= */}
        {activeTab === 'phonics' && (
          <>
            <div className="flex-1 bg-white rounded-[26px] p-2.5 border-2 border-purple-100 shadow-lg flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between shrink-0 mb-1 px-1">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                  TAP ANY LETTER (A–Z) TO HEAR VOICE! 🎧
                </span>
                <span className="text-[10px] font-extrabold text-purple-600">26 Letters</span>
              </div>
              <div className="flex-1 grid grid-cols-7 gap-1.5 overflow-y-auto no-scrollbar py-0.5 items-center content-center">
                {PHONICS_DATA.map((item) => {
                  const isSelected = selectedPhonic.letter === item.letter;
                  return (
                    <motion.button
                      key={item.letter}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handlePhonicClick(item)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-lg ring-3 ring-purple-300 scale-105'
                          : 'bg-purple-50/70 hover:bg-purple-100 text-slate-800 border border-purple-100'
                      }`}
                    >
                      <span className={`text-base sm:text-lg font-black font-['Fredoka'] leading-none ${isSelected ? 'text-white' : 'text-purple-950'}`}>
                        {item.letter}
                      </span>
                      <span className="text-sm sm:text-base mt-0.5 leading-none">{item.icon}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Phonics Showcase */}
            <div className="w-56 sm:w-64 md:w-72 bg-[#FFF5F5] rounded-[28px] p-3 border-2 border-rose-200 border-b-[6px] border-b-rose-400 shadow-xl flex flex-col justify-between items-center shrink-0">
              <span className="bg-[#FF2E63] text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full uppercase">
                SOUND: /{selectedPhonic.phonic.toUpperCase()}/
              </span>
              <div className="flex-1 flex flex-col items-center justify-center text-center my-1">
                <span className="text-6xl sm:text-7xl font-black text-purple-950 font-['Fredoka'] leading-none">
                  {selectedPhonic.letter}
                </span>
                <span className="text-5xl sm:text-6xl my-1 drop-shadow-md">{selectedPhonic.icon}</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka']">{selectedPhonic.word}</h2>
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 italic mt-0.5 leading-tight">
                  "{selectedPhonic.letter} is for {selectedPhonic.word}!"
                </p>
              </div>
              <button
                onClick={() => sound.speak(selectedPhonic.phrase)}
                className="w-full py-2 rounded-2xl bg-[#FF2E63] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Hear Full Sound</span>
              </button>
            </div>
          </>
        )}

        {/* ================= TAB 2: MATH COUNTING ================= */}
        {activeTab === 'counting' && (
          <>
            <div className="flex-1 bg-white rounded-[26px] p-2.5 border-2 border-purple-100 shadow-lg flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between shrink-0 mb-1 px-1">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                  TAP TO HEAR COUNTING (1–10)! 🔢
                </span>
                <span className="text-[10px] font-extrabold text-purple-600">1 to 10</span>
              </div>
              <div className="flex-1 grid grid-cols-5 gap-2 overflow-y-auto no-scrollbar py-0.5 items-center content-center">
                {COUNTING_DATA.map((item) => {
                  const isSelected = selectedCounting.num === item.num;
                  return (
                    <motion.button
                      key={item.num}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCountingClick(item)}
                      className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-900 shadow-lg ring-3 ring-amber-200 scale-105 border-2 border-white'
                          : 'bg-purple-50/80 hover:bg-purple-100 text-purple-950 border border-purple-100'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-black font-['Fredoka'] leading-none">{item.num}</span>
                      <span className="text-lg sm:text-xl mt-1 leading-none">{item.emoji}</span>
                      <span className="text-[9px] font-bold text-slate-600 mt-0.5">{item.word}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Counting Showcase */}
            <div className="w-56 sm:w-64 md:w-72 bg-[#FFFDF0] rounded-[28px] p-3 border-2 border-amber-300 border-b-[6px] border-b-amber-400 shadow-xl flex flex-col justify-between items-center shrink-0">
              <span className="bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full uppercase">
                COUNTING: {selectedCounting.word.toUpperCase()}
              </span>
              <div className="flex-1 flex flex-col items-center justify-center text-center my-1">
                <span className="text-6xl sm:text-7xl font-black text-amber-500 font-['Fredoka'] leading-none">
                  {selectedCounting.num}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1 max-w-[180px] my-2">
                  {Array.from({ length: selectedCounting.repeat }).map((_, i) => (
                    <span key={i} className="text-2xl sm:text-3xl animate-bounce-gentle">
                      {selectedCounting.emoji}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Fredoka']">{selectedCounting.name}</h2>
              </div>
              <button
                onClick={() => sound.speak(`${selectedCounting.num}! ${selectedCounting.name}`)}
                className="w-full py-2 rounded-2xl bg-amber-400 text-slate-900 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Count Out Loud</span>
              </button>
            </div>
          </>
        )}

        {/* ================= TAB 3: NUMBER NAMES (1 TO 50) ================= */}
        {activeTab === 'numbers' && (
          <>
            <div className="flex-1 bg-white rounded-[26px] p-2.5 border-2 border-purple-100 shadow-lg flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between shrink-0 mb-1 px-1">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                  TAP NUMBERS (1–50) TO HEAR NAME & PRONUNCIATION! 📝
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600">1 to 50 (Scrollable)</span>
              </div>
              <div className="flex-1 grid grid-cols-5 sm:grid-cols-6 gap-1.5 overflow-y-auto no-scrollbar py-1 pr-1 items-center">
                {NUMBERS_50_DATA.map((item) => {
                  const isSelected = selectedNumber.num === item.num;
                  return (
                    <motion.button
                      key={item.num}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleNumberClick(item)}
                      className={`h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300 scale-105 border-2 border-white'
                          : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 border border-emerald-100'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black font-['Fredoka'] leading-none">{item.num}</span>
                      <span className="text-[8px] font-black tracking-tight line-clamp-1 mt-0.5">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Numbers Showcase */}
            <div className="w-56 sm:w-64 md:w-72 bg-[#F0FDF4] rounded-[28px] p-3 border-2 border-emerald-300 border-b-[6px] border-b-emerald-500 shadow-xl flex flex-col justify-between items-center shrink-0">
              <span className="bg-emerald-500 text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full uppercase">
                NUMBER: {selectedNumber.num}
              </span>
              <div className="flex-1 flex flex-col items-center justify-center text-center my-1">
                <span className="text-6xl sm:text-7xl font-black text-emerald-600 font-['Fredoka'] leading-none">
                  {selectedNumber.num}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka'] mt-2">
                  {selectedNumber.name}
                </h2>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 tracking-wider mt-1 bg-emerald-100 px-3 py-1 rounded-xl">
                  {selectedNumber.name.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => sound.speak(`Number ${selectedNumber.num}! ${selectedNumber.name}`)}
                className="w-full py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Say Number</span>
              </button>
            </div>
          </>
        )}

        {/* ================= TAB 4: SHAPES & COLORS ================= */}
        {activeTab === 'shapes' && (
          <>
            <div className="flex-1 bg-white rounded-[26px] p-2.5 border-2 border-purple-100 shadow-lg flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between shrink-0 mb-1 px-1">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                  TAP TO HEAR SHAPES & COLORS! 🔷
                </span>
                <span className="text-[10px] font-extrabold text-cyan-600">8 Shapes</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2 overflow-y-auto no-scrollbar py-0.5 items-center content-center">
                {SHAPES_DATA.map((item) => {
                  const isSelected = selectedShape.id === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleShapeClick(item)}
                      className={`h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-white shadow-lg ring-3 ring-cyan-200 scale-105 border-2 border-white'
                          : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-100'
                      }`}
                    >
                      <span className="text-3xl leading-none">{item.icon}</span>
                      <span className="text-[9px] font-black mt-1 leading-tight text-center">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Shapes Showcase */}
            <div className="w-56 sm:w-64 md:w-72 bg-[#F0FBFF] rounded-[28px] p-3 border-2 border-cyan-300 border-b-[6px] border-b-cyan-500 shadow-xl flex flex-col justify-between items-center shrink-0">
              <span className="bg-cyan-500 text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full uppercase">
                SHAPE & COLOR
              </span>
              <div className="flex-1 flex flex-col items-center justify-center text-center my-1">
                <span className="text-7xl my-2 drop-shadow-md animate-bounce-gentle">
                  {selectedShape.icon}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka']">
                  {selectedShape.name}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 italic mt-0.5">
                  "{selectedShape.desc}"
                </p>
              </div>
              <button
                onClick={() => sound.speak(`${selectedShape.name}! ${selectedShape.desc}`)}
                className="w-full py-2 rounded-2xl bg-cyan-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Say Shape</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
