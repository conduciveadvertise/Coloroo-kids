import AsyncStorage from '@react-native-async-storage/async-storage';
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

// In-memory cache for instantaneous synchronous access
let cachedProfile: ChildProfile = DEFAULT_PROFILE;
let cachedArtworks: SavedArtwork[] = [];
let cachedParentSettings: ParentSettings = DEFAULT_PARENT_SETTINGS;

// Initialize cache from AsyncStorage asynchronously on startup
(async () => {
  try {
    const rawProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (rawProfile) cachedProfile = JSON.parse(rawProfile);

    const rawArt = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_ART);
    if (rawArt) cachedArtworks = JSON.parse(rawArt);

    const rawSettings = await AsyncStorage.getItem(STORAGE_KEYS.PARENT_SETTINGS);
    if (rawSettings) cachedParentSettings = JSON.parse(rawSettings);
  } catch {
    // Fallback if AsyncStorage is unavailable
    if (typeof localStorage !== 'undefined') {
      try {
        const rawP = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (rawP) cachedProfile = JSON.parse(rawP);
        const rawA = localStorage.getItem(STORAGE_KEYS.SAVED_ART);
        if (rawA) cachedArtworks = JSON.parse(rawA);
        const rawS = localStorage.getItem(STORAGE_KEYS.PARENT_SETTINGS);
        if (rawS) cachedParentSettings = JSON.parse(rawS);
      } catch {}
    }
  }
})();

export const getStoredProfile = (): ChildProfile => {
  return cachedProfile;
};

export const saveStoredProfile = async (profile: ChildProfile): Promise<void> => {
  cachedProfile = profile;
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); } catch {}
    }
  }
};

export const getStoredArtworks = (): SavedArtwork[] => {
  return cachedArtworks;
};

export const saveStoredArtworks = async (artworks: SavedArtwork[]): Promise<void> => {
  cachedArtworks = artworks;
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ART, JSON.stringify(artworks));
  } catch {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.SAVED_ART, JSON.stringify(artworks)); } catch {}
    }
  }
};

export const getStoredParentSettings = (): ParentSettings => {
  return cachedParentSettings;
};

export const saveStoredParentSettings = async (settings: ParentSettings): Promise<void> => {
  cachedParentSettings = settings;
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PARENT_SETTINGS, JSON.stringify(settings));
  } catch {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.PARENT_SETTINGS, JSON.stringify(settings)); } catch {}
    }
  }
};

