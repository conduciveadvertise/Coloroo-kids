export type ScreenType = 'home' | 'coloring' | 'learning' | 'games' | 'trophies' | 'parent';

export type ColoringCategory = 'animals' | 'fantasy' | 'vehicles' | 'nature' | 'dinosaurs';

export interface ColoringPage {
  id: string;
  title: string;
  category: ColoringCategory;
  difficulty: 'easy' | 'medium' | 'creative';
  thumbnailSvg: string;
  svgPaths: {
    id: string;
    d: string;
    name: string;
    defaultFill?: string;
  }[];
  outlineD?: string;
  tags: string[];
}

export type ToolType = 'bucket' | 'brush' | 'glow' | 'glitter' | 'sticker' | 'eraser';

export interface StickerItem {
  id: string;
  name: string;
  emojiOrSvg: string;
  category: 'cute' | 'sparkle' | 'rewards' | 'nature';
  unlocked: boolean;
  requiredStars: number;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface DrawingPath {
  tool: ToolType;
  color: string;
  size: number;
  points: { x: number; y: number }[];
  isGlitter?: boolean;
}

export interface SavedArtwork {
  id: string;
  pageId: string;
  pageTitle: string;
  timestamp: number;
  dataUrl?: string;
  fills: Record<string, string>;
  starsEarned: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  stars: number;
  level: number;
  completedColorings: number;
  learningScore: number;
  todayMinutes: number;
}

export interface ParentSettings {
  dailyLimitMinutes: number;
  soundVolume: number;
  bgMusicEnabled: boolean;
  speechNarratorEnabled: boolean;
  difficultyLevel: 'toddler' | 'preschool' | 'primary';
  pinCode: string;
}

export interface LearningActivity {
  id: string;
  type: 'phonics' | 'math' | 'shapes' | 'animals';
  title: string;
  description: string;
  iconName: string;
  accentColor: string;
}
