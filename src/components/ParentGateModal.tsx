import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Delete } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requiredPin?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [challenge, setChallenge] = useState<{ num1: number; num2: number; ans: number }>({ num1: 9, num2: 3, ans: 12 });
  const [input, setInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 8) + 3;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setChallenge({ num1: n1, num2: n2, ans: n1 + n2 });
    setInput('');
    setHasError(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateChallenge();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (val: string) => {
    sound.playPop();
    setHasError(false);

    if (val === 'C') {
      setInput('');
      return;
    }

    if (val === 'DEL') {
      setInput(prev => prev.slice(0, -1));
      return;
    }

    const nextInput = input + val;
    setInput(nextInput);

    const target = challenge.ans.toString();
    if (nextInput.length >= target.length) {
      if (parseInt(nextInput, 10) === challenge.ans) {
        sound.playCorrect();
        onSuccess();
      } else {
        setHasError(true);
        setTimeout(() => {
          setInput('');
          generateChallenge();
        }, 500);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 select-none overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[26px] p-2.5 sm:p-3.5 w-full max-w-md shadow-2xl border-4 border-purple-200 border-b-[6px] border-b-purple-500 relative flex flex-row items-center gap-3 max-h-[92vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Question & Status */}
        <div className="flex-1 flex flex-col justify-between items-center text-center py-0.5">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-0.5 border border-purple-200 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka'] leading-tight">
              Grown-Ups Only
            </h3>
            <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium max-w-[130px] leading-tight">
              Solve to enter Parent Zone
            </p>
          </div>

          <div className={`w-full my-1 p-1.5 rounded-xl border-2 transition-all ${
            hasError
              ? 'bg-rose-50 border-rose-400 text-rose-600'
              : 'bg-purple-50/70 border-purple-200 text-purple-950'
          }`}>
            <span className="text-[7px] font-black uppercase text-purple-600 tracking-wider block">
              Parent Verification
            </span>
            <div className="text-lg sm:text-xl font-black font-['Fredoka'] tracking-wider">
              {challenge.num1} + {challenge.num2} = <span className="text-purple-600 underline underline-offset-2">{input || '?'}</span>
            </div>
          </div>

          {hasError ? (
            <span className="text-[8px] font-black text-rose-500 leading-none">Wrong answer!</span>
          ) : (
            <span className="text-[7px] text-slate-400 font-bold leading-none">Tap numbers on keypad</span>
          )}
        </div>

        {/* Right Side: 3x4 Compact Keypad */}
        <div className="w-40 sm:w-44 grid grid-cols-3 gap-1 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-purple-100">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className={`h-8 sm:h-9 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center border shadow-sm active:scale-95 transition-all cursor-pointer ${
                k === 'C'
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : k === 'DEL'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-white text-purple-950 border-purple-100 hover:bg-purple-50'
              }`}
            >
              {k === 'DEL' ? <Delete className="w-3.5 h-3.5" /> : k}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
