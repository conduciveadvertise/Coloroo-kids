import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Volume2,
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Play
} from 'lucide-react';
import {
  CORE_COLORS,
  OBJECTS_TO_COLOR,
  DETECTIVE_POOL,
  ColorDef,
  ObjectToColor,
  DetectiveItem
} from '../../data/colorChallengesData';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface ColorChallengesScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type ChallengeMode = 'hub' | 'find' | 'match' | 'color-object' | 'detective' | 'result';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const ColorChallengesScreen: React.FC<ColorChallengesScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [currentMode, setCurrentMode] = useState<ChallengeMode>('hub');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [sessionStars, setSessionStars] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [lastPlayedMode, setLastPlayedMode] = useState<ChallengeMode>('find');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -------------------------------------------------------------
  // GAME 1: FIND THE COLOR
  // -------------------------------------------------------------
  const [findTarget, setFindTarget] = useState<ColorDef>(CORE_COLORS[0]);
  const [findChoices, setFindChoices] = useState<ColorDef[]>([]);
  const [findWrongHex, setFindWrongHex] = useState<string | null>(null);

  const initFindColorRound = () => {
    setFindWrongHex(null);
    const pool = difficulty === 'easy' ? CORE_COLORS.slice(0, 6) : CORE_COLORS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const target = shuffled[0];

    const numChoices = difficulty === 'easy' ? 3 : 4;
    const choices = [target, ...shuffled.slice(1, numChoices)].sort(() => Math.random() - 0.5);

    setFindTarget(target);
    setFindChoices(choices);
    sound.speak(`Find ${target.name}!`);
  };

  const handleFindChoice = (choice: ColorDef) => {
    if (choice.name === findTarget.name) {
      sound.playCorrect();
      sound.speak(`Great job! That is ${findTarget.name}!`);
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setToastMessage(`Correct! +10 Stars ⭐`);

      const nextCompleted = questionsCompleted + 1;
      setQuestionsCompleted(nextCompleted);

      setTimeout(() => {
        setToastMessage(null);
        if (nextCompleted >= 5) {
          triggerResultScreen('find');
        } else {
          initFindColorRound();
        }
      }, 1100);
    } else {
      sound.playPop();
      setFindWrongHex(choice.hex);
      sound.speak(`Try again! Tap ${findTarget.name}!`);
      setTimeout(() => setFindWrongHex(null), 600);
    }
  };

  // -------------------------------------------------------------
  // GAME 2: COLOR MATCH (Progressive 2, 3, 4 choices)
  // -------------------------------------------------------------
  const [matchTarget, setMatchTarget] = useState<ColorDef>(CORE_COLORS[1]);
  const [matchChoices, setMatchChoices] = useState<ColorDef[]>([]);
  const [matchWrongHex, setMatchWrongHex] = useState<string | null>(null);

  const initMatchRound = () => {
    setMatchWrongHex(null);
    const pool = difficulty === 'easy' ? CORE_COLORS.slice(0, 6) : CORE_COLORS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const target = shuffled[0];

    const numChoices = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const choices = [target, ...shuffled.slice(1, numChoices)].sort(() => Math.random() - 0.5);

    setMatchTarget(target);
    setMatchChoices(choices);
    sound.speak(`Match the ${target.name} color!`);
  };

  const handleMatchChoice = (choice: ColorDef) => {
    if (choice.name === matchTarget.name) {
      sound.playCorrect();
      sound.speak(`Super match! That is ${matchTarget.name}!`);
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setToastMessage(`Match Found! +10 Stars ⭐`);

      const nextCompleted = questionsCompleted + 1;
      setQuestionsCompleted(nextCompleted);

      setTimeout(() => {
        setToastMessage(null);
        if (nextCompleted >= 5) {
          triggerResultScreen('match');
        } else {
          if (difficulty === 'easy' && nextCompleted >= 2) setDifficulty('medium');
          if (difficulty === 'medium' && nextCompleted >= 4) setDifficulty('hard');
          initMatchRound();
        }
      }, 1100);
    } else {
      sound.playPop();
      setMatchWrongHex(choice.hex);
      sound.speak(`Try again! Find ${matchTarget.name}!`);
      setTimeout(() => setMatchWrongHex(null), 600);
    }
  };

  // -------------------------------------------------------------
  // GAME 3: COLOR THE OBJECT
  // -------------------------------------------------------------
  const [objectIndex, setObjectIndex] = useState(0);
  const [filledColor, setFilledColor] = useState<string | null>(null);
  const currentObject = OBJECTS_TO_COLOR[objectIndex];

  const initColorObjectRound = (idx: number) => {
    setFilledColor(null);
    const obj = OBJECTS_TO_COLOR[idx];
    sound.speak(obj.prompt);
  };

  const handleColorObjectChoice = (choice: ColorDef) => {
    if (choice.name === currentObject.correctColorName) {
      setFilledColor(currentObject.correctHex);
      sound.playCorrect();
      sound.speak(`Great job! The ${currentObject.name} is now ${currentObject.correctColorName}!`);
      try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setToastMessage(`Magnificent! +10 Stars ⭐`);

      const nextCompleted = questionsCompleted + 1;
      setQuestionsCompleted(nextCompleted);

      setTimeout(() => {
        setToastMessage(null);
        setFilledColor(null);
        if (nextCompleted >= 5) {
          triggerResultScreen('color-object');
        } else {
          const nextIdx = (objectIndex + 1) % OBJECTS_TO_COLOR.length;
          setObjectIndex(nextIdx);
          initColorObjectRound(nextIdx);
        }
      }, 1400);
    } else {
      sound.playPop();
      sound.speak(`Try again! Make the ${currentObject.name} ${currentObject.correctColorName}!`);
    }
  };

  // -------------------------------------------------------------
  // GAME 4: COLOR DETECTIVE
  // -------------------------------------------------------------
  const [detectiveTargetColor, setDetectiveTargetColor] = useState<string>('Blue');
  const [detectiveItems, setDetectiveItems] = useState<DetectiveItem[]>([]);

  const initDetectiveRound = () => {
    const colorNames = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    const chosenColor = colorNames[Math.floor(Math.random() * colorNames.length)];
    setDetectiveTargetColor(chosenColor);

    const matchesCount = difficulty === 'easy' ? 2 : 3;
    const othersCount = difficulty === 'easy' ? 4 : 5;

    const matches = DETECTIVE_POOL.filter(i => i.colorName === chosenColor).sort(() => Math.random() - 0.5).slice(0, matchesCount);
    const others = DETECTIVE_POOL.filter(i => i.colorName !== chosenColor).sort(() => Math.random() - 0.5).slice(0, othersCount);

    const fullDeck: DetectiveItem[] = [...matches, ...others].sort(() => Math.random() - 0.5).map((item, idx) => ({
      ...item,
      id: idx + 1,
      isFound: false
    }));

    setDetectiveItems(fullDeck);
    sound.speak(`Find all the ${chosenColor} objects!`);
  };

  const handleTapDetectiveItem = (item: DetectiveItem) => {
    if (item.isFound) return;

    if (item.colorName === detectiveTargetColor) {
      sound.playCorrect();
      sound.speak(`Found ${item.name}!`);

      const updated = detectiveItems.map(i => i.id === item.id ? { ...i, isFound: true } : i);
      setDetectiveItems(updated);

      const remaining = updated.filter(i => i.colorName === detectiveTargetColor && !i.isFound);
      if (remaining.length === 0) {
        sound.playFanfare();
        sound.speak(`Case Solved! You found all ${detectiveTargetColor} objects!`);
        try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch {}
        onAddStars(20);
        setSessionStars(s => s + 20);
        setToastMessage(`Case Solved! +20 Stars ⭐`);

        const nextCompleted = questionsCompleted + 1;
        setQuestionsCompleted(nextCompleted);

        setTimeout(() => {
          setToastMessage(null);
          if (nextCompleted >= 3) {
            triggerResultScreen('detective');
          } else {
            initDetectiveRound();
          }
        }, 1600);
      }
    } else {
      sound.playPop();
      sound.speak(`That is ${item.colorName}. Find ${detectiveTargetColor} objects!`);
    }
  };

  const triggerResultScreen = (mode: ChallengeMode) => {
    sound.playFanfare();
    sound.speak("Great job! You completed the challenge!");
    setLastPlayedMode(mode);
    setCurrentMode('result');
  };

  const restartMode = (mode: ChallengeMode) => {
    sound.playPop();
    setQuestionsCompleted(0);
    setSessionStars(0);
    setDifficulty('easy');
    setCurrentMode(mode);
    if (mode === 'find') initFindColorRound();
    if (mode === 'match') initMatchRound();
    if (mode === 'color-object') {
      setObjectIndex(0);
      initColorObjectRound(0);
    }
    if (mode === 'detective') initDetectiveRound();
  };

  const renderObjectSvg = (svgType: ObjectToColor['svgType'], fillColor: string) => {
    switch (svgType) {
      case 'apple':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <path d="M60,20 C60,10 70,5 75,5" stroke="#8B572A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M72,12 C85,8 90,18 72,18 Z" fill="#2ED573" stroke="#2C3A4B" strokeWidth="1.5" />
            <path d="M60,35 C40,15 15,35 25,75 C35,110 58,115 60,115 C62,115 85,110 95,75 C105,35 80,15 60,35 Z" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
          </svg>
        );
      case 'banana':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <path d="M25,30 C55,30 95,60 95,100 C90,105 80,100 80,90 C80,60 45,45 25,38 Z" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
            <path d="M22,26 L27,33" stroke="#8B572A" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );
      case 'leaf':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <path d="M20,100 C20,40 60,20 100,20 C100,80 60,100 20,100 Z" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
            <path d="M20,100 L95,25" stroke="#2C3A4B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'sun':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <circle cx="60" cy="60" r="30" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <line
                key={i}
                x1="60"
                y1="18"
                x2="60"
                y2="8"
                stroke="#2C3A4B"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${ang} 60 60)`}
              />
            ))}
          </svg>
        );
      case 'cloud':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <path d="M30,75 C20,75 15,60 25,50 C25,35 45,30 55,40 C65,25 90,30 95,45 C105,50 105,75 90,75 Z" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
          </svg>
        );
      case 'flower':
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <circle cx="60" cy="40" r="14" fill={fillColor} stroke="#2C3A4B" strokeWidth="3" />
            <circle cx="80" cy="60" r="14" fill={fillColor} stroke="#2C3A4B" strokeWidth="3" />
            <circle cx="60" cy="80" r="14" fill={fillColor} stroke="#2C3A4B" strokeWidth="3" />
            <circle cx="40" cy="60" r="14" fill={fillColor} stroke="#2C3A4B" strokeWidth="3" />
            <circle cx="60" cy="60" r="12" fill="#FFA502" stroke="#2C3A4B" strokeWidth="3" />
          </svg>
        );
      case 'car':
        return (
          <svg viewBox="0 0 120 120" className="w-32 h-28 sm:w-36 sm:h-32 drop-shadow-md">
            <path d="M20,70 L35,50 L85,50 L100,70 L105,75 L105,90 L15,90 L15,75 Z" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
            <path d="M40,55 L75,55 L75,70 L35,70 Z" fill="#FFFFFF" stroke="#2C3A4B" strokeWidth="2.5" />
            <circle cx="35" cy="90" r="10" fill="#2F3542" stroke="#2C3A4B" strokeWidth="3" />
            <circle cx="85" cy="90" r="10" fill="#2F3542" stroke="#2C3A4B" strokeWidth="3" />
          </svg>
        );
      case 'ball':
      default:
        return (
          <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md">
            <circle cx="60" cy="60" r="40" fill={fillColor} stroke="#2C3A4B" strokeWidth="4" />
            <path d="M25,45 C50,45 70,70 70,98" stroke="#2C3A4B" strokeWidth="3" fill="none" />
            <path d="M50,22 C50,55 75,75 98,75" stroke="#2C3A4B" strokeWidth="3" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              if (currentMode !== 'hub') {
                setCurrentMode('hub');
              } else {
                onBack();
              }
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">{currentMode === 'hub' ? 'Home' : 'Challenges Hub'}</span>
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka'] leading-none">
              🌈 Color Challenges
            </h1>
            <span className="text-[9px] text-purple-600 font-bold hidden sm:inline">Learn colors by playing!</span>
          </div>
        </div>

        {/* Current Active Mode Tab Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'find' as ChallengeMode, label: '🎯 Find' },
            { id: 'match' as ChallengeMode, label: '🧩 Match' },
            { id: 'color-object' as ChallengeMode, label: '🍎 Color Object' },
            { id: 'detective' as ChallengeMode, label: '👀 Detective' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => restartMode(m.id)}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                currentMode === m.id
                  ? 'bg-amber-400 text-slate-900 shadow-md font-black scale-105'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Stage Container */}
      <div className="flex-1 bg-white rounded-[26px] p-2.5 sm:p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* ================= MODE: HUB (4 Fully Visible Challenge Cards) ================= */}
        {currentMode === 'hub' && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="text-center py-0.5">
              <h2 className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
                Learn colors by playing exciting quests! 🌟
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400">Choose a game mode below:</p>
            </div>

            {/* 4 Cards Direct Vibrant Backgrounds (No -z-10 stacking bugs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 items-stretch my-1">
              {[
                {
                  id: 'find' as ChallengeMode,
                  title: 'Find the Color',
                  desc: 'Tap the spoken target color',
                  tag: 'TARGET QUEST',
                  icon: '🎯',
                  subIcon: '🔴',
                  bgGradient: 'bg-gradient-to-br from-[#ff7675] via-[#ee5253] to-[#d63031]',
                  borderBottom: 'border-b-[#d63031]'
                },
                {
                  id: 'match' as ChallengeMode,
                  title: 'Color Match',
                  desc: 'Match color shades with levels',
                  tag: 'PUZZLE MATCH',
                  icon: '🧩',
                  subIcon: '🌈',
                  bgGradient: 'bg-gradient-to-br from-[#74b9ff] via-[#0984e3] to-[#00cec9]',
                  borderBottom: 'border-b-[#0984e3]'
                },
                {
                  id: 'color-object' as ChallengeMode,
                  title: 'Color the Object',
                  desc: 'Paint fruits, sun & nature',
                  tag: 'OBJECT FILL',
                  icon: '🍎',
                  subIcon: '🎨',
                  bgGradient: 'bg-gradient-to-br from-[#55efc4] via-[#00b894] to-[#10ac84]',
                  borderBottom: 'border-b-[#10ac84]'
                },
                {
                  id: 'detective' as ChallengeMode,
                  title: 'Color Detective',
                  desc: 'Find all matching clue objects',
                  tag: 'SEEK & FIND',
                  icon: '👀',
                  subIcon: '🔍',
                  bgGradient: 'bg-gradient-to-br from-[#a29bfe] via-[#6c5ce7] to-[#4834d4]',
                  borderBottom: 'border-b-[#4834d4]'
                }
              ].map(card => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => restartMode(card.id)}
                  className={`rounded-[24px] p-3 ${card.bgGradient} text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[6px] ${card.borderBottom} relative shrink-0`}
                >
                  {/* Card Header Badge */}
                  <div className="flex justify-between items-center">
                    <span className="bg-white/25 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  </div>

                  {/* Icon Showcase Stage */}
                  <div className="h-16 rounded-2xl bg-white/20 flex items-center justify-center gap-1.5 my-1 shadow-inner border border-white/30">
                    <span className="text-3xl drop-shadow-md">{card.icon}</span>
                    <span className="text-2xl drop-shadow-sm">{card.subIcon}</span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-sm sm:text-base font-black font-['Fredoka'] leading-tight drop-shadow-sm">
                      {card.title}
                    </h3>
                    <p className="text-[9px] text-white/90 font-semibold leading-tight mt-0.5 line-clamp-1">
                      {card.desc}
                    </p>
                  </div>

                  {/* Play Now Button */}
                  <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1 mt-1 active:scale-95 transition-transform">
                    <Play className="w-3 h-3 fill-slate-900" />
                    <span>Play Now</span>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">Earn +10 Stars on every challenge solved!</span>
            </div>
          </div>
        )}

        {/* ================= GAME 1: FIND THE COLOR ================= */}
        {currentMode === 'find' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                Find the Color 🎯 ({questionsCompleted + 1}/5)
              </span>
              <button
                onClick={() => sound.speak(`Find ${findTarget.name}!`)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-100 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" /> Repeat Voice
              </button>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 px-6 py-1.5 rounded-2xl shadow-sm text-center">
              <span className="text-xs font-bold text-slate-600">Listen & Tap: </span>
              <span className="text-lg sm:text-xl font-black text-purple-950 font-['Fredoka']">
                "Find <span className="underline decoration-wavy decoration-amber-400">{findTarget.name.toUpperCase()}</span>!"
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl px-2 my-1">
              {findChoices.map(c => (
                <motion.button
                  key={c.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFindChoice(c)}
                  className={`h-22 sm:h-26 rounded-3xl flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg border-4 border-white transition-all ${
                    findWrongHex === c.hex ? 'animate-shake ring-4 ring-rose-400 opacity-70' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="text-3xl drop-shadow">{c.emoji}</span>
                  <span className={`text-base font-black font-['Fredoka'] mt-0.5 drop-shadow ${c.textColor || 'text-white'}`}>
                    {c.name}
                  </span>
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Tap the button with the matching color!</span>
          </div>
        )}

        {/* ================= GAME 2: COLOR MATCH ================= */}
        {currentMode === 'match' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                Color Match 🧩 (Difficulty: {difficulty.toUpperCase()})
              </span>
              <button
                onClick={() => sound.speak(`Match the ${matchTarget.name} color!`)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-100 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" /> Prompt
              </button>
            </div>

            <div className="flex-1 flex items-center justify-around w-full max-w-2xl my-1 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Color</span>
                <div
                  className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center"
                  style={{ backgroundColor: matchTarget.hex }}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow">{matchTarget.emoji}</span>
                  <span className={`text-xs font-black font-['Fredoka'] mt-0.5 ${matchTarget.textColor || 'text-white'}`}>
                    {matchTarget.name}
                  </span>
                </div>
              </div>

              <div className="text-2xl font-black text-purple-300">➔</div>

              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {matchChoices.map(c => (
                  <motion.button
                    key={c.name}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleMatchChoice(c)}
                    className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl shadow-lg border-4 border-white flex flex-col items-center justify-center cursor-pointer transition-all ${
                      matchWrongHex === c.hex ? 'animate-shake ring-4 ring-rose-400 opacity-60' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-2xl sm:text-3xl drop-shadow">{c.emoji}</span>
                    <span className={`text-[10px] font-black font-['Fredoka'] mt-0.5 ${c.textColor || 'text-white'}`}>
                      {c.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-400">Select the option that matches the target on the left!</span>
          </div>
        )}

        {/* ================= GAME 3: COLOR THE OBJECT ================= */}
        {currentMode === 'color-object' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                Color the Object 🍎 ({objectIndex + 1}/{OBJECTS_TO_COLOR.length})
              </span>
              <button
                onClick={() => sound.speak(currentObject.prompt)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-100 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" /> Prompt
              </button>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 px-6 py-1 rounded-2xl shadow-sm text-center">
              <span className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
                "{currentObject.prompt}"
              </span>
            </div>

            <div className="flex-1 flex items-center justify-around w-full max-w-xl my-1">
              <div className="bg-slate-50 p-3 rounded-3xl border-2 border-purple-100 shadow-inner flex items-center justify-center min-w-[130px]">
                {renderObjectSvg(currentObject.svgType, filledColor || '#FFFFFF')}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Choose Color:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentObject.options.map(c => (
                    <motion.button
                      key={c.name}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleColorObjectChoice(c)}
                      className="px-3 py-2.5 rounded-2xl text-white font-black text-xs shadow-md border-2 border-white cursor-pointer flex items-center gap-1.5 justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span>{c.emoji}</span>
                      <span>{c.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-400">Pick the true color for the {currentObject.name}!</span>
          </div>
        )}

        {/* ================= GAME 4: COLOR DETECTIVE ================= */}
        {currentMode === 'detective' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                Color Detective 👀
              </span>
              <button
                onClick={() => sound.speak(`Find all the ${detectiveTargetColor} objects!`)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-100 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" /> Clue
              </button>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 px-6 py-1 rounded-2xl shadow-sm text-center">
              <span className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
                🔍 "Find ALL the <span className="underline decoration-wavy decoration-purple-600">{detectiveTargetColor.toUpperCase()}</span> objects!"
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 w-full max-w-xl my-1 flex-1 items-stretch">
              {detectiveItems.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTapDetectiveItem(item)}
                  className={`rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 cursor-pointer shadow-md transition-all ${
                    item.isFound
                      ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300 scale-102'
                      : 'bg-white border-purple-100 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-3xl leading-none drop-shadow-sm">{item.emoji}</span>
                  <span className="text-[9px] font-bold text-slate-700 mt-1 line-clamp-1">{item.name}</span>
                  {item.isFound && (
                    <span className="text-[8px] font-black text-emerald-700 mt-0.5">Found! ✓</span>
                  )}
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Tap every item that has the target clue color!</span>
          </div>
        )}

        {/* ================= RESULT SCREEN ================= */}
        {currentMode === 'result' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 border-b-[8px] border-b-amber-500 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-2 shadow-inner">
                🏆
              </div>
              <h2 className="text-2xl font-black text-purple-950 font-['Fredoka']">🎉 Great Job!</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">You completed the Color Challenge quest!</p>
              
              <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-5 py-2 rounded-2xl border border-amber-200">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-lg font-black text-amber-600">Stars Earned: {sessionStars || 40} ⭐</span>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => restartMode(lastPlayedMode)}
                  className="flex-1 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => setCurrentMode('hub')}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
                >
                  Back to Hub 🏠
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Dynamic Star Celebration Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-900 text-white px-5 py-1.5 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 border-2 border-amber-300 z-50"
            >
              <span>🎉</span>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
