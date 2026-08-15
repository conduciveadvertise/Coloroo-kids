import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Volume2, Sparkles } from 'lucide-react';
import { PHONICS_LIST, MATH_COUNTING, NUMBER_NAMES, SHAPES_COLORS } from '../../data/learningGamesData';
import { sound } from '../../services/soundEffects';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'phonics' | 'counting' | 'numbers' | 'shapes';

export const LearningScreen: React.FC<LearningScreenProps> = ({ onBack, onAddStars }) => {
  const [activeTab, setActiveTab] = useState<TabType>('phonics');
  const [selectedLetter, setSelectedLetter] = useState(PHONICS_LIST[19] || PHONICS_LIST[0]); // Default Tiger (T)

  const handleLetterClick = (item: typeof PHONICS_LIST[0]) => {
    setSelectedLetter(item);
    sound.playLetterChime(item.letter);
    sound.speak(`${item.letter}. ${item.word}! ${item.phonicSound}`);
  };

  const handleSpeakCurrent = () => {
    sound.playPop();
    sound.speak(`${selectedLetter.letter} is for ${selectedLetter.word}! ${selectedLetter.phonicSound}`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header & Tabs Bar */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">Home</span>
          </button>
          <h1 className="text-base sm:text-lg font-black text-purple-950 font-['Fredoka']">
            Learn & Play 🌟
          </h1>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: 'phonics' as TabType, label: '🔤 Phonics ABC' },
            { id: 'counting' as TabType, label: '🔢 Counting' },
            { id: 'numbers' as TabType, label: '📝 Numbers' },
            { id: 'shapes' as TabType, label: '🔷 Shapes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Stage */}
      <div className="flex-1 flex gap-2.5 sm:gap-3 min-h-0 items-stretch my-0.5">
        {/* Left: Interactive 26 Letter Grid (Col) */}
        <div className="flex-1 bg-white rounded-[26px] p-2.5 border-2 border-purple-100 shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between shrink-0 mb-1 px-1">
            <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
              TAP ANY LETTER (A–Z) TO HEAR ITS SOUND! 🎧
            </span>
            <span className="text-[10px] font-extrabold text-purple-600">26 Letters</span>
          </div>

          <div className="flex-1 grid grid-cols-7 gap-1.5 overflow-y-auto no-scrollbar py-0.5 items-center content-center">
            {PHONICS_LIST.map((item) => {
              const isSelected = selectedLetter.letter === item.letter;
              return (
                <motion.button
                  key={item.letter}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleLetterClick(item)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg ring-3 ring-purple-300 scale-105'
                      : 'bg-purple-50/70 hover:bg-purple-100 text-slate-800 border border-purple-100'
                  }`}
                >
                  <span className={`text-base sm:text-lg font-black font-['Fredoka'] leading-none ${isSelected ? 'text-white' : 'text-purple-950'}`}>
                    {item.letter}
                  </span>
                  <span className="text-sm sm:text-base mt-0.5 leading-none">{item.icon}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Big Showcase Card (Col) */}
        <div className="w-56 sm:w-64 md:w-72 bg-[#FFF5F5] rounded-[28px] p-3 border-2 border-rose-200 border-b-[6px] border-b-rose-400 shadow-xl flex flex-col justify-between items-center shrink-0">
          <div className="w-full flex justify-center">
            <span className="bg-[#FF2E63] text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              SOUND: {selectedLetter.phonicSound || `/AH/`}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-1 text-center">
            <span className="text-6xl sm:text-7xl font-black text-purple-950 font-['Fredoka'] leading-none drop-shadow-sm">
              {selectedLetter.letter}
            </span>
            <span className="text-5xl sm:text-6xl my-1 drop-shadow-md animate-bounce-gentle">
              {selectedLetter.icon}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka'] leading-tight">
              {selectedLetter.word}
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 italic mt-0.5 max-w-[200px] leading-tight">
              "{selectedLetter.letter} is for {selectedLetter.word}! {selectedLetter.phonicSound}"
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSpeakCurrent}
            className="w-full py-2.5 rounded-2xl bg-[#FF2E63] hover:bg-[#E8174D] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 border-2 border-white cursor-pointer active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4 fill-white" />
            <span>Hear Sound</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
