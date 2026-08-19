import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Delete, Check, KeyRound } from 'lucide-react';
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
  onSuccess,
  requiredPin = '1234'
}) => {
  const [mode, setMode] = useState<'math' | 'pin'>('math');
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(8);
  const [input, setInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const targetAnswer = num1 + num2;

  useEffect(() => {
    if (isOpen) {
      const n1 = Math.floor(Math.random() * 6) + 5;
      const n2 = Math.floor(Math.random() * 5) + 4;
      setNum1(n1);
      setNum2(n2);
      setInput('');
      setHasError(false);
      setIsSuccess(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleVerify = (val: string) => {
    const isMathCorrect = mode === 'math' && parseInt(val, 10) === targetAnswer;
    const isPinCorrect = mode === 'pin' && val === requiredPin;

    if (isMathCorrect || isPinCorrect) {
      setIsSuccess(true);
      sound.playCorrect();
      setTimeout(() => {
        onSuccess();
      }, 200);
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
    const maxLen = mode === 'math' ? targetAnswer.toString().length : 4;
    if (nextInput.length > maxLen) return;

    setInput(nextInput);
    if (nextInput.length === maxLen) {
      handleVerify(nextInput);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[28px] p-3.5 sm:p-4 w-full max-w-md shadow-2xl border-4 border-purple-200 border-b-[6px] border-b-purple-500 relative flex flex-row items-center gap-3.5"
      >
        <button
          onClick={() => { sound.playPop(); onClose(); }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-purple-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 flex flex-col justify-between items-center text-center py-1">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 mb-1 border border-purple-200 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-purple-950 font-['Fredoka'] leading-tight">
              Parents Only
            </h3>
            <p className="text-[9px] text-slate-500 font-medium max-w-[150px] leading-tight mt-0.5">
              {mode === 'math' ? 'Solve the math problem to unlock Parents Zone.' : 'Enter your 4-digit Parent PIN.'}
            </p>
          </div>

          <div className={`w-full my-2 p-2 rounded-2xl border-2 transition-all ${
            isSuccess
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
              : hasError
              ? 'bg-rose-50 border-rose-400 text-rose-600'
              : 'bg-purple-50/70 border-purple-200 text-purple-950'
          }`}>
            <span className="text-[8px] font-black uppercase text-purple-600 tracking-wider block">
              {mode === 'math' ? 'PARENT VERIFICATION' : 'ENTER 4-DIGIT PIN'}
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-wider mt-0.5">
              {mode === 'math' ? (
                <>
                  {num1} + {num2} = <span className="text-purple-600 underline underline-offset-4">{input || '?'}</span>
                </>
              ) : (
                <span className="tracking-[0.3em] text-purple-700">{input ? '••••'.slice(0, input.length) : '••••'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playPop(); setMode(m => m === 'math' ? 'pin' : 'math'); }}
              className="text-[9px] font-black text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>{mode === 'math' ? 'Use PIN Code' : 'Use Math Challenge'}</span>
            </button>
          </div>
        </div>

        <div className="w-44 grid grid-cols-3 gap-1.5 shrink-0 bg-slate-50 p-2 rounded-2xl border border-purple-100">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className={`h-9 sm:h-10 rounded-xl font-black text-sm flex items-center justify-center border shadow-sm active:scale-95 transition-all cursor-pointer ${
                k === 'C'
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : k === 'DEL'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-white text-purple-950 border-purple-100 hover:bg-purple-50'
              }`}
            >
              {k === 'DEL' ? <Delete className="w-4 h-4" /> : k}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
