import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  ChevronLeft, 
  Star, 
  Lock, 
  Sparkles, 
  Layers, 
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

interface PlacedBookSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export const TrophyScreen: React.FC<TrophyScreenProps> = ({
  profile,
  onBack
}) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerItem>(UNLOCKABLE_STICKERS[0]);
  const [bookStickers, setBookStickers] = useState<PlacedBookSticker[]>([
    { id: '1', emoji: '⭐', x: 20, y: 30 },
    { id: '2', emoji: '🌈', x: 50, y: 20 },
    { id: '3', emoji: '👑', x: 75, y: 40 }
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedSticker.requiredStars > profile.stars) {
      sound.playPop();
      sound.speak(`You need ${selectedSticker.requiredStars} stars to unlock this sticker!`);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    sound.playSparkle();
    setBookStickers(prev => [
      ...prev,
      {
        id: `book-${Date.now()}-${Math.random()}`,
        emoji: selectedSticker.emojiOrSvg,
        x,
        y
      }
    ]);
  };

  const trophies = [
    { id: 'tr-1', title: 'First Painting', desc: 'Completed your first coloring page', icon: '🎨', unlocked: true },
    { id: 'tr-2', title: 'Color Master', desc: 'Used over 10 magical colors', icon: '🌈', unlocked: true },
    { id: 'tr-3', title: 'Star Collector', desc: 'Collected 15+ shiny stars', icon: '⭐', unlocked: profile.stars >= 15 },
    { id: 'tr-4', title: 'Phonics Explorer', desc: 'Practiced alphabet sounds', icon: '🔤', unlocked: true },
    { id: 'tr-5', title: 'Arcade Whiz', desc: 'Won arcade mini-games', icon: '🎈', unlocked: true },
    { id: 'tr-6', title: 'Master Artist', desc: 'Reached Level 5 Artist badge', icon: '🏆', unlocked: profile.level >= 5 }
  ];

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="trophies-back-btn"
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
            Trophy Room & Sticker Book 🏆
          </h1>
        </div>

        {/* Level Progression Pill */}
        <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border-2 border-purple-100 shadow-sm text-slate-800">
          <div className="text-left">
            <span className="text-[10px] uppercase font-black text-purple-700 block">
              Level {profile.level} Artist
            </span>
            <div className="w-28 sm:w-36 h-2.5 bg-purple-100 rounded-full overflow-hidden mt-0.5 border border-purple-200">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (profile.stars / 30) * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-black text-amber-500">
            {profile.stars}/30 ⭐
          </span>
        </div>
      </div>

      {/* Main Split Content: Left Scenic Sticker Playground + Right Trophy Shelf */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Scenic Sticker Playground (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-[32px] sm:rounded-[36px] p-3 sm:p-4 border-2 border-purple-100 border-b-[8px] border-b-cyan-400 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
              🏞️ Tap to Place Stickers on Your Playground!
            </span>
            <button
              id="clear-stickers-btn"
              onClick={() => {
                sound.playPop();
                setBookStickers([]);
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-rose-100 text-rose-600 border border-purple-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Scenic Backdrop Canvas */}
          <div
            id="sticker-book-canvas"
            onClick={handleCanvasClick}
            className="flex-1 w-full rounded-2xl relative overflow-hidden bg-gradient-to-b from-[#74B9FF] via-[#81ECEC] to-[#55EFC4] border-3 border-white shadow-inner cursor-pointer select-none"
          >
            {/* Sun & Cloud scenery */}
            <div className="absolute top-4 left-6 text-4xl animate-bounce-gentle">☀️</div>
            <div className="absolute top-6 right-10 text-3xl opacity-80">☁️</div>
            <div className="absolute top-12 left-1/3 text-2xl opacity-70">☁️</div>
            {/* Grass Hills */}
            <div className="absolute -bottom-6 -left-10 w-[120%] h-24 bg-[#00B894] rounded-t-[100%] opacity-90" />
            <div className="absolute -bottom-10 -right-10 w-[120%] h-28 bg-[#2ED573] rounded-t-[100%]" />

            {/* Placed Stickers */}
            {bookStickers.map(st => (
              <motion.div
                key={st.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{
                  position: 'absolute',
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="text-4xl sm:text-5xl pointer-events-none drop-shadow-lg"
              >
                {st.emoji}
              </motion.div>
            ))}
          </div>

          {/* Sticker Selector Tray */}
          <div className="mt-2 flex items-center gap-2 overflow-x-auto kids-scrollbar py-1">
            {UNLOCKABLE_STICKERS.map(s => {
              const isLocked = s.requiredStars > profile.stars;
              const isSelected = selectedSticker.id === s.id;
              return (
                <button
                  key={s.id}
                  id={`trophy-sticker-${s.id}`}
                  onClick={() => {
                    sound.playPop();
                    setSelectedSticker(s);
                  }}
                  className={`p-2 rounded-2xl shrink-0 text-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-400 scale-110 shadow-lg border-2 border-white'
                      : 'bg-purple-50 hover:bg-purple-100 border border-purple-100'
                  }`}
                  title={`${s.name} ${isLocked ? `(Requires ${s.requiredStars}⭐)` : ''}`}
                >
                  <span>{s.emojiOrSvg}</span>
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Trophy Shelf (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] sm:rounded-[36px] p-3 sm:p-4 border-2 border-purple-100 border-b-[8px] border-b-purple-500 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
              🏆 Badges & Achievements
            </span>
            <span className="text-[10px] text-slate-500 font-bold">
              {trophies.filter(t => t.unlocked).length} / {trophies.length} Unlocked
            </span>
          </div>

          <div className="flex-1 overflow-y-auto kids-scrollbar pr-1 grid grid-cols-2 gap-2.5">
            {trophies.map(t => (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center justify-between transition-all ${
                  t.unlocked
                    ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-2xl mb-1 shadow-sm border border-purple-100">
                  {t.unlocked ? t.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>
                <h4 className="text-xs font-black font-['Fredoka'] text-slate-800">
                  {t.title}
                </h4>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                  {t.desc}
                </p>
                {t.unlocked ? (
                  <span className="mt-1 text-[9px] font-black text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="mt-1 text-[9px] text-slate-400">
                    Locked
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
