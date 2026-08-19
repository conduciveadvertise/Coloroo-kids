import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Volume2,
  Lock,
  CheckCircle2,
  Star,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  Compass,
  Waves,
  Rocket,
  Flame
} from 'lucide-react';
import { WorldId, AdventureProgress } from '../../types';
import { WORLDS_INFO, FOREST_LEVELS, AdventureLevelDef } from '../../data/adventureData';
import {
  getStoredAdventureProgress,
  saveStoredAdventureProgress
} from '../../services/storage';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface AdventureWorldScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

export const AdventureWorldScreen: React.FC<AdventureWorldScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [progress, setProgress] = useState<AdventureProgress>(getStoredAdventureProgress);
  const [selectedWorld, setSelectedWorld] = useState<WorldId>('forest');
  const [activeLevel, setActiveLevel] = useState<AdventureLevelDef | null>(null);

  // Level Play State
  const [levelSuccess, setLevelSuccess] = useState(false);
  const [bossStep, setBossStep] = useState(0);

  useEffect(() => {
    saveStoredAdventureProgress(progress);
  }, [progress]);

  // Derived Single Source of Truth for Completed Levels
  const completedForest = useMemo(() => {
    return progress.completedLevels['forest'] || [];
  }, [progress.completedLevels]);

  const isForestComplete = useMemo(() => {
    return completedForest.includes(5) || completedForest.length >= 5;
  }, [completedForest]);

  // Dynamic World Unlock Evaluator
  const isWorldUnlocked = (worldId: WorldId): boolean => {
    if (worldId === 'forest') return true;
    if (worldId === 'ocean') return isForestComplete || progress.unlockedWorlds.includes('ocean');
    if (worldId === 'space') return progress.unlockedWorlds.includes('space');
    if (worldId === 'dino') return progress.unlockedWorlds.includes('dino');
    return false;
  };

  const handleSelectLevel = (level: AdventureLevelDef) => {
    const isCompleted = completedForest.includes(level.id);
    const isAvailable = level.id === 1 || completedForest.includes(level.id - 1) || isCompleted;

    if (!isAvailable) {
      sound.playPop();
      sound.speak("This level is locked! Complete earlier levels first!");
      return;
    }

    sound.playPop();
    sound.speak(`Level ${level.id}! ${level.title}!`);
    setActiveLevel(level);
    setBossStep(0);
    setLevelSuccess(false);
  };

  const handleCompleteLevel = (levelId: number) => {
    sound.playFanfare();
    setLevelSuccess(true);
    onAddStars(10);
    try { confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } }); } catch {}

    const newCompleted = Array.from(new Set([...completedForest, levelId]));
    const isNowForestFinished = newCompleted.includes(5) || newCompleted.length >= 5;

    let updatedWorlds = progress.unlockedWorlds;
    if (isNowForestFinished && !updatedWorlds.includes('ocean')) {
      updatedWorlds = [...updatedWorlds, 'ocean'];
      sound.speak("World Complete! You unlocked Ocean World!");
    } else {
      sound.speak(`Level complete! You earned 10 stars!`);
    }

    const nextProgress: AdventureProgress = {
      ...progress,
      unlockedWorlds: updatedWorlds,
      completedLevels: {
        ...progress.completedLevels,
        forest: newCompleted
      },
      currentLevel: Math.min(levelId + 1, 5)
    };

    setProgress(nextProgress);
    saveStoredAdventureProgress(nextProgress);
  };

  // Level Gameplay Sandbox
  const renderLevelContent = (lvl: AdventureLevelDef) => {
    // Level 1: ABC
    if (lvl.type === 'abc') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-purple-50 border border-purple-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "Find the letter <span className="text-purple-600 underline">B</span> for Butterfly!" 🦋
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-2">
            {[
              { char: 'A', icon: '🍎' },
              { char: 'B', icon: '🦋', isCorrect: true },
              { char: 'C', icon: '🐱' }
            ].map(item => (
              <motion.button
                key={item.char}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (item.isCorrect) {
                    sound.playCorrect();
                    handleCompleteLevel(lvl.id);
                  } else {
                    sound.playPop();
                    sound.speak(`That is ${item.char}. Find B!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 hover:bg-purple-100 border-3 border-purple-200 flex flex-col items-center justify-center cursor-pointer shadow-md"
              >
                <span className="text-4xl sm:text-5xl font-black text-purple-950 font-['Fredoka']">{item.char}</span>
                <span className="text-xl mt-1">{item.icon}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the correct letter card!</span>
        </div>
      );
    }

    // Level 2: Color
    if (lvl.type === 'color') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-emerald-50 border border-emerald-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-emerald-950 font-['Fredoka']">
              "Find the <span className="text-emerald-600 underline">GREEN</span> forest leaf!" 🍃
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-2">
            {[
              { color: 'Red', hex: '#FF4757', emoji: '🔴' },
              { color: 'Green', hex: '#2ED573', emoji: '🟢', isCorrect: true },
              { color: 'Blue', hex: '#1E90FF', emoji: '🔵' }
            ].map(item => (
              <motion.button
                key={item.color}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (item.isCorrect) {
                    sound.playCorrect();
                    handleCompleteLevel(lvl.id);
                  } else {
                    sound.playPop();
                    sound.speak(`That is ${item.color}. Find Green!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center cursor-pointer shadow-lg text-white font-black text-xs font-['Fredoka']"
                style={{ backgroundColor: item.hex }}
              >
                <span className="text-3xl drop-shadow">{item.emoji}</span>
                <span className="mt-1 text-sm">{item.color}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the green swatch!</span>
        </div>
      );
    }

    // Level 3: Math
    if (lvl.type === 'math') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-amber-50 border border-amber-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "How many apples are on the tree?" 🍎
            </span>
          </div>

          <div className="flex items-center gap-3 my-2">
            {['🍎', '🍎', '🍎'].map((a, i) => (
              <span key={i} className="text-5xl drop-shadow-md animate-bounce-gentle">
                {a}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {[2, 3, 4].map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (num === 3) {
                    sound.playCorrect();
                    handleCompleteLevel(lvl.id);
                  } else {
                    sound.playPop();
                    sound.speak(`Not ${num}. Count the apples!`);
                  }
                }}
                className="w-20 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-2xl shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
              >
                {num}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the right number button!</span>
        </div>
      );
    }

    // Level 4: Memory
    if (lvl.type === 'memory') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-purple-50 border border-purple-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "Match the two Bunny Friends!" 🐰
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 my-2">
            {[
              { id: 1, val: '🐰', isMatch: true },
              { id: 2, val: '🦊', isMatch: false },
              { id: 3, val: '🐰', isMatch: true },
              { id: 4, val: '🦊', isMatch: false }
            ].map(card => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (card.isMatch) {
                    sound.playCorrect();
                    handleCompleteLevel(lvl.id);
                  } else {
                    sound.playPop();
                    sound.speak("Find the bunny!");
                  }
                }}
                className="w-18 h-20 sm:w-22 sm:h-22 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-4xl shadow-md border-2 border-white cursor-pointer"
              >
                {card.val}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap a cute Bunny to complete the match!</span>
        </div>
      );
    }

    // Level 5: Boss Forest Challenge
    if (lvl.type === 'boss') {
      const bossQuestions = [
        {
          q: 'Find the letter D for Dino!',
          options: ['B', 'D', 'E'],
          correct: 'D',
          voice: 'Find letter D!'
        },
        {
          q: 'Find the YELLOW Sun color!',
          options: ['🔵', '🟡', '🔴'],
          correct: '🟡',
          voice: 'Find Yellow!'
        },
        {
          q: 'Count 4 little Stars! ⭐⭐⭐⭐',
          options: ['3', '4', '5'],
          correct: '4',
          voice: 'How many stars?'
        },
        {
          q: 'Match the friendly Lion! 🦁',
          options: ['🐱', '🦁', '🐼'],
          correct: '🦁',
          voice: 'Find the Lion!'
        },
        {
          q: 'Grand Final: Which color is the Forest Tree? 🌳',
          options: ['GREEN', 'RED', 'BLUE'],
          correct: 'GREEN',
          voice: 'Which color is the green tree?'
        }
      ];

      const currentQ = bossQuestions[bossStep];

      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Quest {bossStep + 1} of 5
            </span>
            <span className="text-xs font-black text-purple-900">🏆 Forest Boss Trial</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-lg shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{currentQ.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {currentQ.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt === currentQ.correct) {
                    sound.playCorrect();
                    if (bossStep < 4) {
                      sound.speak("Correct! Next question!");
                      setBossStep(s => s + 1);
                    } else {
                      handleCompleteLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-24 sm:w-28 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-black text-lg sm:text-xl border-3 border-purple-200 shadow-md cursor-pointer flex items-center justify-center"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Answer all 5 questions to unlock Ocean World!</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              if (activeLevel) {
                setActiveLevel(null);
              } else {
                onBack();
              }
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">{activeLevel ? 'World Map' : 'Home'}</span>
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka'] flex items-center gap-1">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Adventure World Map</span>
            </h1>
          </div>
        </div>

        {/* World Selection Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {WORLDS_INFO.map(w => {
            const isUnlocked = isWorldUnlocked(w.id);
            const isSelected = selectedWorld === w.id;
            return (
              <button
                key={w.id}
                onClick={() => {
                  sound.playPop();
                  if (!isUnlocked) {
                    sound.speak(`${w.name} is locked! Complete Forest Challenge first!`);
                    return;
                  }
                  setSelectedWorld(w.id);
                  setActiveLevel(null);
                  sound.speak(`${w.name}!`);
                }}
                className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md'
                    : isUnlocked
                    ? 'text-slate-800 hover:bg-purple-50'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <span>{w.themeEmoji}</span>
                <span>{w.name.split(' ')[0]}</span>
                {!isUnlocked && <Lock className="w-2.5 h-2.5 ml-0.5 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Viewport */}
      <div className="flex-1 bg-white rounded-[26px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* VIEW 1: ACTIVE LEVEL MODAL */}
        {activeLevel ? (
          <div className="w-full h-full flex flex-col justify-between relative">
            <div className="flex items-center justify-between pb-1 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeLevel.icon}</span>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
                    Level {activeLevel.id}: {activeLevel.title}
                  </h2>
                  <p className="text-[10px] font-semibold text-slate-500">{activeLevel.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveLevel(null);
                }}
                className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-100 cursor-pointer"
              >
                Exit Level
              </button>
            </div>

            <div className="flex-1 min-h-0 py-2">
              {renderLevelContent(activeLevel)}
            </div>

            {/* Level Complete Dialog */}
            <AnimatePresence>
              {levelSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 border-b-[8px] border-b-amber-500 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-2 shadow-inner">
                      🎉
                    </div>
                    <h2 className="text-xl font-black text-purple-950 font-['Fredoka']">
                      {activeLevel.id === 5 ? 'WORLD COMPLETE!' : 'Level Complete!'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {activeLevel.id === 5
                        ? 'You conquered Coloroo Forest and unlocked Ocean World!'
                        : 'Great job! Next forest level unlocked!'}
                    </p>

                    <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-5 py-2 rounded-2xl border border-amber-200">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-base font-black text-amber-600">+10 Stars Earned!</span>
                    </div>

                    <button
                      onClick={() => {
                        setLevelSuccess(false);
                        setActiveLevel(null);
                      }}
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
                    >
                      Continue Quest 🗺️
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : selectedWorld === 'forest' ? (
          /* VIEW 2: COLOROO FOREST HORIZONTAL PATH MAP */
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-base font-black text-purple-950 font-['Fredoka']">
                  🌳 Coloroo Forest Path
                </h2>
                <p className="text-[10px] font-bold text-emerald-700">
                  {isForestComplete 
                    ? '🎉 Forest Completed! Ocean World is now UNLOCKED!' 
                    : 'Tap your current level to begin the adventure!'}
                </p>
              </div>
              <span className="text-xs font-black text-purple-900 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                Completed: {completedForest.length} / 5
              </span>
            </div>

            {/* Connected Level Nodes Path */}
            <div className="flex-1 flex items-center justify-between px-3 sm:px-6 relative my-1">
              <div className="absolute left-10 right-10 h-3 bg-emerald-100 rounded-full -z-0" />
              <div
                className="absolute left-10 h-3 bg-emerald-400 rounded-full -z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, completedForest.length - 1) / 4) * 82}%` }}
              />

              {FOREST_LEVELS.map((lvl) => {
                const isCompleted = completedForest.includes(lvl.id);
                const isAvailable = lvl.id === 1 || completedForest.includes(lvl.id - 1) || isCompleted;

                return (
                  <motion.div
                    key={lvl.id}
                    whileHover={isAvailable ? { scale: 1.08 } : {}}
                    whileTap={isAvailable ? { scale: 0.94 } : {}}
                    onClick={() => handleSelectLevel(lvl)}
                    className="flex flex-col items-center cursor-pointer z-10"
                  >
                    <div
                      className={`w-14 h-14 sm:w-18 sm:h-18 rounded-3xl flex flex-col items-center justify-center shadow-lg border-4 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-white text-white shadow-emerald-200'
                          : isAvailable
                          ? 'bg-amber-400 border-white text-slate-900 animate-bounce-gentle shadow-amber-200 ring-4 ring-amber-300'
                          : 'bg-slate-200 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                      ) : isAvailable ? (
                        <span className="text-2xl sm:text-3xl">{lvl.icon}</span>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <span className={`text-[10px] sm:text-xs font-black mt-1 font-['Fredoka'] ${isAvailable ? 'text-purple-950' : 'text-slate-400'}`}>
                      Level {lvl.id}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 max-w-[80px] text-center line-clamp-1 leading-tight">
                      {lvl.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">
                {isForestComplete 
                  ? '⭐ Ocean World unlocked! Tap the Ocean tab above to visit!' 
                  : 'Finish all 5 Forest levels to unlock Ocean World!'}
              </span>
            </div>
          </div>
        ) : isWorldUnlocked(selectedWorld) ? (
          /* VIEW 3: UNLOCKED WORLD VIEWPORT (e.g. Ocean World) */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            {(() => {
              const currentWorldInfo = WORLDS_INFO.find(w => w.id === selectedWorld)!;
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 border-4 border-white shadow-xl flex items-center justify-center text-6xl mb-3 animate-bounce-gentle">
                    {currentWorldInfo.themeEmoji}
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs font-black text-emerald-700 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>WORLD UNLOCKED</span>
                  </div>
                  <h2 className="text-2xl font-black text-purple-950 font-['Fredoka']">
                    {currentWorldInfo.name}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">
                    {currentWorldInfo.tagline}
                  </p>

                  <div className="bg-blue-50 border border-blue-200 px-5 py-2.5 rounded-2xl my-3 text-xs font-black text-blue-900 shadow-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Ocean World quests are ready for exploration!</span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playPop();
                      sound.speak("Ocean quests coming up in next adventure chapter!");
                    }}
                    className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer border-2 border-white active:scale-95 transition-all"
                  >
                    Start Ocean Adventure 🌊
                  </button>
                </motion.div>
              );
            })()}
          </div>
        ) : (
          /* VIEW 4: LOCKED WORLD PREVIEWS (Space, Dino) */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            {(() => {
              const currentWorldInfo = WORLDS_INFO.find(w => w.id === selectedWorld)!;
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-5xl mb-2 relative">
                    {currentWorldInfo.themeEmoji}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-purple-950 font-['Fredoka']">
                    {currentWorldInfo.name}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">
                    {currentWorldInfo.tagline}
                  </p>

                  <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-2xl my-3 text-xs font-bold text-purple-900">
                    🔒 Complete <strong>Coloroo Forest (Level 5)</strong> to unlock this World!
                  </div>

                  <button
                    onClick={() => {
                      sound.playPop();
                      setSelectedWorld('forest');
                    }}
                    className="px-6 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md cursor-pointer border-2 border-white"
                  >
                    Go to Coloroo Forest 🌳
                  </button>
                </motion.div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
