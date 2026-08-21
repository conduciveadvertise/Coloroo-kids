import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Volume2,
  Star,
  Plus,
  Minus,
  Hash,
  ArrowLeftRight,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type LearningCategory = 'math' | 'phonics';
type MathActivity = 'before-after' | 'numbers-50' | 'counting' | 'addition' | 'subtraction';

interface BeforeAfterQuestion {
  type: 'before' | 'after';
  number: number;
  correctAnswer: number;
  options: number[];
  qKey: string;
}

export const LearningScreen: React.FC<LearningScreenProps> = ({ onBack, onAddStars }) => {
  const [activeCategory, setActiveCategory] = useState<LearningCategory>('math');
  const [activeMathActivity, setActiveMathActivity] = useState<MathActivity | null>(null);

  // ==========================================
  // BEFORE & AFTER STATE & LOGIC (1–50)
  // ==========================================
  const [baQuestion, setBaQuestion] = useState<BeforeAfterQuestion | null>(null);
  const [baWrongVal, setBaWrongVal] = useState<number | null>(null);
  const [baAnswered, setBaAnswered] = useState<boolean>(false);
  const lastBaKeyRef = useRef<string>('');

  const generateBeforeAfter = (lastK: string): BeforeAfterQuestion => {
    const type: 'before' | 'after' = Math.random() > 0.5 ? 'before' : 'after';
    let num = 0;
    let correct = 0;

    if (type === 'before') {
      // Before 2..50 -> correct is 1..49 (Never Before 1)
      num = Math.floor(Math.random() * 49) + 2;
      correct = num - 1;
    } else {
      // After 1..49 -> correct is 2..50 (Never After 50)
      num = Math.floor(Math.random() * 49) + 1;
      correct = num + 1;
    }

    const currentKey = `${type}-${num}`;
    if (currentKey === lastK) {
      return generateBeforeAfter(''); // Prevent immediate duplicate
    }

    // Generate nearby distractors (within 1..50)
    const optsSet = new Set<number>();
    optsSet.add(correct);

    const candidates = [
      num,
      correct - 1,
      correct + 1,
      correct - 2,
      correct + 2,
      num - 2,
      num + 2
    ].filter(n => n >= 1 && n <= 50 && n !== correct);

    candidates.sort(() => Math.random() - 0.5);
    for (const c of candidates) {
      if (optsSet.size < 4) optsSet.add(c);
    }

    while (optsSet.size < 4) {
      const fallback = Math.floor(Math.random() * 50) + 1;
      if (fallback !== correct) optsSet.add(fallback);
    }

    return {
      type,
      number: num,
      correctAnswer: correct,
      options: Array.from(optsSet).sort(() => Math.random() - 0.5),
      qKey: currentKey
    };
  };

  const loadNextBeforeAfterQuestion = () => {
    const q = generateBeforeAfter(lastBaKeyRef.current);
    lastBaKeyRef.current = q.qKey;
    setBaQuestion(q);
    setBaWrongVal(null);
    setBaAnswered(false);
  };

  // Speak question automatically when new Before & After question loads
  useEffect(() => {
    if (activeMathActivity === 'before-after' && baQuestion && !baAnswered) {
      sound.speak(`What comes ${baQuestion.type} ${baQuestion.number}?`);
    }
  }, [baQuestion?.qKey, activeMathActivity]);

  const handleSpeakCurrentBA = () => {
    if (!baQuestion) return;
    sound.speak(`What comes ${baQuestion.type} ${baQuestion.number}?`);
  };

  const handleBAGuess = (val: number) => {
    if (!baQuestion || baAnswered) return;
    if (val === baQuestion.correctAnswer) {
      setBaAnswered(true);
      sound.playCorrect();
      sound.speak("Great job!");
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setTimeout(() => loadNextBeforeAfterQuestion(), 1200);
    } else {
      sound.playPop();
      setBaWrongVal(val);
      sound.speak("Try again!");
      setTimeout(() => setBaWrongVal(null), 600);
    }
  };

  // ==========================================
  // PRESERVED NUMBERS 1-50 EXPLORER STATE
  // ==========================================
  const [selectedNum50, setSelectedNum50] = useState<number>(1);

  // ==========================================
  // PRESERVED COUNTING / ADDITION / SUBTRACTION
  // ==========================================
  const [genericMathQ, setGenericMathQ] = useState<any>(null);

  const initGenericMath = (mode: 'counting' | 'addition' | 'subtraction') => {
    let qText = '';
    let voiceText = '';
    let correct = 0;

    if (mode === 'addition') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      correct = a + b;
      qText = `${a} + ${b} = ?`;
      voiceText = `What is ${a} plus ${b}?`;
    } else if (mode === 'subtraction') {
      const a = Math.floor(Math.random() * 5) + 5;
      const b = Math.floor(Math.random() * 4) + 1;
      correct = a - b;
      qText = `${a} - ${b} = ?`;
      voiceText = `What is ${a} minus ${b}?`;
    } else {
      correct = Math.floor(Math.random() * 7) + 2;
      qText = `Count the friendly stars!`;
      voiceText = `How many stars are there?`;
    }

    const opts = Array.from(new Set([correct, correct + 1, Math.max(1, correct - 1), correct + 2])).slice(0, 3).sort(() => Math.random() - 0.5);
    setGenericMathQ({ mode, qText, voiceText, correct, opts });
    setBaWrongVal(null);
  };

  useEffect(() => {
    if (genericMathQ?.voiceText) {
      sound.speak(genericMathQ.voiceText);
    }
  }, [genericMathQ?.qText]);

  const handleGenericGuess = (val: number) => {
    if (!genericMathQ) return;
    if (val === genericMathQ.correct) {
      sound.playCorrect();
      sound.speak("That's right!");
      try { confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } }); } catch {}
      onAddStars(10);
      setTimeout(() => initGenericMath(genericMathQ.mode), 1100);
    } else {
      sound.playPop();
      setBaWrongVal(val);
      sound.speak("Try again!");
      setTimeout(() => setBaWrongVal(null), 600);
    }
  };

  const openMathActivity = (act: MathActivity) => {
    sound.playPop();
    setActiveMathActivity(act);
    if (act === 'before-after') {
      loadNextBeforeAfterQuestion();
    } else if (act === 'numbers-50') {
      sound.speak("Numbers 1 to 50 explorer!");
    } else {
      initGenericMath(act);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              if (activeMathActivity) {
                setActiveMathActivity(null);
              } else {
                onBack();
              }
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">{activeMathActivity ? 'Math Menu' : 'Home'}</span>
          </button>

          <h1 className="text-sm sm:text-base font-black text-purple-950 font-sans flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Learn & Play</span>
          </h1>
        </div>

        {/* Category Tabs / Repeat Voice */}
        {!activeMathActivity ? (
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
            <button
              onClick={() => { sound.playPop(); setActiveCategory('math'); sound.speak("Maths and numbers!"); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCategory === 'math' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              🔢 Maths
            </button>
            <button
              onClick={() => { sound.playPop(); setActiveCategory('phonics'); sound.speak("ABC and phonics!"); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCategory === 'phonics' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              🔤 ABC & Phonics
            </button>
          </div>
        ) : activeMathActivity === 'before-after' && baQuestion ? (
          <button
            onClick={handleSpeakCurrentBA}
            className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-black flex items-center gap-1.5 cursor-pointer border border-purple-100 shadow-sm active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>🔊 Repeat Voice</span>
          </button>
        ) : genericMathQ ? (
          <button
            onClick={() => sound.speak(genericMathQ.voiceText)}
            className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-black flex items-center gap-1.5 cursor-pointer border border-purple-100 shadow-sm active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>🔊 Repeat Voice</span>
          </button>
        ) : null}
      </div>

      {/* Main Learning Arena */}
      <div className="flex-1 bg-white rounded-[26px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between relative overflow-hidden min-h-0">
        
        {/* VIEW 1: MATHS MENU */}
        {!activeMathActivity && activeCategory === 'math' && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="text-center py-0.5">
              <h2 className="text-base sm:text-lg font-black text-purple-950 font-sans">
                Maths & Numbers Activities 🔢
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400">Choose a fun maths game to play & learn!</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 flex-1 items-stretch my-1">
              {/* BEFORE & AFTER */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMathActivity('before-after')}
                className="rounded-[22px] p-3 bg-gradient-to-br from-[#6C5CE7] via-[#5F27CD] to-[#341F97] text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[5px] border-b-[#341f97] ring-2 ring-purple-200"
              >
                <div className="flex justify-between items-start">
                  <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ⭐ NEW MODE
                  </span>
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                </div>
                <div className="h-14 rounded-2xl bg-white/20 flex items-center justify-center gap-1 my-1">
                  <span className="text-3xl">🔢</span>
                  <ArrowLeftRight className="w-5 h-5 text-amber-300 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-sans leading-tight">Before & After</h3>
                  <p className="text-[9px] text-white/90 font-bold mt-0.5">Numbers 1–50 sequence</p>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-white text-purple-950 font-black text-[10px] shadow cursor-pointer mt-1">
                  Play Now ▶
                </button>
              </motion.div>

              {/* NUMBERS 1-50 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMathActivity('numbers-50')}
                className="rounded-[22px] p-3 bg-gradient-to-br from-[#00cec9] via-[#0984e3] to-[#00d2d3] text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[5px] border-b-[#0984e3]"
              >
                <span className="bg-white/25 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                  EXPLORER
                </span>
                <div className="h-14 rounded-2xl bg-white/20 flex items-center justify-center my-1">
                  <span className="text-2xl font-black font-sans">1 → 50</span>
                </div>
                <div>
                  <h3 className="text-sm font-black font-sans leading-tight">Numbers (1–50)</h3>
                  <p className="text-[9px] text-white/90 font-bold mt-0.5">Read, speak & learn count</p>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-[10px] shadow cursor-pointer mt-1">
                  Open Grid ▶
                </button>
              </motion.div>

              {/* COUNTING */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMathActivity('counting')}
                className="rounded-[22px] p-3 bg-gradient-to-br from-[#fdcb6e] via-[#f39c12] to-[#e67e22] text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[5px] border-b-[#e67e22]"
              >
                <span className="bg-white/25 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                  COUNTING
                </span>
                <div className="h-14 rounded-2xl bg-white/20 flex items-center justify-center my-1">
                  <Hash className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-sans leading-tight">Star Counting</h3>
                  <p className="text-[9px] text-white/90 font-bold mt-0.5">Count items & match</p>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-[10px] shadow cursor-pointer mt-1">
                  Count Stars ▶
                </button>
              </motion.div>

              {/* ADDITION */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMathActivity('addition')}
                className="rounded-[22px] p-3 bg-gradient-to-br from-[#55efc4] via-[#00b894] to-[#10ac84] text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[5px] border-b-[#10ac84]"
              >
                <span className="bg-white/25 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                  ADDITION
                </span>
                <div className="h-14 rounded-2xl bg-white/20 flex items-center justify-center my-1">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-sans leading-tight">Simple Plus</h3>
                  <p className="text-[9px] text-white/90 font-bold mt-0.5">Add friendly numbers</p>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-[10px] shadow cursor-pointer mt-1">
                  Add Numbers ▶
                </button>
              </motion.div>

              {/* SUBTRACTION */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openMathActivity('subtraction')}
                className="rounded-[22px] p-3 bg-gradient-to-br from-[#ff7675] via-[#ee5253] to-[#d63031] text-white shadow-lg flex flex-col justify-between cursor-pointer border-2 border-white/60 border-b-[5px] border-b-[#d63031]"
              >
                <span className="bg-white/25 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                  SUBTRACTION
                </span>
                <div className="h-14 rounded-2xl bg-white/20 flex items-center justify-center my-1">
                  <Minus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-sans leading-tight">Minus Fun</h3>
                  <p className="text-[9px] text-white/90 font-bold mt-0.5">Take away & solve</p>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-white text-slate-900 font-black text-[10px] shadow cursor-pointer mt-1">
                  Minus Play ▶
                </button>
              </motion.div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400">Earn +10 Stars on every correct math question! ⭐</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: BEFORE & AFTER VISUAL SEQUENCE FIX */}
        {/* ========================================================================= */}
        {activeMathActivity === 'before-after' && baQuestion && (
          <div className="w-full h-full flex flex-col items-center justify-between py-1">
            
            {/* Question Banner */}
            <div className="bg-purple-50 border-2 border-purple-200 px-6 py-1.5 rounded-2xl shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500">Instruction: </span>
              <span className="text-base sm:text-lg font-black text-purple-950 font-sans uppercase">
                What comes <span className="text-purple-600 underline decoration-wavy decoration-amber-400">{baQuestion.type}</span> {baQuestion.number}?
              </span>
            </div>

            {/* Sequence Box (Always clearly visible with high contrast) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-1.5">
              {baQuestion.type === 'before' ? (
                <>
                  {/* Left Box: ? or correct answer */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 flex items-center justify-center shadow-lg transition-all ${
                    baAnswered 
                      ? 'bg-emerald-500 border-white text-white scale-105' 
                      : 'bg-amber-100 border-amber-400 text-amber-900'
                  }`}>
                    <span className="text-4xl sm:text-5xl font-black font-sans">
                      {baAnswered ? baQuestion.correctAnswer : '?'}
                    </span>
                  </div>

                  <span className="text-2xl sm:text-3xl font-black text-purple-400">➔</span>

                  {/* Right Box: Given Number */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white text-white rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl sm:text-5xl font-black font-sans">
                      {baQuestion.number}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Box: Given Number */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white text-white rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl sm:text-5xl font-black font-sans">
                      {baQuestion.number}
                    </span>
                  </div>

                  <span className="text-2xl sm:text-3xl font-black text-purple-400">➔</span>

                  {/* Right Box: ? or correct answer */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 flex items-center justify-center shadow-lg transition-all ${
                    baAnswered 
                      ? 'bg-emerald-500 border-white text-white scale-105' 
                      : 'bg-amber-100 border-amber-400 text-amber-900'
                  }`}>
                    <span className="text-4xl sm:text-5xl font-black font-sans">
                      {baAnswered ? baQuestion.correctAnswer : '?'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 4 Large Choice Buttons */}
            <div className="flex items-center gap-3 my-1">
              {baQuestion.options.map(opt => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleBAGuess(opt)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl border-4 border-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg cursor-pointer transition-all ${
                    baWrongVal === opt
                      ? 'bg-rose-500 text-white animate-shake ring-4 ring-rose-300'
                      : baAnswered && opt === baQuestion.correctAnswer
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-sans'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">
              Tap the correct number that comes {baQuestion.type} {baQuestion.number}!
            </span>
          </div>
        )}

        {/* VIEW 3: NUMBERS 1-50 EXPLORER */}
        {activeMathActivity === 'numbers-50' && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black text-purple-950">Tap any number to speak:</span>
              <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-0.5 rounded-xl border border-purple-200">
                Selected: {selectedNum50}
              </span>
            </div>

            <div className="flex-1 grid grid-cols-10 gap-1.5 p-1 overflow-y-auto no-scrollbar items-center">
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => {
                    sound.playPop();
                    setSelectedNum50(num);
                    sound.speak(`${num}`);
                  }}
                  className={`h-9 sm:h-10 rounded-xl font-black text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-center ${
                    selectedNum50 === num
                      ? 'bg-purple-600 text-white border-purple-800 scale-105 shadow-md'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: GENERIC MATHS */}
        {(activeMathActivity === 'counting' || activeMathActivity === 'addition' || activeMathActivity === 'subtraction') && genericMathQ && (
          <div className="w-full h-full flex flex-col items-center justify-between py-2">
            <div className="bg-purple-50 border-2 border-purple-200 px-8 py-2 rounded-2xl shadow-sm text-center">
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 font-sans">
                {genericMathQ.qText}
              </h2>
            </div>

            {activeMathActivity === 'counting' && (
              <div className="flex gap-2 my-2 flex-wrap justify-center">
                {Array.from({ length: genericMathQ.correct }).map((_, i) => (
                  <span key={i} className="text-4xl animate-bounce-gentle">⭐</span>
                ))}
              </div>
            )}

            <div className="flex gap-3 my-2">
              {genericMathQ.opts.map((opt: number) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleGenericGuess(opt)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-white flex items-center justify-center text-3xl font-black shadow-lg cursor-pointer transition-all ${
                    baWrongVal === opt ? 'bg-rose-400 text-white animate-shake' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400">Tap the correct answer!</span>
          </div>
        )}

        {/* VIEW 5: PHONICS TOPIC */}
        {!activeMathActivity && activeCategory === 'phonics' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-6xl mb-2 animate-bounce-gentle">🔤</span>
            <h2 className="text-xl font-black text-purple-950 font-sans">ABC & Phonics Adventures</h2>
            <p className="text-xs font-bold text-slate-500 mt-1 max-w-sm">
              Explore alphabet letters, phonetic sounds, and vocabulary words in Color Challenges and Adventure World!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
