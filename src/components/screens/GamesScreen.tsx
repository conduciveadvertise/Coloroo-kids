import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GamesScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type GameTab = 'memory' | 'balloon' | 'puzzle';

interface MemoryCard {
  id: number;
  pairId: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const BASE_CARDS = [
  { pairId: 1, emoji: '🦁', name: 'Lion' },
  { pairId: 2, emoji: '🐬', name: 'Dolphin' },
  { pairId: 3, emoji: '🦘', name: 'Kangaroo' },
  { pairId: 4, emoji: '🐼', name: 'Panda' },
];

export const GamesScreen: React.FC<GamesScreenProps> = ({ onBack, onAddStars }) => {
  const [activeTab, setActiveTab] = useState<GameTab>('memory');

  // --- MEMORY MATCH STATE ---
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- BALLOON POP STATE ---
  const [balloonScore, setBalloonScore] = useState(0);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 1;
    BASE_CARDS.forEach(item => {
      deck.push({ id: idCounter++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });
    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setIsProcessing(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playCardFlip();

    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const firstCard = newCards.find(c => c.id === newFlipped[0])!;
      const secondCard = newCards.find(c => c.id === newFlipped[1])!;

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          sound.speak(`Matched ${firstCard.name}!`);
          setCards(prev => prev.map(c => (c.id === firstCard.id || c.id === secondCard.id) ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
          setIsProcessing(false);
          const nextCount = matchedPairsCount + 1;
          setMatchedPairsCount(nextCount);

          if (nextCount === 4) {
            sound.playFanfare();
            sound.speak("Woohoo! You matched all pairs! You are a superstar!");
            try {
              confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            } catch {}
            onAddStars(3);
          }
        }, 500);
      } else {
        // Not matched -> Flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstCard.id || c.id === secondCard.id) ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Header */}
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
            Arcade Mini-Games 🎮
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'memory' as GameTab, label: '🃏 Memory Match' },
            { id: 'balloon' as GameTab, label: '🎈 Balloon Pop' },
            { id: 'puzzle' as GameTab, label: '🧩 Jigsaw Puzzle' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(t.id);
              }}
              className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-amber-400 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Content Box */}
      <div className="flex-1 bg-white rounded-[28px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* ================= TAB 1: MEMORY MATCH ================= */}
        {activeTab === 'memory' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between shrink-0 mb-1 px-1">
              <span className="text-xs font-black text-purple-900">
                Pairs Matched: <span className="text-purple-600">{matchedPairsCount} / 4</span>
              </span>
              <button
                onClick={() => {
                  sound.playPop();
                  initMemoryGame();
                }}
                className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer shadow-sm border border-purple-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Shuffle Cards
              </button>
            </div>

            {/* 2x4 Card Grid */}
            <div className="flex-1 grid grid-cols-4 gap-2.5 sm:gap-3 p-1 items-stretch">
              {cards.map(c => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCardClick(c.id)}
                  className={`rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all shadow-md ${
                    c.isMatched
                      ? 'bg-emerald-100 border-emerald-400 shadow-lg ring-2 ring-emerald-300'
                      : c.isFlipped
                      ? 'bg-amber-100 border-amber-400 scale-105'
                      : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 border-white hover:brightness-105'
                  }`}
                >
                  {c.isFlipped || c.isMatched ? (
                    <span className="text-4xl sm:text-5xl drop-shadow-md animate-bounce-gentle">{c.emoji}</span>
                  ) : (
                    <span className="text-2xl text-amber-300 drop-shadow">★</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: BALLOON POP ================= */}
        {activeTab === 'balloon' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-2">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs font-black text-purple-900">
                Popped: <span className="text-rose-500 font-extrabold">{balloonScore}</span> Balloons
              </span>
              <button
                onClick={() => setBalloonScore(0)}
                className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center gap-4 flex-wrap my-2">
              {['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'].map((b, i) => (
                <motion.button
                  key={i + balloonScore}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    sound.playPop();
                    sound.speak("Pop!");
                    setBalloonScore(s => s + 1);
                    onAddStars(1);
                  }}
                  className="text-6xl sm:text-7xl cursor-pointer hover:drop-shadow-lg transition-transform"
                >
                  {b}
                </motion.button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400">Tap balloons to pop them and earn stars!</span>
          </div>
        )}

        {/* ================= TAB 3: JIGSAW PUZZLE ================= */}
        {activeTab === 'puzzle' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-6xl mb-2">🧩</span>
            <h2 className="text-lg font-black text-purple-950 font-['Fredoka']">Animal Jigsaw Explorer</h2>
            <p className="text-xs font-bold text-slate-500 max-w-sm mt-1">Tap shuffle in memory match to practice mental recognition!</p>
            <button
              onClick={() => {
                sound.playFanfare();
                sound.speak("You solved the mystery puzzle!");
                try {
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                } catch {}
              }}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer active:scale-95"
            >
              Solve Puzzle 🌟
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
