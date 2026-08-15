import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  ChevronLeft,
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
  const [selectedPhonics, setSelectedPhonics] = useState<PhonicsCard>(PHONICS_LIST[0]);
  const [countLevelIdx, setCountLevelIdx] = useState<number>(2);
  const currentCountLevel = COUNTING_LEVELS[countLevelIdx];
  const [poppedItems, setPoppedItems] = useState<number[]>([]);
  const [shapeQueue, setShapeQueue] = useState<ShapeItem[]>([...SHAPES_DATA]);
  const [shapeScore, setShapeScore] = useState<number>(0);
  const currentShape = shapeQueue[0];
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalFact>(ANIMAL_FACTS[0]);

  const handlePlayPhonics = (card: PhonicsCard) => {
    setSelectedPhonics(card);
    sound.playPop();
    sound.speak(card.audioPrompt);
  };

  const handleTapCountItem = (index: number) => {
    if (poppedItems.includes(index)) return;
    sound.playPop();
    const updated = [...poppedItems, index];
    setPoppedItems(updated);
    sound.speak(`${updated.length}`);

    if (updated.length === currentCountLevel.number) {
      setTimeout(() => {
        sound.playFanfare();
        sound.speak(`Awesome! You counted ${currentCountLevel.number} ${currentCountLevel.itemName}!`);
        onAddStars(2);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        } catch {}
      }, 300);
    }
  };

  const handleNextMathLevel = () => {
    sound.playPop();
    setPoppedItems([]);
    setCountLevelIdx((prev) => (prev + 1) % COUNTING_LEVELS.length);
  };

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
        try { confetti({ particleCount: 50, spread: 50 }); } catch {}
      }
    } else {
      sound.playPop();
      sound.speak(`Try again! Find the ${currentShape.colorName} bin!`);
    }
  };

  const handleAnimalTap = (animal: AnimalFact) => {
    setSelectedAnimal(animal);
    sound.playSparkle();
    sound.speak(`${animal.name} says ${animal.sound}. ${animal.funFact}`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-1.5 sm:p-2 select-none overflow-hidden">
      {/* Top Header Row with Tabs */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playPop(); onBack(); }}
            className="px-2 py-1 rounded-xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 flex items-center gap-1 border border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-[10px] font-bold text-purple-900">Back</span>
          </button>
          <span className="text-xs sm:text-sm font-black text-purple-900 font-['Fredoka']">
            Learn & Play 🌟
          </span>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-100 shadow-sm">
          {[
            { id: 'phonics' as TabType, label: '🔤 ABC' },
            { id: 'math' as TabType, label: '🔢 Math' },
            { id: 'shapes' as TabType, label: '🔷 Shapes' },
            { id: 'animals' as TabType, label: '🦁 Animals' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { sound.playPop(); setActiveTab(tab.id); }}
              className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl p-2 sm:p-2.5 border border-purple-100 shadow-md flex overflow-hidden">
        {/* TAB 1: PHONICS ABC */}
        {activeTab === 'phonics' && (
          <div className="w-full h-full flex flex-row gap-2 items-center justify-between">
            <div className="flex-1 h-full overflow-y-auto no-scrollbar grid grid-cols-6 sm:grid-cols-7 gap-1.5 p-1">
              {PHONICS_LIST.map((card) => {
                const isSelected = selectedPhonics.letter === card.letter;
                return (
                  <button
                    key={card.letter}
                    onClick={() => handlePlayPhonics(card)}
                    className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-white shadow scale-105'
                        : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-purple-100'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-black font-['Fredoka'] leading-none">{card.letter}</span>
                    <span className="text-[10px] leading-none mt-0.5">{card.icon}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-48 sm:w-56 h-full bg-rose-50 rounded-2xl p-2 border border-rose-200 flex flex-col items-center justify-between text-center shrink-0">
              <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                Sound: /{selectedPhonics.phonicsSound}/
              </span>
              <div className="my-auto">
                <span className="text-4xl sm:text-5xl font-black text-purple-900 font-['Fredoka'] block leading-none">
                  {selectedPhonics.letter}
                </span>
                <span className="text-3xl my-1 block">{selectedPhonics.icon}</span>
                <span className="text-sm sm:text-base font-black text-slate-800 font-['Fredoka'] block">
                  {selectedPhonics.word}
                </span>
              </div>
              <button
                onClick={() => handlePlayPhonics(selectedPhonics)}
                className="w-full py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1 border border-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MATH */}
        {activeTab === 'math' && (
          <div className="w-full h-full flex flex-col justify-between items-center text-center p-1">
            <div className="flex items-center justify-between w-full shrink-0">
              <span className="text-[10px] font-bold text-purple-900 uppercase">Tap items to count</span>
              <button
                onClick={handleNextMathLevel}
                className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 font-bold text-[10px] flex items-center gap-1 border border-purple-200"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next</span>
              </button>
            </div>
            <div className="bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 inline-flex items-center gap-2 my-0.5 shrink-0">
              <span className="text-2xl font-black text-amber-500 font-['Fredoka']">{currentCountLevel.number}</span>
              <span className="text-sm font-black text-slate-800 font-['Fredoka']">{currentCountLevel.word} ({currentCountLevel.itemName})</span>
            </div>
            <div className="flex-1 w-full flex flex-wrap items-center justify-center gap-2 p-1 overflow-y-auto no-scrollbar">
              {Array.from({ length: currentCountLevel.number }).map((_, idx) => {
                const isPopped = poppedItems.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTapCountItem(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all ${
                      isPopped ? 'bg-emerald-400 border-white scale-105 shadow-inner' : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
                    }`}
                  >
                    {currentCountLevel.itemEmoji}
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-slate-700 shrink-0">
              Counted: <span className="text-purple-600 font-black">{poppedItems.length}</span> of {currentCountLevel.number}
            </div>
          </div>
        )}

        {/* TAB 3: SHAPES */}
        {activeTab === 'shapes' && (
          <div className="w-full h-full flex flex-row gap-3 items-center justify-between p-1">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {currentShape ? (
                <div className="bg-cyan-50 p-3 rounded-2xl border border-cyan-200 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black text-cyan-700 mb-1">Match Color!</span>
                  <div className="w-16 h-16 flex items-center justify-center my-1">
                    {currentShape.shapeType === 'star' && <span className="text-4xl">⭐</span>}
                    {currentShape.shapeType === 'heart' && <span className="text-4xl">💖</span>}
                    {currentShape.shapeType === 'circle' && <div className="w-12 h-12 rounded-full bg-[#74B9FF] border-2 border-white shadow" />}
                    {currentShape.shapeType === 'square' && <div className="w-12 h-12 rounded-xl bg-[#2ED573] border-2 border-white shadow" />}
                    {currentShape.shapeType === 'diamond' && <div className="w-10 h-10 bg-[#FFA502] rotate-45 border-2 border-white shadow" />}
                  </div>
                  <h3 className="text-xs font-black text-slate-800 font-['Fredoka']">{currentShape.name}</h3>
                </div>
              ) : (
                <div className="text-center">
                  <Award className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-sm font-black text-purple-900 font-['Fredoka']">Completed!</h3>
                  <button onClick={() => { setShapeQueue([...SHAPES_DATA]); setShapeScore(0); }} className="mt-1 px-3 py-1 bg-cyan-500 text-white font-black text-xs rounded-xl">Play Again</button>
                </div>
              )}
            </div>
            <div className="w-48 sm:w-56 grid grid-cols-2 gap-1.5">
              {[
                { name: 'Yellow', bg: 'bg-[#FDCB6E]' },
                { name: 'Red', bg: 'bg-[#FF7675]' },
                { name: 'Blue', bg: 'bg-[#74B9FF]' },
                { name: 'Green', bg: 'bg-[#2ED573]' },
                { name: 'Purple', bg: 'bg-[#A29BFE]' },
                { name: 'Orange', bg: 'bg-[#FFA502]' },
              ].map(bin => (
                <button
                  key={bin.name}
                  onClick={() => handleSortShape(bin.name)}
                  className={`${bin.bg} text-slate-900 font-black p-1.5 rounded-xl border border-white text-[10px] flex items-center justify-center gap-1`}
                >
                  <span>📥</span> <span>{bin.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANIMALS */}
        {activeTab === 'animals' && (
          <div className="w-full h-full flex flex-row gap-2 items-center justify-between">
            <div className="flex-1 h-full grid grid-cols-2 sm:grid-cols-3 gap-1.5 overflow-y-auto no-scrollbar p-1">
              {ANIMAL_FACTS.map((an) => (
                <button
                  key={an.id}
                  onClick={() => handleAnimalTap(an)}
                  className={`p-1.5 rounded-xl flex items-center gap-2 border transition-all ${
                    selectedAnimal.id === an.id ? 'bg-amber-100 text-slate-900 border-amber-400' : 'bg-slate-50 border-purple-100 text-slate-800'
                  }`}
                >
                  <span className="text-xl">{an.icon}</span>
                  <div className="text-left leading-none">
                    <span className="text-[10px] font-black font-['Fredoka'] block">{an.name}</span>
                    <span className="text-[8px] text-slate-500">{an.sound}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="w-48 sm:w-56 h-full bg-amber-50 rounded-2xl p-2 border border-amber-200 flex flex-col items-center justify-between text-center shrink-0">
              <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                {selectedAnimal.habitat}
              </span>
              <div className="my-auto leading-tight">
                <span className="text-3xl block my-0.5">{selectedAnimal.icon}</span>
                <h3 className="text-xs font-black text-slate-800 font-['Fredoka']">{selectedAnimal.name}</h3>
                <p className="text-[9px] text-slate-600 line-clamp-2 mt-0.5">{selectedAnimal.funFact}</p>
              </div>
              <button
                onClick={() => handleAnimalTap(selectedAnimal)}
                className="w-full py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-[10px] flex items-center justify-center gap-1 border border-white"
              >
                <Volume2 className="w-3 h-3" />
                <span>Hear Sound</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
