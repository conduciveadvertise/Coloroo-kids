import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
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
  ChevronLeft,
  Layers
} from 'lucide-react';
import {
  ToolType,
  PlacedSticker,
  DrawingPath,
  SavedArtwork
} from '../../types';
import { COLORING_PAGES, PALETTE_COLORS, UNLOCKABLE_STICKERS } from '../../data/coloringPages';
import { sound } from '../../services/soundEffects';

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
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId);
  const currentPage = COLORING_PAGES.find(p => p.id === currentPageId) || COLORING_PAGES[0];

  const [activeTool, setActiveTool] = useState<ToolType>('bucket');
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[10].hex);
  const [brushSize, setBrushSize] = useState<number>(14);
  const [activeSticker, setActiveSticker] = useState<string>(UNLOCKABLE_STICKERS[0].emojiOrSvg);

  const [pathFills, setPathFills] = useState<Record<string, string>>({});
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [drawingHistory, setDrawingHistory] = useState<DrawingPath[]>([]);
  const [redoHistory, setRedoHistory] = useState<DrawingPath[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const currentPath = useRef<{ x: number; y: number }[]>([]);

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
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

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
      ctx.shadowColor = p.tool === 'glow' ? p.color : 'transparent';
      ctx.shadowBlur = p.tool === 'glow' ? 10 : 0;
      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();
    });
  };

  const handlePathClick = (pathId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'bucket') {
      sound.playPop();
      const colorIndex = PALETTE_COLORS.findIndex(c => c.hex === selectedColor);
      sound.playColorChime(colorIndex >= 0 ? colorIndex : 0);
      setPathFills(prev => ({ ...prev, [pathId]: selectedColor }));
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'sticker') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sound.playSparkle();
      setPlacedStickers(prev => [
        ...prev,
        { id: `placed-${Date.now()}`, stickerId: activeSticker, x, y, scale: 1, rotation: 0 }
      ]);
    }
  };

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
    ctx.shadowColor = activeTool === 'glow' ? selectedColor : 'transparent';
    ctx.shadowBlur = activeTool === 'glow' ? 10 : 0;

    const pts = currentPath.current;
    if (pts.length >= 2) {
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
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
      setDrawingHistory(prev => [...prev, newPath]);
      setRedoHistory([]);
      currentPath.current = [];
    }
  };

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

  const handleClear = () => {
    sound.playPop();
    const resetFills: Record<string, string> = {};
    currentPage.svgPaths.forEach(path => { resetFills[path.id] = '#FFFFFF'; });
    setPathFills(resetFills);
    setPlacedStickers([]);
    setDrawingHistory([]);
    setRedoHistory([]);
    clearCanvas();
  };

  const handleMagicFill = () => {
    sound.playSparkle();
    const magicFills: Record<string, string> = {};
    currentPage.svgPaths.forEach((path, idx) => {
      magicFills[path.id] = PALETTE_COLORS[idx % PALETTE_COLORS.length].hex;
    });
    setPathFills(magicFills);
  };

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
    { id: 'bucket' as ToolType, label: 'Fill', icon: PaintBucket },
    { id: 'brush' as ToolType, label: 'Pen', icon: Brush },
    { id: 'glow' as ToolType, label: 'Glow', icon: Sparkles },
    { id: 'glitter' as ToolType, label: 'Glitter', icon: Layers },
    { id: 'sticker' as ToolType, label: 'Sticker', icon: Smile },
    { id: 'eraser' as ToolType, label: 'Eraser', icon: Eraser }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-1 select-none overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-1.5 shrink-0 px-1">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button
            onClick={() => { sound.playPop(); onBack(); }}
            className="p-1 px-1.5 rounded-lg bg-white text-purple-900 border border-purple-100 flex items-center gap-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black">Back</span>
          </button>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[140px] sm:max-w-xs">
            {COLORING_PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => { sound.playPop(); setCurrentPageId(p.id); }}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-black whitespace-nowrap ${
                  p.id === currentPageId ? 'bg-purple-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleMagicFill} className="p-1 px-1.5 rounded-lg bg-pink-400 text-white text-[9px] font-black flex items-center gap-0.5">
            <Wand2 className="w-3 h-3" />
            <span className="hidden sm:inline">Magic</span>
          </button>
          <button onClick={handleUndo} disabled={drawingHistory.length === 0} className="p-1 rounded-lg bg-white text-purple-900 disabled:opacity-30 border border-purple-100">
            <RotateCcw className="w-3 h-3" />
          </button>
          <button onClick={handleRedo} disabled={redoHistory.length === 0} className="p-1 rounded-lg bg-white text-purple-900 disabled:opacity-30 border border-purple-100">
            <RotateCw className="w-3 h-3" />
          </button>
          <button onClick={handleClear} className="p-1 rounded-lg bg-white text-rose-500 border border-purple-100">
            <Trash2 className="w-3 h-3" />
          </button>
          <button onClick={handleFinish} className="p-1 px-2 rounded-lg bg-emerald-400 text-slate-900 font-black text-[10px] flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Done! ⭐</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex gap-1.5 items-center justify-between min-h-0 relative my-0.5">
        {/* Left Tools Column */}
        <div className="w-10 sm:w-12 bg-white p-0.5 rounded-xl border border-purple-100 flex flex-col gap-0.5 shadow shrink-0">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => { sound.playPop(); setActiveTool(tool.id); }}
                className={`py-0.5 rounded-lg flex flex-col items-center justify-center ${
                  isSelected ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[7px] font-bold leading-none mt-0.5">{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Canvas */}
        <div className="flex-1 h-full flex items-center justify-center relative min-h-0">
          <div
            id="coloring-canvas-container"
            onClick={handleCanvasClick}
            className="relative h-full aspect-[4/3] bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden flex items-center justify-center"
          >
            <svg viewBox="0 0 200 260" className="w-full h-full p-1 select-none relative z-10">
              {currentPage.svgPaths.map((path) => (
                <path
                  key={path.id}
                  d={path.d}
                  fill={pathFills[path.id] || path.defaultFill || '#FFFFFF'}
                  stroke="#2D3436"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={(e) => handlePathClick(path.id, e)}
                  className="cursor-pointer hover:brightness-105"
                />
              ))}
            </svg>

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
                activeTool === 'bucket' || activeTool === 'sticker' ? 'pointer-events-none' : 'cursor-crosshair pointer-events-auto'
              }`}
            />

            {placedStickers.map((st) => (
              <div
                key={st.id}
                style={{ position: 'absolute', left: st.x - 12, top: st.y - 12 }}
                className="text-2xl select-none z-30 pointer-events-none"
              >
                {st.stickerId}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sticker / Accessory Area */}
        {activeTool === 'sticker' && (
          <div className="w-10 sm:w-12 bg-white p-0.5 rounded-xl border border-purple-100 shadow flex flex-col gap-1 max-h-full overflow-y-auto no-scrollbar shrink-0">
            {UNLOCKABLE_STICKERS.map(s => (
              <button
                key={s.id}
                onClick={() => { sound.playPop(); setActiveSticker(s.emojiOrSvg); }}
                className={`p-0.5 rounded-lg text-lg flex items-center justify-center ${
                  activeSticker === s.emojiOrSvg ? 'bg-amber-400' : 'bg-slate-50'
                }`}
              >
                {s.emojiOrSvg}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Color Palette Tray */}
      <div className="shrink-0 bg-white px-2 py-1 rounded-xl border border-purple-100 shadow flex items-center gap-1.5 overflow-x-auto no-scrollbar z-20">
        {PALETTE_COLORS.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => { sound.playColorChime(idx); setSelectedColor(c.hex); }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 flex items-center justify-center ${
              selectedColor === c.hex ? 'ring-2 ring-purple-600 scale-110' : ''
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {selectedColor === c.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
          </button>
        ))}
      </div>
    </div>
  );
};
