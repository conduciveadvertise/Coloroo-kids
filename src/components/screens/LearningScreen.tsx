import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  CheckCircle2, 
  Star, 
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  PHONICS_LIST, 
  COUNTING_LEVELS, 
  SHAPES_DATA, 
  ANIMAL_FACTS, 
  PhonicsCard, 
  ShapeItem, 
  AnimalFact 
} from '../../data/learningGamesData';
import { sound } from '../../services/soundEffects';
import { MascotRoo } from '../MascotRoo';
import confetti from 'canvas-confetti';

interface LearningScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type TabType = 'phonics' | 'math' | 'shapes' | 'animals';

export const LearningScreen: React.FC<LearningScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('phonics');

  // Phonics State
  const [selectedPhonics, setSelectedPhonics] = useState<PhonicsCard>(PHONICS_LIST[0]);
  
  // Math Counting State
  const [countLevelIdx, setCountLevelIdx] = useState<number>(2); // Level 3 (Three Balloons)
  const currentCountLevel = COUNTING_LEVELS[countLevelIdx];
  const [poppedItems, setPoppedItems] = useState<number[]>([]);

  // Shapes Sorting State
  const [shapeQueue, setShapeQueue] = useState<ShapeItem[]>([...SHAPES_DATA]);
  const [shapeScore, setShapeScore] = useState<number>(0);
  const currentShape = shapeQueue[0];

  // Animal Soundboard State
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalFact>(ANIMAL_FACTS[0]);

  // Phonics Audio Trigger
  const handlePlayPhonics = (card: PhonicsCard) => {
    setSelectedPhonics(card);
    sound.playPop();
    sound.speak(card.audioPrompt);
  };

  // Math Item Tap
  const handleTapCountItem = (index: number) => {
    if (poppedItems.includes(index)) return;
    sound.playPop();
    const updated = [...poppedItems, index];
    setPoppedItems(updated);
    
    // Count speech
    sound.speak(`${updated.length}`);

    // If all items counted
    if (updated.length === currentCountLevel.number) {
      setTimeout(() => {
        sound.playFanfare();
        sound.speak(`Awesome! You counted ${currentCountLevel.number} ${currentCountLevel.itemName}!`);
        onAddStars(2);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {}
      }, 300);
    }
  };

  // Next Math Level
  const handleNextMathLevel = () => {
    sound.playPop();
    setPoppedItems([]);
    setCountLevelIdx((prev) => (prev + 1) % COUNTING_LEVELS.length);
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

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Top Header Row with Tabs */}
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="learning-back-btn"
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
            <span className="text-xs font-bold hidden sm:inline text-purple-900">Home</span>
          </button>
          <h1 className="text-lg sm:text-xl font-black text-purple-900 font-['Fredoka']">
            Learn & Play Discovery 🌟
          </h1>
        </div>

        {/* Discovery Tab Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'phonics' as TabType, label: '🔤 Phonics ABC', color: '#6C5CE7' },
            { id: 'math' as TabType, label: '🔢 Math Counting', color: '#FF7675' },
            { id: 'shapes' as TabType, label: '🔷 Shapes & Colors', color: '#00CEC9' },
            { id: 'animals' as TabType, label: '🦁 Animal World', color: '#FFA502' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`learn-tab-${tab.id}`}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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

      {/* Main Content Area based on Tab */}
      <div className="flex-1 min-h-0 bg-white rounded-[32px] sm:rounded-[36px] p-4 border-2 border-purple-100 border-b-[8px] border-b-rose-400 shadow-xl flex gap-4 items-center justify-between">
        {/* TAB 1: PHONICS ABC */}
        {activeTab === 'phonics' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Left Carousel / Grid of Letters */}
            <div className="flex-1 h-full overflow-y-auto kids-scrollbar pr-2 grid grid-cols-4 sm:grid-cols-7 gap-2">
              {PHONICS_LIST.map((card) => {
                const isSelected = selectedPhonics.letter === card.letter;
                return (
                  <motion.button
                    key={card.letter}
                    id={`phonics-letter-${card.letter}`}
                    onClick={() => handlePlayPhonics(card)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white border-white scale-105 shadow-lg'
                        : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-purple-100'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black font-['Fredoka'] leading-none">
                      {card.letter}
                    </span>
                    <span className="text-sm mt-1">{card.icon}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Large Phonics Card & Sound Player */}
            <motion.div
              key={selectedPhonics.letter}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full md:w-80 h-full bg-rose-50 rounded-[28px] p-6 shadow-md border-2 border-rose-200 flex flex-col items-center justify-between text-center shrink-0"
            >
              <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Letter Sound: /{selectedPhonics.phonicsSound}/
              </span>

              <div className="my-auto">
                <span className="text-6xl sm:text-7xl font-black text-purple-900 font-['Fredoka'] block drop-shadow-sm">
                  {selectedPhonics.letter}
                </span>
                <span className="text-5xl my-2 block animate-bounce-gentle">
                  {selectedPhonics.icon}
                </span>
                <span className="text-2xl font-black text-slate-800 font-['Fredoka'] block">
                  {selectedPhonics.word}
                </span>
              </div>

              <motion.button
                id="listen-phonics-sound-btn"
                onClick={() => handlePlayPhonics(selectedPhonics)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
              >
                <Volume2 className="w-5 h-5" />
                <span>Hear Sound</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* TAB 2: MATH & COUNTING */}
        {activeTab === 'math' && (
          <div className="w-full h-full flex flex-col justify-between items-center text-center">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase font-bold text-purple-900 tracking-wider">
                Tap each item to count!
              </span>
              <button
                id="next-counting-level-btn"
                onClick={handleNextMathLevel}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1 border border-purple-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next Number</span>
              </button>
            </div>

            {/* Large Target Number Box */}
            <div className="bg-amber-50 px-6 py-2 rounded-2xl border-2 border-amber-200 inline-flex items-center gap-3 my-1">
              <span className="text-4xl font-black text-amber-500 font-['Fredoka']">
                {currentCountLevel.number}
              </span>
              <div className="text-left">
                <span className="text-xl font-black text-slate-800 font-['Fredoka'] block">
                  {currentCountLevel.word}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentCountLevel.itemName}
                </span>
              </div>
            </div>

            {/* Interactive Items to Tap and Count */}
            <div className="flex-1 w-full max-w-2xl flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4">
              {Array.from({ length: currentCountLevel.number }).map((_, idx) => {
                const isPopped = poppedItems.includes(idx);
                return (
                  <motion.button
                    key={idx}
                    id={`count-item-${idx}`}
                    onClick={() => handleTapCountItem(idx)}
                    whileHover={!isPopped ? { scale: 1.15 } : {}}
                    whileTap={!isPopped ? { scale: 0.85 } : {}}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center text-3xl sm:text-4xl border-3 transition-all cursor-pointer relative shadow-lg ${
                      isPopped
                        ? 'bg-emerald-400 border-white scale-105 shadow-inner'
                        : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
                    }`}
                  >
                    {currentCountLevel.itemEmoji}
                    {isPopped && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center border border-white shadow">
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Progress Count Bar */}
            <div className="text-sm font-bold text-slate-700">
              Counted: <span className="text-purple-600 text-lg font-black">{poppedItems.length}</span> of {currentCountLevel.number}
            </div>
          </div>
        )}

        {/* TAB 3: SHAPES & COLORS */}
        {activeTab === 'shapes' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Current Shape to Sort */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {currentShape ? (
                <motion.div
                  key={currentShape.id}
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-cyan-50 p-6 rounded-[28px] border-2 border-cyan-200 shadow-md flex flex-col items-center"
                >
                  <span className="text-xs uppercase font-black text-cyan-700 tracking-wider mb-2">
                    Match This Shape & Color!
                  </span>
                  
                  {/* Shape Drawing */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center my-2">
                    {currentShape.shapeType === 'star' && <span className="text-7xl">⭐</span>}
                    {currentShape.shapeType === 'heart' && <span className="text-7xl">💖</span>}
                    {currentShape.shapeType === 'circle' && <div className="w-24 h-24 rounded-full bg-[#74B9FF] border-4 border-white shadow-md" />}
                    {currentShape.shapeType === 'square' && <div className="w-24 h-24 rounded-2xl bg-[#2ED573] border-4 border-white shadow-md" />}
                    {currentShape.shapeType === 'triangle' && (
                      <div className="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[80px] border-b-[#A29BFE]" />
                    )}
                    {currentShape.shapeType === 'diamond' && (
                      <div className="w-20 h-20 bg-[#FFA502] rotate-45 border-4 border-white shadow-md" />
                    )}
                  </div>

                  <h3 className="text-xl font-black text-slate-800 font-['Fredoka'] mt-1">
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

            {/* Target Sorting Bins (Color Bins) */}
            <div className="w-full md:w-80 grid grid-cols-2 gap-3">
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
                  className={`${bin.bg} text-slate-900 font-black p-3 rounded-2xl border-2 border-white shadow-md flex flex-col items-center justify-center cursor-pointer`}
                >
                  <span className="text-xl">📥</span>
                  <span className="text-xs font-black uppercase tracking-wider mt-1">
                    {bin.name} Bin
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANIMAL SOUNDBOARD */}
        {activeTab === 'animals' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Animal Icons Grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto kids-scrollbar pr-2">
              {ANIMAL_FACTS.map((an) => {
                const isSelected = selectedAnimal.id === an.id;
                return (
                  <motion.button
                    key={an.id}
                    id={`animal-btn-${an.id}`}
                    onClick={() => handleAnimalTap(an)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-2xl flex items-center gap-3 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 text-slate-900 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-purple-100'
                    }`}
                  >
                    <span className="text-3xl">{an.icon}</span>
                    <div className="text-left">
                      <span className="text-xs font-black block font-['Fredoka']">
                        {an.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block">
                        {an.sound}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Animal Detail Card */}
            <div className="w-full md:w-80 h-full bg-amber-50 rounded-[28px] p-5 border-2 border-amber-200 shadow-md flex flex-col items-center justify-between text-center shrink-0">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                Habitat: {selectedAnimal.habitat}
              </span>

              <div className="my-auto">
                <span className="text-6xl block my-2 animate-bounce-gentle">
                  {selectedAnimal.icon}
                </span>
                <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                  {selectedAnimal.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {selectedAnimal.funFact}
                </p>
              </div>

              <motion.button
                id="play-animal-voice-btn"
                onClick={() => handleAnimalTap(selectedAnimal)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-md flex items-center justify-center gap-2 border-2 border-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Sound: "{selectedAnimal.sound}"</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
