import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  ChevronLeft, 
  Sparkles, 
  RefreshCw, 
  Award, 
  Trophy, 
  Check 
} from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GamesScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type GameMode = 'memory' | 'balloons' | 'puzzle';

interface MemoryCard {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Balloon {
  id: number;
  color: string;
  emoji: string;
  x: number;
  speed: number;
  popped: boolean;
}

export const GamesScreen: React.FC<GamesScreenProps> = ({
  onBack,
  onAddStars
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('memory');

  // --- MEMORY MATCH STATE ---
  const initialMemoryPairs = ['🦘', '🦁', '🐬', '🐼'];
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);

  const initMemoryGame = () => {
    const duplicated = [...initialMemoryPairs, ...initialMemoryPairs];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        name: emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairsCount(0);
  };

  useEffect(() => {
    if (activeGame === 'memory') {
      initMemoryGame();
    }
  }, [activeGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    sound.playCardFlip();
    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Match!
        setTimeout(() => {
          sound.playCorrect();
          const matched = [...cards];
          matched[firstIdx].isMatched = true;
          matched[secondIdx].isMatched = true;
          setCards(matched);
          setFlippedIndices([]);
          setMatchedPairsCount(prev => {
            const next = prev + 1;
            if (next === initialMemoryPairs.length) {
              sound.playFanfare();
              sound.speak("You won Memory Match! 3 Stars for you!");
              onAddStars(3);
              try { confetti({ particleCount: 60, spread: 60 }); } catch {}
            }
            return next;
          });
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          const reset = [...cards];
          reset[firstIdx].isFlipped = false;
          reset[secondIdx].isFlipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // --- BALLOON POP STATE ---
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [balloonScore, setBalloonScore] = useState<number>(0);

  const initBalloons = () => {
    const balloonColors = ['#FF7675', '#74B9FF', '#FDCB6E', '#55EFC4', '#FD79A8', '#A29BFE'];
    const emojis = ['⭐', '🎈', '💖', '🌟', '🎨'];
    const generated: Balloon[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      color: balloonColors[i % balloonColors.length],
      emoji: emojis[i % emojis.length],
      x: 10 + (i * 11),
      speed: 3 + Math.random() * 2,
      popped: false
    }));
    setBalloons(generated);
    setBalloonScore(0);
  };

  useEffect(() => {
    if (activeGame === 'balloons') {
      initBalloons();
    }
  }, [activeGame]);

  const handlePopBalloon = (id: number) => {
    sound.playPop();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setBalloonScore(prev => {
      const next = prev + 1;
      if (next === 8) {
        sound.playFanfare();
        sound.speak("You popped all the balloons! Super job!");
        onAddStars(3);
        try { confetti({ particleCount: 70, spread: 60 }); } catch {}
      }
      return next;
    });
  };

  // --- JIGSAW PUZZLE STATE ---
  const [puzzlePlaced, setPuzzlePlaced] = useState<boolean[]>([false, false, false, false]);

  const handlePlacePuzzlePiece = (index: number) => {
    sound.playPop();
    const next = [...puzzlePlaced];
    next[index] = true;
    setPuzzlePlaced(next);

    if (next.every(Boolean)) {
      sound.playFanfare();
      sound.speak("Puzzle complete! You built Coloroo's rainbow!");
      onAddStars(3);
      try { confetti({ particleCount: 70, spread: 60 }); } catch {}
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Top Bar with Games Switcher */}
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="games-back-btn"
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
            Arcade Mini-Games 🎮
          </h1>
        </div>

        {/* Game Mode Pills */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'memory' as GameMode, label: '🃏 Memory Match' },
            { id: 'balloons' as GameMode, label: '🎈 Balloon Pop' },
            { id: 'puzzle' as GameMode, label: '🧩 Jigsaw Puzzle' },
          ].map(g => (
            <button
              key={g.id}
              id={`game-pill-${g.id}`}
              onClick={() => {
                sound.playPop();
                setActiveGame(g.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeGame === g.id
                  ? 'bg-amber-400 text-slate-900 font-black shadow-md scale-105 border border-white'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="flex-1 min-h-0 bg-white rounded-[32px] sm:rounded-[36px] p-4 border-2 border-purple-100 border-b-[8px] border-b-amber-400 shadow-xl flex flex-col justify-between relative overflow-hidden">
        {/* GAME 1: MEMORY MATCH */}
        {activeGame === 'memory' && (
          <div className="h-full flex flex-col items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-purple-900">
                Pairs Matched: {matchedPairsCount} / {initialMemoryPairs.length}
              </span>
              <button
                id="reset-memory-btn"
                onClick={initMemoryGame}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Shuffle Cards</span>
              </button>
            </div>

            {/* 8 Card Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl w-full my-auto">
              {cards.map((card, idx) => (
                <motion.button
                  key={card.id}
                  id={`memory-card-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-2xl sm:rounded-3xl border-3 flex items-center justify-center text-3xl sm:text-4xl transition-all cursor-pointer shadow-lg relative ${
                    card.isMatched
                      ? 'bg-emerald-400 border-white text-white opacity-90'
                      : card.isFlipped
                      ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xl'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-white text-transparent hover:brightness-105'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span>{card.emoji}</span>
                  ) : (
                    <span className="text-xl text-amber-300 font-black font-['Fredoka']">
                      ★
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Tap cards to find the cute animal twins!
            </div>
          </div>
        )}

        {/* GAME 2: BALLOON POP */}
        {activeGame === 'balloons' && (
          <div className="h-full flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between z-20">
              <span className="text-xs font-black text-purple-900">
                Popped: {balloonScore} / 8 Balloons
              </span>
              <button
                id="reset-balloons-btn"
                onClick={initBalloons}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>More Balloons!</span>
              </button>
            </div>

            {/* Balloon Stage Area */}
            <div className="flex-1 relative w-full h-full my-auto flex items-center justify-around">
              {balloons.map((b) => (
                <div key={b.id} className="relative h-full flex items-center">
                  {!b.popped ? (
                    <motion.button
                      id={`balloon-${b.id}`}
                      onClick={() => handlePopBalloon(b.id)}
                      animate={{
                        y: [0, -25, 0],
                        rotate: [-3, 3, -3]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: b.speed,
                        ease: 'easeInOut'
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.8 }}
                      style={{ backgroundColor: b.color }}
                      className="w-14 h-18 sm:w-16 sm:h-20 rounded-full flex flex-col items-center justify-center text-xl shadow-xl border-2 border-white cursor-pointer relative"
                    >
                      <span>{b.emoji}</span>
                      {/* Balloon String */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-purple-400" />
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ scale: 1.5, opacity: 1 }}
                      animate={{ scale: 0, opacity: 0 }}
                      className="text-2xl"
                    >
                      💥
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-center text-slate-500 font-medium z-20">
              Tap the floating balloons before they fly into the sky!
            </div>
          </div>
        )}

        {/* GAME 3: JIGSAW PUZZLE BUILDER */}
        {activeGame === 'puzzle' && (
          <div className="h-full flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Target Puzzle Board */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 bg-amber-50 rounded-3xl p-3 border-4 border-amber-300 shadow-md grid grid-cols-2 gap-2 relative">
              {/* Piece 1 */}
              <div className="rounded-2xl border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden bg-white">
                {puzzlePlaced[0] ? (
                  <div className="w-full h-full bg-[#FF7675] flex items-center justify-center text-4xl shadow-inner font-black text-white">
                    🌈
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Piece 1</span>
                )}
              </div>

              {/* Piece 2 */}
              <div className="rounded-2xl border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden bg-white">
                {puzzlePlaced[1] ? (
                  <div className="w-full h-full bg-[#FDCB6E] flex items-center justify-center text-4xl shadow-inner font-black text-white">
                    ☀️
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Piece 2</span>
                )}
              </div>

              {/* Piece 3 */}
              <div className="rounded-2xl border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden bg-white">
                {puzzlePlaced[2] ? (
                  <div className="w-full h-full bg-[#55EFC4] flex items-center justify-center text-4xl shadow-inner font-black text-white">
                    🦘
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Piece 3</span>
                )}
              </div>

              {/* Piece 4 */}
              <div className="rounded-2xl border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden bg-white">
                {puzzlePlaced[3] ? (
                  <div className="w-full h-full bg-[#6C5CE7] flex items-center justify-center text-4xl shadow-inner font-black text-white">
                    🎨
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Piece 4</span>
                )}
              </div>
            </div>

            {/* Available Pieces tray */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase font-black text-purple-900 tracking-wider mb-2">
                Tap each piece to snap it in place!
              </span>

              <div className="grid grid-cols-2 gap-3 max-w-xs w-full mb-3">
                {[
                  { idx: 0, label: 'Rainbow Sky', emoji: '🌈', color: '#FF7675' },
                  { idx: 1, label: 'Happy Sun', emoji: '☀️', color: '#FDCB6E' },
                  { idx: 2, label: 'Coloroo Mascot', emoji: '🦘', color: '#55EFC4' },
                  { idx: 3, label: 'Magic Paint', emoji: '🎨', color: '#6C5CE7' },
                ].map(p => (
                  <motion.button
                    key={p.idx}
                    id={`puzzle-piece-${p.idx}`}
                    disabled={puzzlePlaced[p.idx]}
                    onClick={() => handlePlacePuzzlePiece(p.idx)}
                    whileHover={!puzzlePlaced[p.idx] ? { scale: 1.08 } : {}}
                    whileTap={!puzzlePlaced[p.idx] ? { scale: 0.92 } : {}}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      puzzlePlaced[p.idx]
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-purple-50 text-slate-800 border-purple-200 shadow-md'
                    }`}
                  >
                    <span className="text-3xl">{p.emoji}</span>
                    <span className="text-[10px] font-black uppercase mt-1">
                      {puzzlePlaced[p.idx] ? '✓ Snapped' : p.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {puzzlePlaced.every(Boolean) && (
                <button
                  id="reset-puzzle-btn"
                  onClick={() => setPuzzlePlaced([false, false, false, false])}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-xl cursor-pointer"
                >
                  Build Again!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
