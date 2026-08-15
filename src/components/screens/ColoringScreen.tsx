import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PaintBucket, 
  Brush, 
  Sparkles, 
  Smile, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Wand2, 
  Check, 
  Download, 
  ChevronLeft, 
  Layers
} from 'lucide-react';
import { 
  ColoringPage, 
  ToolType, 
  PlacedSticker, 
  DrawingPath, 
  SavedArtwork, 
  ColoringCategory 
} from '../../types';
import { COLORING_PAGES, PALETTE_COLORS, UNLOCKABLE_STICKERS } from '../../data/coloringPages';
import { sound } from '../../services/soundEffects';
import { MascotRoo } from '../MascotRoo';

interface ColoringScreenProps {
  initialPageId?: string;
  onFinishColoring: (artwork: SavedArtwork) => void;
  onBack: () => void;
  userStars: number;
}

export const ColoringScreen: React.FC<ColoringScreenProps> = ({
  initialPageId = 'roo-artist',
  onFinishColoring,
  onBack,
  userStars
}) => {
  // Active Page Selection
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId);
  const [selectedCategory, setSelectedCategory] = useState<ColoringCategory>('animals');
  
  const currentPage = COLORING_PAGES.find(p => p.id === currentPageId) || COLORING_PAGES[0];

  // Tool & Color State
  const [activeTool, setActiveTool] = useState<ToolType>('bucket');
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[10].hex); // Coloroo purple default
  const [brushSize, setBrushSize] = useState<number>(14);
  const [activeSticker, setActiveSticker] = useState<string>(UNLOCKABLE_STICKERS[0].emojiOrSvg);

  // Canvas / SVG Fill State
  const [pathFills, setPathFills] = useState<Record<string, string>>({});
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [drawingHistory, setDrawingHistory] = useState<DrawingPath[]>([]);
  const [redoHistory, setRedoHistory] = useState<DrawingPath[]>([]);
  
  // Freehand Canvas Drawing Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const currentPath = useRef<{ x: number; y: number }[]>([]);

  // Initialize fills on page change
  useEffect(() => {
    const initialFills: Record<string, string> = {};
    currentPage.svgPaths.forEach(path => {
      initialFills[path.id] = path.defaultFill || '#FFFFFF';
    });
    setPathFills(initialFills);
    setPlacedStickers([]);
    setDrawingHistory([]);
    setRedoHistory([]);
    clearCanvas();
  }, [currentPageId]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Re-render freehand drawing paths onto canvas
  const redrawCanvas = (paths: DrawingPath[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paths.forEach(p => {
      if (p.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (p.tool === 'glow') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();

      // Glitter effect
      if (p.isGlitter) {
        ctx.shadowBlur = 0;
        p.points.forEach((pt, i) => {
          if (i % 3 === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pt.x + (Math.random() * 6 - 3), pt.y + (Math.random() * 6 - 3), 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    });
  };

  // Tap Path in Bucket Mode
  const handlePathClick = (pathId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'bucket') {
      sound.playPop();
      const colorIndex = PALETTE_COLORS.findIndex(c => c.hex === selectedColor);
      sound.playColorChime(colorIndex >= 0 ? colorIndex : 0);

      setPathFills(prev => ({
        ...prev,
        [pathId]: selectedColor
      }));
    }
  };

  // Stamp sticker on SVG Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'sticker') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      sound.playSparkle();
      const newSticker: PlacedSticker = {
        id: `placed-${Date.now()}-${Math.random()}`,
        stickerId: activeSticker,
        x,
        y,
        scale: 1,
        rotation: (Math.random() * 30) - 15
      };
      setPlacedStickers(prev => [...prev, newSticker]);
    }
  };

  // Canvas Mouse / Touch Handlers for Drawing Tools
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool === 'bucket' || activeTool === 'sticker') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    currentPath.current = [{ x, y }];

    sound.playSwoosh();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeTool === 'bucket' || activeTool === 'sticker') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    currentPath.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : selectedColor;
    ctx.lineWidth = activeTool === 'eraser' ? brushSize * 1.5 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'glow') {
      ctx.shadowColor = selectedColor;
      ctx.shadowBlur = 14;
    } else {
      ctx.shadowBlur = 0;
    }

    const pts = currentPath.current;
    if (pts.length >= 2) {
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();

      if (activeTool === 'glitter' && pts.length % 2 === 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x + (Math.random() * 8 - 4), y + (Math.random() * 8 - 4), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentPath.current.length > 0) {
      const newPath: DrawingPath = {
        tool: activeTool,
        color: activeTool === 'eraser' ? '#FFFFFF' : selectedColor,
        size: brushSize,
        points: [...currentPath.current],
        isGlitter: activeTool === 'glitter'
      };

      const updated = [...drawingHistory, newPath];
      setDrawingHistory(updated);
      setRedoHistory([]);
      currentPath.current = [];
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (drawingHistory.length === 0) return;
    sound.playPop();
    const last = drawingHistory[drawingHistory.length - 1];
    const nextHistory = drawingHistory.slice(0, -1);
    setDrawingHistory(nextHistory);
    setRedoHistory(prev => [...prev, last]);
    redrawCanvas(nextHistory);
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    sound.playPop();
    const next = redoHistory[redoHistory.length - 1];
    const nextRedo = redoHistory.slice(0, -1);
    const updatedHistory = [...drawingHistory, next];
    setDrawingHistory(updatedHistory);
    setRedoHistory(nextRedo);
    redrawCanvas(updatedHistory);
  };

  // Clear Canvas
  const handleClear = () => {
    sound.playPop();
    const resetFills: Record<string, string> = {};
    currentPage.svgPaths.forEach(path => {
      resetFills[path.id] = '#FFFFFF';
    });
    setPathFills(resetFills);
    setPlacedStickers([]);
    setDrawingHistory([]);
    setRedoHistory([]);
    clearCanvas();
  };

  // Magic Rainbow Auto-fill
  const handleMagicFill = () => {
    sound.playSparkle();
    sound.speak("Abracadabra! Magic Rainbow Splash!");
    const magicFills: Record<string, string> = {};
    currentPage.svgPaths.forEach((path, idx) => {
      magicFills[path.id] = PALETTE_COLORS[idx % PALETTE_COLORS.length].hex;
    });
    setPathFills(magicFills);
  };

  // Complete Artwork
  const handleFinish = () => {
    const artwork: SavedArtwork = {
      id: `art-${Date.now()}`,
      pageId: currentPage.id,
      pageTitle: currentPage.title,
      timestamp: Date.now(),
      fills: pathFills,
      starsEarned: 3
    };
    onFinishColoring(artwork);
  };

  const tools = [
    { id: 'bucket' as ToolType, label: 'Smart Fill', icon: PaintBucket, color: '#FF7675' },
    { id: 'brush' as ToolType, label: 'Crayon', icon: Brush, color: '#6C5CE7' },
    { id: 'glow' as ToolType, label: 'Magic Glow', icon: Sparkles, color: '#00CEC9' },
    { id: 'glitter' as ToolType, label: 'Glitter Roller', icon: Layers, color: '#FD79A8' },
    { id: 'sticker' as ToolType, label: 'Stickers', icon: Smile, color: '#FFA502' },
    { id: 'eraser' as ToolType, label: 'Eraser', icon: Eraser, color: '#B2BEC3' }
  ];

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-2 sm:p-4 select-none overflow-hidden">
      {/* Top Bar: Back, Page Selector, Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Left Back & Title */}
        <div className="flex items-center gap-2">
          <button
            id="coloring-back-btn"
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
            <span className="text-xs font-bold hidden sm:inline text-purple-900">Back</span>
          </button>

          {/* Page Picker Dropdown / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-md">
            {COLORING_PAGES.map(p => (
              <button
                key={p.id}
                id={`select-page-${p.id}`}
                onClick={() => {
                  sound.playPop();
                  setCurrentPageId(p.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  p.id === currentPageId
                    ? 'bg-purple-600 text-white shadow-md border-2 border-white scale-105'
                    : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Tools: Magic Fill, Undo, Redo, Clear, Done */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            id="magic-rainbow-btn"
            onClick={handleMagicFill}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-gradient-to-r from-pink-400 to-amber-300 text-slate-900 font-black text-xs flex items-center gap-1 shadow-md border-2 border-white cursor-pointer active:scale-95"
            title="Magic Auto Color"
          >
            <Wand2 className="w-4 h-4 text-purple-900" />
            <span className="hidden md:inline text-purple-900">Magic Fill</span>
          </motion.button>

          <button
            id="undo-btn"
            onClick={handleUndo}
            disabled={drawingHistory.length === 0}
            className="p-2 rounded-xl bg-white hover:bg-purple-50 disabled:opacity-30 text-purple-900 border-2 border-purple-100 shadow-sm cursor-pointer active:scale-95"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="redo-btn"
            onClick={handleRedo}
            disabled={redoHistory.length === 0}
            className="p-2 rounded-xl bg-white hover:bg-purple-50 disabled:opacity-30 text-purple-900 border-2 border-purple-100 shadow-sm cursor-pointer active:scale-95"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            id="clear-canvas-btn"
            onClick={handleClear}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-500 border-2 border-purple-100 shadow-sm cursor-pointer active:scale-95"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="finish-coloring-btn"
            onClick={handleFinish}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 active:scale-95 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 border-2 border-white cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>I'm Done! ⭐</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area: Left Tool Sidebar + Center Work Canvas + Right Mascot Tip */}
      <div className="flex-1 flex gap-2 sm:gap-3 items-center justify-between min-h-0 relative py-0.5">
        {/* Left Tools Column */}
        <div className="w-14 sm:w-16 md:w-20 bg-white p-1 sm:p-1.5 md:p-2 rounded-2xl sm:rounded-3xl border-2 border-purple-100 flex flex-col gap-1 sm:gap-1.5 md:gap-2 shadow-xl shrink-0 z-20">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                id={`tool-btn-${tool.id}`}
                onClick={() => {
                  sound.playPop();
                  setActiveTool(tool.id);
                }}
                className={`py-1 sm:py-1.5 md:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg scale-105 border-2 border-white'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold mt-0.5 leading-none text-center">
                  {tool.label}
                </span>
              </button>
            );
          })}

          {/* Brush Size Picker Pill if in Brush/Glow/Glitter/Eraser */}
          {activeTool !== 'bucket' && activeTool !== 'sticker' && (
            <div className="pt-1 border-t border-purple-100 flex flex-col items-center gap-0.5">
              <span className="text-[7px] sm:text-[8px] font-black uppercase text-purple-700 leading-none">
                Size
              </span>
              <div className="flex flex-col gap-1 items-center">
                {[8, 16, 26].map(sz => (
                  <button
                    key={sz}
                    id={`brush-size-${sz}`}
                    onClick={() => {
                      sound.playPop();
                      setBrushSize(sz);
                    }}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      brushSize === sz
                        ? 'border-purple-600 bg-purple-100'
                        : 'border-slate-200 bg-slate-100'
                    }`}
                  >
                    <div
                      className="rounded-full bg-purple-800"
                      style={{ width: sz / 3, height: sz / 3 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Canvas Studio Stage */}
        <div className="flex-1 h-full flex items-center justify-center relative min-h-0 px-1">
          <div
            id="coloring-canvas-container"
            onClick={handleCanvasClick}
            className="relative h-full max-h-[56vh] sm:max-h-[62vh] md:max-h-[68vh] aspect-[4/3] max-w-full bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[36px] shadow-2xl border-2 sm:border-4 border-purple-200 border-b-[6px] sm:border-b-[8px] border-b-cyan-500 overflow-hidden flex items-center justify-center"
          >
            {/* Background Texture grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* SVG Coloring Sheet */}
            <svg
              viewBox="0 0 200 260"
              className="w-full h-full p-2 select-none relative z-10"
            >
              {currentPage.svgPaths.map((path) => {
                const fill = pathFills[path.id] || path.defaultFill || '#FFFFFF';
                return (
                  <path
                    key={path.id}
                    id={`path-${path.id}`}
                    d={path.d}
                    fill={fill}
                    stroke="#2D3436"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={(e) => handlePathClick(path.id, e)}
                    className="transition-colors duration-150 cursor-pointer hover:brightness-105 active:brightness-95"
                  />
                );
              })}
            </svg>

            {/* Freehand HTML5 Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={`absolute inset-0 w-full h-full z-20 ${
                activeTool === 'bucket' || activeTool === 'sticker'
                  ? 'pointer-events-none'
                  : 'cursor-crosshair pointer-events-auto'
              }`}
            />

            {/* Placed Stickers Layer */}
            {placedStickers.map((st) => (
              <motion.div
                key={st.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: st.rotation }}
                style={{
                  position: 'absolute',
                  left: st.x - 20,
                  top: st.y - 20
                }}
                className="text-3xl sm:text-4xl select-none z-30 pointer-events-none drop-shadow-md"
              >
                {st.stickerId}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optional Right Sticker Tray (when Sticker tool selected) OR Mascot Helper */}
        <div className="w-16 sm:w-20 md:w-24 shrink-0 flex flex-col items-center justify-center">
          {activeTool === 'sticker' ? (
            <div className="bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border-2 border-purple-100 shadow-xl flex flex-col gap-1 sm:gap-1.5 max-h-[65vh] overflow-y-auto kids-scrollbar">
              <span className="text-[8px] sm:text-[9px] font-black text-center text-purple-900 uppercase">
                Stickers
              </span>
              {UNLOCKABLE_STICKERS.map(s => (
                <button
                  key={s.id}
                  id={`sticker-pick-${s.id}`}
                  onClick={() => {
                    sound.playPop();
                    setActiveSticker(s.emojiOrSvg);
                  }}
                  className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    activeSticker === s.emojiOrSvg
                      ? 'bg-amber-400 scale-110 shadow-lg border-2 border-white'
                      : 'bg-slate-100 hover:bg-purple-50'
                  }`}
                  title={s.name}
                >
                  {s.emojiOrSvg}
                </button>
              ))}
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center">
              <MascotRoo
                size="sm"
                message={
                  activeTool === 'bucket'
                    ? 'Tap any spot to fill it with color!'
                    : activeTool === 'glow'
                    ? 'Draw magical neon glowing lines!'
                    : 'Looking super creative!'
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Horizontal Color Palette Tray */}
      <div 
        id="color-palette-tray"
        className="mt-1 sm:mt-2 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl sm:rounded-3xl border-2 border-purple-100 shadow-xl flex items-center gap-1.5 sm:gap-2 overflow-x-auto kids-scrollbar z-20 shrink-0"
      >
        <span className="text-[10px] sm:text-xs font-black text-purple-900 uppercase tracking-wider pl-1 hidden sm:inline whitespace-nowrap">
          Colors:
        </span>
        {PALETTE_COLORS.map((c, idx) => {
          const isSelected = selectedColor === c.hex;
          return (
            <motion.button
              key={c.id}
              id={`color-swatch-${c.id}`}
              onClick={() => {
                sound.playColorChime(idx);
                setSelectedColor(c.hex);
              }}
              whileHover={{ scale: 1.18, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-xl sm:rounded-2xl shrink-0 transition-transform cursor-pointer relative flex items-center justify-center shadow-md ${
                isSelected
                  ? 'ring-3 sm:ring-4 ring-purple-600 ring-offset-1 sm:ring-offset-2 ring-offset-white scale-110'
                  : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: c.hex,
                borderColor: c.border,
                borderWidth: '2.5px'
              }}
              title={c.name}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white stroke-[3] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
