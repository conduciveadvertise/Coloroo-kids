import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, CheckCircle, Sparkles, ImageDown, ArrowRight } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface CelebrationModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  starsEarned?: number;
  unlockedStickerEmoji?: string;
  onClose: () => void;
  onContinue: () => void;
  onSave?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  title = "You're a Master Artist!",
  subtitle = "You painted a super colorful masterpiece!",
  starsEarned = 3,
  unlockedStickerEmoji = "⭐",
  onClose,
  onContinue,
  onSave
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playArtworkSuccess();
      sound.speak(title);

      // Fire vibrant confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6C5CE7', '#FF7675', '#FFEAA7', '#55EFC4', '#FD79A8', '#00CEC9']
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFA502', '#FF4757', '#2ED573']
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#74B9FF', '#A29BFE', '#FDCB6E']
          });
        }, 300);
      } catch {}
    }
  }, [isOpen, title]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="bg-white w-full max-w-lg rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border-2 border-purple-100 border-b-[8px] border-b-amber-400 shadow-2xl text-center text-slate-800 relative overflow-hidden"
      >
        {/* Floating Background Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Golden Stars Rating Animation */}
        <div className="flex justify-center items-center gap-3 mb-4">
          {[1, 2, 3].map((starIdx) => (
            <motion.div
              key={starIdx}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
              transition={{ delay: 0.2 * starIdx, type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <Star className="w-12 h-12 sm:w-16 sm:h-16 fill-amber-400 text-amber-300 stroke-[2.5] drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)]" />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: starIdx * 0.3 }}
                className="absolute -top-1 -right-1 text-amber-500"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka'] text-purple-950 mb-2 tracking-wide">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-sm mx-auto font-medium">
          {subtitle}
        </p>

        {/* Rewards Earned Box */}
        <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 flex items-center justify-around mb-6 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider text-purple-700 font-bold block">
                Stars Earned
              </span>
              <span className="text-lg font-black text-amber-500">
                +{starsEarned} Gold Stars
              </span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-purple-200" />

          <div className="flex items-center gap-2">
            <span className="text-2xl">{unlockedStickerEmoji}</span>
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider text-cyan-700 font-bold block">
                Badge Unlocked
              </span>
              <span className="text-lg font-black text-slate-800">
                Sticker Badge
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onSave && (
            <button
              id="save-gallery-modal-btn"
              onClick={onSave}
              className="py-3 px-5 rounded-2xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-900 font-bold flex items-center justify-center gap-2 border border-purple-200 transition-all cursor-pointer shadow-sm"
            >
              <ImageDown className="w-5 h-5 text-purple-600" />
              Save to Gallery
            </button>
          )}

          <button
            id="continue-modal-btn"
            onClick={onContinue}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-105 active:scale-95 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
          >
            <span>Play Next Page</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
