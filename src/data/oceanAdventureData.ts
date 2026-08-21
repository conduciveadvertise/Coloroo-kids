export interface OceanLevelDef {
  id: number;
  title: string;
  type: 'ocean-colors' | 'ocean-count' | 'ocean-match' | 'ocean-words' | 'coral-quest' | 'ocean-boss';
  icon: string;
  description: string;
}

export const OCEAN_LEVELS: OceanLevelDef[] = [
  {
    id: 1,
    title: 'Ocean Colors',
    type: 'ocean-colors',
    icon: '🐚',
    description: 'Find colorful ocean sea creatures'
  },
  {
    id: 2,
    title: 'Sea Animal Count',
    type: 'ocean-count',
    icon: '🐠',
    description: 'Count schools of fish, crabs & starfish'
  },
  {
    id: 3,
    title: 'Sea Creature Match',
    type: 'ocean-match',
    icon: '🐙',
    description: 'Match ocean animal friends'
  },
  {
    id: 4,
    title: 'Ocean Words',
    type: 'ocean-words',
    icon: '🐳',
    description: 'Learn ocean phonics & vocabulary'
  },
  {
    id: 5,
    title: 'Coral Reef Quest',
    type: 'coral-quest',
    icon: '🪸',
    description: 'Complete the coral reef multi-mission'
  },
  {
    id: 6,
    title: 'Ocean Challenge',
    type: 'ocean-boss',
    icon: '🏆',
    description: 'Grand Sea Challenge to unlock Space World!'
  }
];

export interface OceanColorQuestion {
  prompt: string;
  targetColorName: string;
  options: { name: string; colorName: string; hex: string; emoji: string; isCorrect: boolean }[];
}

export const OCEAN_COLOR_QUESTIONS: OceanColorQuestion[] = [
  {
    prompt: 'Find the BLUE Whale!',
    targetColorName: 'Blue',
    options: [
      { name: 'Blue Whale', colorName: 'Blue', hex: '#1E90FF', emoji: '🐳', isCorrect: true },
      { name: 'Pink Coral', colorName: 'Pink', hex: '#FF78CB', emoji: '🪸', isCorrect: false },
      { name: 'Yellow Starfish', colorName: 'Yellow', hex: '#FFA502', emoji: '⭐', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the PINK Shell!',
    targetColorName: 'Pink',
    options: [
      { name: 'Green Turtle', colorName: 'Green', hex: '#2ED573', emoji: '🐢', isCorrect: false },
      { name: 'Pink Shell', colorName: 'Pink', hex: '#FF78CB', emoji: '🐚', isCorrect: true },
      { name: 'Blue Fish', colorName: 'Blue', hex: '#1E90FF', emoji: '🐟', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the ORANGE Clownfish!',
    targetColorName: 'Orange',
    options: [
      { name: 'Orange Clownfish', colorName: 'Orange', hex: '#FF7F50', emoji: '🐠', isCorrect: true },
      { name: 'Purple Jellyfish', colorName: 'Purple', hex: '#9B59B6', emoji: '🪼', isCorrect: false },
      { name: 'Green Seaweed', colorName: 'Green', hex: '#2ED573', emoji: '🌿', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the GREEN Sea Turtle!',
    targetColorName: 'Green',
    options: [
      { name: 'Red Crab', colorName: 'Red', hex: '#FF4757', emoji: '🦀', isCorrect: false },
      { name: 'Blue Dolphin', colorName: 'Blue', hex: '#1E90FF', emoji: '🐬', isCorrect: false },
      { name: 'Green Sea Turtle', colorName: 'Green', hex: '#2ED573', emoji: '🐢', isCorrect: true }
    ]
  },
  {
    prompt: 'Find the YELLOW Starfish!',
    targetColorName: 'Yellow',
    options: [
      { name: 'Yellow Starfish', colorName: 'Yellow', hex: '#FFA502', emoji: '⭐', isCorrect: true },
      { name: 'Pink Shell', colorName: 'Pink', hex: '#FF78CB', emoji: '🐚', isCorrect: false },
      { name: 'Purple Octopus', colorName: 'Purple', hex: '#9B59B6', emoji: '🐙', isCorrect: false }
    ]
  }
];

export interface OceanCountQuestion {
  prompt: string;
  emoji: string;
  count: number;
  options: number[];
}

export const OCEAN_COUNT_QUESTIONS: OceanCountQuestion[] = [
  { prompt: 'How many friendly Clownfish swimming together?', emoji: '🐠', count: 4, options: [3, 4, 5] },
  { prompt: 'How many little Crabs on the sandy shore?', emoji: '🦀', count: 3, options: [2, 3, 4] },
  { prompt: 'How many shiny Starfish on the sea floor?', emoji: '⭐', count: 5, options: [4, 5, 6] },
  { prompt: 'How many playful Dolphins jumping high?', emoji: '🐬', count: 2, options: [1, 2, 3] },
  { prompt: 'How many pretty Seashells in the reef?', emoji: '🐚', count: 6, options: [5, 6, 7] }
];

export interface OceanWordQuestion {
  letter: string;
  prompt: string;
  correctWord: string;
  correctEmoji: string;
  options: { word: string; emoji: string; isCorrect: boolean }[];
}

export const OCEAN_WORD_QUESTIONS: OceanWordQuestion[] = [
  {
    letter: 'W',
    prompt: 'What ocean friend starts with W?',
    correctWord: 'Whale',
    correctEmoji: '🐳',
    options: [
      { word: 'Whale', emoji: '🐳', isCorrect: true },
      { word: 'Fish', emoji: '🐟', isCorrect: false },
      { word: 'Crab', emoji: '🦀', isCorrect: false }
    ]
  },
  {
    letter: 'F',
    prompt: 'What ocean friend starts with F?',
    correctWord: 'Fish',
    correctEmoji: '🐠',
    options: [
      { word: 'Dolphin', emoji: '🐬', isCorrect: false },
      { word: 'Fish', emoji: '🐠', isCorrect: true },
      { word: 'Turtle', emoji: '🐢', isCorrect: false }
    ]
  },
  {
    letter: 'S',
    prompt: 'What ocean friend starts with S?',
    correctWord: 'Shark',
    correctEmoji: '🦈',
    options: [
      { word: 'Octopus', emoji: '🐙', isCorrect: false },
      { word: 'Shark', emoji: '🦈', isCorrect: true },
      { word: 'Jellyfish', emoji: '🪼', isCorrect: false }
    ]
  },
  {
    letter: 'C',
    prompt: 'What ocean friend starts with C?',
    correctWord: 'Crab',
    correctEmoji: '🦀',
    options: [
      { word: 'Crab', emoji: '🦀', isCorrect: true },
      { word: 'Whale', emoji: '🐳', isCorrect: false },
      { word: 'Starfish', emoji: '⭐', isCorrect: false }
    ]
  }
];

export const CORAL_QUEST_STEPS = [
  {
    q: 'Reef Step 1: Find the RED Coral Crab! 🦀',
    options: [
      { label: '🔴 Red Crab', isCorrect: true },
      { label: '🔵 Blue Fish', isCorrect: false },
      { label: '🟡 Yellow Sun', isCorrect: false }
    ]
  },
  {
    q: 'Reef Step 2: How many Seashells in the chest? 🐚🐚🐚',
    options: [
      { label: '2', isCorrect: false },
      { label: '3', isCorrect: true },
      { label: '4', isCorrect: false }
    ]
  },
  {
    q: 'Reef Step 3: Match the gentle Sea Turtle! 🐢',
    options: [
      { label: '🐬 Dolphin', isCorrect: false },
      { label: '🐢 Sea Turtle', isCorrect: true },
      { label: '🐙 Octopus', isCorrect: false }
    ]
  },
  {
    q: 'Reef Step 4: Which word says WHALE? 🐳',
    options: [
      { label: 'WHALE', isCorrect: true },
      { label: 'CRAB', isCorrect: false },
      { label: 'FISH', isCorrect: false }
    ]
  },
  {
    q: 'Reef Step 5: Find the BLUE Water Drop! 💧',
    options: [
      { label: '💧 Water Drop', isCorrect: true },
      { label: '🍎 Apple', isCorrect: false },
      { label: '🍃 Leaf', isCorrect: false }
    ]
  }
];

export const OCEAN_BOSS_QUESTIONS = [
  {
    q: 'Ocean Trial 1: Find the deep BLUE Whale! 🐳',
    options: ['🔴 Red', '🔵 Blue', '🟡 Yellow'],
    correct: '🔵 Blue',
    voice: 'Find the blue whale!'
  },
  {
    q: 'Ocean Trial 2: Count 5 dancing Starfish! ⭐⭐⭐⭐⭐',
    options: ['4', '5', '6'],
    correct: '5',
    voice: 'How many starfish?'
  },
  {
    q: 'Ocean Trial 3: Match the purple Octopus! 🐙',
    options: ['🐙 Octopus', '🦀 Crab', '🐬 Dolphin'],
    correct: '🐙 Octopus',
    voice: 'Match the octopus!'
  },
  {
    q: 'Ocean Trial 4: What letter starts SHARK? 🦈',
    options: ['S', 'B', 'M'],
    correct: 'S',
    voice: 'What letter starts shark?'
  },
  {
    q: 'Ocean Trial 5: Count 3 sea horses! 🫧🫧🫧',
    options: ['2', '3', '4'],
    correct: '3',
    voice: 'How many bubbles?'
  },
  {
    q: 'Grand Ocean Final: Which color is the bright Sea Coral? 🪸',
    options: ['PINK', 'BLACK', 'GREY'],
    correct: 'PINK',
    voice: 'Which color is the bright pink coral?'
  }
];
