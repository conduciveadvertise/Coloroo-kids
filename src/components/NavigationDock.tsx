import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Palette, 
  Sparkles, 
  Gamepad2, 
  Award, 
  ShieldCheck 
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
  orientation = 'vertical-left',
  onOpenParentGate
}) => {
  const navItems = [
    { id: 'home' as ScreenType, label: 'HOME', icon: Home, emoji: '🏠' },
    { id: 'coloring' as ScreenType, label: 'STUDIO', icon: Palette, emoji: '🎨' },
    { id: 'learning' as ScreenType, label: 'LEARN', icon: Sparkles, emoji: '🚀' },
    { id: 'games' as ScreenType, label: 'GAMES', icon: Gamepad2, emoji: '🎮' },
    { id: 'trophies' as ScreenType, label: 'REWARDS', icon: Award, emoji: '🏆' },
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
        className="w-[104px] h-full flex flex-col items-center justify-between py-3 px-2 bg-white/95 backdrop-blur-md border-r-2 md:border-r-4 border-purple-100 shadow-xl z-40 select-none shrink-0 overflow-y-auto no-scrollbar"
      >
        {/* App Mini Brand Logo */}
        <button 
          id="dock-logo-btn"
          onClick={() => handleItemClick('home')}
          className="group flex flex-col items-center cursor-pointer mb-1 sm:mb-2 transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <div className="w-12 h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1 shadow-md border-2 border-white flex items-center justify-center text-white text-2xl font-black italic transform -rotate-3">
            C
          </div>
          <span className="text-[11px] font-black tracking-wider text-purple-900 mt-0.5 text-center font-['Fredoka'] hidden sm:block">
            COLOROO
          </span>
        </button>

        {/* Core Navigation Items */}
        <nav className="flex flex-col gap-1 sm:gap-1.5 md:gap-2.5 w-full items-center my-auto">
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
                  className={`w-12 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-150 relative ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg transform rotate-3 border-2 border-white'
                      : 'bg-gray-100 text-slate-500 hover:bg-cyan-100'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-dock-pill"
                      className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-4 sm:h-6 bg-purple-600 rounded-l-full shadow-sm"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-black tracking-wider uppercase leading-none ${
                  isActive ? 'text-purple-900' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Parent Lock Gate Button */}
        <div className="pt-1 sm:pt-2 border-t-2 border-purple-100 w-full flex flex-col items-center shrink-0">
          <motion.button
            id="nav-btn-parent"
            onClick={handleParentClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="group flex flex-col items-center gap-0.5 cursor-pointer w-full opacity-90 hover:opacity-100"
            title="Parents Zone (PIN Protected)"
          >
            <div className={`w-12 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
              currentScreen === 'parent'
                ? 'bg-purple-900 text-white shadow-lg border-2 border-white'
                : 'bg-slate-800 text-white shadow-md'
            }`}>
              <span className="text-2xl">⚙️</span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider leading-none ${
              currentScreen === 'parent' ? 'text-purple-900' : 'text-slate-500'
            }`}>
              PARENTS
            </span>
          </motion.button>
        </div>
      </aside>
    );
  }

  // Horizontal Landscape Bottom Floating Dock fallback
  return (
    <div 
      id="landscape-bottom-navigation"
      className="h-24 bg-white mt-8 rounded-[32px] shadow-2xl border-2 border-purple-100 flex items-center justify-around px-8 sm:px-12 fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none min-w-[340px] sm:min-w-[500px]"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <div 
            key={item.id}
            id={`nav-bottom-${item.id}`}
            onClick={() => handleItemClick(item.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-purple-600 text-white shadow-lg transform rotate-3 border-2 border-white' 
                : 'bg-gray-100 hover:bg-cyan-100'
            }`}>
              <span className="text-xl sm:text-2xl">{item.emoji}</span>
            </div>
            <span className={`text-xs font-black uppercase ${
              isActive ? 'text-purple-900' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </div>
        );
      })}
      <div className="h-10 w-[2px] bg-slate-100 mx-2" />
      <div 
        id="nav-bottom-parent"
        onClick={handleParentClick}
        className="flex flex-col items-center gap-1 group cursor-pointer opacity-90 hover:opacity-100"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-xl sm:text-2xl">⚙️</span>
        </div>
        <span className="text-xs font-black text-slate-500 uppercase">
          PARENTS
        </span>
      </div>
    </div>
  );
};
