import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { sound } from '../../services/soundEffects';

export const GamesScreen: React.FC<{onBack: () => void, onAddStars: (n: number) => void}> = ({ onBack, onAddStars }) => {
  const [activeGame, setActiveGame] = useState<'memory' | 'balloons'>('memory');
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const arr = ['🦘', '🦁', '🐬', '🐼', '🦘', '🦁', '🐬', '🐼'].sort(() => Math.random() - 0.5);
    setCards(arr.map((emoji, i) => ({ id: i, emoji, flipped: false })));
  }, []);

  return (
    <div className="w-full h-full bg-[#F3E8FF] p-4 flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <button onClick={onBack} className="p-3 rounded-2xl bg-white shadow-md text-purple-900"><ChevronLeft size={24}/></button>
         <h1 className="text-2xl font-black text-purple-900">Arcade Games 🎮</h1>
       </div>
       <div className="flex-1 grid grid-cols-4 gap-4">
         {cards.map((c, i) => (
           <button key={i} onClick={() => sound.playPop()} className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl text-4xl shadow-xl flex items-center justify-center">
             {c.flipped ? c.emoji : '★'}
           </button>
         ))}
       </div>
    </div>
  );
};
