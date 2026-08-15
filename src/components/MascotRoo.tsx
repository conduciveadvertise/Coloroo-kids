import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../services/soundEffects';

interface MascotRooProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'excited' | 'cheering' | 'thinking';
  interactive?: boolean;
}

export const MascotRoo: React.FC<MascotRooProps> = ({
  message,
  size = 'md',
  mood = 'happy',
  interactive = true
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [customTip, setCustomTip] = useState<string | null>(null);

  const tips = [
    "Boing! You're a super artist!",
    "Pick your favorite color and tap the canvas!",
    "I love using purple and gold together!",
    "Did you know dinosaurs loved strawberries? 🍓",
    "Giggle! That tickles! Keep painting!",
    "You earned shiny gold stars today! ⭐"
  ];

  const handleTap = () => {
    if (!interactive) return;
    sound.playPop();
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    const chosenTip = tips[nextCount % tips.length];
    setCustomTip(chosenTip);
    sound.speak(chosenTip);

    setTimeout(() => {
      setCustomTip(null);
    }, 4000);
  };

  const currentText = customTip || message;

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      {/* Interactive Speech Bubble */}
      <AnimatePresence>
        {currentText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-white text-[#4834D4] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-lg border-2 border-[#A29BFE] max-w-[220px] sm:max-w-xs z-30"
          >
            <span>{currentText}</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white border-r-2 border-b-2 border-[#A29BFE] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Animated Character Vector */}
      <motion.button
        id="mascot-roo-button"
        onClick={handleTap}
        whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
        whileTap={{ scale: 0.92, rotate: -6 }}
        className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-b from-[#FFEAA7] to-[#FDCB6E] p-1 shadow-md border-3 border-white flex items-center justify-center cursor-pointer group`}
        title="Tap Roo the Mascot!"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm overflow-visible"
        >
          {/* Beret on head */}
          <ellipse cx="50" cy="24" rx="22" ry="11" fill="#FF7675" transform="rotate(-10 50 24)" />
          <circle cx="56" cy="14" r="3.5" fill="#D63031" />

          {/* Ears */}
          <motion.path
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            d="M 28 32 C 14 10 26 5 36 22 Z"
            fill="#FDCB6E"
          />
          <path d="M 28 28 C 20 14 27 10 33 22 Z" fill="#FAB1A0" />

          <motion.path
            animate={{ rotate: [2, -3, 2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
            d="M 72 32 C 86 10 74 5 64 22 Z"
            fill="#FDCB6E"
          />
          <path d="M 72 28 C 80 14 73 10 67 22 Z" fill="#FAB1A0" />

          {/* Head & Face */}
          <circle cx="50" cy="52" r="32" fill="#FFEAA7" />

          {/* Cheeks */}
          <circle cx="30" cy="58" r="7" fill="#FD79A8" opacity="0.6" />
          <circle cx="70" cy="58" r="7" fill="#FD79A8" opacity="0.6" />

          {/* Snout */}
          <ellipse cx="50" cy="58" rx="14" ry="10" fill="#FFFFFF" />
          <ellipse cx="50" cy="52" rx="4.5" ry="3" fill="#2D3436" />

          {/* Eyes (Blinking animation) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.9, 0.92, 0.94, 1] }}
            style={{ transformOrigin: "50% 44%" }}
          >
            <circle cx="38" cy="44" r="4.5" fill="#2D3436" />
            <circle cx="36" cy="42" r="1.5" fill="#FFFFFF" />

            <circle cx="62" cy="44" r="4.5" fill="#2D3436" />
            <circle cx="60" cy="42" r="1.5" fill="#FFFFFF" />
          </motion.g>

          {/* Cute Smile */}
          <path
            d={mood === 'cheering' ? "M 44 60 Q 50 67 56 60 Z" : "M 44 60 Q 50 66 56 60"}
            stroke="#2D3436"
            strokeWidth="2"
            fill={mood === 'cheering' ? "#FF7675" : "none"}
            strokeLinecap="round"
          />

          {/* Mini Paintbrush in hand */}
          <g transform="translate(68, 62) rotate(25)">
            <rect x="0" y="0" width="3" height="16" rx="1.5" fill="#B2BEC3" />
            <path d="M 0 0 C 0 -4 3 -4 3 0 Z" fill="#6C5CE7" />
          </g>
        </svg>

        {/* Tiny star badge */}
        <span className="absolute -bottom-1 -right-1 bg-[#6C5CE7] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white shadow">
          ★
        </span>
      </motion.button>
    </div>
  );
};
