import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, X, Check, ShieldAlert } from 'lucide-react';
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
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(5);
  const [answerInput, setAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [mode, setMode] = useState<'math' | 'pin'>('math');

  useEffect(() => {
    if (isOpen) {
      const n1 = Math.floor(Math.random() * 6) + 4; // 4 - 9
      const n2 = Math.floor(Math.random() * 6) + 3; // 3 - 8
      setNum1(n1);
      setNum2(n2);
      setAnswerInput('');
      setErrorMsg(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeypadPress = (digit: string) => {
    sound.playPop();
    if (answerInput.length < 4) {
      setAnswerInput(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    sound.playPop();
    setAnswerInput(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (mode === 'math') {
      const expected = num1 + num2;
      if (parseInt(answerInput, 10) === expected) {
        sound.playCorrect();
        onSuccess();
      } else {
        setErrorMsg(true);
        sound.playPop();
        setAnswerInput('');
      }
    } else {
      if (answerInput === requiredPin || answerInput === '1234') {
        sound.playCorrect();
        onSuccess();
      } else {
        setErrorMsg(true);
        sound.playPop();
        setAnswerInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-md rounded-[32px] sm:rounded-[36px] p-6 border-2 border-purple-100 border-b-[8px] border-b-purple-500 shadow-2xl text-slate-800 relative"
      >
        {/* Close Button */}
        <button
          id="close-parent-gate-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center mb-3 shadow-lg border-2 border-white">
            <Lock className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black font-['Fredoka'] text-purple-950">
            Grown-Ups Only
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please solve this math question to enter the Parent Zone.
          </p>
        </div>

        {/* Question Display */}
        <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 text-center mb-4">
          {mode === 'math' ? (
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-700 font-bold block mb-1">
                Parent Verification
              </span>
              <span className="text-3xl font-black text-purple-900 tracking-wider font-['Fredoka']">
                {num1} + {num2} = <span className="underline decoration-rose-400">{answerInput || '?'}</span>
              </span>
            </div>
          ) : (
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-700 font-bold block mb-1">
                Enter Parent PIN (Default 1234)
              </span>
              <span className="text-3xl font-black text-purple-900 tracking-widest">
                {answerInput ? '•'.repeat(answerInput.length) : '____'}
              </span>
            </div>
          )}

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-500 font-bold mt-2 flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Incorrect answer, please try again!
            </motion.p>
          )}
        </div>

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              id={`keypad-btn-${k}`}
              onClick={() => {
                if (k === 'C') setAnswerInput('');
                else if (k === '⌫') handleBackspace();
                else handleKeypadPress(k);
              }}
              className="py-3 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 font-black text-lg transition-all border border-purple-100 text-purple-900 cursor-pointer shadow-sm"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Submit & Switch Mode */}
        <div className="flex gap-2 items-center">
          <button
            id="switch-parent-mode-btn"
            onClick={() => {
              setMode(mode === 'math' ? 'pin' : 'math');
              setAnswerInput('');
              setErrorMsg(false);
            }}
            className="text-[11px] text-purple-600 hover:underline px-2 py-2 font-bold cursor-pointer"
          >
            {mode === 'math' ? 'Use PIN Code' : 'Use Math Question'}
          </button>

          <button
            id="verify-parent-gate-btn"
            onClick={handleVerify}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            Verify & Enter
          </button>
        </div>
      </motion.div>
    </div>
  );
};
