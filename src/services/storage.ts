import { ChildProfile, ParentSettings, SavedArtwork } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'coloroo_child_profile',
  SAVED_ART: 'coloroo_saved_artwork',
  PARENT_SETTINGS: 'coloroo_parent_settings',
  UNLOCKED_STICKERS: 'coloroo_unlocked_stickers'
};

const DEFAULT_PROFILE: ChildProfile = {
  id: 'child-1',
  name: 'Leo',
  age: 4,
  avatar: '🎨',
  stars: 18,
  level: 3,
  completedColorings: 5,
  learningScore: 92,
  todayMinutes: 14
};

const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  dailyLimitMinutes: 30,
  soundVolume: 0.8,
  bgMusicEnabled: false,
  speechNarratorEnabled: true,
  difficultyLevel: 'preschool',
  pinCode: '1234'
};

export const getStoredProfile = (): ChildProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveStoredProfile = (profile: ChildProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
};

export const getStoredArtworks = (): SavedArtwork[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredArtworks = (artworks: SavedArtwork[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_ART, JSON.stringify(artworks));
  } catch {}
};

export const getStoredParentSettings = (): ParentSettings => {
  if (typeof window === 'undefined') return DEFAULT_PARENT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENT_SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_PARENT_SETTINGS;
  } catch {
    return DEFAULT_PARENT_SETTINGS;
  }
};

export const saveStoredParentSettings = (settings: ParentSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARENT_SETTINGS, JSON.stringify(settings));
  } catch {}
};
