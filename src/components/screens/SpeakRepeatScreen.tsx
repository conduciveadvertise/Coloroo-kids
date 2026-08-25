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
import { SPEAK_REPEAT_LESSONS } from '../../data/speakRepeatData';
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
  const activePhraseElementRef = useRef<HTMLSpanElement | null>(null);

  // Parse sentences cleanly as discrete practice items
  const segments: PhraseSegment[] = React.useMemo(() => {
    const list: PhraseSegment[] = [];
    currentLesson.paragraphs.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed) {
        const clean = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
        list.push({
          id: idx,
          text: trimmed,
          cleanText: clean,
          words: clean.split(/\s+/).filter(Boolean),
          paragraphIndex: idx
        });
      }
    });
    return list;
  }, [currentLesson]);

  useEffect(() => {
    currentPhraseIndexRef.current = activePhraseIndex;
    if (activePhraseElementRef.current) {
      activePhraseElementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activePhraseIndex]);

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

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    } catch {}

    setMode('listening_ai');
    setStatusMessage('Buddy is speaking... Listen carefully! 👂');
    setUserSpokenText('');
    setEvaluationFeedback(null);

    // Speak readable text without brackets for TTS
    const speechText = phrase.text
      .replace(/\[|\]/g, '')
      .replace('e.g.,', 'for example')
      .replace('e.g.', 'for example');

    try {
      await TextToSpeech.speak({
        text: speechText,
        lang: 'en-US',
        rate: speechRate,
        pitch: 1.05,
        volume: 1.0,
        category: 'ambient'
      });

      if (!isMountedRef.current) return;
      onBuddyFinishedSpeaking();
    } catch {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
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
      } catch {}
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
    }, 500);
  };

  const evaluateSpokenSpeech = (spoken: string) => {
    const current = segments[currentPhraseIndexRef.current];
    if (!current) return;

    const spokenClean = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

    if (spokenWords.length === 0) {
      setMode('retry');
      setEvaluationFeedback({
        isMatch: false,
        message: "Buddy didn't catch your voice. Tap Mic & try again! 🎤"
      });
      setStatusMessage('Tap Mic to try repeating again! 🔁');
      return;
    }

    const matchedCount = current.words.filter((targetWord) =>
      spokenWords.some((sw) => sw === targetWord || sw.includes(targetWord) || targetWord.includes(sw))
    ).length;

    const matchRatio = matchedCount / Math.max(1, current.words.length);

    if (matchRatio >= 0.35 || spokenWords.length >= 2) {
      setEvaluationFeedback({
        isMatch: true,
        message: 'Great job! You said it correctly! ⭐'
      });
      setStatusMessage('Awesome pronunciation! ⭐');
      sound.playFanfare();

      setTimeout(() => {
        advanceToNextPhrase();
      }, 1100);
    } else {
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

  const handleSwitchLesson = (newIdx: number) => {
    sound.playPop();
    try { TextToSpeech.stop(); } catch {}
    setLessonIndex(newIdx);
    setActivePhraseIndex(0);
    setMode('idle');
    setStatusMessage('Tap "Start Lesson" to begin! 🌟');
    setUserSpokenText('');
    setEvaluationFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7] text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <button
          onClick={() => {
            sound.playPop();
            try { TextToSpeech.stop(); } catch {}
            try { if (recognitionRef.current) recognitionRef.current.abort(); } catch {}
            onBack();
          }}
          className="p-1.5 rounded-2xl bg-white hover:bg-orange-50 active:scale-95 text-orange-950 flex items-center gap-1 border-2 border-orange-200 shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-black font-sans">Home</span>
        </button>

        {/* Lesson Switcher Dropdown / Pill */}
        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-2xl border-2 border-orange-200 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-orange-500" />
          <button
            onClick={() => handleSwitchLesson((lessonIndex + 1) % SPEAK_REPEAT_LESSONS.length)}
            className="text-xs font-black text-orange-950 hover:text-orange-700 flex items-center gap-1 cursor-pointer font-sans"
            title="Click to Switch Lesson"
          >
            <span>{currentLesson.title}</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-300">
              {currentLesson.badge} ({activePhraseIndex + 1}/{segments.length})
            </span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            const nextRate = speechRate === 0.85 ? 0.7 : speechRate === 0.7 ? 1.0 : 0.85;
            setSpeechRate(nextRate);
          }}
          className="px-2 py-1 rounded-xl bg-white hover:bg-orange-50 text-orange-800 border border-orange-200 shadow-sm text-[10px] font-black cursor-pointer flex items-center gap-1"
        >
          <Volume2 className="w-3 h-3 text-orange-600" />
          <span>{speechRate === 0.7 ? 'Slow 🐢' : speechRate === 0.85 ? 'Normal 🐇' : 'Fast ⚡'}</span>
        </button>
      </div>

      {/* Main Reading Card */}
      <div className="flex-1 bg-white rounded-[22px] p-2.5 sm:p-3.5 border-3 border-orange-200 shadow-md flex flex-col justify-between overflow-hidden relative min-h-0">
        {/* Lesson Title Header */}
        <div className="flex items-center justify-between border-b border-orange-100 pb-1 px-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xl filter drop-shadow">{currentLesson.emoji}</span>
            <h2 className="text-xs sm:text-sm font-black text-slate-800 font-sans">
              {currentLesson.title}
            </h2>
            <span className="text-[10px] text-orange-600 font-bold hidden sm:inline">
              — {currentLesson.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-0.5 rounded-lg border border-orange-200 font-bold text-[9px]">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>Interactive Practice</span>
          </div>
        </div>

        {/* Scrollable Structured Lesson Text List */}
        <div className="flex-1 flex flex-col justify-start space-y-1.5 sm:space-y-2 py-1 px-1 sm:px-2 overflow-y-auto no-scrollbar max-h-[175px]">
          {segments.map((seg, sIdx) => {
            const isActive = seg.id === activePhraseIndex;
            const isDone = seg.id < activePhraseIndex;

            return (
              <div
                key={sIdx}
                className="w-full flex items-center"
              >
                <motion.span
                  ref={isActive ? activePhraseElementRef : null}
                  animate={{
                    scale: isActive ? 1.01 : 1
                  }}
                  className={`w-full text-left px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold leading-snug font-sans transition-all duration-200 break-words ${
                    isActive
                      ? 'bg-amber-300 text-slate-950 font-black shadow-sm ring-2 ring-amber-400'
                      : isDone
                      ? 'text-emerald-800 font-extrabold bg-emerald-50/70'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {seg.text}
                </motion.span>
              </div>
            );
          })}
        </div>

        {/* Evaluation and Feedback Ribbon */}
        {evaluationFeedback && (
          <div
            className={`mx-1 rounded-xl px-2 py-1 text-[10px] font-bold flex items-center gap-1.5 shrink-0 border ${
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
            <span className="truncate">{evaluationFeedback.message}</span>
            {userSpokenText && (
              <span className="italic text-slate-600 truncate max-w-[140px]">("{userSpokenText}")</span>
            )}
          </div>
        )}

        {/* Completion Overlay */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-2 bottom-12 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-2xl p-2 shadow-xl flex items-center justify-between z-10 border-2 border-white"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-bounce" />
                <div>
                  <h4 className="text-xs font-black font-sans">Great Speaking! 🌟</h4>
                  <p className="text-[9px] font-bold text-white/90">
                    You practiced the entire lesson! +5 Stars
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRestartFullLesson}
                  className="px-2.5 py-1 rounded-xl bg-white text-orange-950 font-black text-[10px] shadow active:scale-95 cursor-pointer"
                >
                  Repeat 🔁
                </button>
                {lessonIndex < SPEAK_REPEAT_LESSONS.length - 1 && (
                  <button
                    onClick={() => handleSwitchLesson(lessonIndex + 1)}
                    className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 font-black text-[10px] shadow active:scale-95 cursor-pointer"
                  >
                    Next Lesson ➡️
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Action Bar */}
        <div className="pt-1.5 border-t border-orange-100 flex items-center justify-between px-1 shrink-0">
          <div className="flex flex-col text-left max-w-[45%]">
            <span className="text-[8px] font-black uppercase text-orange-600 tracking-wider">Status</span>
            <span className="text-[10px] font-black text-slate-800 truncate">{statusMessage}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Replay Current */}
            <button
              onClick={handleReplayCurrent}
              className="p-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-200 shadow-sm active:scale-95 cursor-pointer"
              title="Hear Phrase Again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mode Action Button */}
            {mode === 'idle' ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playPhraseAudio(activePhraseIndex)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs flex items-center gap-1 shadow-md border border-white cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Start Lesson 🗣️</span>
              </motion.button>
            ) : mode === 'listening_ai' ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1 border border-amber-300 animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Buddy Speaking...</span>
              </div>
            ) : mode === 'recording_user' ? (
              <motion.button
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={handleStopRecordingAndEvaluate}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center gap-1 shadow-md ring-2 ring-rose-300 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-bounce" />
                <span>Done (Check) 🎤</span>
              </motion.button>
            ) : mode === 'evaluating' ? (
              <div className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 font-black text-xs flex items-center gap-1 border border-purple-300 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Checking...</span>
              </div>
            ) : mode === 'retry' ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRecording}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1 shadow-md border border-white ring-2 ring-amber-200 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Try Again 🎤</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRecording}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md border border-white ring-2 ring-emerald-200 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Tap & Repeat 🎤</span>
              </motion.button>
            )}

            {/* Next / Skip */}
            <button
              onClick={() => {
                sound.playPop();
                advanceToNextPhrase();
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm active:scale-95 cursor-pointer"
              title="Next Phrase"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[9px] font-bold text-orange-900/70 px-1 shrink-0">
        <span>Listen → Tap Mic → Speak to advance</span>
        <span>Phonics & Reading Practice ✨</span>
      </div>
    </div>
  );
};
