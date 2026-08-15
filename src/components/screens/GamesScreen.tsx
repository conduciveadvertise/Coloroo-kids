import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, Star, Sparkles } from 'lucide-react';
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

interface FloatingBalloon {
  id: number;
  color: string;
  xPos: number;       // percentage 10% - 85%
  duration: number;   // speed
  delay: number;
  hasStar: boolean;
}

const BALLOON_COLORS = ['#FF4D4D', '#FF9F43', '#10AC84', '#00D2D3', '#54A0FF', '#5F27CD', '#FF6B6B', '#FECA57'];

export const GamesScreen: React.FC<GamesScreenProps> = ({ onBack, onAddStars }) => {
  const [activeTab, setActiveTab] = useState<GameTab>('balloon');

  // --- MEMORY MATCH STATE ---
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- BALLOON POP STATE (Rising Floating Physics) ---
  const [poppedCount, setPoppedCount] = useState(0);
  const [starsWon, setStarsWon] = useState(0);
  const [balloons, setBalloons] = useState<FloatingBalloon[]>([]);
  const [floatingStars, setFloatingStars] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnBalloons = () => {
    const list: FloatingBalloon[] = [];
    for (let i = 0; i < 7; i++) {
      list.push({
        id: Date.now() + i + Math.random(),
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        xPos: 8 + Math.random() * 78,
        duration: 4.5 + Math.random() * 2.5,
        delay: Math.random() * 2,
        hasStar: Math.random() < 0.35 // 35% chance to give star
      });
    }
    setBalloons(list);
  };

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 1;
    BASE_CARDS.forEach(item => {
      deck.push({ id: idCounter++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setIsProcessing(false);
  };

  useEffect(() => {
    initMemoryGame();
    spawnBalloons();
  }, []);

  // Pop a Rising Balloon
  const handlePopBalloon = (balloon: FloatingBalloon, e: React.MouseEvent) => {
    sound.playPop();
    setPoppedCount(prev => prev + 1);

    // Remove popped balloon and respawn
    setBalloons(prev => {
      const filtered = prev.filter(b => b.id !== balloon.id);
      const newBalloon: FloatingBalloon = {
        id: Date.now() + Math.random(),
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        xPos: 8 + Math.random() * 78,
        duration: 4.2 + Math.random() * 2.5,
        delay: 0.1,
        hasStar: Math.random() < 0.35
      };
      return [...filtered, newBalloon];
    });

    if (balloon.hasStar) {
      sound.playCorrect();
      setStarsWon(s => s + 1);
      onAddStars(1);

      // Star particle animation
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const starId = Date.now();
      setFloatingStars(prev => [...prev, { id: starId, x: rect.left + rect.width / 2, y: rect.top }]);
      setTimeout(() => {
        setFloatingStars(prev => prev.filter(s => s.id !== starId));
      }, 900);
    }
  };

  // Memory card click
  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;
    const clicked = cards.find(c => c.id === cardId);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    sound.playCardFlip();
    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const first = newCards.find(c => c.id === newFlipped[0])!;
      const second = newCards.find(c => c.id === newFlipped[1])!;

      if (first.pairId === second.pairId) {
        setTimeout(() => {
          sound.playCorrect();
          sound.speak(`Matched ${first.name}!`);
          setCards(prev => prev.map(c => (c.id === first.id || c.id === second.id) ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
          setIsProcessing(false);
          const nextCount = matchedPairsCount + 1;
          setMatchedPairsCount(nextCount);

          if (nextCount === 4) {
            sound.playFanfare();
            sound.speak("Superstar! You solved the memory match!");
            try { confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } }); } catch {}
            onAddStars(3);
          }
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === first.id || c.id === second.id) ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 800);
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'balloon' as GameTab, label: '🎈 Balloon Pop' },
            { id: 'memory' as GameTab, label: '🃏 Memory Match' },
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

      {/* Main Game Stage */}
      <div className="flex-1 bg-white rounded-[28px] p-3 border-2 border-purple-100 shadow-xl flex flex-col justify-between min-h-0 relative overflow-hidden">
        
        {/* ================= TAB 1: BALLOON POP (RISING FROM BOTTOM) ================= */}
        {activeTab === 'balloon' && (
          <div className="w-full h-full relative overflow-hidden flex flex-col justify-between">
            {/* Top Stat Bar */}
            <div className="flex items-center justify-between z-20 px-2 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-purple-950 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                  Popped: <span className="text-rose-500">{poppedCount}</span> 🎈
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Stars Found: {starsWon}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  setPoppedCount(0);
                  setStarsWon(0);
                  spawnBalloons();
                }}
                className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer border border-purple-100"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Rising Balloons Interactive Sky */}
            <div className="flex-1 relative w-full h-full overflow-hidden">
              {balloons.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ y: '120vh', opacity: 0.9 }}
                  animate={{ y: '-140px', opacity: 1 }}
                  transition={{
                    duration: b.duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: b.delay
                  }}
                  style={{ left: `${b.xPos}%` }}
                  onClick={(e) => handlePopBalloon(b, e)}
                  className="absolute bottom-0 cursor-pointer active:scale-75 transition-transform"
                >
                  <div className="relative flex flex-col items-center group">
                    {/* SVG Realistic Color Balloon */}
                    <svg width="60" height="75" viewBox="0 0 60 75" className="drop-shadow-md">
                      <path
                        d="M30,5 C48,5 55,22 55,38 C55,54 40,62 33,65 L32,68 L28,68 L27,65 C20,62 5,54 5,38 C5,22 12,5 30,5 Z"
                        fill={b.color}
                      />
                      <ellipse cx="22" cy="20" rx="6" ry="12" fill="white" opacity="0.35" transform="rotate(-20 22 20)" />
                      <polygon points="30,68 34,73 26,73" fill={b.color} />
                    </svg>
                    {/* Balloon String */}
                    <div className="w-[1.5px] h-9 bg-slate-400 -mt-0.5 transform rotate-2"></div>

                    {b.hasStar && (
                      <span className="absolute top-4 text-xs">⭐</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Floating Star Animation on Pop */}
              {floatingStars.map(s => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -60, scale: 1.6 }}
                  transition={{ duration: 0.8 }}
                  className="fixed z-50 pointer-events-none text-2xl font-black text-amber-500"
                  style={{ left: s.x, top: s.y }}
                >
                  ⭐ +1
                </motion.div>
              ))}
            </div>

            <div className="text-center z-20 shrink-0">
              <span className="text-[10px] font-bold text-slate-400">
                Tap rising balloons as they float up! Golden stars hide inside some balloons!
              </span>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MEMORY MATCH ================= */}
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

            <div className="flex-1 grid grid-cols-4 gap-2.5 p-1 items-stretch">
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
                    <span className="text-4xl sm:text-5xl drop-shadow-md">{c.emoji}</span>
                  ) : (
                    <span className="text-2xl text-amber-300 drop-shadow">★</span>
                  )}
                </motion.button>
              ))}
            </div>
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
                try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
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
