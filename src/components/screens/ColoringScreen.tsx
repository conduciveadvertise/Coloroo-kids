import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  PaintBucket, Brush, Sparkles, Smile, Eraser, Trash2, Wand2, Check, ChevronLeft, Layers
} from 'lucide-react';
import { ColoringPage, ToolType, PlacedSticker, DrawingPath, SavedArtwork } from '../../types';
import { COLORING_PAGES, PALETTE_COLORS, UNLOCKABLE_STICKERS } from '../../data/coloringPages';
import { sound } from '../../services/soundEffects';

interface ColoringScreenProps {
  initialPageId?: string;
  onFinishColoring: (artwork: SavedArtwork) => void;
  onBack: () => void;
  userStars: number;
}

export const ColoringScreen: React.FC<ColoringScreenProps> = ({ initialPageId, onFinishColoring, onBack }) => {
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId || 'roo-artist');
  const currentPage = COLORING_PAGES.find(p => p.id === currentPageId) || COLORING_PAGES[0];
  const [activeTool, setActiveTool] = useState<ToolType>('bucket');
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[10].hex);
  const [pathFills, setPathFills] = useState<Record<string, string>>({});
  const [activeSticker, setActiveSticker] = useState<string>(UNLOCKABLE_STICKERS[0].emojiOrSvg);

  // Setup Fills
  useEffect(() => {
    const initialFills: Record<string, string> = {};
    currentPage.svgPaths.forEach(path => initialFills[path.id] = path.defaultFill || '#FFFFFF');
    setPathFills(initialFills);
  }, [currentPageId]);

  return (
    <div className="w-full h-full flex flex-col bg-[#F3E8FF] p-1 select-none overflow-hidden">
      {/* Top Bar: Full Scrollable Pages */}
      <div className="flex items-center gap-2 shrink-0 mb-1 px-1">
        <button onClick={onBack} className="p-1.5 rounded-xl bg-purple-600 text-white"><ChevronLeft className="w-4 h-4"/></button>
        <div className="flex-1 overflow-x-auto no-scrollbar flex gap-1">
            {COLORING_PAGES.map(p => (
                <button key={p.id} onClick={() => setCurrentPageId(p.id)} className={`px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap ${p.id === currentPageId ? 'bg-purple-900 text-white' : 'bg-white'}`}>
                    {p.title}
                </button>
            ))}
        </div>
        <button onClick={() => onFinishColoring({} as any)} className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-black text-[10px]">DONE</button>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex gap-2 min-h-0">
        {/* Left Tools */}
        <div className="w-12 bg-white rounded-2xl p-1 flex flex-col gap-1 shadow-sm border border-purple-100">
            {[ {id: 'bucket', icon: PaintBucket}, {id: 'brush', icon: Brush}, {id: 'eraser', icon: Eraser} ].map(t => (
                <button key={t.id} onClick={() => setActiveTool(t.id as ToolType)} className={`p-2 rounded-xl ${activeTool === t.id ? 'bg-purple-600 text-white' : ''}`}>
                    <t.icon className="w-5 h-5"/>
                </button>
            ))}
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl flex items-center justify-center p-2">
            <svg viewBox="0 0 200 260" className="max-h-full max-w-full">
              {currentPage.svgPaths.map((path) => (
                <path key={path.id} d={path.d} fill={pathFills[path.id]} stroke="#2D3436" strokeWidth="2" onClick={() => setPathFills(prev => ({...prev, [path.id]: selectedColor}))} />
              ))}
            </svg>
        </div>

        {/* Right Palette (Grid) */}
        <div className="w-20 bg-white rounded-2xl p-2 shadow-sm border border-purple-100 grid grid-cols-2 gap-1.5 content-start overflow-y-auto no-scrollbar">
            {PALETTE_COLORS.map(c => (
                <button key={c.hex} onClick={() => setSelectedColor(c.hex)} className={`w-7 h-7 rounded-lg ${selectedColor === c.hex ? 'ring-2 ring-purple-600' : ''}`} style={{background: c.hex}} />
            ))}
        </div>
      </div>
    </div>
  );
};
