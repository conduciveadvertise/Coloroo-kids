import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  RotateCcw,
  Star,
  Sparkles,
  Volume2,
  Trophy,
  Check,
  Gamepad2
} from 'lucide-react';
import {
  ARCADE_GAMES_LIST,
  VOCAB_MEMORY_PAIRS,
  SHAPES_LIST,
  WORD_POP_QUESTIONS,
  ShapeItem,
  WordPopQuestion
} from '../../data/arcadeGamesData';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GamesScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type ArcadeMode = 'hub' | 'balloon-math' | 'memory-match' | 'shape-sorter' | 'count-catch' | 'word-pop' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

export const GamesScreen: React.FC<GamesScreenProps> = ({ onBack, onAddStars }) => {
  const [currentMode, setCurrentMode] = useState<ArcadeMode>('hub');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [lastPlayedGame, setLastPlayedGame] = useState<ArcadeMode>('balloon-math');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 1. BALLOON MATH STATE
  // -------------------------------------------------------------
  const [mathNum1, setMathNum1] = useState(2);
  const [mathNum2, setMathNum2] = useState(3);
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+');
  const [mathChoices, setMathChoices] = useState<number[]>([]);
  const [mathWrongVal, setMathWrongVal] = useState<number | null>(null);
  const [mathQuestionCount, setMathQuestionCount] = useState(0);

  const generateMathQuestion = () => {
    setMathWrongVal(null);
    let n1 = 2;
    let n2 = 3;
    let op: '+' | '-' | '×' = '+';
    let ans = 5;

    if (difficulty === 'easy') {
      n1 = Math.floor(Math.random() * 5) + 1;
      n2 = Math.floor(Math.random() * 4) + 1;
      ans = n1 + n2;
      op = '+';
    } else if (difficulty === 'medium') {
      const isSub = Math.random() > 0.5;
      if (isSub) {
        n1 = Math.floor(Math.random() * 10) + 6;
        n2 = Math.floor(Math.random() * 5) + 1;
        ans = n1 - n2;
        op = '-';
      } else {
        n1 = Math.floor(Math.random() * 8) + 4;
        n2 = Math.floor(Math.random() * 7) + 2;
        ans = n1 + n2;
        op = '+';
      }
    } else {
      n1 = Math.floor(Math.random() * 5) + 2;
      n2 = Math.floor(Math.random() * 4) + 2;
      ans = n1 * n2;
      op = '×';
    }

    setMathNum1(n1);
    setMathNum2(n2);
    setMathOp(op);

    const wrong1 = ans + (Math.random() > 0.5 ? 1 : 2);
    const wrong2 = Math.max(1, ans - (Math.random() > 0.5 ? 1 : 2));
    const choices = [ans, wrong1, wrong2].sort(() => Math.random() - 0.5);

    setMathChoices(choices);
    sound.speak(`${n1} ${op === '+' ? 'plus' : op === '-' ? 'minus' : 'times'} ${n2}`);
  };

  const handlePopMathBalloon = (val: number) => {
    const targetAns = mathOp === '+' ? mathNum1 + mathNum2 : mathOp === '-' ? mathNum1 - mathNum2 : mathNum1 * mathNum2;

    if (val === targetAns) {
      sound.playCorrect();
      sound.speak(`Correct! ${val}!`);
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setSessionScore(s => s + 20);

      const nextCount = mathQuestionCount + 1;
      setMathQuestionCount(nextCount);

      if (nextCount >= 5) {
        setTimeout(() => triggerResult('balloon-math'), 800);
      } else {
        setTimeout(() => generateMathQuestion(), 900);
      }
    } else {
      sound.playPop();
      setMathWrongVal(val);
      sound.speak(`Try again! What is ${mathNum1} ${mathOp === '+' ? 'plus' : 'minus'} ${mathNum2}?`);
      setTimeout(() => setMathWrongVal(null), 600);
    }
  };

  // -------------------------------------------------------------
  // 2. MEMORY MATCH STATE (Vocab & Audio Learning)
  // -------------------------------------------------------------
  interface CardSlot {
    id: number;
    pairId: number;
    word: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [memoryDeck, setMemoryDeck] = useState<CardSlot[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  const initMemoryDeck = () => {
    const pairsCount = difficulty === 'easy' ? 3 : 4;
    const selectedPairs = VOCAB_MEMORY_PAIRS.slice(0, pairsCount);

    const deck: CardSlot[] = [];
    let idCounter = 1;
    selectedPairs.forEach(item => {
      deck.push({ id: idCounter++, pairId: item.pairId, word: item.word, emoji: item.emoji, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, pairId: item.pairId, word: item.word, emoji: item.emoji, isFlipped: false, isMatched: false });
    });
    deck.sort(() => Math.random() - 0.5);

    setMemoryDeck(deck);
    setFlippedIds([]);
    setMatchedPairsCount(0);
    setIsProcessingMatch(false);
    sound.speak("Find matching cards!");
  };

  const handleCardClick = (cardId: number) => {
    if (isProcessingMatch) return;
    const clicked = memoryDeck.find(c => c.id === cardId);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    sound.playCardFlip();
    const updated = memoryDeck.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setMemoryDeck(updated);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessingMatch(true);
      const c1 = updated.find(c => c.id === newFlipped[0])!;
      const c2 = updated.find(c => c.id === newFlipped[1])!;

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          sound.playCorrect();
          sound.speak(`${c1.word}!`);
          setMemoryDeck(prev => prev.map(c => c.id === c1.id || c.id === c2.id ? { ...c, isMatched: true } : c));
          setFlippedIds([]);
          setIsProcessingMatch(false);
          onAddStars(10);
          setSessionStars(s => s + 10);
          setSessionScore(s => s + 25);

          const nextMatched = matchedPairsCount + 1;
          setMatchedPairsCount(nextMatched);

          const targetPairs = difficulty === 'easy' ? 3 : 4;
          if (nextMatched >= targetPairs) {
            sound.playFanfare();
            setTimeout(() => triggerResult('memory-match'), 1000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setMemoryDeck(prev => prev.map(c => c.id === c1.id || c.id === c2.id ? { ...c, isFlipped: false } : c));
          setFlippedIds([]);
          setIsProcessingMatch(false);
        }, 850);
      }
    }
  };

  // -------------------------------------------------------------
  // 3. SHAPE SORTER STATE (Tap-to-Place)
  // -------------------------------------------------------------
  const [sorterTarget, setSorterTarget] = useState<ShapeItem>(SHAPES_LIST[0]);
  const [sortedCount, setSortedCount] = useState(0);

  const initShapeSorter = () => {
    const pool = difficulty === 'easy' ? SHAPES_LIST.slice(0, 3) : SHAPES_LIST;
    const target = pool[Math.floor(Math.random() * pool.length)];
    setSorterTarget(target);
    sound.speak(`Place the ${target.name} in its container!`);
  };

  const handlePlaceShapeInBin = (bin: ShapeItem) => {
    if (bin.id === sorterTarget.id) {
      sound.playCorrect();
      sound.speak(`Awesome! ${bin.name}!`);
      try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setSessionScore(s => s + 20);

      const nextCount = sortedCount + 1;
      setSortedCount(nextCount);

      if (nextCount >= 4) {
        setTimeout(() => triggerResult('shape-sorter'), 800);
      } else {
        setTimeout(() => initShapeSorter(), 900);
      }
    } else {
      sound.playPop();
      sound.speak(`That's a ${bin.name}. Put ${sorterTarget.name} in the ${sorterTarget.name} bin!`);
    }
  };

  // -------------------------------------------------------------
  // 4. COUNT & CATCH STATE
  // -------------------------------------------------------------
  const [catchTargetQty, setCatchTargetQty] = useState(5);
  const [caughtQty, setCaughtQty] = useState(0);

  const initCountAndCatch = () => {
    const qty = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    setCatchTargetQty(qty);
    setCaughtQty(0);
    sound.speak(`Catch ${qty} delicious apples!`);
  };

  const handleCatchApple = () => {
    sound.playPop();
    const next = caughtQty + 1;
    setCaughtQty(next);
    sound.speak(`${next}`);

    if (next >= catchTargetQty) {
      sound.playFanfare();
      sound.speak(`Great job! You caught all ${catchTargetQty} apples!`);
      try { confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } }); } catch {}
      onAddStars(15);
      setSessionStars(s => s + 15);
      setSessionScore(s => s + 30);
      setTimeout(() => triggerResult('count-catch'), 1100);
    }
  };

  // -------------------------------------------------------------
  // 5. WORD POP STATE (Phonics)
  // -------------------------------------------------------------
  const [wordPopIndex, setWordPopIndex] = useState(0);
  const currentWordQ = WORD_POP_QUESTIONS[wordPopIndex];

  const initWordPop = (idx = 0) => {
    setWordPopIndex(idx);
    const q = WORD_POP_QUESTIONS[idx];
    sound.speak(q.prompt);
  };

  const handleWordPopChoice = (choiceWord: string) => {
    if (choiceWord === currentWordQ.correctWord) {
      sound.playCorrect();
      sound.speak(`${currentWordQ.letter}... ${currentWordQ.correctWord}!`);
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setSessionStars(s => s + 10);
      setSessionScore(s => s + 20);

      const nextIdx = wordPopIndex + 1;
      if (nextIdx >= WORD_POP_QUESTIONS.length) {
        setTimeout(() => triggerResult('word-pop'), 900);
      } else {
        setTimeout(() => initWordPop(nextIdx), 1100);
      }
    } else {
      sound.playPop();
      sound.speak(`Try again! Find the word starting with ${currentWordQ.letter}!`);
    }
  };

  // -------------------------------------------------------------
  // RESULT TRIGGER & RESTART
  // -------------------------------------------------------------
  const triggerResult = (gameMode: ArcadeMode) => {
    sound.playFanfare();
    sound.speak("Great job! You completed the arcade game!");
    setLastPlayedGame(gameMode);
    setCurrentMode('result');
  };

  const startGame = (gameMode: ArcadeMode) => {
    sound.playPop();
    setSessionScore(0);
    setSessionStars(0);
    setCurrentMode(gameMode);

    if (gameMode === 'balloon-math') {
      setMathQuestionCount(0);
      generateMathQuestion();
    } else if (gameMode === 'memory-match') {
      initMemoryDeck();
    } else if (gameMode === 'shape-sorter') {
      setSortedCount(0);
      initShapeSorter();
    } else if (gameMode === 'count-catch') {
      initCountAndCatch();
    } else if (gameMode === 'word-pop') {
      initWordPop(0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Bar */}
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
            <span className="text-xs font-black">{currentMode === 'hub' ? 'Home' : 'Arcade Hub'}</span>
          </button>
          <h1 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka'] flex items-center gap-1">
            <Gamepad2 className="w-4 h-4 text-amber-500" />
            <span>Arcade Fun 🎮</span>
          </h1>
        </div>

        {/* Difficulty Selector (Easy / Medium / Hard) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => {
                sound.playPop();
                setDifficulty(d);
                if (currentMode !== 'hub' && currentMode !== 'result') {
                  startGame(currentMode);
                }
              }}
              className={`px-2.5 py-0.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all cursor-pointer ${
                difficulty === d
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:bg-purple-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Stage Container */}
      <div className="flex-1 bg-white rounded-[26px] p-2.5 sm:p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">

        {/* ================= VIEW 1: ARCADE HUB (5 GAMES CAROUSEL) ================= */}
        {currentMode === 'hub' && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="text-center py-0.5">
              <h2 className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
                Educational Arcade Mini-Games! 🌟
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400">Play, think and earn bonus stars!</p>
            </div>

            <div className="flex-1 flex items-center min-h-0 py-1">
              <div className="w-full h-full flex gap-2.5 overflow-x-auto overflow-y-hidden py-1 px-0.5 items-stretch no-scrollbar scroll-smooth snap-x snap-mandatory">
                {ARCADE_GAMES_LIST.map(game => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame(game.id)}
                    className={`min-w-[190px] sm:min-w-[210px] max-w-[230px] rounded-[24px] p-3 bg-gradient-to-br ${game.gradient} text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 relative shrink-0 snap-center`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="bg-white/25 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        {game.subtitle}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    </div>

                    <div className="h-16 rounded-2xl bg-white/20 flex items-center justify-center gap-1 my-1">
                      <span className="text-3xl drop-shadow">{game.iconEmoji}</span>
                      <span className="text-xl drop-shadow">{game.secondaryEmoji}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black font-['Fredoka'] leading-tight">{game.title}</h3>
                      <p className="text-[9px] text-white/90 font-medium leading-tight mt-0.5">{game.tagline}</p>
                    </div>

                    <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-[11px] shadow cursor-pointer mt-1">
                      Play Now ▶
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">Earn +10 Stars on every challenge solved!</span>
            </div>
          </div>
        )}

        {/* ================= GAME 1: BALLOON MATH ================= */}
        {currentMode === 'balloon-math' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase">
                🎈 Balloon Math ({mathQuestionCount + 1}/5)
              </span>
              <button
                onClick={() => sound.speak(`${mathNum1} ${mathOp === '+' ? 'plus' : 'minus'} ${mathNum2}`)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-100"
              >
                <Volume2 className="w-3.5 h-3.5" /> Speak
              </button>
            </div>

            {/* Equation */}
            <div className="bg-amber-50 border-2 border-amber-300 px-8 py-2 rounded-2xl shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-purple-950 font-['Fredoka']">
                {mathNum1} {mathOp} {mathNum2} = <span className="text-amber-500">?</span>
              </span>
            </div>

            {/* Balloons Floating Choices */}
            <div className="flex items-center justify-center gap-4 my-2">
              {mathChoices.map((val, i) => (
                <motion.button
                  key={i + '-' + val}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePopMathBalloon(val)}
                  className={`w-20 h-24 sm:w-24 sm:h-28 rounded-3xl flex flex-col items-center justify-center cursor-pointer shadow-lg border-4 border-white transition-all ${
                    mathWrongVal === val
                      ? 'bg-rose-400 animate-shake'
                      : i === 0 ? 'bg-[#FF4757]' : i === 1 ? 'bg-[#1E90FF]' : 'bg-[#2ED573]'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Fredoka'] drop-shadow">
                    {val}
                  </span>
                  <span className="text-[10px] text-white font-bold mt-1">🎈 POP</span>
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Pop the balloon with the correct answer!</span>
          </div>
        )}

        {/* ================= GAME 2: MEMORY MATCH ================= */}
        {currentMode === 'memory-match' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-purple-900">
                Pairs Matched: <span className="text-purple-600">{matchedPairsCount}</span>
              </span>
              <button
                onClick={() => initMemoryDeck()}
                className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            <div className="flex-1 grid grid-cols-4 sm:grid-cols-4 gap-2.5 p-1 items-stretch">
              {memoryDeck.map(c => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCardClick(c.id)}
                  className={`rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                    c.isMatched
                      ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
                      : c.isFlipped
                      ? 'bg-amber-100 border-amber-400 scale-105'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-700 border-white hover:brightness-105'
                  }`}
                >
                  {c.isFlipped || c.isMatched ? (
                    <>
                      <span className="text-3xl sm:text-4xl drop-shadow">{c.emoji}</span>
                      <span className="text-[9px] font-black text-purple-950 font-['Fredoka'] mt-0.5 uppercase">
                        {c.word}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl text-amber-300 drop-shadow">★</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ================= GAME 3: SHAPE SORTER ================= */}
        {currentMode === 'shape-sorter' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase">
                🔷 Shape Sorter ({sortedCount + 1}/4)
              </span>
              <button
                onClick={() => sound.speak(`Place the ${sorterTarget.name} in its container!`)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-100"
              >
                <Volume2 className="w-3.5 h-3.5" /> Clue
              </button>
            </div>

            {/* Target Item Prompt */}
            <div className="bg-purple-50 border-2 border-purple-200 px-6 py-1.5 rounded-2xl flex items-center gap-3 shadow-inner">
              <span className="text-3xl">{sorterTarget.icon}</span>
              <span className="text-base font-black text-purple-950 font-['Fredoka']">
                Tap the container for: <span className="underline decoration-purple-500">{sorterTarget.name}</span>
              </span>
            </div>

            {/* Shape Bins / Containers */}
            <div className="flex items-center gap-3 my-2">
              {(difficulty === 'easy' ? SHAPES_LIST.slice(0, 3) : SHAPES_LIST).map(bin => (
                <motion.button
                  key={bin.id}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePlaceShapeInBin(bin)}
                  className="w-22 sm:w-26 h-24 sm:h-28 rounded-3xl bg-slate-50 border-3 border-purple-200 hover:border-purple-500 flex flex-col items-center justify-between p-2 cursor-pointer shadow-md"
                >
                  <span className="text-3xl">{bin.icon}</span>
                  <div className="w-full py-1 rounded-xl bg-white border border-purple-100 text-center">
                    <span className="text-[10px] font-black text-purple-950 font-['Fredoka']">{bin.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Match the target shape to its corresponding bin!</span>
          </div>
        )}

        {/* ================= GAME 4: COUNT & CATCH ================= */}
        {currentMode === 'count-catch' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase">
                🍎 Count & Catch
              </span>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                Caught: {caughtQty} / {catchTargetQty}
              </span>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 px-6 py-1.5 rounded-2xl text-center">
              <span className="text-base font-black text-purple-950 font-['Fredoka']">
                "Catch {catchTargetQty} Apples!" 🍎
              </span>
            </div>

            {/* Tappable floating targets */}
            <div className="flex-1 flex items-center justify-center gap-3 my-2 flex-wrap">
              {Array.from({ length: catchTargetQty }).map((_, i) => {
                const isCaught = i < caughtQty;
                return (
                  <motion.button
                    key={i}
                    whileHover={!isCaught ? { scale: 1.15 } : {}}
                    whileTap={!isCaught ? { scale: 0.85 } : {}}
                    onClick={!isCaught ? handleCatchApple : undefined}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                      isCaught
                        ? 'bg-emerald-100 border-emerald-400 opacity-60 scale-95'
                        : 'bg-rose-50 border-rose-200 hover:bg-rose-100 cursor-pointer shadow-md'
                    }`}
                  >
                    {isCaught ? <Check className="w-8 h-8 text-emerald-600 stroke-[3]" /> : '🍎'}
                  </motion.button>
                );
              })}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Tap each apple to catch it!</span>
          </div>
        )}

        {/* ================= GAME 5: WORD POP (PHONICS) ================= */}
        {currentMode === 'word-pop' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-900 uppercase">
                🔤 Word Pop ({wordPopIndex + 1}/{WORD_POP_QUESTIONS.length})
              </span>
              <button
                onClick={() => sound.speak(currentWordQ.prompt)}
                className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-100"
              >
                <Volume2 className="w-3.5 h-3.5" /> Prompt
              </button>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-300 px-6 py-1.5 rounded-2xl text-center">
              <span className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
                "Pop the word starting with <span className="text-emerald-600 underline">{currentWordQ.letter}</span>!"
              </span>
            </div>

            {/* Word Bubble Choices */}
            <div className="flex items-center justify-center gap-3 my-2">
              {currentWordQ.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleWordPopChoice(opt.word)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 hover:bg-purple-100 border-3 border-purple-200 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md"
                >
                  <span className="text-3xl sm:text-4xl drop-shadow">{opt.emoji}</span>
                  <span className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka'] mt-1">
                    {opt.word}
                  </span>
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Tap the item that starts with letter {currentWordQ.letter}!</span>
          </div>
        )}

        {/* ================= RESULT SUMMARY DIALOG ================= */}
        {currentMode === 'result' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 border-b-[8px] border-b-amber-500 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-2 shadow-inner">
                🎉
              </div>
              <h2 className="text-2xl font-black text-purple-950 font-['Fredoka']">GREAT JOB!</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">Score: {sessionScore || 80} Points</p>

              <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-5 py-2 rounded-2xl border border-amber-200">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-base font-black text-amber-600">Stars Earned: +{sessionStars || 30} ⭐</span>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => startGame(lastPlayedGame)}
                  className="flex-1 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  PLAY AGAIN 🔄
                </button>
                <button
                  onClick={() => setCurrentMode('hub')}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
                >
                  BACK TO ARCADE 🏠
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
