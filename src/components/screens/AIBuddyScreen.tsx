import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Mic,
  MicOff,
  Bot,
  RotateCcw
} from 'lucide-react';
import {
  BuddyLiveSession,
  LiveConnectionState,
  LiveMessageTranscript
} from '../../services/geminiLiveService';
import { sound } from '../../services/soundEffects';

interface AIBuddyScreenProps {
  onBack: () => void;
}

export const AIBuddyScreen: React.FC<AIBuddyScreenProps> = ({ onBack }) => {
  const [state, setState] = useState<LiveConnectionState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Buddy is getting ready...');
  const [transcripts, setTranscripts] = useState<LiveMessageTranscript[]>([
    { sender: 'buddy', text: 'Namaste! Main hoon aapka Coloroo AI Buddy! Kuch bhi poochhiye! 🌟' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const sessionRef = useRef<BuddyLiveSession | null>(null);

  useEffect(() => {
    const session = new BuddyLiveSession();
    sessionRef.current = session;

    session.onStateChange = (st, msg) => {
      setState(st);
      if (msg) setStatusMessage(msg);
      if (st === 'ready' || st === 'error' || st === 'idle' || st === 'speaking') {
        setIsRecording(false);
      }
    };

    session.onTranscript = (t) => {
      setTranscripts((prev) => [...prev.slice(-4), t]);
    };

    session.onError = (err) => {
      setStatusMessage(err);
      setIsRecording(false);
    };

    session.connect();

    return () => {
      session.disconnect();
      sessionRef.current = null;
    };
  }, []);

  const handleToggleTalk = async () => {
    if (!sessionRef.current) return;
    sound.playPop();

    if (!isRecording) {
      setIsRecording(true);
      await sessionRef.current.startTalking();
    } else {
      setIsRecording(false);
      sessionRef.current.stopTalking();
    }
  };

  const handleEndChat = () => {
    sound.playPop();
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    onBack();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#EDE9FE] to-[#F5F3FF] text-slate-800">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 mb-1">
        <button
          onClick={handleEndChat}
          className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-black">Exit Chat</span>
        </button>

        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-2xl border border-purple-100 shadow-sm">
          <Bot className="w-4 h-4 text-purple-600 animate-bounce-gentle" />
          <h1 className="text-xs sm:text-sm font-black text-purple-950 font-sans">
            Coloroo AI Buddy 🤖
          </h1>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full ml-1">
            Live AI
          </span>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            if (sessionRef.current) {
              sessionRef.current.disconnect();
              sessionRef.current.connect();
            }
          }}
          className="p-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-600 border border-purple-100 shadow-sm cursor-pointer"
          title="Reconnect"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Conversation Landscape Arena */}
      <div className="flex-1 bg-white rounded-[28px] p-3 border-2 border-purple-100 shadow-xl flex flex-row gap-4 items-center justify-between min-h-0 relative overflow-hidden">
        {/* Left Side: Animated Mascot Visualizer */}
        <div className="w-1/3 flex flex-col items-center justify-center text-center p-2">
          <div className="relative">
            <motion.div
              animate={{
                scale: state === 'speaking' ? [1, 1.08, 1] : state === 'listening' ? [1, 1.04, 1] : 1
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 ${
                state === 'speaking'
                  ? 'bg-gradient-to-tr from-purple-500 to-pink-500 border-amber-300 ring-4 ring-pink-200'
                  : state === 'listening'
                  ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 border-white ring-4 ring-emerald-200'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600 border-white'
              }`}
            >
              🤖
            </motion.div>
            {state === 'speaking' && (
              <span className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow">
                Speaking...
              </span>
            )}
          </div>

          <h2 className="text-base font-black text-purple-950 font-sans mt-2">Coloroo Buddy</h2>
          <span className="text-[10px] text-purple-600 font-bold max-w-[140px] leading-tight">
            Friendly Educational AI Companion
          </span>
        </div>

        {/* Center & Right: Live Dialogue Cards & Push-To-Talk Button */}
        <div className="flex-1 flex flex-col justify-between h-full py-1">
          {/* Transcript Dialogue Box */}
          <div className="flex-1 bg-purple-50/70 border-2 border-purple-100 rounded-2xl p-2.5 overflow-y-auto no-scrollbar space-y-2 max-h-[140px]">
            {transcripts.map((t, idx) => (
              <div
                key={idx}
                className={`flex gap-2 items-start ${t.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {t.sender === 'buddy' && (
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shrink-0">
                    🤖
                  </span>
                )}
                <div
                  className={`p-2 rounded-2xl max-w-[80%] text-xs font-bold ${
                    t.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-purple-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {t.text}
                </div>
                {t.sender === 'user' && (
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-xs shrink-0">
                    👦
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Mic Controller */}
          <div className="flex items-center justify-between pt-2 px-2">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider block">Status</span>
              <span className="text-xs font-black text-purple-950 block">{statusMessage}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleTalk}
              className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg border-2 border-white cursor-pointer transition-all ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-200'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isRecording ? 'Done Speaking (Send)' : 'Tap to Talk 🎤'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Footer Safety Disclaimer */}
      <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-2 shrink-0 pt-1">
        <span>Kid-Safe AI Sandbox • Private Ephemeral Session</span>
        <span>Speaks Hindi, English & Hinglish ✨</span>
      </div>
    </div>
  );
};
