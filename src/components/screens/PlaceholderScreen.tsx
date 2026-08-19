import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sparkles, Star } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface PlaceholderScreenProps {
  title: string;
  tag: string;
  iconEmoji: string;
  description: string;
  accentColor: string;
  onBack: () => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  tag,
  iconEmoji,
  description,
  accentColor,
  onBack,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-black">Home</span>
        </button>
        <span className="bg-white text-purple-900 text-xs font-black px-3 py-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {tag}
        </span>
      </div>

      {/* Main Showcase Box */}
      <div className="flex-1 flex items-center justify-center p-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[32px] p-6 max-w-md w-full text-center shadow-2xl border-4 border-purple-100 border-b-[8px] border-b-purple-400 flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center text-5xl mb-3 shadow-inner border-2 border-purple-100">
            {iconEmoji}
          </div>
          <h2 className="text-2xl font-black text-purple-950 font-['Fredoka']">{title}</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">{description}</p>

          <div className="flex items-center gap-1.5 my-4 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-amber-700">Get ready for exciting quests & magical prizes!</span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all border-2 border-white"
          >
            Back to Home 🏠
          </button>
        </motion.div>
      </div>

      <div className="text-center shrink-0">
        <span className="text-[10px] font-bold text-slate-400">Coloroo Kids World • Safe Play Zone</span>
      </div>
    </div>
  );
};
