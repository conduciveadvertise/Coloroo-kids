import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SPEAK_REPEAT_LESSONS, SpeakLesson } from '../../data/speakRepeatData';
import { sound } from '../../services/soundEffects';

interface SpeakRepeatScreenProps {
  onBack: () => void;
  onAddStars?: (amount: number) => void;
}

interface PhraseSegment {
  id: number;
  text: string;
  cleanText: string;
  paragraphIndex: number;
}

export const SpeakRepeatScreen: React.FC<SpeakRepeatScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [currentLesson] = useState<SpeakLesson>(SPEAK_REPEAT_LESSONS[0]);
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const [mode, setMode] = useState<'idle' | 'listening_ai' | 'waiting_user' | 'recording_user' | 'success'>('idle');
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [isCompleted, setIsCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap "Listen & Repeat" to start!');
  const [hasMicSupport, setHasMicSupport] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  // Divide paragraph text into child-friendly phrases/clauses
  const segments: PhraseSegment[] = React.useMemo(() => {
    const list: PhraseSegment[] = [];
    let idx = 0;
    currentLesson.paragraphs.forEach((para, pIdx) => {
      // Split by sentences and commas to make digestible practice phrases
      const clauses = para.match(/[^.,!?]+[.,!?]?/g) || [para];
      clauses.forEach((cl) => {
        const trimmed = cl.trim();
        if (trimmed) {
          list.push({
            id: idx++,
            text: trimmed,
            cleanText: trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, ''),
            paragraphIndex: pIdx
          });
        }
      });
    });
    return list;
  }, [currentLesson]);

  // Initialize Web Speech Recognition with graceful fallback
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setUserSpokenText(transcript);

        // Check if child spoke the current phrase reasonably correctly
        validateSpokenPhrase(transcript);
      };

      recognition.onerror = (e: any) => {
        console.log('[SpeakRepeat SpeechRecognition error]', e);
        if (mode === 'recording_user') {
          setMode('waiting_user');
          setStatusMessage('Buddy didn\'t hear clearly. Try again or tap Skip ➡️');
        }
      };

      recognition.onend = () => {
        if (mode === 'recording_user') {
          setMode('waiting_user');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setHasMicSupport(false);
    }

    return () => {
      stopAllAudio();
    };
  }, [activePhraseIndex, mode]);

  const stopAllAudio = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    } catch {}
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    try {
      await TextToSpeech.stop();
    } catch {}
  };

  const playCurrentPhrase = async (phraseIndex: number) => {
    const phrase = segments[phraseIndex];
    if (!phrase) return;

    await stopAllAudio();
    setMode('listening_ai');
    setStatusMessage('Listen to Buddy speak... 👂');
    setUserSpokenText('');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.text);
      utterance.rate = speechRate;
      utterance.pitch = 1.1;
      utterance.lang = 'en-US';

      utterance.onend = () => {
        promptUserToSpeak();
      };
      utterance.onerror = () => {
        promptUserToSpeak();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      try {
        await TextToSpeech.speak({
          text: phrase.text,
          lang: 'en-US',
          rate: speechRate,
          pitch: 1.1
        });
      } catch {}
      promptUserToSpeak();
    }
  };

  const promptUserToSpeak = () => {
    setMode('waiting_user');
    setStatusMessage('Now your turn! Tap the Mic & Repeat aloud 🎤');
  };

  const handleStartListeningUser = () => {
    sound.playPop();
    setUserSpokenText('');

    if (recognitionRef.current) {
      try {
        setMode('recording_user');
        setStatusMessage('Listening to your voice... Speak clearly! 🌟');
        recognitionRef.current.start();
      } catch {
        // Recognition might already be running
        setMode('recording_user');
      }
    } else {
      // Graceful fallback when SpeechRecognition is not available
      setUserSpokenText('Great repeating!');
      handleAdvancePhrase();
    }
  };

  const validateSpokenPhrase = (spoken: string) => {
    const current = segments[activePhraseIndex];
    if (!current) return;

    const targetWords = current.cleanText.split(/\s+/).filter(Boolean);
    const spokenWords = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    // Fuzzy match: if child repeats at least 50% of the target words in the phrase
    const matchedCount = targetWords.filter((tw) => spokenWords.some((sw) => sw.includes(tw) || tw.includes(sw))).length;
    const matchRatio = matchedCount / Math.max(1, targetWords.length);

    if (matchRatio >= 0.5 || spokenWords.length >= targetWords.length) {
      setMode('success');
      setStatusMessage('Excellent! Moving to the next phrase! ⭐');
      sound.playFanfare();

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      setTimeout(() => {
        handleAdvancePhrase();
      }, 1000);
    }
  };

  const handleAdvancePhrase = () => {
    if (activePhraseIndex < segments.length - 1) {
      const nextIdx = activePhraseIndex + 1;
      setActivePhraseIndex(nextIdx);
      playCurrentPhrase(nextIdx);
    } else {
      // Completed full lesson
      setMode('idle');
      setIsCompleted(true);
      setStatusMessage('Lesson complete! Fantastic speaking! 🎉');
      sound.playFanfare();
      if (onAddStars) {
        onAddStars(5);
      }
    }
  };

  const handleReplayCurrent = () => {
    sound.playPop();
    playCurrentPhrase(activePhraseIndex);
  };

  const handleRestartFullLesson = () => {
    sound.playPop();
    setIsCompleted(false);
    setActivePhraseIndex(0);
    playCurrentPhrase(0);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7] text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <button
          onClick={() => {
            sound.playPop();
            stopAllAudio();
            onBack();
          }}
          className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-orange-50 active:scale-95 text-orange-950 flex items-center gap-1.5 border-2 border-orange-200 shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-black font-sans">Home</span>
        </button>

        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-2xl border-2 border-orange-200 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-orange-500" />
          <h1 className="text-xs sm:text-sm font-black text-orange-950 font-sans">
            Speak & Repeat 🗣️
          </h1>
          <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300 ml-1">
            Phrase {activePhraseIndex + 1}/{segments.length}
          </span>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            const nextRate = speechRate === 0.85 ? 0.7 : speechRate === 0.7 ? 1.0 : 0.85;
            setSpeechRate(nextRate);
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-orange-50 text-orange-800 border border-orange-200 shadow-sm text-[10px] font-black cursor-pointer flex items-center gap-1"
        >
          <Volume2 className="w-3 h-3 text-orange-600" />
          <span>{speechRate === 0.7 ? 'Slow 🐢' : speechRate === 0.85 ? 'Normal 🐇' : 'Fast ⚡'}</span>
        </button>
      </div>

      {/* Main Reading Card */}
      <div className="flex-1 bg-white rounded-[24px] p-3 sm:p-4 border-3 border-orange-200 shadow-lg flex flex-col justify-between overflow-hidden relative min-h-0">
        {/* Lesson Header Sub-bar */}
        <div className="flex items-center justify-between border-b border-orange-100 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl filter drop-shadow">{currentLesson.emoji}</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-800 font-sans leading-tight">
                {currentLesson.title}
              </h2>
              <p className="text-[10px] font-bold text-orange-600">
                Listen, then tap the mic to repeat!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-0.5 rounded-lg border border-orange-200 font-bold text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>Interactive Practice</span>
          </div>
        </div>

        {/* Compact Paragraphs with Phrase-Level Highlighting */}
        <div className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-2.5 py-2 overflow-y-auto no-scrollbar">
          {currentLesson.paragraphs.map((para, pIdx) => {
            const paraSegments = segments.filter((s) => s.paragraphIndex === pIdx);
            return (
              <p
                key={pIdx}
                className="text-xs sm:text-sm md:text-base font-bold text-slate-700 leading-relaxed font-sans flex flex-wrap items-center gap-x-1"
              >
                {paraSegments.map((seg) => {
                  const isActive = seg.id === activePhraseIndex;
                  const isDone = seg.id < activePhraseIndex;

                  return (
                    <motion.span
                      key={seg.id}
                      animate={{
                        scale: isActive ? 1.04 : 1
                      }}
                      className={`inline-block px-1.5 py-0.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-300 text-slate-950 font-black shadow-sm ring-2 ring-amber-400'
                          : isDone
                          ? 'text-emerald-700 font-extrabold bg-emerald-50/60'
                          : 'text-slate-600'
                      }`}
                    >
                      {seg.text}
                    </motion.span>
                  );
                })}
              </p>
            );
          })}
        </div>

        {/* Live Spoken Feedback Ribbon */}
        {userSpokenText && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-purple-900 flex items-center gap-1.5 shrink-0 my-1">
            <span>You said:</span>
            <span className="italic text-purple-700">"{userSpokenText}"</span>
          </div>
        )}

        {/* Completion Celebration Overlay */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-3 bottom-14 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-2xl p-2.5 shadow-xl flex items-center justify-between z-10 border-2 border-white"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-bounce" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black font-sans">Great Speaking! 🌟</h4>
                  <p className="text-[10px] font-bold text-white/90">
                    You practiced the entire lesson! +5 Stars
                  </p>
                </div>
              </div>
              <button
                onClick={handleRestartFullLesson}
                className="px-3 py-1 rounded-xl bg-white text-orange-950 font-black text-xs shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Repeat Lesson 🔁
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Action Controls */}
        <div className="pt-2 border-t border-orange-100 flex items-center justify-between shrink-0">
          <div className="flex flex-col text-left max-w-[50%]">
            <span className="text-[9px] font-black uppercase text-orange-600 tracking-wider">Step</span>
            <span className="text-[11px] font-black text-slate-800 truncate">{statusMessage}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Phrase Button */}
            <button
              onClick={handleReplayCurrent}
              className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-200 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Hear Phrase Again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Listen / Record Toggle Button */}
            {mode === 'idle' ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playCurrentPhrase(activePhraseIndex)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md border border-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Start Lesson 🗣️</span>
              </motion.button>
            ) : mode === 'listening_ai' ? (
              <div className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1.5 border border-amber-300 animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span>Buddy Speaking...</span>
              </div>
            ) : mode === 'recording_user' ? (
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={() => {
                  if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch {}
                  }
                  setMode('waiting_user');
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md ring-2 ring-rose-300 cursor-pointer"
              >
                <Mic className="w-4 h-4 animate-bounce" />
                <span>Listening... (Tap to finish)</span>
              </motion.button>
            ) : mode === 'success' ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>Well Done!</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartListeningUser}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md border border-white ring-2 ring-emerald-200 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Tap & Repeat 🎤</span>
              </motion.button>
            )}

            {/* Skip / Next Phrase Button */}
            <button
              onClick={() => {
                sound.playPop();
                handleAdvancePhrase();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Skip to next phrase"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[9px] font-bold text-orange-900/70 px-2 shrink-0">
        <span>Listen $ightarrow$ Tap Mic $ightarrow$ Speak to advance</span>
        <span>Phonics & Reading Practice ✨</span>
      </div>
    </div>
  );
};
