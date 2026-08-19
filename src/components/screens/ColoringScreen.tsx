import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Wand2,
  Trash2,
  Check,
  Star,
  Sparkles,
  Undo2
} from 'lucide-react';
import { COLORING_PAGES, PALETTE_COLORS } from '../../data/coloringPages';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface ColoringScreenProps {
  initialPageId?: string;
  onFinishColoring: (artwork: any) => void;
  onBack: () => void;
  userStars?: number;
}

type ToolMode = 'fill' | 'brush' | 'crayon' | 'glitter' | 'eraser';

export const ColoringScreen: React.FC<ColoringScreenProps> = ({
  initialPageId = 'roo-artist',
  onFinishColoring,
  onBack
}) => {
  const [currentPageId, setCurrentPageId] = useState(initialPageId);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0].hex);
  const [tool, setTool] = useState<ToolMode>('brush');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [pathsColorMap, setPathsColorMap] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);

  const currentPage = COLORING_PAGES.find(p => p.id === currentPageId) || COLORING_PAGES[0];

  // Initialize and scale Canvas with devicePixelRatio
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      undoStackRef.current = [];
    }
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPageId]);

  // Coordinate Conversion Helper
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (undoStackRef.current.length > 8) {
      undoStackRef.current.shift();
    }
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    saveCanvasState();

    const coords = getCanvasCoords(e);
    lastPosRef.current = coords;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 1.6;
      ctx.arc(coords.x, coords.y, brushSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = selectedColor;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = tool === 'crayon' ? brushSize * 0.85 : brushSize;

      if (tool === 'glitter') {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = selectedColor;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.arc(coords.x, coords.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || tool === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const lastPos = lastPosRef.current;
    if (!ctx || !lastPos) return;

    const currentPos = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 1.6;
      ctx.stroke();
    } else if (tool === 'glitter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = selectedColor;
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Glitter sparkle points
      if (Math.random() > 0.4) {
        ctx.fillStyle = '#FFF275';
        ctx.beginPath();
        ctx.arc(
          currentPos.x + (Math.random() * 12 - 6),
          currentPos.y + (Math.random() * 12 - 6),
          2 + Math.random() * 2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else if (tool === 'crayon') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else {
      // Default Smooth Brush
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    lastPosRef.current = currentPos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // SVG Fill Handler
  const handleSvgPathClick = (pathId: string) => {
    if (tool !== 'fill' && tool !== 'eraser') return;
    sound.playPop();
    setPathsColorMap(prev => ({
      ...prev,
      [pathId]: tool === 'eraser' ? '#FFFFFF' : selectedColor
    }));
  };

  const handleSelectColor = (hex: string) => {
    setSelectedColor(hex);
    sound.playPop();
  };

  const handleMagicFill = () => {
    sound.playCorrect();
    const fullMap: Record<string, string> = {};
    currentPage.svgPaths.forEach((path, idx) => {
      fullMap[path.id] = PALETTE_COLORS[idx % PALETTE_COLORS.length].hex;
    });
    setPathsColorMap(fullMap);
  };

  const handleClearAll = () => {
    sound.playPop();
    setPathsColorMap({});
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleUndo = () => {
    sound.playPop();
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const previous = undoStackRef.current.pop();
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
  };

  const handleDone = () => {
    sound.playFanfare();
    sound.speak("Woohoo! Magnificent masterpiece created! You earned 5 stars!");
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch {}
    setShowCelebration(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-purple-900 flex items-center gap-1 border-2 border-purple-100 shadow-sm cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black">Home</span>
          </button>

          {/* Artwork Selection Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {COLORING_PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  sound.playPop();
                  setCurrentPageId(p.id);
                  setPathsColorMap({});
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }}
                className={`px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  currentPageId === p.id
                    ? 'bg-purple-600 text-white shadow-md scale-105 border border-white'
                    : 'bg-white text-slate-700 border border-purple-100 hover:bg-purple-50'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUndo}
            className="p-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 border border-purple-100 shadow-sm cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleMagicFill}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 hover:brightness-105 text-white font-black text-xs shadow-sm flex items-center gap-1 cursor-pointer border border-white"
          >
            <Wand2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Magic Fill</span>
          </button>
          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-500 border border-purple-100 shadow-sm cursor-pointer"
            title="Clear Drawing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDone}
            className="px-3.5 py-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1 border-2 border-white cursor-pointer active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>I'm Done! ⭐</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex gap-2.5 sm:gap-3 min-h-0 items-stretch my-0.5">
        {/* Left Tools */}
        <div className="w-16 bg-white rounded-[24px] p-2 border-2 border-purple-100 shadow-lg flex flex-col justify-around items-center shrink-0">
          {[
            { id: 'brush' as ToolMode, label: 'Brush', icon: '🖌️' },
            { id: 'fill' as ToolMode, label: 'Fill', icon: '🎨' },
            { id: 'crayon' as ToolMode, label: 'Crayon', icon: '🖍️' },
            { id: 'glitter' as ToolMode, label: 'Glitter', icon: '✨' },
            { id: 'eraser' as ToolMode, label: 'Eraser', icon: '🧼' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                sound.playPop();
                setTool(t.id);
              }}
              className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                tool === t.id
                  ? 'bg-purple-600 text-white shadow-md scale-105 border-2 border-purple-300'
                  : 'hover:bg-purple-50 text-slate-700'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="text-[7px] font-black mt-0.5">{t.label}</span>
            </button>
          ))}

          {/* Brush Thickness Indicator */}
          {tool !== 'fill' && (
            <div className="flex flex-col items-center gap-1 mt-1">
              <span className="text-[7px] font-black text-slate-400">SIZE</span>
              <div className="flex gap-1">
                {[8, 14, 22].map(sz => (
                  <button
                    key={sz}
                    onClick={() => { sound.playPop(); setBrushSize(sz); }}
                    className={`w-3.5 h-3.5 rounded-full border cursor-pointer ${
                      brushSize === sz ? 'bg-purple-600 border-purple-800' : 'bg-slate-200 border-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Palette */}
        <div className="w-20 bg-white rounded-[24px] p-2 border-2 border-purple-100 shadow-lg flex flex-col justify-between items-center shrink-0">
          <span className="text-[9px] font-black text-purple-900 uppercase tracking-wider">Colors</span>
          <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-y-auto no-scrollbar py-1">
            {PALETTE_COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => handleSelectColor(c.hex)}
                className={`w-7 h-7 rounded-full shadow-sm cursor-pointer transition-all flex items-center justify-center ${
                  selectedColor === c.hex ? 'ring-3 ring-purple-600 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {selectedColor === c.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* High-DPI Layered Canvas Surface */}
        <div
          ref={containerRef}
          className="flex-1 bg-white rounded-[28px] p-2 border-2 border-purple-100 shadow-xl flex items-center justify-center relative overflow-hidden"
          style={{ touchAction: 'none' }}
        >
          {/* Layer 1: SVG Color Fill Background */}
          <svg
            viewBox={currentPage.viewBox || "0 0 200 260"}
            className="absolute inset-0 w-full h-full p-4 pointer-events-auto"
          >
            {currentPage.svgPaths.map(path => (
              <path
                key={path.id}
                d={path.d}
                fill={pathsColorMap[path.id] || path.defaultColor || '#FFFFFF'}
                stroke="#2C3A4B"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSvgPathClick(path.id)}
                className={`${tool === 'fill' ? 'cursor-pointer hover:opacity-90' : 'pointer-events-none'}`}
              />
            ))}
          </svg>

          {/* Layer 2: Touch & Pointer Freehand Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute inset-0 w-full h-full z-10 ${tool === 'fill' ? 'pointer-events-none' : 'cursor-crosshair'}`}
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 border-b-[8px] border-b-amber-500 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-2 shadow-inner">
                🎉
              </div>
              <h2 className="text-xl font-black text-purple-950 font-['Fredoka']">Magnificent Artwork!</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">You colored with brilliance and earned bonus stars!</p>
              <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-4 py-1.5 rounded-2xl border border-amber-200">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-base font-black text-amber-600">+5 Stars Earned!</span>
              </div>
              <button
                onClick={() => {
                  setShowCelebration(false);
                  onFinishColoring({});
                }}
                className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Back to Home 🏠
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
