import React, { useState } from 'react';
import {
  ChevronLeft,
  Lock,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { UNLOCKABLE_STICKERS } from '../../data/coloringPages';
import { ChildProfile, StickerItem } from '../../types';
import { sound } from '../../services/soundEffects';

interface TrophyScreenProps {
  profile: ChildProfile;
  onBack: () => void;
}

export const TrophyScreen: React.FC<TrophyScreenProps> = ({ profile, onBack }) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerItem>(UNLOCKABLE_STICKERS[0]);
  const [bookStickers, setBookStickers] = useState<{ id: string; emoji: string; x: number; y: number }[]>([
    { id: '1', emoji: '⭐', x: 25, y: 30 },
    { id: '2', emoji: '🌈', x: 50, y: 25 }
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedSticker.requiredStars > profile.stars) {
      sound.playPop();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sound.playSparkle();
    setBookStickers(prev => [...prev, { id: `book-${Date.now()}`, emoji: selectedSticker.emojiOrSvg, x, y }]);
  };

  const trophies = [
    { id: 'tr-1', title: 'First Art', icon: '🎨', unlocked: true },
    { id: 'tr-2', title: 'Color Guru', icon: '🌈', unlocked: true },
    { id: 'tr-3', title: 'Star Champ', icon: '⭐', unlocked: profile.stars >= 15 },
    { id: 'tr-4', title: 'ABC Whiz', icon: '🔤', unlocked: true },
    { id: 'tr-5', title: 'Arcade Pro', icon: '🎈', unlocked: true },
    { id: 'tr-6', title: 'Master', icon: '🏆', unlocked: profile.level >= 5 }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-1.5 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-1.5 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playPop(); onBack(); }}
            className="px-2 py-1 rounded-xl bg-white text-purple-900 border border-purple-100 flex items-center gap-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black">Back</span>
          </button>
          <span className="text-xs sm:text-sm font-black text-purple-900 font-['Fredoka']">Trophy Room 🏆</span>
        </div>

        <div className="flex items-center gap-2 bg-white px-2.5 py-0.5 rounded-xl border border-purple-100 text-[10px] font-black text-purple-900">
          <span>Lv. {profile.level}</span>
          <span className="text-amber-500">{profile.stars}/30 ⭐</span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2">
        {/* Left Playground */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-1.5 border border-purple-100 shadow overflow-hidden">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <span className="text-[9px] font-black text-purple-900">Tap to place stickers</span>
            <button onClick={() => setBookStickers([])} className="px-1.5 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[9px] font-bold">
              <Trash2 className="w-2.5 h-2.5 inline" /> Clear
            </button>
          </div>

          <div
            onClick={handleCanvasClick}
            className="flex-1 w-full rounded-xl relative overflow-hidden bg-gradient-to-b from-[#74B9FF] to-[#55EFC4] border border-white shadow-inner cursor-pointer"
          >
            <div className="absolute top-2 left-3 text-2xl">☀️</div>
            <div className="absolute top-3 right-4 text-xl opacity-80">☁️</div>
            {bookStickers.map(st => (
              <div
                key={st.id}
                style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, transform: 'translate(-50%, -50%)' }}
                className="text-2xl pointer-events-none drop-shadow"
              >
                {st.emoji}
              </div>
            ))}
          </div>

          <div className="mt-1 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {UNLOCKABLE_STICKERS.map(s => {
              const isLocked = s.requiredStars > profile.stars;
              return (
                <button
                  key={s.id}
                  onClick={() => { sound.playPop(); setSelectedSticker(s); }}
                  className={`p-1 rounded-lg text-lg shrink-0 relative ${
                    selectedSticker.id === s.id ? 'bg-amber-400 border border-white' : 'bg-purple-50'
                  }`}
                >
                  {s.emojiOrSvg}
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-amber-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Trophy Shelf */}
        <div className="bg-white rounded-2xl p-1.5 border border-purple-100 shadow flex flex-col justify-between overflow-hidden">
          <span className="text-[9px] font-black text-purple-900 mb-1 shrink-0">Badges & Awards</span>
          <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-1.5 p-0.5">
            {trophies.map(t => (
              <div
                key={t.id}
                className={`p-1 rounded-xl border flex flex-col items-center justify-center text-center ${
                  t.unlocked ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 opacity-40'
                }`}
              >
                <span className="text-xl mb-0.5">{t.icon}</span>
                <span className="text-[9px] font-black leading-none">{t.title}</span>
                {t.unlocked && (
                  <span className="text-[7px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <CheckCircle2 className="w-2 h-2" /> Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
