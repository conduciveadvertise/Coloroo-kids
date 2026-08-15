import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Volume2, 
  VolumeX, 
  Wifi, 
  BatteryMedium, 
  Clock, 
  Maximize2, 
  Sparkles, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { ChildProfile } from '../types';
import { sound } from '../services/soundEffects';

interface TabletStatusBarProps {
  profile: ChildProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  isTabletFrame: boolean;
  onToggleTabletFrame: () => void;
  onOpenParentGate: () => void;
  remainingMinutes?: number;
}

export const TabletStatusBar: React.FC<TabletStatusBarProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenProfile,
  isTabletFrame,
  onToggleTabletFrame,
  onOpenParentGate,
  remainingMinutes = 25
}) => {
  const handleStarTap = () => {
    sound.playSparkle();
    sound.speak(`You have ${profile.stars} golden stars!`);
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header 
      id="tablet-status-bar"
      className="h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 bg-white/95 backdrop-blur-md border-b-2 border-purple-100 flex items-center justify-between select-none z-30 shadow-sm shrink-0"
    >
      {/* Left: Brand Logo + Child Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-black italic border-2 border-white transform -rotate-3 shrink-0">
            C
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base sm:text-lg md:text-2xl font-black text-purple-900 tracking-tight leading-none font-['Fredoka']">
              COLOROO
            </h1>
            <p className="text-[8px] sm:text-[9px] font-bold text-purple-400 uppercase tracking-widest leading-tight">
              KIDS WORLD
            </p>
          </div>
        </div>

        <motion.button
          id="profile-badge-btn"
          onClick={onOpenProfile}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-purple-50 px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl border-2 border-purple-100 shadow-sm cursor-pointer"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-yellow-200 border-2 border-white shadow-sm flex items-center justify-center text-xs sm:text-sm md:text-base">
            {profile.avatar}
          </div>
          <div className="text-left leading-tight hidden lg:block">
            <span className="text-[11px] sm:text-xs font-black text-slate-800 block font-['Fredoka']">
              {profile.name} <span className="text-[10px] text-purple-600 font-semibold">({profile.age}y)</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Level {profile.level} Artist
            </span>
          </div>
        </motion.button>

        {/* Screen Time Timer Indicator */}
        <div 
          className="hidden md:flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200/80 text-purple-800"
          title="Safe screen time remaining"
        >
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
          <span className="text-[10px] sm:text-xs font-bold text-purple-900">
            {remainingMinutes}m left
          </span>
        </div>
      </div>

      {/* Center: Stars Balance Wallet */}
      <motion.button
        id="star-wallet-pill"
        onClick={handleStarTap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white px-3.5 sm:px-5 md:px-6 py-1 sm:py-1.5 rounded-full shadow-sm flex items-center gap-1.5 sm:gap-2 border-2 border-purple-100 cursor-pointer group hover:border-purple-200"
      >
        <span className="text-lg sm:text-2xl animate-bounce-gentle">⭐</span>
        <span className="text-base sm:text-xl md:text-2xl font-black text-purple-900 font-['Fredoka']">
          {profile.stars.toLocaleString()}
        </span>
      </motion.button>

      {/* Right: Sound, Tablet Frame & Device Info */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Sound Toggle */}
        <motion.button
          id="audio-toggle-btn"
          onClick={onToggleSound}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
        </motion.button>

        {/* Tablet Bezel Simulator Toggle */}
        <motion.button
          id="tablet-frame-toggle-btn"
          onClick={onToggleTabletFrame}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 ${
            isTabletFrame
              ? 'bg-cyan-500 text-white border-cyan-500 shadow-md font-bold'
              : 'bg-white text-slate-600 border-purple-100 hover:bg-purple-50'
          }`}
          title="Toggle Android Tablet Bezel Preview"
        >
          <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase">
            {isTabletFrame ? 'Tablet' : 'Full'}
          </span>
        </motion.button>

        {/* Parents Gate / Settings Button */}
        <motion.button
          id="top-right-parent-btn"
          onClick={() => {
            sound.playPop();
            onOpenParentGate();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-amber-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
          title="Parent Dashboard & Settings"
        >
          <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider hidden md:inline">
            Parents
          </span>
        </motion.button>

        {/* Fullscreen Button */}
        <motion.button
          id="fullscreen-toggle-btn"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-purple-50 text-slate-600 border-2 border-purple-100 cursor-pointer hidden lg:flex shadow-sm"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.button>

        {/* Device Status */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l-2 border-purple-100 text-slate-400 text-xs font-semibold">
          <Wifi className="w-3.5 h-3.5 text-purple-500" />
          <BatteryMedium className="w-3.5 h-3.5 text-emerald-500" />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
};
