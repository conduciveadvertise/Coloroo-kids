import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Volume2, RotateCcw, Sparkles, Check } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'abc' | 'math' | 'shapes' | 'animals';

// 1. Phonics ABC Exact 26 Letters & Sentences
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

// 2. Math Counting Levels (1 to 10)
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

// 3. Shapes & Colors Match Questions
const SHAPE_MATCH_DATA = [
  { id: 'star', prompt: 'MATCH COLOR!', name: 'Yellow Star', icon: '⭐', correctColor: 'Yellow' },
  { id: 'heart', prompt: 'MATCH COLOR!', name: 'Red Heart', icon: '❤️', correctColor: 'Red' },
  { id: 'circle', prompt: 'MATCH COLOR!', name: 'Blue Circle', icon: '🔵', correctColor: 'Blue' },
  { id: 'square', prompt: 'MATCH COLOR!', name: 'Green Square', icon: '🟩', correctColor: 'Green' },
  { id: 'diamond', prompt: 'MATCH COLOR!', name: 'Orange Diamond', icon: '🔶', correctColor: 'Orange' },
  { id: 'moon', prompt: 'MATCH COLOR!', name: 'Purple Moon', icon: '🌙', correctColor: 'Purple' },
];

const COLOR_OPTIONS = [
  { name: 'Yellow', bg: 'bg-[#FDCB6E]', hover: 'hover:bg-[#f39c12]' },
  { name: 'Red', bg: 'bg-[#FF7675]', hover: 'hover:bg-[#e17055]' },
  { name: 'Blue', bg: 'bg-[#74B9FF]', hover: 'hover:bg-[#0984e3]' },
  { name: 'Green', bg: 'bg-[#55EFC4]', hover: 'hover:bg-[#00cec9]' },
  { name: 'Purple', bg: 'bg-[#A29BFE]', hover: 'hover:bg-[#6c5ce7]' },
  { name: 'Orange', bg: 'bg-[#FFA502]', hover: 'hover:bg-[#e67e22]' },
];

// 4. Animal Sound Explorer
const ANIMALS_DATA = [
  { name: 'Coloroo Kangaroo', icon: '🦘', category: 'OUTBACK', fact: 'Boing! Boing!', soundText: 'Boing! Boing! Kangaroo hops high!' },
  { name: 'Playful Dolphin', icon: '🐬', category: 'OCEAN', fact: 'Click-click! Squeak!', soundText: 'Click click! Dolphins love jumping!' },
  { name: 'Gentle Lion', icon: '🦁', category: 'SAVANNA', fact: 'Rrrr-Oar!', soundText: 'Roaaar! King of the jungle!' },
  { name: 'Cute Panda', icon: '🐼', category: 'BAMBOO FOREST', fact: 'Munch! Crunch!', soundText: 'Munch munch! Pandas love bamboo!' },
  { name: 'Happy Cow', icon: '🐮', category: 'FARM', fact: 'Moooo-Mooo!', soundText: 'Moooo! Happy cow in the green meadow!' },
  { name: 'Little Froggy', icon: '🐸', category: 'JUNGLE', fact: 'Ribbit! Croak! Frogs jump up to 20 times their body length!', soundText: 'Ribbit! Croak! Frogs love splashing!' },
];

export const LearningScreen: React.FC<LearningScreenProps> = ({ onBack, onAddStars }) => {
  const [activeTab, setActiveTab] = useState<TabType>('abc');

  // ABC state
  const [selectedPhonic, setSelectedPhonic] = useState(PHONICS_DATA[0]);

  // Math State
  const [mathIndex, setMathIndex] = useState(2); // Start with 3 Balloons like screenshot
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const currentMath = MATH_LEVELS[mathIndex];

  // Shapes Match State
  const [shapeIndex, setShapeIndex] = useState(0);
  const currentShape = SHAPE_MATCH_DATA[shapeIndex];

  // Animals State
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS_DATA[5]); // Little Froggy

  // ABC Tap Handler
  const handleLetterClick = (item: typeof PHONICS_DATA[0]) => {
    setSelectedPhonic(item);
    sound.speak(item.sentence);
  };

  // Math Tap Item Handler (Counts 1, 2, 3...)
  const handleTapMathItem = (idx: number) => {
    if (countedItems.includes(idx)) return;
    const nextCount = countedItems.length + 1;
    const newCounted = [...countedItems, idx];
    setCountedItems(newCounted);

    sound.speak(`${nextCount}`);

    // If all items counted
    if (nextCount === currentMath.target) {
      sound.playFanfare();
      setTimeout(() => {
        sound.speak(`Awesome! That is ${currentMath.name}!`);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }, 400);
    }
  };

  const handleNextMath = () => {
    sound.playPop();
    setCountedItems([]);
    setMathIndex((prev) => (prev + 1) % MATH_LEVELS.length);
  };

  // Shape Match Handler
  const handleColorChoice = (colorName: string) => {
    if (colorName === currentShape.correctColor) {
      sound.playCorrect();
      sound.speak(`Correct! ${currentShape.name}!`);
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => {
        setShapeIndex((prev) => (prev + 1) % SHAPE_MATCH_DATA.length);
      }, 1000);
    } else {
      sound.playPop();
      sound.speak(`Oops! Try again! Find ${currentShape.correctColor}!`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Navigation Bar */}
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

        {/* 4 Exact Tabs: ABC, Math, Shapes, Animals */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'abc' as TabType, label: 'abc ABC' },
            { id: 'math' as TabType, label: '🔢 Math' },
            { id: 'shapes' as TabType, label: '🔷 Shapes' },
            { id: 'animals' as TabType, label: '🐱 Animals' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(t.id);
              }}
              className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[28px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* ================= TAB 1: PHONICS ABC ================= */}
        {activeTab === 'abc' && (
          <div className="w-full h-full flex gap-3 min-h-0">
            {/* Left 26 Letters Column List */}
            <div className="w-48 sm:w-56 flex flex-col justify-between border-r border-purple-100 pr-2">
              <div className="shrink-0 mb-1">
                <span className="text-[9px] font-black text-purple-900 uppercase block">
                  TAP ANY LETTER TO HEAR ITS SOUND! 🎧
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

            {/* Right Large Showcase Stage */}
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
                onClick={() => sound.speak(selectedPhonic.sentence)}
                className="w-full max-w-xs py-2 rounded-2xl bg-[#FF2E63] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MATH COUNTING ================= */}
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

            {/* Target Badge */}
            <div className="bg-amber-50 border-2 border-amber-200 px-6 py-2 rounded-2xl shadow-sm text-center">
              <span className="text-2xl font-black text-amber-500 font-['Fredoka'] mr-2">{currentMath.target}</span>
              <span className="text-base font-black text-slate-800 font-['Fredoka']">{currentMath.name}</span>
            </div>

            {/* Interactive Tap Boxes */}
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

        {/* ================= TAB 3: SHAPES MATCH COLOR ================= */}
        {activeTab === 'shapes' && (
          <div className="w-full h-full flex items-center justify-around px-4">
            {/* Shape Target Card */}
            <div className="w-48 bg-[#F0FBFF] rounded-[24px] p-4 border-2 border-cyan-200 border-b-[5px] border-b-cyan-400 shadow-md text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-cyan-700 tracking-wider mb-2">
                {currentShape.prompt}
              </span>
              <span className="text-6xl my-2 drop-shadow-md">{currentShape.icon}</span>
              <span className="text-sm font-black text-slate-800 font-['Fredoka']">{currentShape.name}</span>
            </div>

            {/* Color Option Buttons */}
            <div className="grid grid-cols-2 gap-2 w-72">
              {COLOR_OPTIONS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => handleColorChoice(col.name)}
                  className={`py-3 px-4 rounded-2xl ${col.bg} ${col.hover} text-white font-black text-xs shadow-md border-2 border-white cursor-pointer active:scale-95 transition-all text-center flex items-center justify-center gap-1.5`}
                >
                  <span className="drop-shadow">🎨</span>
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ANIMALS SOUND EXPLORER ================= */}
        {activeTab === 'animals' && (
          <div className="w-full h-full flex gap-3 min-h-0">
            {/* Left Animals Grid */}
            <div className="flex-1 grid grid-cols-3 gap-2 overflow-y-auto no-scrollbar items-center">
              {ANIMALS_DATA.map((a) => {
                const isSelected = selectedAnimal.name === a.name;
                return (
                  <button
                    key={a.name}
                    onClick={() => {
                      setSelectedAnimal(a);
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
                    <span className="text-[9px] text-slate-500 font-bold leading-tight">{a.fact.slice(0, 15)}...</span>
                  </button>
                );
              })}
            </div>

            {/* Right Animal Feature Showcase */}
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
                onClick={() => sound.speak(selectedAnimal.soundText)}
                className="w-full py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" /> <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
