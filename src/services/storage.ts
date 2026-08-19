import {
  ChildProfile,
  ParentSettings,
  SavedArtwork,
  AdventureProgress,
  BuddyState,
  StreakData,
  DailyMission,
  AchievementBadge,
  ParentActivityLog,
  ScreenTimeRecord
} from '../types';
import { MISSION_POOL, INITIAL_ACHIEVEMENTS } from '../data/buddyAndMissionsData';

const STORAGE_KEYS = {
  PROFILE: 'coloroo_profile_v1',
  SETTINGS: 'coloroo_settings_v1',
  ARTWORKS: 'coloroo_artworks_v1',
  ADVENTURE: 'coloroo_adventure_v1',
  BUDDY: 'coloroo_buddy_v1',
  STREAK: 'coloroo_streak_v1',
  MISSIONS: 'coloroo_missions_v1',
  MISSIONS_DATE: 'coloroo_missions_date_v1',
  ACHIEVEMENTS: 'coloroo_achievements_v1',
  ACTIVITY_LOGS: 'coloroo_activity_logs_v1',
  SCREEN_TIME: 'coloroo_screen_time_v1'
};

const DEFAULT_PROFILE: ChildProfile = {
  name: 'Explorer',
  age: 4,
  avatar: '🎨',
  stars: 35,
  level: 3,
  todayMinutes: 14,
  completedColorings: 5
};

const DEFAULT_SETTINGS: ParentSettings = {
  dailyLimitMinutes: 30,
  dailyTimeLimitMinutes: 30,
  speechNarratorEnabled: true,
  backgroundMusicEnabled: true,
  soundVolume: 1.0,
  pinCode: '1234'
};

const DEFAULT_ADVENTURE: AdventureProgress = {
  unlockedWorlds: ['forest'],
  completedLevels: { forest: [] },
  currentLevel: 1
};

const DEFAULT_BUDDY: BuddyState = {
  type: 'bunny',
  name: 'Bella Bunny',
  level: 1,
  xp: 40,
  xpToNextLevel: 100,
  happiness: 'happy',
  timesFed: 2
};

export const getTodayDateString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getStoredProfile = (): ChildProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveStoredProfile = (profile: ChildProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
};

export const getStoredParentSettings = (): ParentSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredParentSettings = (settings: ParentSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
};

export const getStoredArtworks = (): SavedArtwork[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredArtworks = (artworks: SavedArtwork[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks));
  } catch {}
};

// --- ADVENTURE PROGRESS WITH AUTO-MIGRATION & UNLOCK DERIVATION ---
export const getStoredAdventureProgress = (): AdventureProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADVENTURE);
    if (!raw) return DEFAULT_ADVENTURE;
    const parsed = JSON.parse(raw);
    
    const completedLevels = parsed.completedLevels || { forest: [] };
    const forestLevels: number[] = Array.isArray(completedLevels.forest) ? completedLevels.forest : [];
    
    let unlockedWorlds: ('forest' | 'ocean' | 'space' | 'dino')[] = Array.isArray(parsed.unlockedWorlds) 
      ? [...parsed.unlockedWorlds] 
      : ['forest'];

    // Auto-unlock Ocean if Forest Level 5 is completed or all 5 levels are finished
    if ((forestLevels.includes(5) || forestLevels.length >= 5) && !unlockedWorlds.includes('ocean')) {
      unlockedWorlds.push('ocean');
    }

    return {
      unlockedWorlds,
      completedLevels,
      currentLevel: typeof parsed.currentLevel === 'number' ? parsed.currentLevel : 1
    };
  } catch {
    return DEFAULT_ADVENTURE;
  }
};

export const saveStoredAdventureProgress = (progress: AdventureProgress): void => {
  try {
    const forestLevels: number[] = progress.completedLevels?.forest || [];
    let unlocked = [...(progress.unlockedWorlds || ['forest'])];
    
    if ((forestLevels.includes(5) || forestLevels.length >= 5) && !unlocked.includes('ocean')) {
      unlocked.push('ocean');
    }

    const payload: AdventureProgress = {
      ...progress,
      unlockedWorlds: unlocked
    };
    localStorage.setItem(STORAGE_KEYS.ADVENTURE, JSON.stringify(payload));
  } catch {}
};

export const getStoredBuddy = (): BuddyState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDDY);
    return raw ? JSON.parse(raw) : DEFAULT_BUDDY;
  } catch {
    return DEFAULT_BUDDY;
  }
};

export const saveStoredBuddy = (buddy: BuddyState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDDY, JSON.stringify(buddy));
  } catch {}
};

export const getStoredStreak = (): StreakData => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) return { currentStreak: 1, longestStreak: 1, lastActiveDate: today, claimedMilestones: [] };
    return JSON.parse(raw);
  } catch {
    return { currentStreak: 1, longestStreak: 1, lastActiveDate: today, claimedMilestones: [] };
  }
};

export const updateStreakOnActivity = (): StreakData => {
  const today = getTodayDateString();
  const current = getStoredStreak();

  if (current.lastActiveDate === today) return current;

  const lastDate = new Date(current.lastActiveDate);
  const nowDate = new Date(today);
  const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  let nextStreak = current.currentStreak;
  if (diffDays === 1) {
    nextStreak += 1;
  } else if (diffDays > 1) {
    nextStreak = 1;
  }

  const updated: StreakData = {
    currentStreak: nextStreak,
    longestStreak: Math.max(current.longestStreak, nextStreak),
    lastActiveDate: today,
    claimedMilestones: current.claimedMilestones || []
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  } catch {}
  return updated;
};

export const getStoredDailyMissions = (): DailyMission[] => {
  const today = getTodayDateString();
  try {
    const storedDate = localStorage.getItem(STORAGE_KEYS.MISSIONS_DATE);
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);

    if (storedDate === today && raw) return JSON.parse(raw);

    const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    const fresh: DailyMission[] = shuffled.map(m => ({ ...m, current: 0, completed: false, claimed: false }));

    localStorage.setItem(STORAGE_KEYS.MISSIONS_DATE, today);
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(fresh));
    return fresh;
  } catch {
    return MISSION_POOL.slice(0, 3).map(m => ({ ...m, current: 0, completed: false, claimed: false }));
  }
};

export const saveStoredDailyMissions = (missions: DailyMission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  } catch {}
};

export const getStoredAchievements = (): AchievementBadge[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
};

export const saveStoredAchievements = (badges: AchievementBadge[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(badges));
  } catch {}
};

export const getStoredActivityLogs = (): ParentActivityLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const logActivityEvent = (entry: Omit<ParentActivityLog, 'id' | 'timestamp' | 'date'>): void => {
  try {
    const now = new Date();
    const newLog: ParentActivityLog = {
      ...entry,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: getTodayDateString()
    };
    const logs = getStoredActivityLogs();
    const updated = [newLog, ...logs].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(updated));
  } catch {}
};

export const getStoredScreenTimeRecords = (): ScreenTimeRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addActiveScreenTimeMinutes = (minutes = 1): void => {
  try {
    const today = getTodayDateString();
    const records = getStoredScreenTimeRecords();
    const existingIndex = records.findIndex(r => r.date === today);

    if (existingIndex >= 0) {
      records[existingIndex].activeMinutes += minutes;
    } else {
      records.unshift({ date: today, activeMinutes: minutes });
    }

    const trimmed = records.slice(0, 14);
    localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(trimmed));

    const p = getStoredProfile();
    p.todayMinutes = records.find(r => r.date === today)?.activeMinutes || p.todayMinutes;
    saveStoredProfile(p);
  } catch {}
};

export const getScreenTimeSummary = () => {
  const today = getTodayDateString();
  const records = getStoredScreenTimeRecords();
  const todayRecord = records.find(r => r.date === today);
  const todayMinutes = todayRecord ? todayRecord.activeMinutes : 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const weekMinutes = records
    .filter(r => new Date(r.date) >= sevenDaysAgo)
    .reduce((acc, r) => acc + r.activeMinutes, 0);

  return { todayMinutes, weekMinutes };
};

export const resetAllChildProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ADVENTURE);
    localStorage.removeItem(STORAGE_KEYS.BUDDY);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS_DATE);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ARTWORKS);
    localStorage.removeItem(STORAGE_KEYS.SCREEN_TIME);
  } catch {}
};
