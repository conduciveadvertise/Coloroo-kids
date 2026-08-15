import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  CheckCircle2, 
  Star, 
  RefreshCw,
  Award,
  Play
} from 'lucide-react';
import { 
  PHONICS_LIST, 
  COUNTING_LEVELS, 
  NUMBER_NAMES_LIST,
  SHAPES_DATA, 
  ANIMAL_FACTS, 
  PhonicsCard, 
  MathCountingLevel,
  NumberNameItem,
  ShapeItem, 
  AnimalFact 
} from '../../data/learningGamesData';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'phonics' | 'math' | 'numberNames' | 'shapes' | 'animals';

export const LearningScreen: React.FC<LearningScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('phonics');

  // Phonics State (A to Z)
  const [selectedPhonics, setSelectedPhonics] = useState<PhonicsCard>(PHONICS_LIST[0]);
  
  // Math Counting State (1 to 20)
  const [countLevelIdx, setCountLevelIdx] = useState<number>(2); // Level 3 default
  const currentCountLevel = COUNTING_LEVELS[countLevelIdx] || COUNTING_LEVELS[0];
  const [poppedItems, setPoppedItems] = useState<number[]>([]);

  // Number Names State (1 to 50)
  const [selectedNumberName, setSelectedNumberName] = useState<NumberNameItem>(NUMBER_NAMES_LIST[0]);

  // Shapes Sorting State
  const [shapeQueue, setShapeQueue] = useState<ShapeItem[]>([...SHAPES_DATA]);
  const [shapeScore, setShapeScore] = useState<number>(0);
  const currentShape = shapeQueue[0];

  // Animal Soundboard State
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalFact>(ANIMAL_FACTS[0]);

  // --- HANDLERS ---

  // Phonics Selection & Audio Trigger
  const handleSelectPhonics = (card: PhonicsCard) => {
    setSelectedPhonics(card);
    sound.playPop();
    sound.speak(card.audioPrompt);
  };

  // Math Level Selection
  const handleSelectMathLevel = (idx: number) => {
    setCountLevelIdx(idx);
    setPoppedItems([]);
    sound.playPop();
    const lvl = COUNTING_LEVELS[idx];
    sound.speak(`Number ${lvl.number}! ${lvl.word} ${lvl.itemName}! Tap to count!`);
  };

  // Math Item Tap
  const handleTapCountItem = (index: number) => {
    if (poppedItems.includes(index)) return;
    sound.playPop();
    const updated = [...poppedItems, index];
    setPoppedItems(updated);
    
    // Count number speech
    sound.speak(`${updated.length}`);

    // If all items counted
    if (updated.length === currentCountLevel.number) {
      setTimeout(() => {
        sound.playFanfare();
        sound.speak(`Awesome! You counted all ${currentCountLevel.number} ${currentCountLevel.itemName}!`);
        onAddStars(2);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {}
      }, 250);
    }
  };

  // Next Math Level
  const handleNextMathLevel = () => {
    sound.playPop();
    setPoppedItems([]);
    setCountLevelIdx((prev) => (prev + 1) % COUNTING_LEVELS.length);
  };

  // Number Names Selection
  const handleSelectNumberName = (item: NumberNameItem) => {
    setSelectedNumberName(item);
    sound.playPop();
    sound.speak(item.audioPrompt);
  };

  // Shape Sorting Target Tap
  const handleSortShape = (colorName: string) => {
    if (!currentShape) return;
    if (currentShape.colorName === colorName) {
      sound.playCorrect();
      sound.speak(`Correct! ${currentShape.name}!`);
      setShapeScore(prev => prev + 1);
      const remaining = shapeQueue.slice(1);
      setShapeQueue(remaining);

      if (remaining.length === 0) {
        sound.playFanfare();
        sound.speak("You are a Shape Champion!");
        onAddStars(3);
        try {
          confetti({ particleCount: 60, spread: 60 });
        } catch {}
      }
    } else {
      sound.playPop();
      sound.speak(`Try again! Find the ${currentShape.colorName} bin!`);
    }
  };

  // Animal Tap
  const handleAnimalTap = (animal: AnimalFact) => {
    setSelectedAnimal(animal);
    sound.playSparkle();
    sound.speak(`${animal.name} says ${animal.sound}. ${animal.funFact}`);
  };

  const tabs: { id: TabType; label: string; color: string }[] = [
    { id: 'phonics', label: '🔤 Phonics ABC', color: '#6C5CE7' },
    { id: 'math', label: '🔢 Math Counting', color: '#FF7675' },
    { id: 'numberNames', label: '🧮 Number Names', color: '#00CEC9' },
    { id: 'shapes', label: '🔷 Shapes & Colors', color: '#FD79A8' },
    { id: 'animals', label: '🦁 Animal World', color: '#FFA502' },
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between p-2 sm:p-3 md:p-4 select-none overflow-hidden bg-[#F3E8FF]">
      {/* Top Header Row with Back Button & 5 Landscape Tabs */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="learning-back-btn"
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
            <span className="text-xs font-bold hidden sm:inline text-purple-900">Home</span>
          </button>
          <h1 className="text-base sm:text-lg md:text-xl font-black text-purple-900 font-['Fredoka'] whitespace-nowrap">
            Learn & Play 🌟
          </h1>
        </div>

        {/* Discovery 5 Tab Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border-2 border-purple-100 shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`learn-tab-${tab.id}`}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id);
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md scale-105 border border-white'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Landscape Workspace Area */}
      <div className="flex-1 min-h-0 bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[36px] p-2.5 sm:p-3.5 md:p-4 border-2 border-purple-100 border-b-[6px] sm:border-b-[8px] border-b-rose-400 shadow-xl flex gap-2.5 sm:gap-4 items-stretch overflow-hidden">
        
        {/* ========================================================================= */}
        {/* TAB 1: PHONICS ABC (A - Z Complete 26 Letters) */}
        {/* ========================================================================= */}
        {activeTab === 'phonics' && (
          <div className="w-full h-full flex gap-3 sm:gap-4 items-stretch justify-between">
            {/* LEFT / MAIN AREA: Grid of all 26 Selectable Letters A - Z */}
            <div className="flex-1 h-full flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-1.5 px-1 shrink-0">
                <span className="text-[11px] sm:text-xs font-black uppercase text-purple-900 tracking-wider">
                  Tap any letter (A–Z) to hear its sound! 🎧
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-purple-600">
                  26 Letters
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto kids-scrollbar pr-1 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-1.5 sm:gap-2">
                {PHONICS_LIST.map((card) => {
                  const isSelected = selectedPhonics.letter === card.letter;
                  return (
                    <motion.button
                      key={card.letter}
                      id={`phonics-letter-${card.letter}`}
                      onClick={() => handleSelectPhonics(card)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      className={`rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center border-2 transition-all cursor-pointer min-h-[58px] sm:min-h-[66px] ${
                        isSelected
                          ? 'bg-purple-600 text-white border-white scale-105 shadow-lg ring-2 ring-purple-300'
                          : 'bg-purple-50/50 hover:bg-purple-100/80 text-slate-800 border-purple-100 hover:border-purple-200 shadow-xs'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl font-black font-['Fredoka'] leading-none">
                        {card.letter}
                      </span>
                      <span className="text-sm sm:text-base mt-0.5">{card.icon}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT AREA: Large Detail Card for Selected Phonics Letter */}
            <motion.div
              key={selectedPhonics.letter}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-64 sm:w-72 md:w-80 h-full bg-rose-50/90 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-4 border-2 border-rose-200 shadow-md flex flex-col items-center justify-between text-center shrink-0"
            >
              <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Sound: /{selectedPhonics.phonicsSound}/
              </span>

              <div className="my-auto py-1 flex flex-col items-center">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-purple-900 font-['Fredoka'] block drop-shadow-xs leading-none">
                  {selectedPhonics.letter}
                </span>
                <span className="text-4xl sm:text-5xl my-1.5 block animate-bounce-gentle">
                  {selectedPhonics.icon}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka'] block leading-tight">
                  {selectedPhonics.word}
                </span>
                <span className="text-[11px] sm:text-xs text-rose-700 font-bold mt-0.5">
                  "{selectedPhonics.audioPrompt}"
                </span>
              </div>

              <motion.button
                id="listen-phonics-sound-btn"
                onClick={() => handleSelectPhonics(selectedPhonics)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Hear Sound</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MATH COUNTING (Numbers 1 - 20) */}
        {/* ========================================================================= */}
        {activeTab === 'math' && (
          <div className="w-full h-full flex gap-3 sm:gap-4 items-stretch justify-between">
            {/* LEFT / MAIN AREA: Number Selector & Tap-to-Count Interactive Board */}
            <div className="flex-1 h-full flex flex-col min-w-0 justify-between">
              {/* Number Level Selector Row (1 to 20) */}
              <div className="shrink-0 mb-1.5">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-purple-900 tracking-wider">
                    Pick a number (1–20):
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">
                    Counted {poppedItems.length} of {currentCountLevel.number}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto kids-scrollbar pb-1">
                  {COUNTING_LEVELS.map((lvl, idx) => {
                    const isSelected = countLevelIdx === idx;
                    return (
                      <button
                        key={lvl.number}
                        id={`math-level-btn-${lvl.number}`}
                        onClick={() => handleSelectMathLevel(idx)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-md scale-105 border-2 border-white'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                        }`}
                      >
                        {lvl.number}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Items to Tap and Count */}
              <div className="flex-1 min-h-0 bg-amber-50/60 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border-2 border-amber-200/80 overflow-y-auto kids-scrollbar flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {Array.from({ length: currentCountLevel.number }).map((_, idx) => {
                  const isPopped = poppedItems.includes(idx);
                  return (
                    <motion.button
                      key={idx}
                      id={`count-item-${idx}`}
                      onClick={() => handleTapCountItem(idx)}
                      whileHover={!isPopped ? { scale: 1.12 } : {}}
                      whileTap={!isPopped ? { scale: 0.88 } : {}}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-2xl sm:text-3xl border-2 sm:border-3 transition-all cursor-pointer relative shadow-sm ${
                        isPopped
                          ? 'bg-emerald-400 border-white scale-105 shadow-inner'
                          : 'bg-white hover:bg-amber-100 border-amber-200'
                      }`}
                    >
                      {currentCountLevel.itemEmoji}
                      {isPopped && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center border border-white shadow">
                          ✓
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom Quick Controls */}
              <div className="flex items-center justify-between gap-2 mt-1.5 shrink-0 px-1">
                <button
                  id="reset-count-btn"
                  onClick={() => {
                    sound.playPop();
                    setPoppedItems([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Count Again</span>
                </button>
                <button
                  id="next-counting-level-btn"
                  onClick={handleNextMathLevel}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs flex items-center gap-1 shadow-sm border border-white cursor-pointer"
                >
                  <span>Next Level ({((countLevelIdx + 1) % COUNTING_LEVELS.length) + 1})</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* RIGHT AREA: Large Detail Card for Selected Number */}
            <motion.div
              key={currentCountLevel.number}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-64 sm:w-72 md:w-80 h-full bg-amber-50 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-4 border-2 border-amber-200 shadow-md flex flex-col items-center justify-between text-center shrink-0"
            >
              <span className="bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Counting Card: {currentCountLevel.number} / 20
              </span>

              <div className="my-auto py-1 flex flex-col items-center">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-amber-500 font-['Fredoka'] block drop-shadow-xs leading-none">
                  {currentCountLevel.number}
                </span>
                <span className="text-4xl sm:text-5xl my-1.5 block animate-bounce-gentle">
                  {currentCountLevel.itemEmoji}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka'] block leading-tight">
                  {currentCountLevel.word}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">
                  {currentCountLevel.itemName}
                </span>
              </div>

              <motion.button
                id="listen-math-sound-btn"
                onClick={() => {
                  sound.playSparkle();
                  sound.speak(`Number ${currentCountLevel.number}! ${currentCountLevel.word} ${currentCountLevel.itemName}!`);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Hear Sound</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NUMBER NAMES (1 to 50 Complete) */}
        {/* ========================================================================= */}
        {activeTab === 'numberNames' && (
          <div className="w-full h-full flex gap-3 sm:gap-4 items-stretch justify-between">
            {/* LEFT / MAIN AREA: Grid of Numbers 1 to 50 */}
            <div className="flex-1 h-full flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-1.5 px-1 shrink-0">
                <span className="text-[11px] sm:text-xs font-black uppercase text-purple-900 tracking-wider">
                  Tap any number (1–50) to learn its name! 🧮
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-cyan-700">
                  50 Numbers
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto kids-scrollbar pr-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
                {NUMBER_NAMES_LIST.map((item) => {
                  const isSelected = selectedNumberName.number === item.number;
                  return (
                    <motion.button
                      key={item.number}
                      id={`number-name-btn-${item.number}`}
                      onClick={() => handleSelectNumberName(item)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      className={`rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center border-2 transition-all cursor-pointer min-h-[58px] sm:min-h-[64px] ${
                        isSelected
                          ? 'bg-cyan-600 text-white border-white scale-105 shadow-lg ring-2 ring-cyan-300'
                          : 'bg-cyan-50/50 hover:bg-cyan-100 text-slate-800 border-cyan-100 hover:border-cyan-200 shadow-xs'
                      }`}
                    >
                      <span className="text-lg sm:text-xl font-black font-['Fredoka'] leading-none">
                        {item.number}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 truncate max-w-full">
                        {item.word}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT AREA: Large Detail Card for Selected Number Name */}
            <motion.div
              key={selectedNumberName.number}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-64 sm:w-72 md:w-80 h-full bg-cyan-50 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-4 border-2 border-cyan-200 shadow-md flex flex-col items-center justify-between text-center shrink-0"
            >
              <span className="bg-cyan-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Number Name: {selectedNumberName.number}
              </span>

              <div className="my-auto py-1 flex flex-col items-center">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-cyan-700 font-['Fredoka'] block drop-shadow-xs leading-none">
                  {selectedNumberName.number}
                </span>
                <span className="text-4xl sm:text-5xl my-1.5 block animate-bounce-gentle">
                  {selectedNumberName.emoji}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka'] block leading-tight">
                  {selectedNumberName.word}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedNumberName.number} = {selectedNumberName.word}
                </span>
              </div>

              <motion.button
                id="listen-number-name-btn"
                onClick={() => handleSelectNumberName(selectedNumberName)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Hear Sound</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SHAPES & COLORS */}
        {/* ========================================================================= */}
        {activeTab === 'shapes' && (
          <div className="w-full h-full flex gap-3 sm:gap-4 items-stretch justify-between">
            {/* Left Area: Shape Display */}
            <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-2">
              {currentShape ? (
                <motion.div
                  key={currentShape.id}
                  initial={{ scale: 0.6, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-cyan-50/80 p-5 rounded-[24px] sm:rounded-[32px] border-2 border-cyan-200 shadow-md flex flex-col items-center max-w-sm w-full"
                >
                  <span className="text-[10px] sm:text-xs uppercase font-black text-cyan-700 tracking-wider mb-1">
                    Match This Shape & Color!
                  </span>
                  
                  {/* Shape Drawing */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center my-2">
                    {currentShape.shapeType === 'star' && <span className="text-6xl sm:text-7xl">⭐</span>}
                    {currentShape.shapeType === 'heart' && <span className="text-6xl sm:text-7xl">💖</span>}
                    {currentShape.shapeType === 'circle' && <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#74B9FF] border-4 border-white shadow-md" />}
                    {currentShape.shapeType === 'square' && <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#2ED573] border-4 border-white shadow-md" />}
                    {currentShape.shapeType === 'triangle' && (
                      <div className="w-0 h-0 border-l-[36px] sm:border-l-[45px] border-l-transparent border-r-[36px] sm:border-r-[45px] border-r-transparent border-b-[65px] sm:border-b-[80px] border-b-[#A29BFE]" />
                    )}
                    {currentShape.shapeType === 'diamond' && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFA502] rotate-45 border-4 border-white shadow-md" />
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka'] mt-1">
                    {currentShape.name}
                  </h3>
                </motion.div>
              ) : (
                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 text-center">
                  <Award className="w-16 h-16 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-purple-900 font-['Fredoka']">
                    All Shapes Sorted!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">You earned 3 Gold Stars!</p>
                  <button
                    id="restart-shapes-btn"
                    onClick={() => {
                      setShapeQueue([...SHAPES_DATA]);
                      setShapeScore(0);
                    }}
                    className="mt-3 px-4 py-2 bg-cyan-500 text-white font-black rounded-xl cursor-pointer"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>

            {/* Right Area: Target Color Bins */}
            <div className="w-64 sm:w-72 md:w-80 grid grid-cols-2 gap-2 sm:gap-2.5 shrink-0 content-center">
              {[
                { name: 'Yellow', color: '#FDCB6E', bg: 'bg-[#FDCB6E]' },
                { name: 'Red', color: '#FF7675', bg: 'bg-[#FF7675]' },
                { name: 'Blue', color: '#74B9FF', bg: 'bg-[#74B9FF]' },
                { name: 'Green', color: '#2ED573', bg: 'bg-[#2ED573]' },
                { name: 'Purple', color: '#A29BFE', bg: 'bg-[#A29BFE]' },
                { name: 'Orange', color: '#FFA502', bg: 'bg-[#FFA502]' },
              ].map(bin => (
                <motion.button
                  key={bin.name}
                  id={`sort-bin-${bin.name}`}
                  onClick={() => handleSortShape(bin.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${bin.bg} text-slate-900 font-black p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 border-white shadow-md flex flex-col items-center justify-center cursor-pointer`}
                >
                  <span className="text-xl sm:text-2xl">📥</span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-0.5">
                    {bin.name} Bin
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ANIMAL WORLD */}
        {/* ========================================================================= */}
        {activeTab === 'animals' && (
          <div className="w-full h-full flex gap-3 sm:gap-4 items-stretch justify-between">
            {/* Left Area: Animal Icons Grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 overflow-y-auto kids-scrollbar pr-1 content-start">
              {ANIMAL_FACTS.map((an) => {
                const isSelected = selectedAnimal.id === an.id;
                return (
                  <motion.button
                    key={an.id}
                    id={`animal-btn-${an.id}`}
                    onClick={() => handleAnimalTap(an)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 text-slate-900 border-amber-400 shadow-md scale-105'
                        : 'bg-purple-50/50 hover:bg-purple-100 text-slate-800 border-purple-100'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{an.icon}</span>
                    <div className="text-left min-w-0">
                      <span className="text-xs sm:text-sm font-black block font-['Fredoka'] truncate">
                        {an.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block truncate">
                        {an.sound}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Area: Animal Detail Card */}
            <motion.div 
              key={selectedAnimal.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-64 sm:w-72 md:w-80 h-full bg-amber-50 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-4 border-2 border-amber-200 shadow-md flex flex-col items-center justify-between text-center shrink-0"
            >
              <span className="bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase">
                Habitat: {selectedAnimal.habitat}
              </span>

              <div className="my-auto py-1 flex flex-col items-center">
                <span className="text-5xl sm:text-6xl block my-1.5 animate-bounce-gentle">
                  {selectedAnimal.icon}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka']">
                  {selectedAnimal.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium line-clamp-3">
                  {selectedAnimal.funFact}
                </p>
              </div>

              <motion.button
                id="play-animal-voice-btn"
                onClick={() => handleAnimalTap(selectedAnimal)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 border-2 border-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Hear Sound: "{selectedAnimal.sound}"</span>
              </motion.button>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
