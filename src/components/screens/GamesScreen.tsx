import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Gamepad2,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GamesScreenProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
}

type GameMode = 'memory' | 'balloons' | 'puzzle';

export const GamesScreen: React.FC<GamesScreenProps> = ({ onBack, onAddStars }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('memory');

  // Memory
  const initialMemoryPairs = ['🦘', '🦁', '🐬', '🐼'];
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);

  const initMemoryGame = () => {
    const duplicated = [...initialMemoryPairs, ...initialMemoryPairs];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairsCount(0);
  };

  useEffect(() => {
    if (activeGame === 'memory') initMemoryGame();
    if (activeGame === 'balloons') initBalloons();
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
      const [f, s] = newFlipped;
      if (cards[f].emoji === cards[s].emoji) {
        setTimeout(() => {
          sound.playCorrect();
          const matched = [...cards];
          matched[f].isMatched = true;
          matched[s].isMatched = true;
          setCards(matched);
          setFlippedIndices([]);
          setMatchedPairsCount(prev => {
            const next = prev + 1;
            if (next === initialMemoryPairs.length) {
              sound.playFanfare();
              sound.speak("You won Memory Match! 3 Stars for you!");
              onAddStars(3);
              try { confetti({ particleCount: 50, spread: 50 }); } catch {}
            }
            return next;
          });
        }, 400);
      } else {
        setTimeout(() => {
          const reset = [...cards];
          reset[f].isFlipped = false;
          reset[s].isFlipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // Balloons
  const [balloons, setBalloons] = useState<any[]>([]);
  const [balloonScore, setBalloonScore] = useState<number>(0);

  const initBalloons = () => {
    const balloonColors = ['#FF7675', '#74B9FF', '#FDCB6E', '#55EFC4', '#FD79A8', '#A29BFE'];
    const emojis = ['⭐', '🎈', '💖', '🌟', '🎨'];
    const generated = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      color: balloonColors[i % balloonColors.length],
      emoji: emojis[i % emojis.length],
      popped: false
    }));
    setBalloons(generated);
    setBalloonScore(0);
  };

  const handlePopBalloon = (id: number) => {
    sound.playPop();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setBalloonScore(prev => {
      const next = prev + 1;
      if (next === 8) {
        sound.playFanfare();
        onAddStars(3);
        try { confetti({ particleCount: 50, spread: 50 }); } catch {}
      }
      return next;
    });
  };

  // Puzzle
  const [puzzlePlaced, setPuzzlePlaced] = useState<boolean[]>([false, false, false, false]);

  const handlePlacePuzzlePiece = (index: number) => {
    sound.playPop();
    const next = [...puzzlePlaced];
    next[index] = true;
    setPuzzlePlaced(next);
    if (next.every(Boolean)) {
      sound.playFanfare();
      onAddStars(3);
      try { confetti({ particleCount: 50, spread: 50 }); } catch {}
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-1.5 select-none overflow-hidden">
      {/* Top Nav */}
      <div className="flex items-center justify-between gap-1.5 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playPop(); onBack(); }}
            className="px-2 py-1 rounded-xl bg-white text-purple-900 border border-purple-100 flex items-center gap-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black">Back</span>
          </button>
          <span className="text-xs sm:text-sm font-black text-purple-900 font-['Fredoka']">Arcade 🎮</span>
        </div>

        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-purple-100">
          {[
            { id: 'memory' as GameMode, label: '🃏 Memory' },
            { id: 'balloons' as GameMode, label: '🎈 Balloon' },
            { id: 'puzzle' as GameMode, label: '🧩 Puzzle' },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => { sound.playPop(); setActiveGame(g.id); }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                activeGame === g.id ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl p-2 border border-purple-100 shadow flex flex-col justify-between overflow-hidden">
        {activeGame === 'memory' && (
          <div className="h-full flex flex-col items-center justify-between">
            <div className="flex items-center justify-between w-full shrink-0">
              <span className="text-[10px] font-black text-purple-900">Matched: {matchedPairsCount}/4</span>
              <button onClick={initMemoryGame} className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 text-[10px] font-bold border border-purple-200">
                <RefreshCw className="w-3 h-3 inline mr-1" /> Shuffle
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-sm w-full my-auto">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl border transition-all ${
                    card.isMatched
                      ? 'bg-emerald-400 text-white'
                      : card.isFlipped
                      ? 'bg-purple-50 border-purple-600 text-purple-900'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : '★'}
                </button>
              ))}
            </div>
            <div className="text-[9px] text-slate-400">Find the cute animal twins!</div>
          </div>
        )}

        {activeGame === 'balloons' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between w-full shrink-0">
              <span className="text-[10px] font-black text-purple-900">Popped: {balloonScore}/8</span>
              <button onClick={initBalloons} className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 text-[10px] font-bold border border-purple-200">
                More 🎈
              </button>
            </div>
            <div className="flex-1 flex items-center justify-around my-auto">
              {balloons.map((b) => (
                <div key={b.id}>
                  {!b.popped ? (
                    <button
                      onClick={() => handlePopBalloon(b.id)}
                      style={{ backgroundColor: b.color }}
                      className="w-10 h-14 rounded-full flex items-center justify-center text-lg border-2 border-white shadow cursor-pointer active:scale-90"
                    >
                      {b.emoji}
                    </button>
                  ) : (
                    <div className="text-xl">💥</div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[9px] text-center text-slate-400">Pop the floating balloons!</div>
          </div>
        )}

        {activeGame === 'puzzle' && (
          <div className="h-full flex flex-row items-center justify-around gap-2">
            <div className="w-36 h-36 bg-amber-50 rounded-2xl p-1.5 border-2 border-amber-300 grid grid-cols-2 gap-1 shrink-0">
              {['🌈', '☀️', '🦘', '🎨'].map((emoji, idx) => (
                <div key={idx} className="rounded-xl border border-dashed border-amber-300 flex items-center justify-center bg-white">
                  {puzzlePlaced[idx] ? <span className="text-2xl">{emoji}</span> : <span className="text-[9px] text-slate-300">P{idx + 1}</span>}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                {[
                  { idx: 0, label: 'Rainbow', emoji: '🌈' },
                  { idx: 1, label: 'Sun', emoji: '☀️' },
                  { idx: 2, label: 'Roo', emoji: '🦘' },
                  { idx: 3, label: 'Paint', emoji: '🎨' },
                ].map(p => (
                  <button
                    key={p.idx}
                    disabled={puzzlePlaced[p.idx]}
                    onClick={() => handlePlacePuzzlePiece(p.idx)}
                    className={`px-2 py-1.5 rounded-xl border flex items-center gap-1 ${
                      puzzlePlaced[p.idx] ? 'bg-slate-100 opacity-40' : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <span className="text-[9px] font-black">{p.label}</span>
                  </button>
                ))}
              </div>
              {puzzlePlaced.every(Boolean) && (
                <button onClick={() => setPuzzlePlaced([false, false, false, false])} className="px-2.5 py-0.5 bg-amber-400 text-slate-900 font-black text-[10px] rounded-lg">
                  Rebuild!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
