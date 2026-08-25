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
  CheckCircle2,
  HelpCircle
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
  words: string[];
  paragraphIndex: number;
}

export const SpeakRepeatScreen: React.FC<SpeakRepeatScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [lessonIndex, setLessonIndex] = useState<number>(0);
  const currentLesson = SPEAK_REPEAT_LESSONS[lessonIndex] || SPEAK_REPEAT_LESSONS[0];
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const [mode, setMode] = useState<'idle' | 'listening_ai' | 'waiting_user' | 'recording_user' | 'evaluating' | 'retry'>('idle');
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [isCompleted, setIsCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap "Start Lesson" to begin! 🌟');
  const [evaluationFeedback, setEvaluationFeedback] = useState<{ isMatch: boolean; message: string } | null>(null);

  const recognitionRef = useRef<any>(null);
  const isMountedRef = useRef<boolean>(true);
  const currentPhraseIndexRef = useRef<number>(0);

  // Split lesson into distinct practice phrases
  const segments: PhraseSegment[] = React.useMemo(() => {
    const list: PhraseSegment[] = [];
    let idx = 0;
    currentLesson.paragraphs.forEach((para, pIdx) => {
      const clauses = para.match(/[^.!?]+[.!?]?/g) || [para];
      clauses.forEach((cl) => {
        const trimmed = cl.trim();
        if (trimmed) {
          const clean = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, '');
          list.push({
            id: idx++,
            text: trimmed,
            cleanText: clean,
            words: clean.split(/\s+/).filter(Boolean),
            paragraphIndex: pIdx
          });
        }
      });
    });
    return list;
  }, [currentLesson]);

  // Keep ref synchronized with active index
  useEffect(() => {
    currentPhraseIndexRef.current = activePhraseIndex;
  }, [activePhraseIndex]);

  // Setup Speech Recognition once on mount without cleanup race conditions
  useEffect(() => {
    isMountedRef.current = true;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          const currentText = (finalTranscript || interim).trim();
          if (currentText) {
            setUserSpokenText(currentText);
          }
        };

        recognition.onerror = (e: any) => {
          console.log('[SpeakRepeat SpeechRecognition error]', e);
        };

        recognition.onend = () => {
          // Finished listening
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition init error:', err);
      }
    }

    return () => {
      isMountedRef.current = false;
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch {}
      try {
        TextToSpeech.stop();
      } catch {}
    };
  }, []);

  const playPhraseAudio = async (phraseIndex: number) => {
    const phrase = segments[phraseIndex];
    if (!phrase) return;

    // Stop any ongoing mic recognition
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    } catch {}

    setMode('listening_ai');
    setStatusMessage('Buddy is speaking... Listen carefully! 👂');
    setUserSpokenText('');
    setEvaluationFeedback(null);

    try {
      // Native Capacitor TTS returns a promise that resolves when speech completes
      await TextToSpeech.speak({
        text: phrase.text,
        lang: 'en-US',
        rate: speechRate,
        pitch: 1.05,
        volume: 1.0,
        category: 'ambient'
      });

      if (!isMountedRef.current) return;
      onBuddyFinishedSpeaking();
    } catch {
      // Browser fallback if native TTS plugin is not active in browser preview
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase.text);
        utterance.rate = speechRate;
        utterance.pitch = 1.05;
        utterance.lang = 'en-US';

        utterance.onend = () => {
          if (isMountedRef.current) onBuddyFinishedSpeaking();
        };
        utterance.onerror = () => {
          if (isMountedRef.current) onBuddyFinishedSpeaking();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        if (isMountedRef.current) onBuddyFinishedSpeaking();
      }
    }
  };

  const onBuddyFinishedSpeaking = () => {
    setMode('waiting_user');
    setStatusMessage('Now your turn! Tap the Mic & Repeat aloud 🎤');
  };

  const handleStartRecording = () => {
    sound.playPop();
    setUserSpokenText('');
    setEvaluationFeedback(null);
    setMode('recording_user');
    setStatusMessage('Listening to your voice... Speak now! 🌟');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition already active
      }
    }
  };

  const handleStopRecordingAndEvaluate = () => {
    sound.playPop();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setMode('evaluating');
    setStatusMessage('Checking your words... ✨');

    setTimeout(() => {
      evaluateSpokenSpeech(userSpokenText);
    }, 600);
  };

  const evaluateSpokenSpeech = (spoken: string) => {
    const current = segments[currentPhraseIndexRef.current];
    if (!current) return;

    const spokenClean = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

    if (spokenWords.length === 0) {
      setMode('retry');
      setEvaluationFeedback({
        isMatch: false,
        message: "Buddy didn't catch your voice. Tap the Mic and try again! 🎤"
      });
      setStatusMessage('Tap Mic to try repeating again! 🔁');
      return;
    }

    // Check how many required words the child matched
    const matchedCount = current.words.filter((targetWord) =>
      spokenWords.some((sw) => sw === targetWord || sw.includes(targetWord) || targetWord.includes(sw))
    ).length;

    const matchRatio = matchedCount / Math.max(1, current.words.length);

    if (matchRatio >= 0.45 || spokenWords.length >= current.words.length) {
      // Success
      setEvaluationFeedback({
        isMatch: true,
        message: 'Great job! You said it correctly! ⭐'
      });
      setStatusMessage('Awesome pronunciation! ⭐');
      sound.playFanfare();

      setTimeout(() => {
        advanceToNextPhrase();
      }, 1200);
    } else {
      // Retry
      setMode('retry');
      setEvaluationFeedback({
        isMatch: false,
        message: 'Close! Listen once more and repeat! 🌟'
      });
      setStatusMessage('Listen to Buddy again, then repeat! 🔁');
    }
  };

  const advanceToNextPhrase = () => {
    if (activePhraseIndex < segments.length - 1) {
      const nextIdx = activePhraseIndex + 1;
      setActivePhraseIndex(nextIdx);
      playPhraseAudio(nextIdx);
    } else {
      setMode('idle');
      setIsCompleted(true);
      setStatusMessage('Lesson complete! Fantastic speaking! 🎉');
      sound.playFanfare();
      if (onAddStars) {
        onAddStars(5);
      }
      if (lessonIndex < SPEAK_REPEAT_LESSONS.length - 1) {
        setStatusMessage('Lesson complete! Tap Next Lesson! 🎉');
      }
    }
  };

  const handleReplayCurrent = () => {
    sound.playPop();
    playPhraseAudio(activePhraseIndex);
  };

  const handleRestartFullLesson = () => {
    sound.playPop();
    setIsCompleted(false);
    setActivePhraseIndex(0);
    playPhraseAudio(0);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7] text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <button
          onClick={() => {
            sound.playPop();
            try { TextToSpeech.stop(); } catch {}
            try { if (recognitionRef.current) recognitionRef.current.abort(); } catch {}
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
          <button
            onClick={() => {
              sound.playPop();
              try { TextToSpeech.stop(); } catch {}
              const nextL = (lessonIndex + 1) % SPEAK_REPEAT_LESSONS.length;
              setLessonIndex(nextL);
              setActivePhraseIndex(0);
              setMode('idle');
              setStatusMessage('Tap "Start Lesson" to begin! 🌟');
              setUserSpokenText('');
              setEvaluationFeedback(null);
            }}
            className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 ml-1 cursor-pointer flex items-center gap-1 shadow-xs"
            title="Switch Lesson"
          >
            <span>{currentLesson.badge}: {currentLesson.title}</span>
            <span className="text-[8px] bg-amber-300 text-amber-950 px-1 rounded-sm">({activePhraseIndex + 1}/{segments.length})</span>
          </button>
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
      <div className="flex-1 bg-white rounded-[24px] p-3 sm:p-5 border-3 border-orange-200 shadow-lg flex flex-col justify-between overflow-hidden relative min-h-0">
        {/* Lesson Sub-bar */}
        <div className="flex items-center justify-between border-b border-orange-100 pb-1.5 px-2 shrink-0">
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

        {/* Text Container with Safe Left/Right Padding */}
        <div className="flex-1 flex flex-col justify-center space-y-2.5 sm:space-y-3.5 py-2 px-3 sm:px-6 overflow-y-auto no-scrollbar">
          {currentLesson.paragraphs.map((para, pIdx) => {
            const paraSegments = segments.filter((s) => s.paragraphIndex === pIdx);
            return (
              <p
                key={pIdx}
                className="text-xs sm:text-sm md:text-base font-bold text-slate-700 leading-relaxed font-sans flex flex-wrap items-center gap-x-1.5 gap-y-1 pl-1"
              >
                {paraSegments.map((seg) => {
                  const isActive = seg.id === activePhraseIndex;
                  const isDone = seg.id < activePhraseIndex;

                  return (
                    <motion.span
                      key={seg.id}
                      animate={{
                        scale: isActive ? 1.02 : 1
                      }}
                      className={`inline-block px-2.5 py-1 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-300 text-slate-950 font-black shadow-sm ring-2 ring-amber-400'
                          : isDone
                          ? 'text-emerald-700 font-extrabold bg-emerald-50/70'
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

        {/* Evaluation and Feedback Ribbon */}
        {evaluationFeedback && (
          <div
            className={`mx-2 rounded-xl px-2.5 py-1 text-[11px] font-bold flex items-center gap-1.5 shrink-0 my-0.5 border ${
              evaluationFeedback.isMatch
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {evaluationFeedback.isMatch ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span>{evaluationFeedback.message}</span>
            {userSpokenText && (
              <span className="italic text-slate-600 ml-1">("{userSpokenText}")</span>
            )}
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

        {/* Action Controls Bar */}
        <div className="pt-2 border-t border-orange-100 flex items-center justify-between px-1 shrink-0">
          <div className="flex flex-col text-left max-w-[48%]">
            <span className="text-[9px] font-black uppercase text-orange-600 tracking-wider">Status</span>
            <span className="text-[11px] font-black text-slate-800 truncate">{statusMessage}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Current Phrase */}
            <button
              onClick={handleReplayCurrent}
              className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-200 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Hear Phrase Again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Interactive State Buttons */}
            {mode === 'idle' ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playPhraseAudio(activePhraseIndex)}
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
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={handleStopRecordingAndEvaluate}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md ring-2 ring-rose-300 cursor-pointer"
              >
                <Mic className="w-4 h-4 animate-bounce" />
                <span>Done Speaking (Check) 🎤</span>
              </motion.button>
            ) : mode === 'evaluating' ? (
              <div className="px-4 py-2 rounded-xl bg-purple-100 text-purple-900 font-black text-xs flex items-center gap-1.5 border border-purple-300 animate-pulse">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Evaluating...</span>
              </div>
            ) : mode === 'retry' ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRecording}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md border border-white ring-2 ring-amber-200 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Try Again 🎤</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRecording}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md border border-white ring-2 ring-emerald-200 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Tap & Repeat 🎤</span>
              </motion.button>
            )}

            {/* Skip / Next */}
            <button
              onClick={() => {
                sound.playPop();
                advanceToNextPhrase();
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
        <span>Listen → Tap Mic → Speak to advance</span>
        <span>Phonics & Reading Practice ✨</span>
      </div>
    </div>
  );
};
