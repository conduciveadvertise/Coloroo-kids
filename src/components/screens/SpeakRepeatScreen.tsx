import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SPEAK_REPEAT_LESSONS, SpeakLesson } from '../../data/speakRepeatData';
import { sound } from '../../services/soundEffects';

interface SpeakRepeatScreenProps {
  onBack: () => void;
  onAddStars?: (amount: number) => void;
}

interface WordToken {
  text: string;
  cleanWord: string;
  globalIndex: number;
  paragraphIndex: number;
}

export const SpeakRepeatScreen: React.FC<SpeakRepeatScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [currentLesson] = useState<SpeakLesson>(SPEAK_REPEAT_LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Child-friendly pace

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<any>(null);
  const totalWordsCountRef = useRef<number>(0);
  const wordsListRef = useRef<WordToken[]>([]);

  // Tokenize lesson into words
  const parsedParagraphs = React.useMemo(() => {
    let count = 0;
    const allTokens: WordToken[] = [];
    const tokenized = currentLesson.paragraphs.map((para, pIdx) => {
      const rawWords = para.split(/(\s+)/);
      return rawWords.map((part) => {
        const isWhitespace = /^\s+$/.test(part) || part === '';
        if (isWhitespace) {
          return { text: part, isWord: false, globalIndex: -1, paragraphIndex: pIdx };
        }
        const gIdx = count++;
        const token: WordToken = {
          text: part,
          cleanWord: part.replace(/[^a-zA-Z0-9]/g, ''),
          globalIndex: gIdx,
          paragraphIndex: pIdx
        };
        allTokens.push(token);
        return { text: part, isWord: true, globalIndex: gIdx, paragraphIndex: pIdx };
      });
    });

    totalWordsCountRef.current = count;
    wordsListRef.current = allTokens;
    return tokenized;
  }, [currentLesson]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const stopSpeech = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    try {
      await TextToSpeech.stop();
    } catch {}
  };

  const handlePlay = () => {
    sound.playPop();
    if (isPaused) {
      resumeSpeech();
    } else {
      startSpeechFromWord(0);
    }
  };

  const startSpeechFromWord = async (startIndex: number = 0) => {
    await stopSpeech();
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentWordIndex(startIndex);

    const fullText = currentLesson.paragraphs.join(' ');

    // Browser SpeechSynthesis with Boundary Event support
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = speechRate;
      utterance.pitch = 1.1; // Friendly tone for kids
      utterance.lang = 'en-US';

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          // Calculate active word from char position
          let cumulativeLength = 0;
          for (let i = 0; i < wordsListRef.current.length; i++) {
            const word = wordsListRef.current[i];
            const wordLen = word.text.length + 1;
            if (charIndex >= cumulativeLength && charIndex < cumulativeLength + wordLen) {
              setCurrentWordIndex(i);
              break;
            }
            cumulativeLength += wordLen;
          }
        }
      };

      utterance.onend = () => {
        finishSpeech();
      };

      utterance.onerror = () => {
        fallbackTimerReading(startIndex);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer for environments without native boundary events
      fallbackTimerReading(startIndex);
    }
  };

  const fallbackTimerReading = async (startIndex: number) => {
    const fullText = currentLesson.paragraphs.join(' ');
    try {
      await TextToSpeech.speak({
        text: fullText,
        lang: 'en-US',
        rate: speechRate,
        pitch: 1.1
      });
    } catch {}

    let current = startIndex;
    // Estimated average word duration based on speechRate (~350ms per word)
    const wordIntervalMs = Math.round(380 / speechRate);

    timerRef.current = setInterval(() => {
      if (current < totalWordsCountRef.current) {
        setCurrentWordIndex(current);
        current++;
      } else {
        finishSpeech();
      }
    }, wordIntervalMs);
  };

  const handlePause = async () => {
    sound.playPop();
    setIsPaused(true);
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    try {
      await TextToSpeech.stop();
    } catch {}
  };

  const resumeSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      startSpeechFromWord(currentWordIndex >= 0 ? currentWordIndex : 0);
    }
  };

  const handleReplay = () => {
    sound.playPop();
    startSpeechFromWord(0);
  };

  const finishSpeech = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setIsCompleted(true);
    sound.playFanfare();
    if (onAddStars) {
      onAddStars(5);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 select-none overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7] text-slate-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playPop();
            stopSpeech();
            onBack();
          }}
          className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-orange-50 active:scale-95 text-orange-950 flex items-center gap-1.5 border-2 border-orange-200 shadow-sm cursor-pointer transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-orange-600" />
          <span className="text-xs sm:text-sm font-black font-sans">Home</span>
        </button>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border-2 border-orange-200 shadow-sm">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <h1 className="text-xs sm:text-sm font-black text-orange-950 font-sans tracking-wide">
            Speak & Repeat 🗣️
          </h1>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
            {currentLesson.badge}
          </span>
        </div>

        {/* Speed Adjustment Control */}
        <button
          onClick={() => {
            sound.playPop();
            const nextRate = speechRate === 0.85 ? 0.7 : speechRate === 0.7 ? 1.0 : 0.85;
            setSpeechRate(nextRate);
          }}
          className="px-2.5 py-1.5 rounded-2xl bg-white hover:bg-orange-50 text-orange-800 border-2 border-orange-200 shadow-sm text-[11px] font-black cursor-pointer flex items-center gap-1"
          title="Speech Speed"
        >
          <Volume2 className="w-3.5 h-3.5 text-orange-600" />
          <span>{speechRate === 0.7 ? 'Slow 🐢' : speechRate === 0.85 ? 'Normal 🐇' : 'Fast ⚡'}</span>
        </button>
      </div>

      {/* Main Reading Card Area */}
      <div className="flex-1 my-2 sm:my-3 bg-white rounded-[28px] p-4 sm:p-6 border-4 border-orange-200 shadow-xl flex flex-col justify-between overflow-hidden relative">
        {/* Lesson Header */}
        <div className="flex items-center justify-between border-b-2 border-orange-100 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl sm:text-4xl filter drop-shadow">
              {currentLesson.emoji}
            </span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 font-sans leading-tight">
                {currentLesson.title}
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-orange-600">
                Listen carefully and speak along!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-orange-50 text-orange-800 px-3 py-1 rounded-xl border border-orange-200 font-black text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Karaoke Reading</span>
          </div>
        </div>

        {/* Paragraphs with Dynamic Word-by-Word Highlighting */}
        <div className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4 py-3 overflow-y-auto no-scrollbar">
          {parsedParagraphs.map((paraTokens, pIdx) => (
            <p
              key={pIdx}
              className="text-base sm:text-xl md:text-2xl font-black text-slate-700 leading-relaxed sm:leading-loose tracking-wide font-sans flex flex-wrap items-center gap-x-1 sm:gap-x-1.5"
            >
              {paraTokens.map((item, wIdx) => {
                if (!item.isWord) {
                  return <span key={wIdx}>{item.text}</span>;
                }

                const isActive = isPlaying && currentWordIndex === item.globalIndex;
                const isPast = isPlaying && currentWordIndex > item.globalIndex;

                return (
                  <motion.span
                    key={wIdx}
                    animate={{
                      scale: isActive ? 1.18 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`inline-block px-1.5 py-0.5 rounded-xl transition-colors duration-150 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 font-black scale-110'
                        : isPast
                        ? 'text-orange-950 font-extrabold'
                        : 'text-slate-700 font-bold'
                    }`}
                  >
                    {item.text}
                  </motion.span>
                );
              })}
            </p>
          ))}
        </div>

        {/* Completion Celebration Overlay */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-4 bottom-16 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-2xl p-2.5 shadow-lg flex items-center justify-between z-10 border-2 border-white"
            >
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-200 fill-yellow-200 animate-bounce" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black font-sans">Awesome Job! 🌟</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-white/90">
                    You practiced speaking like a champion! +5 Stars
                  </p>
                </div>
              </div>
              <button
                onClick={handleReplay}
                className="px-3 py-1 rounded-xl bg-white text-orange-950 font-black text-xs shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Read Again 🔁
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls Bar */}
        <div className="pt-2 border-t-2 border-orange-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500">
              {isPlaying ? 'Speaking out loud...' : isPaused ? 'Paused' : 'Ready to start'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Replay Button */}
            <button
              onClick={handleReplay}
              className="p-2 sm:p-2.5 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-900 border-2 border-orange-200 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-xs font-black"
              title="Replay Lesson"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            {/* Play / Pause Toggle */}
            {!isPlaying ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="px-5 sm:px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg border-2 border-white ring-4 ring-orange-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isPaused ? 'Resume Reading' : 'Listen & Repeat 🗣️'}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="px-5 sm:px-7 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg border-2 border-white ring-4 ring-rose-200 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-bold text-orange-900/70 px-2 shrink-0">
        <span>Coloroo Kids • Phonics & Speech Practice</span>
        <span>Tap Listen & Repeat to hear each word ✨</span>
      </div>
    </div>
  );
};
