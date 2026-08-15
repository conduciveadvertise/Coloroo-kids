import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Volume2, RotateCcw } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'abc' | 'math' | 'numbers' | 'shapes' | 'animals';

const PHONICS_DATA = [
  { letter: 'A', word: 'Apple', icon: '🍎', soundTxt: 'AH', sentence: 'A is for Apple! Ah, ah, Apple!' },
  { letter: 'B', word: 'Butterfly', icon: '🦋', soundTxt: 'BUH', sentence: 'B is for Butterfly! Buh, buh, Butterfly!' },
  { letter: 'C', word: 'Cat', icon: '🐱', soundTxt: 'KUH', sentence: 'C is for Cat! Kuh, kuh, Cat!' },
  { letter: 'D', word: 'Dinosaur', icon: '🦕', soundTxt: 'DUH', sentence: 'D is for Dinosaur! Duh, duh, Dinosaur!' },
  { letter: 'E', word: 'Elephant', icon: '🐘', soundTxt: 'EH', sentence: 'E is for Elephant! Eh, eh, Elephant!' },
  { letter: 'F', word: 'Frog', icon: '🐸', soundTxt: 'FUH', sentence: 'F is for Frog! Fuh, fuh, Frog!' },
  { letter: 'G', word: 'Giraffe', icon: '🦒', soundTxt: 'GUH', sentence: 'G is for Giraffe! Guh, guh, Giraffe!' },
  { letter: 'H', word: 'Heart', icon: '💖', soundTxt: 'HUH', sentence: 'H is for Heart! Huh, huh, Heart!' },
  { letter: 'I', word: 'Ice Cream', icon: '🍦', soundTxt: 'IH', sentence: 'I is for Ice Cream! Ih, ih, Ice Cream!' },
  { letter: 'J', word: 'Jellyfish', icon: '🪼', soundTxt: 'JUH', sentence: 'J is for Jellyfish! Juh, juh, Jellyfish!' },
  { letter: 'K', word: 'Kangaroo', icon: '🦘', soundTxt: 'KUH', sentence: 'K is for Kangaroo! Kuh, kuh, Kangaroo!' },
  { letter: 'L', word: 'Lion', icon: '🦁', soundTxt: 'LUH', sentence: 'L is for Lion! Luh, luh, Lion!' },
  { letter: 'M', word: 'Moon', icon: '🌙', soundTxt: 'MUH', sentence: 'M is for Moon! Muh, muh, Moon!' },
  { letter: 'N', word: 'Nest', icon: '🪺', soundTxt: 'NUH', sentence: 'N is for Nest! Nuh, nuh, Nest!' },
  { letter: 'O', word: 'Octopus', icon: '🐙', soundTxt: 'AW', sentence: 'O is for Octopus! Aw, aw, Octopus!' },
  { letter: 'P', word: 'Penguin', icon: '🐧', soundTxt: 'PUH', sentence: 'P is for Penguin! Puh, puh, Penguin!' },
  { letter: 'Q', word: 'Queen', icon: '👑', soundTxt: 'KWUH', sentence: 'Q is for Queen! Kwuh, kwuh, Queen!' },
  { letter: 'R', word: 'Rainbow', icon: '🌈', soundTxt: 'RUH', sentence: 'R is for Rainbow! Ruh, ruh, Rainbow!' },
  { letter: 'S', word: 'Star', icon: '⭐', soundTxt: 'SUH', sentence: 'S is for Star! Suh, suh, Star!' },
  { letter: 'T', word: 'Tiger', icon: '🐯', soundTxt: 'TUH', sentence: 'T is for Tiger! Tuh, tuh, Tiger!' },
  { letter: 'U', word: 'Unicorn', icon: '🦄', soundTxt: 'UH', sentence: 'U is for Unicorn! Uh, uh, Unicorn!' },
  { letter: 'V', word: 'Volcano', icon: '🌋', soundTxt: 'VUH', sentence: 'V is for Volcano! Vuh, vuh, Volcano!' },
  { letter: 'W', word: 'Whale', icon: '🐳', soundTxt: 'WUH', sentence: 'W is for Whale! Wuh, wuh, Whale!' },
  { letter: 'X', word: 'Xylophone', icon: '🎵', soundTxt: 'KS', sentence: 'X is for Xylophone! Ks, ks, Xylophone!' },
  { letter: 'Y', word: 'Yo-Yo', icon: '🪀', soundTxt: 'YUH', sentence: 'Y is for Yo-Yo! Yuh, yuh, Yo-Yo!' },
  { letter: 'Z', word: 'Zebra', icon: '🦓', soundTxt: 'ZUH', sentence: 'Z is for Zebra! Zuh, zuh, Zebra!' },
];

const MATH_LEVELS = [
  { target: 1, name: 'One (Apple)', emoji: '🍎' },
  { target: 2, name: 'Two (Ducks)', emoji: '🦆' },
  { target: 3, name: 'Three (Balloons)', emoji: '🎈' },
  { target: 4, name: 'Four (Flowers)', emoji: '🌸' },
  { target: 5, name: 'Five (Stars)', emoji: '⭐' },
  { target: 6, name: 'Six (Ice Creams)', emoji: '🍦' },
  { target: 7, name: 'Seven (Strawberries)', emoji: '🍓' },
  { target: 8, name: 'Eight (Kittens)', emoji: '🐱' },
  { target: 9, name: 'Nine (Cars)', emoji: '🚗' },
  { target: 10, name: 'Ten (Rockets)', emoji: '🚀' },
];

const numWordsMap: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  30: 'Thirty', 40: 'Forty', 50: 'Fifty'
};

const getNumName = (n: number): string => {
  if (numWordsMap[n]) return numWordsMap[n];
  const t = Math.floor(n / 10) * 10;
  const o = n % 10;
  return `${numWordsMap[t]} ${numWordsMap[o]}`;
};

const NUMBERS_1_TO_50 = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const name = getNumName(num);
  return { num, name };
});

const SHAPE_MATCH_DATA = [
  { id: 'star', prompt: 'MATCH COLOR!', name: 'Yellow Star', icon: '⭐', correctColor: 'Yellow' },
  { id: 'heart', prompt: 'MATCH COLOR!', name: 'Red Heart', icon: '❤️', correctColor: 'Red' },
  { id: 'circle', prompt: 'MATCH COLOR!', name: 'Blue Circle', icon: '🔵', correctColor: 'Blue' },
  { id: 'square', prompt: 'MATCH COLOR!', name: 'Green Square', icon: '🟩', correctColor: 'Green' },
  { id: 'diamond', prompt: 'MATCH COLOR!', name: 'Orange Diamond', icon: '🔶', correctColor: 'Orange' },
  { id: 'moon', prompt: 'MATCH COLOR!', name: 'Purple Moon', icon: '🌙', correctColor: 'Purple' },
];

const COLOR_OPTIONS = [
  { name: 'Yellow', bg: 'bg-[#FDCB6E]' },
  { name: 'Red', bg: 'bg-[#FF7675]' },
  { name: 'Blue', bg: 'bg-[#74B9FF]' },
  { name: 'Green', bg: 'bg-[#55EFC4]' },
  { name: 'Purple', bg: 'bg-[#A29BFE]' },
  { name: 'Orange', bg: 'bg-[#FFA502]' },
];

const ANIMALS_DATA = [
  { name: 'Coloroo Kangaroo', icon: '🦘', category: 'OUTBACK', fact: 'Boing! Boing! Kangaroo hops high in Australia!', soundText: 'Boing Boing! Kangaroo hops high!' },
  { name: 'Playful Dolphin', icon: '🐬', category: 'OCEAN', fact: 'Click-click! Squeak! Dolphins love jumping!', soundText: 'Click click! Playful dolphin in the sea!' },
  { name: 'Gentle Lion', icon: '🦁', category: 'SAVANNA', fact: 'Rrrr-Oar! King of the wild savanna!', soundText: 'Roaaar! Gentle brave lion!' },
  { name: 'Cute Panda', icon: '🐼', category: 'BAMBOO', fact: 'Munch! Crunch! Pandas love fresh bamboo!', soundText: 'Munch munch! Sweet little panda!' },
  { name: 'Happy Cow', icon: '🐮', category: 'FARM', fact: 'Moooo-Mooo! Gives tasty milk in the farm!', soundText: 'Moooo! Happy cow in the green meadow!' },
  { name: 'Little Froggy', icon: '🐸', category: 'JUNGLE', fact: 'Ribbit! Croak! Frogs jump up to 20 times their size!', soundText: 'Ribbit! Croak! Little green froggy!' },
];

export const LearningScreen: React.FC<LearningScreenProps> = ({ onBack, onAddStars }) => {
  const [activeTab, setActiveTab] = useState<TabType>('abc');
  const [selectedPhonic, setSelectedPhonic] = useState(PHONICS_DATA[0]);
  const [mathIndex, setMathIndex] = useState(2);
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const [selectedNumber50, setSelectedNumber50] = useState(NUMBERS_1_TO_50[0]);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS_DATA[0]);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const currentMath = MATH_LEVELS[mathIndex];
  const currentShape = SHAPE_MATCH_DATA[shapeIndex];

  const handleLetterClick = (item: typeof PHONICS_DATA[0]) => {
    setSelectedPhonic(item);
    sound.playPop();
    sound.speak(item.sentence);
  };

  const handleTapMathItem = (idx: number) => {
    if (countedItems.includes(idx)) return;
    const nextCount = countedItems.length + 1;
    const newCounted = [...countedItems, idx];
    setCountedItems(newCounted);

    sound.playPop();
    sound.speak(`${nextCount}`);

    if (nextCount === currentMath.target) {
      sound.playFanfare();
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
      setCelebrationMsg(`Great job counting ${currentMath.name}! ⭐`);
      onAddStars(2);
      sound.speak(`Awesome! You counted ${currentMath.target}! ${currentMath.name}!`);
    }
  };

  const handleNextMath = () => {
    sound.playPop();
    setCountedItems([]);
    setCelebrationMsg(null);
    setMathIndex((prev) => (prev + 1) % MATH_LEVELS.length);
  };

  const handleNumber50Click = (n: typeof NUMBERS_1_TO_50[0]) => {
    setSelectedNumber50(n);
    sound.playPop();
    sound.speak(`Number ${n.num}! ${n.name}`);
  };

  const handleColorChoice = (colorName: string) => {
    if (colorName === currentShape.correctColor) {
      sound.playCorrect();
      sound.speak(`Correct! ${currentShape.name}!`);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setCelebrationMsg(`Super! That is ${currentShape.name}! 🎨`);
      onAddStars(2);
      setTimeout(() => {
        setCelebrationMsg(null);
        setShapeIndex((prev) => (prev + 1) % SHAPE_MATCH_DATA.length);
      }, 1500);
    } else {
      sound.playPop();
      sound.speak(`Try again! Find ${currentShape.correctColor}!`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header */}
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
            <span className="text-xs font-black">Back</span>
          </button>
          <h1 className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
            Learn & Play 🌟
          </h1>
        </div>

        {/* 5 Complete Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'abc' as TabType, label: 'abc ABC' },
            { id: 'math' as TabType, label: '🔢 Math' },
            { id: 'numbers' as TabType, label: '📝 Numbers (1–50)' },
            { id: 'shapes' as TabType, label: '🔷 Shapes' },
            { id: 'animals' as TabType, label: '🐱 Animals' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(t.id);
                setCelebrationMsg(null);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 bg-white rounded-[28px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* TAB 1: PHONICS ABC */}
        {activeTab === 'abc' && (
          <div className="w-full h-full flex gap-3 min-h-0">
            <div className="w-48 sm:w-56 flex flex-col justify-between border-r border-purple-100 pr-2">
              <div className="shrink-0 mb-1">
                <span className="text-[9px] font-black text-purple-900 uppercase block">
                  TAP ANY LETTER (A–Z) 🎧
                </span>
                <span className="text-[9px] font-extrabold text-purple-600">26 Letters</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-1.5 overflow-y-auto no-scrollbar py-0.5 items-center content-start">
                {PHONICS_DATA.map((item) => {
                  const isSelected = selectedPhonic.letter === item.letter;
                  return (
                    <button
                      key={item.letter}
                      onClick={() => handleLetterClick(item)}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-100'
                      }`}
                    >
                      <span className="text-sm font-black leading-none font-['Fredoka']">{item.letter}</span>
                      <span className="text-xs mt-0.5 leading-none">{item.icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 bg-[#FFF5F5] rounded-[24px] p-3 border-2 border-rose-200 border-b-[5px] border-b-rose-400 flex flex-col justify-between items-center text-center relative">
              <span className="bg-[#FF2E63] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow-sm">
                SOUND: /{selectedPhonic.soundTxt}/
              </span>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-7xl font-black text-purple-950 font-['Fredoka'] leading-none">
                  {selectedPhonic.letter}
                </span>
                <span className="text-6xl my-1 drop-shadow-md">{selectedPhonic.icon}</span>
                <h2 className="text-2xl font-black text-slate-900 font-['Fredoka']">{selectedPhonic.word}</h2>
                <p className="text-xs font-bold text-slate-500 italic mt-0.5">
                  "{selectedPhonic.sentence}"
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(selectedPhonic.sentence);
                }}
                className="w-full max-w-xs py-2 rounded-2xl bg-[#FF2E63] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MATH COUNTING */}
        {activeTab === 'math' && (
          <div className="w-full h-full flex flex-col justify-between items-center relative py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                TAP ITEMS TO COUNT
              </span>
              <button
                onClick={handleNextMath}
                className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-200 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Next
              </button>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 px-6 py-2 rounded-2xl shadow-sm text-center">
              <span className="text-2xl font-black text-amber-500 font-['Fredoka'] mr-2">{currentMath.target}</span>
              <span className="text-base font-black text-slate-800 font-['Fredoka']">{currentMath.name}</span>
            </div>

            <div className="flex items-center justify-center gap-3 my-2 flex-wrap">
              {Array.from({ length: currentMath.target }).map((_, i) => {
                const isTapped = countedItems.includes(i);
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTapMathItem(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-2 transition-all cursor-pointer ${
                      isTapped
                        ? 'bg-emerald-400 border-emerald-500 shadow-lg scale-105'
                        : 'bg-purple-50 border-purple-200 shadow-sm'
                    }`}
                  >
                    {currentMath.emoji}
                  </motion.button>
                );
              })}
            </div>

            <span className="text-xs font-black text-purple-900">
              Counted: <span className="text-purple-600">{countedItems.length}</span> of {currentMath.target}
            </span>
          </div>
        )}

        {/* TAB 3: NUMBERS 1 TO 50 */}
        {activeTab === 'numbers' && (
          <div className="w-full h-full flex gap-3 min-h-0">
            <div className="flex-1 flex flex-col justify-between overflow-hidden border-r border-purple-100 pr-2">
              <span className="text-[10px] font-black text-purple-900 uppercase block mb-1">
                TAP NUMBERS (1–50) TO HEAR NAME & PRONUNCIATION! 📝
              </span>
              <div className="flex-1 grid grid-cols-5 gap-1.5 overflow-y-auto no-scrollbar py-0.5 items-center">
                {NUMBERS_1_TO_50.map((item) => {
                  const isSelected = selectedNumber50.num === item.num;
                  return (
                    <button
                      key={item.num}
                      onClick={() => handleNumber50Click(item)}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300'
                          : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 border border-emerald-100'
                      }`}
                    >
                      <span className="text-base font-black font-['Fredoka'] leading-none">{item.num}</span>
                      <span className="text-[8px] font-black tracking-tight line-clamp-1 mt-0.5">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-60 bg-[#F0FDF4] rounded-[24px] p-3 border-2 border-emerald-300 border-b-[5px] border-b-emerald-500 flex flex-col justify-between items-center text-center shrink-0">
              <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                NUMBER: {selectedNumber50.num}
              </span>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-emerald-600 font-['Fredoka'] leading-none">
                  {selectedNumber50.num}
                </span>
                <h2 className="text-xl font-black text-slate-900 font-['Fredoka'] mt-1">
                  {selectedNumber50.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(`Number ${selectedNumber50.num}! ${selectedNumber50.name}`);
                }}
                className="w-full py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Say Number</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHAPES MATCH */}
        {activeTab === 'shapes' && (
          <div className="w-full h-full flex items-center justify-around px-4">
            <div className="w-48 bg-[#F0FBFF] rounded-[24px] p-4 border-2 border-cyan-200 border-b-[5px] border-b-cyan-400 shadow-md text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-cyan-700 tracking-wider mb-2">
                {currentShape.prompt}
              </span>
              <span className="text-6xl my-2 drop-shadow-md">{currentShape.icon}</span>
              <span className="text-sm font-black text-slate-800 font-['Fredoka']">{currentShape.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-72">
              {COLOR_OPTIONS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => handleColorChoice(col.name)}
                  className={`py-3 px-4 rounded-2xl ${col.bg} text-white font-black text-xs shadow-md border-2 border-white cursor-pointer active:scale-95 transition-all text-center flex items-center justify-center gap-1.5`}
                >
                  <span className="drop-shadow">🎨</span>
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ANIMALS */}
        {activeTab === 'animals' && (
          <div className="w-full h-full flex gap-3 min-h-0">
            <div className="flex-1 grid grid-cols-3 gap-2 overflow-y-auto no-scrollbar items-center">
              {ANIMALS_DATA.map((a) => {
                const isSelected = selectedAnimal.name === a.name;
                return (
                  <button
                    key={a.name}
                    onClick={() => {
                      setSelectedAnimal(a);
                      sound.playPop();
                      sound.speak(a.soundText);
                    }}
                    className={`h-24 rounded-2xl p-2 flex flex-col justify-center items-start text-left border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300'
                        : 'bg-white border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-3xl leading-none">{a.icon}</span>
                    <span className="text-xs font-black text-purple-950 font-['Fredoka'] mt-1 leading-tight">{a.name}</span>
                    <span className="text-[9px] text-slate-500 font-bold leading-tight">{a.fact.slice(0, 16)}...</span>
                  </button>
                );
              })}
            </div>

            <div className="w-64 bg-[#FFFDF0] rounded-[24px] p-3 border-2 border-amber-200 border-b-[5px] border-b-amber-400 shadow-lg flex flex-col justify-between items-center text-center">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                {selectedAnimal.category}
              </span>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-6xl my-1 drop-shadow-md">{selectedAnimal.icon}</span>
                <h2 className="text-xl font-black text-slate-900 font-['Fredoka']">{selectedAnimal.name}</h2>
                <p className="text-[10px] font-bold text-slate-600 mt-1 max-w-[190px]">
                  {selectedAnimal.fact}
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(selectedAnimal.soundText);
                }}
                className="w-full py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Celebration Toast */}
        <AnimatePresence>
          {celebrationMsg && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-900 text-white px-5 py-2 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border-2 border-amber-300"
            >
              <span>🎉</span>
              <span>{celebrationMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
