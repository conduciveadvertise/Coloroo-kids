import { WorldId } from '../types';

export interface AdventureWorldInfo {
  id: WorldId;
  name: string;
  tagline: string;
  themeEmoji: string;
  gradient: string;
  borderAccent: string;
  totalLevels: number;
}

export const WORLDS_INFO: AdventureWorldInfo[] = [
  {
    id: 'forest',
    name: 'Coloroo Forest',
    tagline: 'Sunlit trees, friendly animals & nature quests',
    themeEmoji: '🌳',
    gradient: 'from-[#1dd1a1] via-[#10ac84] to-[#01a3a4]',
    borderAccent: 'border-[#10AC84]',
    totalLevels: 5
  },
  {
    id: 'ocean',
    name: 'Ocean World',
    tagline: 'Deep blue sea, friendly whales & coral gems',
    themeEmoji: '🌊',
    gradient: 'from-[#74b9ff] via-[#0984e3] to-[#00cec9]',
    borderAccent: 'border-[#0984E3]',
    totalLevels: 5
  },
  {
    id: 'space',
    name: 'Space World',
    tagline: 'Cosmic rockets, glowing stars & galaxy fun',
    themeEmoji: '🚀',
    gradient: 'from-[#a29bfe] via-[#6c5ce7] to-[#3742fa]',
    borderAccent: 'border-[#6C5CE7]',
    totalLevels: 5
  },
  {
    id: 'dino',
    name: 'Dino World',
    tagline: 'Baby triceratops, volcanoes & jungle tracks',
    themeEmoji: '🦖',
    gradient: 'from-[#fdcb6e] via-[#f39c12] to-[#d35400]',
    borderAccent: 'border-[#F39C12]',
    totalLevels: 5
  }
];

export interface AdventureLevelDef {
  id: number;
  title: string;
  type: 'abc' | 'color' | 'math' | 'memory' | 'boss';
  icon: string;
  description: string;
}

export const FOREST_LEVELS: AdventureLevelDef[] = [
  {
    id: 1,
    title: 'Letter Discovery',
    type: 'abc',
    icon: '🔤',
    description: 'Find letter B in the sunny forest'
  },
  {
    id: 2,
    title: 'Forest Color Quest',
    type: 'color',
    icon: '🌈',
    description: 'Match sunny forest nature colors'
  },
  {
    id: 3,
    title: 'Berry Counting',
    type: 'math',
    icon: '🔢',
    description: 'Count delicious forest apples & berries'
  },
  {
    id: 4,
    title: 'Animal Pair Match',
    type: 'memory',
    icon: '🧩',
    description: 'Match forest animal friends'
  },
  {
    id: 5,
    title: 'Forest Challenge',
    type: 'boss',
    icon: '🏆',
    description: 'Grand Multi-Challenge to unlock Ocean World!'
  }
];
