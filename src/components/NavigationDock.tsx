import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Palette,
  Sparkles,
  Gamepad2,
  Award
} from 'lucide-react';
import { ScreenType } from '../types';
import { sound } from '../services/soundEffects';

interface NavigationDockProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  orientation?: 'vertical-left' | 'horizontal-bottom';
  onOpenParentGate: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  currentScreen,
  onNavigate,
  orientation = 'horizontal-bottom',
  onOpenParentGate
}) => {
  const navItems = [
    { id: 'home' as ScreenType, label: 'HOME', emoji: '🏠' },
    { id: 'coloring' as ScreenType, label: 'STUDIO', emoji: '🎨' },
    { id: 'learning' as ScreenType, label: 'LEARN', emoji: '🚀' },
    { id: 'games' as ScreenType, label: 'GAMES', emoji: '🎮' },
    { id: 'trophies' as ScreenType, label: 'REWARDS', emoji: '🏆' },
  ];

  const handleItemClick = (screen: ScreenType) => {
    sound.playPop();
    onNavigate(screen);
  };

  const handleParentClick = () => {
    sound.playPop();
    onOpenParentGate();
  };

  if (orientation === 'vertical-left') {
    return (
      <aside
        id="landscape-sidebar-navigation"
        className="w-[90px] sm:w-[104px] h-full flex flex-col items-center justify-between py-2 sm:py-3 px-1.5 sm:px-2 bg-white/95 backdrop-blur-md border-r-2 md:border-r-4 border-purple-100 shadow-xl z-40 select-none shrink-0 overflow-y-auto no-scrollbar"
      >
        <button
          id="dock-logo-btn"
          onClick={() => handleItemClick('home')}
          className="group flex flex-col items-center cursor-pointer mb-1 transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1 shadow-md border-2 border-white flex items-center justify-center text-white text-xl sm:text-2xl font-black italic transform -rotate-3">
            C
          </div>
          <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-purple-900 mt-0.5 text-center font-['Fredoka'] hidden sm:block">
            COLOROO
          </span>
        </button>

        <nav className="flex flex-col gap-1 sm:gap-1.5 w-full items-center my-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <motion.button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="group flex flex-col items-center gap-0.5 cursor-pointer w-full"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-150 relative ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg transform rotate-3 border-2 border-white'
                      : 'bg-gray-100 text-slate-500 hover:bg-cyan-100'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{item.emoji}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-dock-pill"
                      className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-4 sm:h-6 bg-purple-600 rounded-l-full shadow-sm"
                    />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-black tracking-wider uppercase leading-none ${
                  isActive ? 'text-purple-900' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <div className="pt-1 border-t-2 border-purple-100 w-full flex flex-col items-center shrink-0">
          <motion.button
            id="nav-btn-parent"
            onClick={handleParentClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="group flex flex-col items-center gap-0.5 cursor-pointer w-full opacity-90 hover:opacity-100"
            title="Parents Zone (PIN Protected)"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
              currentScreen === 'parent'
                ? 'bg-purple-900 text-white shadow-lg border-2 border-white'
                : 'bg-slate-800 text-white shadow-md'
            }`}>
              <span className="text-xl sm:text-2xl">⚙️</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-none ${
              currentScreen === 'parent' ? 'text-purple-900' : 'text-slate-500'
            }`}>
              PARENTS
            </span>
          </motion.button>
        </div>
      </aside>
    );
  }

  return (
    <nav
      id="landscape-bottom-navigation"
      className="w-full h-14 sm:h-16 bg-white/95 backdrop-blur-md border-t-2 border-purple-100 flex items-center justify-around px-2 sm:px-8 shrink-0 z-40 select-none shadow-md"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <motion.button
            key={item.id}
            id={`nav-bottom-${item.id}`}
            onClick={() => handleItemClick(item.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-purple-600 text-white shadow-md transform rotate-2 border-2 border-white'
                : 'bg-gray-100 hover:bg-cyan-100'
            }`}>
              <span className="text-base sm:text-xl">{item.emoji}</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] font-black tracking-wider uppercase leading-none ${
              isActive ? 'text-purple-900' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
      <div className="h-6 sm:h-8 w-[1.5px] bg-slate-200 mx-1" />
      <motion.button
        id="nav-bottom-parent"
        onClick={handleParentClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex flex-col items-center gap-0.5 group cursor-pointer opacity-90 hover:opacity-100"
        title="Parents Zone"
      >
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm ${
          currentScreen === 'parent'
            ? 'bg-purple-900 text-white border-2 border-white'
            : 'bg-slate-800 text-white'
        }`}>
          <span className="text-base sm:text-xl">⚙️</span>
        </div>
        <span className={`text-[9px] sm:text-[10px] font-black text-slate-500 uppercase leading-none ${
          currentScreen === 'parent' ? 'text-purple-900' : 'text-slate-500'
        }`}>
          PARENTS
        </span>
      </motion.button>
    </nav>
  );
};
