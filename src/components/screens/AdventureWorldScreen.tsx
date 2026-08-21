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
  Home
} from 'lucide-react';
import { WorldId, AdventureProgress } from '../../types';
import { WORLDS_INFO, FOREST_LEVELS, AdventureLevelDef } from '../../data/adventureData';
import {
  OCEAN_LEVELS,
  OCEAN_COLOR_QUESTIONS,
  OCEAN_COUNT_QUESTIONS,
  OCEAN_WORD_QUESTIONS,
  CORAL_QUEST_STEPS,
  OCEAN_BOSS_QUESTIONS,
  OceanLevelDef
} from '../../data/oceanAdventureData';
import {
  SPACE_LEVELS,
  SPACE_COLOR_QUESTIONS,
  SPACE_COUNT_QUESTIONS,
  SPACE_WORD_QUESTIONS,
  GALAXY_QUEST_STEPS,
  SPACE_BOSS_QUESTIONS,
  SpaceLevelDef
} from '../../data/spaceAdventureData';
import {
  DINO_LEVELS,
  DINO_COLOR_QUESTIONS,
  DINO_COUNT_QUESTIONS,
  DINO_WORD_QUESTIONS,
  JURASSIC_QUEST_STEPS,
  DINO_BOSS_QUESTIONS,
  DINO_LEVELS as DinoLevelsArray,
  DinoLevelDef
} from '../../data/dinoWorldData';
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
  const [activeLevel, setActiveLevel] = useState<AdventureLevelDef | OceanLevelDef | SpaceLevelDef | DinoLevelDef | null>(null);

  // Level Play State
  const [levelSuccess, setLevelSuccess] = useState(false);
  const [genericQuestionIndex, setGenericQuestionIndex] = useState(0);
  const [questStep, setQuestStep] = useState(0);
  const [bossStep, setBossStep] = useState(0);
  const [isGrandFinaleModal, setIsGrandFinaleModal] = useState(false);

  // Memory Game Sub-State
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  useEffect(() => {
    saveStoredAdventureProgress(progress);
  }, [progress]);

  const completedForest = useMemo(() => {
    return progress.completedLevels['forest'] || [];
  }, [progress.completedLevels]);

  const completedOcean = useMemo(() => {
    return progress.completedLevels['ocean'] || [];
  }, [progress.completedLevels]);

  const completedSpace = useMemo(() => {
    return progress.completedLevels['space'] || [];
  }, [progress.completedLevels]);

  const completedDino = useMemo(() => {
    return progress.completedLevels['dino'] || [];
  }, [progress.completedLevels]);

  const isForestComplete = useMemo(() => {
    return completedForest.includes(5) || completedForest.length >= 5;
  }, [completedForest]);

  const isOceanComplete = useMemo(() => {
    return completedOcean.includes(6) || completedOcean.length >= 6;
  }, [completedOcean]);

  const isSpaceComplete = useMemo(() => {
    return completedSpace.includes(6) || completedSpace.length >= 6;
  }, [completedSpace]);

  const isDinoComplete = useMemo(() => {
    return completedDino.includes(6) || completedDino.length >= 6;
  }, [completedDino]);

  const isWorldUnlocked = (worldId: WorldId): boolean => {
    if (worldId === 'forest') return true;
    if (worldId === 'ocean') return isForestComplete || progress.unlockedWorlds.includes('ocean');
    if (worldId === 'space') return isOceanComplete || progress.unlockedWorlds.includes('space');
    if (worldId === 'dino') return isSpaceComplete || progress.unlockedWorlds.includes('dino');
    return false;
  };

  // Level Selection Handlers
  const handleSelectForestLevel = (level: AdventureLevelDef) => {
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
    setLevelSuccess(false);
  };

  const handleSelectOceanLevel = (level: OceanLevelDef) => {
    const isCompleted = completedOcean.includes(level.id);
    const isAvailable = level.id === 1 || completedOcean.includes(level.id - 1) || isCompleted;

    if (!isAvailable) {
      sound.playPop();
      sound.speak("This ocean quest is locked! Complete earlier levels first!");
      return;
    }

    sound.playPop();
    sound.speak(`Ocean Quest ${level.id}! ${level.title}!`);
    setActiveLevel(level);
    setGenericQuestionIndex(0);
    setQuestStep(0);
    setBossStep(0);
    setLevelSuccess(false);

    if (level.type === 'ocean-match') {
      const items = [
        { id: 1, pairId: 1, name: 'Octopus', emoji: '🐙' },
        { id: 2, pairId: 1, name: 'Octopus', emoji: '🐙' },
        { id: 3, pairId: 2, name: 'Dolphin', emoji: '🐬' },
        { id: 4, pairId: 2, name: 'Dolphin', emoji: '🐬' }
      ].sort(() => Math.random() - 0.5).map(c => ({ ...c, isFlipped: false, isMatched: false }));
      setMemoryCards(items);
      setFlippedIds([]);
      setMatchedPairs(0);
    }
  };

  const handleSelectSpaceLevel = (level: SpaceLevelDef) => {
    const isCompleted = completedSpace.includes(level.id);
    const isAvailable = level.id === 1 || completedSpace.includes(level.id - 1) || isCompleted;

    if (!isAvailable) {
      sound.playPop();
      sound.speak("This space quest is locked! Complete earlier levels first!");
      return;
    }

    sound.playPop();
    sound.speak(`Space Quest ${level.id}! ${level.title}!`);
    setActiveLevel(level);
    setGenericQuestionIndex(0);
    setQuestStep(0);
    setBossStep(0);
    setLevelSuccess(false);

    if (level.type === 'space-match') {
      const items = [
        { id: 1, pairId: 1, name: 'Star', emoji: '🌟' },
        { id: 2, pairId: 1, name: 'Star', emoji: '🌟' },
        { id: 3, pairId: 2, name: 'Moon', emoji: '🌙' },
        { id: 4, pairId: 2, name: 'Moon', emoji: '🌙' }
      ].sort(() => Math.random() - 0.5).map(c => ({ ...c, isFlipped: false, isMatched: false }));
      setMemoryCards(items);
      setFlippedIds([]);
      setMatchedPairs(0);
    }
  };

  const handleSelectDinoLevel = (level: DinoLevelDef) => {
    const isCompleted = completedDino.includes(level.id);
    const isAvailable = level.id === 1 || completedDino.includes(level.id - 1) || isCompleted;

    if (!isAvailable) {
      sound.playPop();
      sound.speak("This dino quest is locked! Complete earlier levels first!");
      return;
    }

    sound.playPop();
    sound.speak(`Dino Quest ${level.id}! ${level.title}!`);
    setActiveLevel(level);
    setGenericQuestionIndex(0);
    setQuestStep(0);
    setBossStep(0);
    setLevelSuccess(false);

    if (level.type === 'dino-match') {
      const items = [
        { id: 1, pairId: 1, name: 'T-Rex', emoji: '🦖' },
        { id: 2, pairId: 1, name: 'T-Rex', emoji: '🦖' },
        { id: 3, pairId: 2, name: 'Bronto', emoji: '🦕' },
        { id: 4, pairId: 2, name: 'Bronto', emoji: '🦕' }
      ].sort(() => Math.random() - 0.5).map(c => ({ ...c, isFlipped: false, isMatched: false }));
      setMemoryCards(items);
      setFlippedIds([]);
      setMatchedPairs(0);
    }
  };

  const handleCompleteForestLevel = (levelId: number) => {
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
      sound.speak("Level complete! You earned 10 stars!");
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

  const handleCompleteOceanLevel = (levelId: number) => {
    sound.playFanfare();
    setLevelSuccess(true);
    onAddStars(15);
    try { confetti({ particleCount: 80, spread: 85, origin: { y: 0.6 } }); } catch {}

    const newCompleted = Array.from(new Set([...completedOcean, levelId]));
    const isNowOceanFinished = newCompleted.includes(6) || newCompleted.length >= 6;

    let updatedWorlds = progress.unlockedWorlds;
    if (isNowOceanFinished && !updatedWorlds.includes('space')) {
      updatedWorlds = [...updatedWorlds, 'space'];
      sound.speak("Spectacular! Ocean World completed! Space World is now UNLOCKED!");
    } else {
      sound.speak("Great job! Ocean quest complete! +15 Stars!");
    }

    const nextProgress: AdventureProgress = {
      ...progress,
      unlockedWorlds: updatedWorlds,
      completedLevels: {
        ...progress.completedLevels,
        ocean: newCompleted
      }
    };

    setProgress(nextProgress);
    saveStoredAdventureProgress(nextProgress);
  };

  const handleCompleteSpaceLevel = (levelId: number) => {
    sound.playFanfare();
    setLevelSuccess(true);
    onAddStars(20);
    try { confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } }); } catch {}

    const newCompleted = Array.from(new Set([...completedSpace, levelId]));
    const isNowSpaceFinished = newCompleted.includes(6) || newCompleted.length >= 6;

    let updatedWorlds = progress.unlockedWorlds;
    if (isNowSpaceFinished && !updatedWorlds.includes('dino')) {
      updatedWorlds = [...updatedWorlds, 'dino'];
      sound.speak("Cosmic Champion! Space World completed! Dino World is now UNLOCKED!");
    } else {
      sound.speak("Cosmic Victory! Space quest complete! +20 Stars!");
    }

    const nextProgress: AdventureProgress = {
      ...progress,
      unlockedWorlds: updatedWorlds,
      completedLevels: {
        ...progress.completedLevels,
        space: newCompleted
      }
    };

    setProgress(nextProgress);
    saveStoredAdventureProgress(nextProgress);
  };

  const handleCompleteDinoLevel = (levelId: number) => {
    sound.playFanfare();
    onAddStars(25);
    try { confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } }); } catch {}

    const newCompleted = Array.from(new Set([...completedDino, levelId]));
    const isNowDinoFinished = newCompleted.includes(6) || newCompleted.length >= 6;

    const nextProgress: AdventureProgress = {
      ...progress,
      completedLevels: {
        ...progress.completedLevels,
        dino: newCompleted
      }
    };

    setProgress(nextProgress);
    saveStoredAdventureProgress(nextProgress);

    if (isNowDinoFinished && levelId === 6) {
      setIsGrandFinaleModal(true);
      sound.speak("AMAZING! You completed all Dino World adventures! You are a Super Dino Explorer!");
    } else {
      setLevelSuccess(true);
      sound.speak("Roaaar! Dino quest complete! +25 Stars!");
    }
  };

  // Memory Match Card Tap
  const handleMemoryTap = (cardId: number, world: 'ocean' | 'space' | 'dino') => {
    if (flippedIds.length === 2) return;
    const clicked = memoryCards.find(c => c.id === cardId);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    sound.playCardFlip();
    const updated = memoryCards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setMemoryCards(updated);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const c1 = updated.find(c => c.id === newFlipped[0])!;
      const c2 = updated.find(c => c.id === newFlipped[1])!;

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          sound.playCorrect();
          sound.speak(`${c1.name}!`);
          setMemoryCards(prev => prev.map(c => c.id === c1.id || c.id === c2.id ? { ...c, isMatched: true } : c));
          setFlippedIds([]);
          const nextMatches = matchedPairs + 1;
          setMatchedPairs(nextMatches);
          if (nextMatches >= 2) {
            if (world === 'ocean') handleCompleteOceanLevel(3);
            else if (world === 'space') handleCompleteSpaceLevel(3);
            else handleCompleteDinoLevel(3);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => c.id === c1.id || c.id === c2.id ? { ...c, isFlipped: false } : c));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  // Render Dino Level Sandbox
  const renderDinoLevelContent = (lvl: DinoLevelDef) => {
    // Level 1: Dino Colors
    if (lvl.type === 'dino-colors') {
      const q = DINO_COLOR_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Question {genericQuestionIndex + 1} of {DINO_COLOR_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🦕 Dino Colors</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`Awesome! ${opt.name}!`);
                    if (genericQuestionIndex < DINO_COLOR_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteDinoLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`That is ${opt.name}. Find ${q.targetColorName}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg text-white font-black text-xs font-['Fredoka']"
                style={{ backgroundColor: opt.hex }}
              >
                <span className="text-3xl drop-shadow">{opt.emoji}</span>
                <span className="mt-1 text-[11px] leading-tight text-center drop-shadow">{opt.name}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the dinosaur with the target color!</span>
        </div>
      );
    }

    // Level 2: Dino Counting
    if (lvl.type === 'dino-count') {
      const q = DINO_COUNT_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Question {genericQuestionIndex + 1} of {DINO_COUNT_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🥚 Dino Counting</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 px-6 py-1.5 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex items-center gap-2.5 my-2 flex-wrap justify-center max-w-sm">
            {Array.from({ length: q.count }).map((_, i) => (
              <span key={i} className="text-4xl drop-shadow-md animate-bounce-gentle">
                {q.emoji}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {q.options.map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (num === q.count) {
                    sound.playCorrect();
                    sound.speak(`${num}! That is correct!`);
                    if (genericQuestionIndex < DINO_COUNT_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteDinoLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Not ${num}. Count again!`);
                  }
                }}
                className="w-20 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-2xl shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
              >
                {num}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the matching number button!</span>
        </div>
      );
    }

    // Level 3: Dino Match
    if (lvl.type === 'dino-match') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-amber-50 border border-amber-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "Match the Prehistoric Pairs!" 🦖 🦕
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 my-2">
            {memoryCards.map(card => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleMemoryTap(card.id, 'dino')}
                className={`w-20 h-22 sm:w-24 sm:h-26 rounded-3xl border-3 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : card.isFlipped
                    ? 'bg-amber-100 border-amber-400'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 border-white text-white'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <>
                    <span className="text-4xl drop-shadow">{card.emoji}</span>
                    <span className="text-[10px] font-black text-amber-950 font-['Fredoka'] mt-1">{card.name}</span>
                  </>
                ) : (
                  <span className="text-3xl text-amber-200">🦖</span>
                )}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Find matching dinosaur friends to complete the quest!</span>
        </div>
      );
    }

    // Level 4: Dino Words
    if (lvl.type === 'dino-words') {
      const q = DINO_WORD_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Word {genericQuestionIndex + 1} of {DINO_WORD_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">📖 Dino Words</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`${q.letter}... ${opt.word}!`);
                    if (genericQuestionIndex < DINO_WORD_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteDinoLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Try again! Find the word starting with ${q.letter}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white hover:bg-amber-50 border-3 border-amber-200 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md"
              >
                <span className="text-4xl drop-shadow">{opt.emoji}</span>
                <span className="text-xs sm:text-sm font-black text-amber-950 font-['Fredoka'] mt-1">{opt.word}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the prehistoric friend starting with {q.letter}!</span>
        </div>
      );
    }

    // Level 5: Jurassic Quest
    if (lvl.type === 'jurassic-quest') {
      const step = JURASSIC_QUEST_STEPS[questStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-orange-700 bg-orange-50 px-3 py-0.5 rounded-full border border-orange-200">
              Jurassic Task {questStep + 1} of 5
            </span>
            <span className="text-xs font-black text-purple-950">🌋 Jurassic Quest</span>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-orange-950 font-['Fredoka']">
              "{step.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {step.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    if (questStep < JURASSIC_QUEST_STEPS.length - 1) {
                      setQuestStep(s => s + 1);
                    } else {
                      handleCompleteDinoLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-28 sm:w-32 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-orange-950 font-black text-xs sm:text-sm border-3 border-orange-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt.label}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Complete all 5 tasks to reach the Final Dino Challenge!</span>
        </div>
      );
    }

    // Level 6: Dino Boss Challenge
    if (lvl.type === 'dino-boss') {
      const q = DINO_BOSS_QUESTIONS[bossStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Final Trial {bossStep + 1} of 6
            </span>
            <span className="text-xs font-black text-purple-950">🏆 Final Dino Challenge</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-lg shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{q.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt === q.correct) {
                    sound.playCorrect();
                    if (bossStep < DINO_BOSS_QUESTIONS.length - 1) {
                      sound.speak("Awesome! Next trial!");
                      setBossStep(s => s + 1);
                    } else {
                      handleCompleteDinoLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-24 sm:w-28 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-purple-950 font-black text-base sm:text-lg border-3 border-amber-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Solve all 6 trials to complete Dino World! 🦖</span>
        </div>
      );
    }

    return null;
  };

  // Render Forest Game Sandbox
  const renderForestLevelContent = (lvl: AdventureLevelDef) => {
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
                    handleCompleteForestLevel(lvl.id);
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
                    handleCompleteForestLevel(lvl.id);
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
              <span key={i} className="text-5xl drop-shadow-md animate-bounce-gentle">{a}</span>
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
                    handleCompleteForestLevel(lvl.id);
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
                    handleCompleteForestLevel(lvl.id);
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

    if (lvl.type === 'boss') {
      const bossQuestions = [
        { q: 'Find the letter D for Dino!', options: ['B', 'D', 'E'], correct: 'D' },
        { q: 'Find the YELLOW Sun color!', options: ['🔵', '🟡', '🔴'], correct: '🟡' },
        { q: 'Count 4 little Stars! ⭐⭐⭐⭐', options: ['3', '4', '5'], correct: '4' },
        { q: 'Match the friendly Lion! 🦁', options: ['🐱', '🦁', '🐼'], correct: '🦁' },
        { q: 'Grand Final: Which color is the Forest Tree? 🌳', options: ['GREEN', 'RED', 'BLUE'], correct: 'GREEN' }
      ];

      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-lg shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{bossQuestions[0].q}"
            </h3>
          </div>
          <div className="flex gap-3 my-2">
            {bossQuestions[0].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (opt === bossQuestions[0].correct) {
                    sound.playCorrect();
                    handleCompleteForestLevel(lvl.id);
                  } else {
                    sound.playPop();
                  }
                }}
                className="w-24 py-3 rounded-2xl bg-white text-purple-950 font-black text-lg border-2 border-purple-200 shadow"
              >
                {opt}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">Tap the correct option!</span>
        </div>
      );
    }

    return null;
  };

  // Render Ocean Level Sandbox
  const renderOceanLevelContent = (lvl: OceanLevelDef) => {
    if (lvl.type === 'ocean-colors') {
      const q = OCEAN_COLOR_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200">
              Question {genericQuestionIndex + 1} of {OCEAN_COLOR_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🐚 Ocean Colors</span>
          </div>

          <div className="bg-cyan-50 border-2 border-cyan-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-cyan-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`Awesome! ${opt.name}!`);
                    if (genericQuestionIndex < OCEAN_COLOR_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteOceanLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`That is ${opt.name}. Find ${q.targetColorName}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg text-white font-black text-xs font-['Fredoka']"
                style={{ backgroundColor: opt.hex }}
              >
                <span className="text-3xl drop-shadow">{opt.emoji}</span>
                <span className="mt-1 text-[11px] leading-tight text-center drop-shadow">{opt.name}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the sea creature with the target color!</span>
        </div>
      );
    }

    if (lvl.type === 'ocean-count') {
      const q = OCEAN_COUNT_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200">
              Question {genericQuestionIndex + 1} of {OCEAN_COUNT_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🐠 Sea Animal Count</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 px-6 py-1.5 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex items-center gap-2.5 my-2 flex-wrap justify-center max-w-sm">
            {Array.from({ length: q.count }).map((_, i) => (
              <span key={i} className="text-4xl drop-shadow-md animate-bounce-gentle">
                {q.emoji}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {q.options.map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (num === q.count) {
                    sound.playCorrect();
                    sound.speak(`${num}! That is correct!`);
                    if (genericQuestionIndex < OCEAN_COUNT_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteOceanLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Not ${num}. Count again!`);
                  }
                }}
                className="w-20 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-2xl shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
              >
                {num}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the matching number button!</span>
        </div>
      );
    }

    if (lvl.type === 'ocean-match') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-cyan-50 border border-cyan-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-cyan-950 font-['Fredoka']">
              "Match the Ocean Animal Pairs!" 🐙 🐬
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 my-2">
            {memoryCards.map(card => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleMemoryTap(card.id, 'ocean')}
                className={`w-20 h-22 sm:w-24 sm:h-26 rounded-3xl border-3 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : card.isFlipped
                    ? 'bg-cyan-100 border-cyan-400'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-white text-white'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <>
                    <span className="text-4xl drop-shadow">{card.emoji}</span>
                    <span className="text-[10px] font-black text-cyan-950 font-['Fredoka'] mt-1">{card.name}</span>
                  </>
                ) : (
                  <span className="text-3xl text-cyan-200">🌊</span>
                )}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Find matching ocean friends to complete the quest!</span>
        </div>
      );
    }

    if (lvl.type === 'ocean-words') {
      const q = OCEAN_WORD_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200">
              Word {genericQuestionIndex + 1} of {OCEAN_WORD_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🐳 Ocean Words</span>
          </div>

          <div className="bg-cyan-50 border-2 border-cyan-300 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-cyan-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`${q.letter}... ${opt.word}!`);
                    if (genericQuestionIndex < OCEAN_WORD_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteOceanLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Try again! Find the word starting with ${q.letter}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white hover:bg-cyan-50 border-3 border-cyan-200 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md"
              >
                <span className="text-4xl drop-shadow">{opt.emoji}</span>
                <span className="text-xs sm:text-sm font-black text-cyan-950 font-['Fredoka'] mt-1">{opt.word}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the sea creature starting with {q.letter}!</span>
        </div>
      );
    }

    if (lvl.type === 'coral-quest') {
      const step = CORAL_QUEST_STEPS[questStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
              Reef Task {questStep + 1} of 5
            </span>
            <span className="text-xs font-black text-purple-950">🪸 Coral Reef Quest</span>
          </div>

          <div className="bg-rose-50 border-2 border-rose-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-rose-950 font-['Fredoka']">
              "{step.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {step.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    if (questStep < CORAL_QUEST_STEPS.length - 1) {
                      setQuestStep(s => s + 1);
                    } else {
                      handleCompleteOceanLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-28 sm:w-32 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 font-black text-xs sm:text-sm border-3 border-rose-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt.label}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Complete all 5 coral tasks to reach the Ocean Boss!</span>
        </div>
      );
    }

    if (lvl.type === 'ocean-boss') {
      const q = OCEAN_BOSS_QUESTIONS[bossStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Trial {bossStep + 1} of 6
            </span>
            <span className="text-xs font-black text-purple-950">🏆 Ocean Boss Challenge</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-lg shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{q.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt === q.correct) {
                    sound.playCorrect();
                    if (bossStep < OCEAN_BOSS_QUESTIONS.length - 1) {
                      sound.speak("Awesome! Next trial!");
                      setBossStep(s => s + 1);
                    } else {
                      handleCompleteOceanLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-24 sm:w-28 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-purple-950 font-black text-base sm:text-lg border-3 border-amber-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Solve all 6 trials to unlock Space World! 🚀</span>
        </div>
      );
    }

    return null;
  };

  // Render Space Level Sandbox
  const renderSpaceLevelContent = (lvl: SpaceLevelDef) => {
    if (lvl.type === 'space-colors') {
      const q = SPACE_COLOR_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
              Question {genericQuestionIndex + 1} of {SPACE_COLOR_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🚀 Rocket Colors</span>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-indigo-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`Awesome! ${opt.name}!`);
                    if (genericQuestionIndex < SPACE_COLOR_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteSpaceLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`That is ${opt.name}. Find ${q.targetColorName}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg text-white font-black text-xs font-['Fredoka']"
                style={{ backgroundColor: opt.hex }}
              >
                <span className="text-3xl drop-shadow">{opt.emoji}</span>
                <span className="mt-1 text-[11px] leading-tight text-center drop-shadow">{opt.name}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the space object with the target color!</span>
        </div>
      );
    }

    if (lvl.type === 'space-count') {
      const q = SPACE_COUNT_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
              Question {genericQuestionIndex + 1} of {SPACE_COUNT_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">🪐 Planet Count</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 px-6 py-1.5 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex items-center gap-2.5 my-2 flex-wrap justify-center max-w-sm">
            {Array.from({ length: q.count }).map((_, i) => (
              <span key={i} className="text-4xl drop-shadow-md animate-bounce-gentle">
                {q.emoji}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {q.options.map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (num === q.count) {
                    sound.playCorrect();
                    sound.speak(`${num}! That is correct!`);
                    if (genericQuestionIndex < SPACE_COUNT_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteSpaceLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Not ${num}. Count again!`);
                  }
                }}
                className="w-20 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-2xl shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
              >
                {num}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the matching number button!</span>
        </div>
      );
    }

    if (lvl.type === 'space-match') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="bg-indigo-50 border border-indigo-200 px-5 py-1.5 rounded-2xl text-center">
            <span className="text-sm sm:text-base font-black text-indigo-950 font-['Fredoka']">
              "Match the Space Pairs!" 🌟 🌙
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 my-2">
            {memoryCards.map(card => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleMemoryTap(card.id, 'space')}
                className={`w-20 h-22 sm:w-24 sm:h-26 rounded-3xl border-3 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : card.isFlipped
                    ? 'bg-indigo-100 border-indigo-400'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white text-white'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <>
                    <span className="text-4xl drop-shadow">{card.emoji}</span>
                    <span className="text-[10px] font-black text-indigo-950 font-['Fredoka'] mt-1">{card.name}</span>
                  </>
                ) : (
                  <span className="text-3xl text-indigo-200">🚀</span>
                )}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Find matching celestial friends to complete the quest!</span>
        </div>
      );
    }

    if (lvl.type === 'space-words') {
      const q = SPACE_WORD_QUESTIONS[genericQuestionIndex];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
              Word {genericQuestionIndex + 1} of {SPACE_WORD_QUESTIONS.length}
            </span>
            <span className="text-xs font-black text-purple-950">👽 Space Words</span>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-300 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-indigo-950 font-['Fredoka']">
              "{q.prompt}"
            </h3>
          </div>

          <div className="flex gap-3.5 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    sound.speak(`${q.letter}... ${opt.word}!`);
                    if (genericQuestionIndex < SPACE_WORD_QUESTIONS.length - 1) {
                      setGenericQuestionIndex(idx => idx + 1);
                    } else {
                      handleCompleteSpaceLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak(`Try again! Find the word starting with ${q.letter}!`);
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white hover:bg-indigo-50 border-3 border-indigo-200 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md"
              >
                <span className="text-4xl drop-shadow">{opt.emoji}</span>
                <span className="text-xs sm:text-sm font-black text-indigo-950 font-['Fredoka'] mt-1">{opt.word}</span>
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Tap the cosmic friend starting with {q.letter}!</span>
        </div>
      );
    }

    if (lvl.type === 'galaxy-quest') {
      const step = GALAXY_QUEST_STEPS[questStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200">
              Galaxy Task {questStep + 1} of 5
            </span>
            <span className="text-xs font-black text-purple-950">🌌 Galaxy Quest</span>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 px-6 py-2 rounded-2xl text-center my-1 max-w-md shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{step.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {step.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt.isCorrect) {
                    sound.playCorrect();
                    if (questStep < GALAXY_QUEST_STEPS.length - 1) {
                      setQuestStep(s => s + 1);
                    } else {
                      handleCompleteSpaceLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-28 sm:w-32 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-black text-xs sm:text-sm border-3 border-purple-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt.label}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Complete all 5 galaxy tasks to reach the Space Boss!</span>
        </div>
      );
    }

    if (lvl.type === 'space-boss') {
      const q = SPACE_BOSS_QUESTIONS[bossStep];
      return (
        <div className="flex flex-col items-center justify-between h-full py-1">
          <div className="flex justify-between w-full px-2">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Trial {bossStep + 1} of 6
            </span>
            <span className="text-xs font-black text-purple-950">🏆 Space Boss Challenge</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2 rounded-2xl text-center my-1 max-w-lg shadow-sm">
            <h3 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              "{q.q}"
            </h3>
          </div>

          <div className="flex gap-3 my-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (opt === q.correct) {
                    sound.playCorrect();
                    if (bossStep < SPACE_BOSS_QUESTIONS.length - 1) {
                      sound.speak("Awesome! Next cosmic trial!");
                      setBossStep(s => s + 1);
                    } else {
                      handleCompleteSpaceLevel(lvl.id);
                    }
                  } else {
                    sound.playPop();
                    sound.speak("Try again!");
                  }
                }}
                className="w-24 sm:w-28 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-purple-950 font-black text-base sm:text-lg border-3 border-amber-200 shadow-md cursor-pointer flex items-center justify-center text-center"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <span className="text-[10px] font-bold text-slate-400">Solve all 6 trials to unlock Dino World! 🦖</span>
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
                    sound.speak(`${w.name} is locked! Complete previous world challenges first!`);
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
              {selectedWorld === 'forest'
                ? renderForestLevelContent(activeLevel as AdventureLevelDef)
                : selectedWorld === 'ocean'
                ? renderOceanLevelContent(activeLevel as OceanLevelDef)
                : selectedWorld === 'space'
                ? renderSpaceLevelContent(activeLevel as SpaceLevelDef)
                : renderDinoLevelContent(activeLevel as DinoLevelDef)}
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
                      {(selectedWorld === 'space' && activeLevel.id === 6) || (selectedWorld === 'ocean' && activeLevel.id === 6) || (selectedWorld === 'forest' && activeLevel.id === 5)
                        ? 'WORLD COMPLETE!'
                        : 'Level Complete!'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {selectedWorld === 'space' && activeLevel.id === 6
                        ? 'You conquered Space World! Dino World is UNLOCKED!'
                        : selectedWorld === 'ocean' && activeLevel.id === 6
                        ? 'You conquered Ocean World! Space World is UNLOCKED!'
                        : selectedWorld === 'forest' && activeLevel.id === 5
                        ? 'You conquered Coloroo Forest and unlocked Ocean World!'
                        : 'Great job! Next quest unlocked!'}
                    </p>

                    <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-5 py-2 rounded-2xl border border-amber-200">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-base font-black text-amber-600">
                        +{selectedWorld === 'dino' ? '25' : selectedWorld === 'space' ? '20' : selectedWorld === 'ocean' ? '15' : '10'} Stars Earned!
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setLevelSuccess(false);
                        setActiveLevel(null);
                        if (selectedWorld === 'space' && activeLevel.id === 6) {
                          setSelectedWorld('dino');
                        } else if (selectedWorld === 'ocean' && activeLevel.id === 6) {
                          setSelectedWorld('space');
                        }
                      }}
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
                    >
                      {selectedWorld === 'space' && activeLevel.id === 6
                        ? 'Explore Dino World 🦖'
                        : selectedWorld === 'ocean' && activeLevel.id === 6
                        ? 'Explore Space 🚀'
                        : 'Continue Quest 🗺️'}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : selectedWorld === 'forest' ? (
          /* VIEW 2: COLOROO FOREST TRAIL MAP */
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
                    onClick={() => handleSelectForestLevel(lvl)}
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
        ) : selectedWorld === 'ocean' ? (
          /* VIEW 3: OCEAN ADVENTURE MAP */
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-base font-black text-cyan-950 font-['Fredoka'] flex items-center gap-1.5">
                  <Waves className="w-5 h-5 text-cyan-600" />
                  <span>🌊 Ocean Adventure Path</span>
                </h2>
                <p className="text-[10px] font-bold text-cyan-700">
                  {isOceanComplete 
                    ? '🎉 Ocean World Completed! Space World is UNLOCKED!' 
                    : 'Explore the deep blue sea and complete all 6 quests!'}
                </p>
              </div>
              <span className="text-xs font-black text-cyan-900 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
                Completed: {completedOcean.length} / 6
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between px-2 sm:px-4 relative my-1">
              <div className="absolute left-8 right-8 h-3 bg-cyan-100 rounded-full -z-0" />
              <div
                className="absolute left-8 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full -z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, completedOcean.length - 1) / 5) * 85}%` }}
              />

              {OCEAN_LEVELS.map((lvl) => {
                const isCompleted = completedOcean.includes(lvl.id);
                const isAvailable = lvl.id === 1 || completedOcean.includes(lvl.id - 1) || isCompleted;

                return (
                  <motion.div
                    key={lvl.id}
                    whileHover={isAvailable ? { scale: 1.08 } : {}}
                    whileTap={isAvailable ? { scale: 0.94 } : {}}
                    onClick={() => handleSelectOceanLevel(lvl)}
                    className="flex flex-col items-center cursor-pointer z-10"
                  >
                    <div
                      className={`w-13 h-13 sm:w-16 sm:h-16 rounded-3xl flex flex-col items-center justify-center shadow-lg border-4 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-white text-white shadow-cyan-200'
                          : isAvailable
                          ? 'bg-amber-400 border-white text-slate-900 animate-bounce-gentle shadow-amber-200 ring-4 ring-amber-300'
                          : 'bg-slate-200 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      ) : isAvailable ? (
                        <span className="text-xl sm:text-2xl">{lvl.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <span className={`text-[9px] sm:text-[10px] font-black mt-1 font-['Fredoka'] ${isAvailable ? 'text-cyan-950' : 'text-slate-400'}`}>
                      {lvl.id === 6 ? 'Final Trial' : `Quest ${lvl.id}`}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 max-w-[70px] text-center line-clamp-1 leading-tight">
                      {lvl.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">
                {isOceanComplete 
                  ? '⭐ Space World is unlocked! Tap the Space tab above to explore!' 
                  : 'Complete all 6 Ocean levels to unlock Space World! 🚀'}
              </span>
            </div>
          </div>
        ) : selectedWorld === 'space' ? (
          /* VIEW 4: SPACE ADVENTURE MAP */
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-base font-black text-indigo-950 font-['Fredoka'] flex items-center gap-1.5">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  <span>🚀 Space Adventure Path</span>
                </h2>
                <p className="text-[10px] font-bold text-indigo-700">
                  {isSpaceComplete 
                    ? '🎉 Space World Completed! Dino World is UNLOCKED!' 
                    : 'Explore the stars and cosmic planets to conquer Space!'}
                </p>
              </div>
              <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                Completed: {completedSpace.length} / 6
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between px-2 sm:px-4 relative my-1">
              <div className="absolute left-8 right-8 h-3 bg-indigo-100 rounded-full -z-0" />
              <div
                className="absolute left-8 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full -z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, completedSpace.length - 1) / 5) * 85}%` }}
              />

              {SPACE_LEVELS.map((lvl) => {
                const isCompleted = completedSpace.includes(lvl.id);
                const isAvailable = lvl.id === 1 || completedSpace.includes(lvl.id - 1) || isCompleted;

                return (
                  <motion.div
                    key={lvl.id}
                    whileHover={isAvailable ? { scale: 1.08 } : {}}
                    whileTap={isAvailable ? { scale: 0.94 } : {}}
                    onClick={() => handleSelectSpaceLevel(lvl)}
                    className="flex flex-col items-center cursor-pointer z-10"
                  >
                    <div
                      className={`w-13 h-13 sm:w-16 sm:h-16 rounded-3xl flex flex-col items-center justify-center shadow-lg border-4 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-700 border-white text-white shadow-indigo-200'
                          : isAvailable
                          ? 'bg-amber-400 border-white text-slate-900 animate-bounce-gentle shadow-amber-200 ring-4 ring-amber-300'
                          : 'bg-slate-200 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      ) : isAvailable ? (
                        <span className="text-xl sm:text-2xl">{lvl.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <span className={`text-[9px] sm:text-[10px] font-black mt-1 font-['Fredoka'] ${isAvailable ? 'text-indigo-950' : 'text-slate-400'}`}>
                      {lvl.id === 6 ? 'Final Trial' : `Quest ${lvl.id}`}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 max-w-[70px] text-center line-clamp-1 leading-tight">
                      {lvl.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">
                {isSpaceComplete 
                  ? '⭐ Dino World is unlocked! Tap the Dino tab above to explore!' 
                  : 'Complete all 6 Space levels to unlock Dino World! 🦖'}
              </span>
            </div>
          </div>
        ) : (
          /* VIEW 5: DINO ADVENTURE MAP */
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-base font-black text-amber-950 font-['Fredoka'] flex items-center gap-1.5">
                  <span className="text-lg">🦖</span>
                  <span>🦖 Dino Adventure Path</span>
                </h2>
                <p className="text-[10px] font-bold text-amber-700">
                  {isDinoComplete 
                    ? '🎉 AMAZING! You are a Super Dino Explorer!' 
                    : 'Travel back in time and learn with friendly dinosaurs!'}
                </p>
              </div>
              <span className="text-xs font-black text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                Completed: {completedDino.length} / 6
              </span>
            </div>

            {/* Dino 6-Node Connected Path */}
            <div className="flex-1 flex items-center justify-between px-2 sm:px-4 relative my-1">
              <div className="absolute left-8 right-8 h-3 bg-amber-100 rounded-full -z-0" />
              <div
                className="absolute left-8 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full -z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, completedDino.length - 1) / 5) * 85}%` }}
              />

              {DINO_LEVELS.map((lvl) => {
                const isCompleted = completedDino.includes(lvl.id);
                const isAvailable = lvl.id === 1 || completedDino.includes(lvl.id - 1) || isCompleted;

                return (
                  <motion.div
                    key={lvl.id}
                    whileHover={isAvailable ? { scale: 1.08 } : {}}
                    whileTap={isAvailable ? { scale: 0.94 } : {}}
                    onClick={() => handleSelectDinoLevel(lvl)}
                    className="flex flex-col items-center cursor-pointer z-10"
                  >
                    <div
                      className={`w-13 h-13 sm:w-16 sm:h-16 rounded-3xl flex flex-col items-center justify-center shadow-lg border-4 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-white text-white shadow-amber-200'
                          : isAvailable
                          ? 'bg-amber-400 border-white text-slate-900 animate-bounce-gentle shadow-amber-200 ring-4 ring-amber-300'
                          : 'bg-slate-200 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      ) : isAvailable ? (
                        <span className="text-xl sm:text-2xl">{lvl.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <span className={`text-[9px] sm:text-[10px] font-black mt-1 font-['Fredoka'] ${isAvailable ? 'text-amber-950' : 'text-slate-400'}`}>
                      {lvl.id === 6 ? 'Final Trial' : `Quest ${lvl.id}`}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 max-w-[70px] text-center line-clamp-1 leading-tight">
                      {lvl.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">
                {isDinoComplete 
                  ? '🏆 Grand Adventure Complete! All 4 Worlds Conquered!' 
                  : 'Complete all 6 Dino quests to earn the Super Dino Explorer Trophy! 🦖'}
              </span>
            </div>
          </div>
        )}

        {/* GRAND FINALE COMPLETION MODAL */}
        <AnimatePresence>
          {isGrandFinaleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-[36px] p-6 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 border-b-[8px] border-b-amber-500 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl mb-2 shadow-inner border-2 border-white animate-bounce-gentle">
                  🏆
                </div>
                <h2 className="text-2xl font-black text-purple-950 font-['Fredoka']">
                  🎉 AMAZING!
                </h2>
                <p className="text-sm font-black text-amber-600 mt-0.5">
                  You completed all Dino World adventures!
                </p>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  🦖 You're a Super Dino Explorer & Master Learner!
                </p>

                <div className="flex items-center gap-2 my-3 bg-amber-50 px-6 py-2 rounded-2xl border border-amber-200">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-black text-amber-600">+25 Stars Earned!</span>
                </div>

                <div className="flex gap-2 w-full mt-2">
                  <button
                    onClick={() => {
                      setIsGrandFinaleModal(false);
                      setActiveLevel(DINO_LEVELS[5]);
                      setBossStep(0);
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Play Again 🔄
                  </button>
                  <button
                    onClick={() => {
                      setIsGrandFinaleModal(false);
                      setSelectedWorld('dino');
                      setActiveLevel(null);
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
                  >
                    Adventure Map 🗺️
                  </button>
                  <button
                    onClick={() => {
                      setIsGrandFinaleModal(false);
                      onBack();
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white flex items-center justify-center gap-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
