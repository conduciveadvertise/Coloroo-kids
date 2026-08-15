import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Delete, Check, ArrowRight } from 'lucide-react';
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
  // Direct state without desynced useEffect
  const [num1, setNum1] = useState<number>(() => Math.floor(Math.random() * 5) + 4); // 4-8
  const [num2, setNum2] = useState<number>(() => Math.floor(Math.random() * 5) + 2); // 2-6
  const [input, setInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const targetAnswer = num1 + num2;

  const resetChallenge = () => {
    setNum1(Math.floor(Math.random() * 5) + 4);
    setNum2(Math.floor(Math.random() * 5) + 2);
    setInput('');
    setHasError(false);
    setIsSuccess(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetChallenge();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (valToCheck: string) => {
    const entered = parseInt(valToCheck, 10);
    if (entered === targetAnswer) {
      setIsSuccess(true);
      sound.playCorrect();
      setTimeout(() => {
        onSuccess();
      }, 150);
    } else {
      setHasError(true);
      sound.playPop();
      setTimeout(() => {
        setInput('');
        setHasError(false);
      }, 500);
    }
  };

  const handleKeyPress = (val: string) => {
    if (isSuccess) return;
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
    if (nextInput.length > 2) return;
    setInput(nextInput);

    // If matches target length, auto check
    if (nextInput.length >= targetAnswer.toString().length) {
      handleVerify(nextInput);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 select-none overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[26px] p-3 sm:p-4 w-full max-w-md shadow-2xl border-4 border-purple-200 border-b-[6px] border-b-purple-500 relative flex flex-row items-center gap-3 max-h-[92vh] overflow-hidden"
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

        {/* Left Side: Challenge & Status */}
        <div className="flex-1 flex flex-col justify-between items-center text-center py-1">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-1 border border-purple-200 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka'] leading-tight">
              Grown-Ups Only
            </h3>
            <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium max-w-[130px] leading-tight mt-0.5">
              Solve to enter Parent Zone
            </p>
          </div>

          <div className={`w-full my-1.5 p-2 rounded-xl border-2 transition-all ${
            isSuccess
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
              : hasError
              ? 'bg-rose-50 border-rose-400 text-rose-600'
              : 'bg-purple-50/70 border-purple-200 text-purple-950'
          }`}>
            <span className="text-[7px] font-black uppercase text-purple-600 tracking-wider block">
              Parent Verification
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-wider mt-0.5">
              {num1} + {num2} = <span className="text-purple-600 underline underline-offset-2">{input || '?'}</span>
            </div>
          </div>

          {isSuccess ? (
            <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5 leading-none">
              <Check className="w-3 h-3 stroke-[3]" /> Access Granted!
            </span>
          ) : hasError ? (
            <span className="text-[9px] font-black text-rose-500 leading-none">Incorrect, retry!</span>
          ) : (
            <span className="text-[8px] text-slate-400 font-bold leading-none">Tap numbers on keypad</span>
          )}
        </div>

        {/* Right Side: 3x4 Keypad */}
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
