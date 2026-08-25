export type ScreenType =
  | 'speak-repeat' 'home' | 'ai-buddy' | 'coloring' | 'learning' | 'challenges' | 'games' | 'adventure' | 'trophies' | 'parent' | 'buddy' | 'missions';

export interface ChildProfile {
  name: string;
  age: number;
  avatar: string;
  stars: number;
  level: number;
  todayMinutes: number;
  completedColorings: number;
}

export interface ParentSettings {
  dailyLimitMinutes: number;
  dailyTimeLimitMinutes?: number;
  speechNarratorEnabled: boolean;
  backgroundMusicEnabled?: boolean;
  soundVolume: number;
  pinCode: string;
}

export interface SavedArtwork {
  id: string;
  pageId: string;
  title: string;
  date: string;
  dataUrl?: string;
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  starsRequired: number;
  category: string;
  unlocked?: boolean;
}

export type WorldId = 'forest' | 'ocean' | 'space' | 'dino';
export type LevelState = 'locked' | 'available' | 'completed';

export interface AdventureProgress {
  unlockedWorlds: WorldId[];
  completedLevels: Record<string, number[]>;
  currentLevel: number;
}

export type BuddyType = 'bunny' | 'panda' | 'fox' | 'cat' | 'dino';

export interface BuddyState {
  type: BuddyType;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  happiness: 'happy' | 'excited' | 'sleepy';
  timesFed: number;
}

export interface DailyMission {
  id: string;
  title: string;
  icon: string;
  activityType: 'challenge' | 'arcade' | 'adventure' | 'stars';
  current: number;
  target: number;
  rewardStars: number;
  completed: boolean;
  claimed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  claimedMilestones: number[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  current: number;
  target: number;
  unlocked: boolean;
}

export type ActivityCategory = 'abc' | 'math' | 'colors' | 'shapes' | 'memory' | 'vocab' | 'adventure' | 'art';

export interface ParentActivityLog {
  id: string;
  title: string;
  category: ActivityCategory;
  categoryName: string;
  iconEmoji: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  starsEarned: number;
  score?: number;
}

export interface ScreenTimeRecord {
  date: string; // YYYY-MM-DD
  activeMinutes: number;
}
