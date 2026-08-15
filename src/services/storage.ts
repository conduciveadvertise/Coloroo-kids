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

// Load saved data from browser/Capacitor WebView storage.
const loadStorage = () => {
  if (typeof localStorage === 'undefined') return;

  try {
    const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (rawProfile) cachedProfile = JSON.parse(rawProfile);

    const rawArt = localStorage.getItem(STORAGE_KEYS.SAVED_ART);
    if (rawArt) cachedArtworks = JSON.parse(rawArt);

    const rawSettings = localStorage.getItem(STORAGE_KEYS.PARENT_SETTINGS);
    if (rawSettings) cachedParentSettings = JSON.parse(rawSettings);
  } catch {
    // Keep defaults if stored data is invalid.
  }
};

loadStorage();

export const getStoredProfile = (): ChildProfile => {
  return cachedProfile;
};

export const saveStoredProfile = async (
  profile: ChildProfile
): Promise<void> => {
  cachedProfile = profile;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(profile)
      );
    } catch {}
  }
};

export const getStoredArtworks = (): SavedArtwork[] => {
  return cachedArtworks;
};

export const saveStoredArtworks = async (
  artworks: SavedArtwork[]
): Promise<void> => {
  cachedArtworks = artworks;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SAVED_ART,
        JSON.stringify(artworks)
      );
    } catch {}
  }
};

export const getStoredParentSettings = (): ParentSettings => {
  return cachedParentSettings;
};

export const saveStoredParentSettings = async (
  settings: ParentSettings
): Promise<void> => {
  cachedParentSettings = settings;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PARENT_SETTINGS,
        JSON.stringify(settings)
      );
    } catch {}
  }
};
