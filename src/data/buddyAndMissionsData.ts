import { BuddyType, DailyMission, AchievementBadge } from '../types';

export interface BuddyDef {
  type: BuddyType;
  name: string;
  emoji: string;
  quote: string;
  favoriteFood: string;
  colorHex: string;
}

export const BUDDY_LIST: BuddyDef[] = [
  {
    type: 'bunny',
    name: 'Bella Bunny',
    emoji: '🐰',
    quote: 'Hop hop! Let\'s learn together!',
    favoriteFood: 'Carrot 🥕',
    colorHex: '#FF78CB'
  },
  {
    type: 'panda',
    name: 'Pip Panda',
    emoji: '🐼',
    quote: 'Munch munch! High five buddy!',
    favoriteFood: 'Bamboo 🎋',
    colorHex: '#2ED573'
  },
  {
    type: 'fox',
    name: 'Finley Fox',
    emoji: '🦊',
    quote: 'Smart and speedy! You\'re a star!',
    favoriteFood: 'Berries 🍓',
    colorHex: '#FF7F50'
  },
  {
    type: 'cat',
    name: 'Cleo Cat',
    emoji: '🐱',
    quote: 'Purr-fect job on your challenges!',
    favoriteFood: 'Fish Treat 🐟',
    colorHex: '#9B59B6'
  },
  {
    type: 'dino',
    name: 'Dex Dino',
    emoji: '🦖',
    quote: 'Roaaar! Let\'s conquer adventures!',
    favoriteFood: 'Apple 🍎',
    colorHex: '#1E90FF'
  }
];

export const MISSION_POOL: Omit<DailyMission, 'current' | 'completed' | 'claimed'>[] = [
  {
    id: 'm-challenges',
    title: 'Complete 2 Color Challenges',
    icon: '🎯',
    activityType: 'challenge',
    target: 2,
    rewardStars: 20
  },
  {
    id: 'm-arcade',
    title: 'Play 1 Arcade Game',
    icon: '🎮',
    activityType: 'arcade',
    target: 1,
    rewardStars: 20
  },
  {
    id: 'm-adventure',
    title: 'Complete 1 Adventure Level',
    icon: '🗺️',
    activityType: 'adventure',
    target: 1,
    rewardStars: 30
  },
  {
    id: 'm-stars',
    title: 'Earn 30 Stars Today',
    icon: '⭐',
    activityType: 'stars',
    target: 30,
    rewardStars: 25
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-color',
    title: 'Color Explorer',
    description: 'Complete 10 Color Challenges',
    iconEmoji: '🌈',
    current: 0,
    target: 10,
    unlocked: false
  },
  {
    id: 'ach-brain',
    title: 'Brain Starter',
    description: 'Complete 10 Arcade learning games',
    iconEmoji: '🧠',
    current: 0,
    target: 10,
    unlocked: false
  },
  {
    id: 'ach-adventure',
    title: 'Adventure Explorer',
    description: 'Complete 5 Adventure levels',
    iconEmoji: '🌳',
    current: 0,
    target: 5,
    unlocked: false
  },
  {
    id: 'ach-streak',
    title: '7 Day Learner',
    description: 'Maintain a 7-day learning streak',
    iconEmoji: '🔥',
    current: 1,
    target: 7,
    unlocked: false
  },
  {
    id: 'ach-collector',
    title: 'Star Collector',
    description: 'Earn 500 total stars',
    iconEmoji: '⭐',
    current: 0,
    target: 500,
    unlocked: false
  },
  {
    id: 'ach-super',
    title: 'Super Learner',
    description: 'Complete 50 learning activities',
    iconEmoji: '🏆',
    current: 0,
    target: 50,
    unlocked: false
  }
];
