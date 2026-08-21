export interface SpaceLevelDef {
  id: number;
  title: string;
  type: 'space-colors' | 'space-count' | 'space-match' | 'space-words' | 'galaxy-quest' | 'space-boss';
  icon: string;
  description: string;
}

export const SPACE_LEVELS: SpaceLevelDef[] = [
  {
    id: 1,
    title: 'Rocket Colors',
    type: 'space-colors',
    icon: '🚀',
    description: 'Find colorful cosmic rockets & celestial bodies'
  },
  {
    id: 2,
    title: 'Planet Count',
    type: 'space-count',
    icon: '🪐',
    description: 'Count glowing planets, stars & moons'
  },
  {
    id: 3,
    title: 'Star Match',
    type: 'space-match',
    icon: '🌟',
    description: 'Match friendly space companions'
  },
  {
    id: 4,
    title: 'Space Words',
    type: 'space-words',
    icon: '👽',
    description: 'Learn space phonics & cosmic vocabulary'
  },
  {
    id: 5,
    title: 'Galaxy Quest',
    type: 'galaxy-quest',
    icon: '🌌',
    description: 'Complete the cosmic galaxy exploration'
  },
  {
    id: 6,
    title: 'Space Challenge',
    type: 'space-boss',
    icon: '🏆',
    description: 'Grand Space Challenge to unlock Dino World!'
  }
];

export interface SpaceColorQuestion {
  prompt: string;
  targetColorName: string;
  options: { name: string; colorName: string; hex: string; emoji: string; isCorrect: boolean }[];
}

export const SPACE_COLOR_QUESTIONS: SpaceColorQuestion[] = [
  {
    prompt: 'Find the RED Rocket!',
    targetColorName: 'Red',
    options: [
      { name: 'Red Rocket', colorName: 'Red', hex: '#FF4757', emoji: '🚀', isCorrect: true },
      { name: 'Blue Planet', colorName: 'Blue', hex: '#1E90FF', emoji: '🪐', isCorrect: false },
      { name: 'Yellow Star', colorName: 'Yellow', hex: '#FFA502', emoji: '⭐', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the PURPLE Galaxy Planet!',
    targetColorName: 'Purple',
    options: [
      { name: 'Green Alien', colorName: 'Green', hex: '#2ED573', emoji: '👽', isCorrect: false },
      { name: 'Purple Planet', colorName: 'Purple', hex: '#9B59B6', emoji: '🪐', isCorrect: true },
      { name: 'Blue Comet', colorName: 'Blue', hex: '#1E90FF', emoji: '☄️', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the YELLOW Shining Star!',
    targetColorName: 'Yellow',
    options: [
      { name: 'Yellow Star', colorName: 'Yellow', hex: '#FFA502', emoji: '🌟', isCorrect: true },
      { name: 'Pink Moon', colorName: 'Pink', hex: '#FF78CB', emoji: '🌙', isCorrect: false },
      { name: 'Green Rocket', colorName: 'Green', hex: '#2ED573', emoji: '🚀', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the GREEN Friendly Alien!',
    targetColorName: 'Green',
    options: [
      { name: 'Red Comet', colorName: 'Red', hex: '#FF4757', emoji: '☄️', isCorrect: false },
      { name: 'Blue Shuttle', colorName: 'Blue', hex: '#1E90FF', emoji: '🛰️', isCorrect: false },
      { name: 'Green Alien', colorName: 'Green', hex: '#2ED573', emoji: '👽', isCorrect: true }
    ]
  },
  {
    prompt: 'Find the BLUE Cosmic Earth!',
    targetColorName: 'Blue',
    options: [
      { name: 'Blue Earth', colorName: 'Blue', hex: '#1E90FF', emoji: '🌍', isCorrect: true },
      { name: 'Orange Mars', colorName: 'Orange', hex: '#FF7F50', emoji: '🪐', isCorrect: false },
      { name: 'Purple Star', colorName: 'Purple', hex: '#9B59B6', emoji: '⭐', isCorrect: false }
    ]
  }
];

export interface SpaceCountQuestion {
  prompt: string;
  emoji: string;
  count: number;
  options: number[];
}

export const SPACE_COUNT_QUESTIONS: SpaceCountQuestion[] = [
  { prompt: 'How many golden Stars glowing in the dark?', emoji: '⭐', count: 4, options: [3, 4, 5] },
  { prompt: 'How many ringed Planets orbiting peacefully?', emoji: '🪐', count: 3, options: [2, 3, 4] },
  { prompt: 'How many flying Rockets zooming through space?', emoji: '🚀', count: 5, options: [4, 5, 6] },
  { prompt: 'How many glowing Crescent Moons in the sky?', emoji: '🌙', count: 2, options: [1, 2, 3] },
  { prompt: 'How many speedy Comets leaving sparkling trails?', emoji: '☄️', count: 6, options: [5, 6, 7] }
];

export interface SpaceWordQuestion {
  letter: string;
  prompt: string;
  correctWord: string;
  correctEmoji: string;
  options: { word: string; emoji: string; isCorrect: boolean }[];
}

export const SPACE_WORD_QUESTIONS: SpaceWordQuestion[] = [
  {
    letter: 'R',
    prompt: 'What space friend starts with R?',
    correctWord: 'Rocket',
    correctEmoji: '🚀',
    options: [
      { word: 'Rocket', emoji: '🚀', isCorrect: true },
      { word: 'Star', emoji: '⭐', isCorrect: false },
      { word: 'Moon', emoji: '🌙', isCorrect: false }
    ]
  },
  {
    letter: 'S',
    prompt: 'What space friend starts with S?',
    correctWord: 'Star',
    correctEmoji: '🌟',
    options: [
      { word: 'Planet', emoji: '🪐', isCorrect: false },
      { word: 'Star', emoji: '🌟', isCorrect: true },
      { word: 'Alien', emoji: '👽', isCorrect: false }
    ]
  },
  {
    letter: 'M',
    prompt: 'What space friend starts with M?',
    correctWord: 'Moon',
    correctEmoji: '🌙',
    options: [
      { word: 'Rocket', emoji: '🚀', isCorrect: false },
      { word: 'Moon', emoji: '🌙', isCorrect: true },
      { word: 'Earth', emoji: '🌍', isCorrect: false }
    ]
  },
  {
    letter: 'P',
    prompt: 'What space friend starts with P?',
    correctWord: 'Planet',
    correctEmoji: '🪐',
    options: [
      { word: 'Planet', emoji: '🪐', isCorrect: true },
      { word: 'Comet', emoji: '☄️', isCorrect: false },
      { word: 'Star', emoji: '⭐', isCorrect: false }
    ]
  }
];

export const GALAXY_QUEST_STEPS = [
  {
    q: 'Galaxy Step 1: Find the RED Rocket Booster! 🚀',
    options: [
      { label: '🔴 Red Rocket', isCorrect: true },
      { label: '🔵 Blue Earth', isCorrect: false },
      { label: '🟡 Yellow Star', isCorrect: false }
    ]
  },
  {
    q: 'Galaxy Step 2: How many shining Stars? ⭐⭐⭐',
    options: [
      { label: '2', isCorrect: false },
      { label: '3', isCorrect: true },
      { label: '4', isCorrect: false }
    ]
  },
  {
    q: 'Galaxy Step 3: Match the friendly Alien! 👽',
    options: [
      { label: '🪐 Planet', isCorrect: false },
      { label: '👽 Alien', isCorrect: true },
      { label: '🌙 Moon', isCorrect: false }
    ]
  },
  {
    q: 'Galaxy Step 4: Which word says MOON? 🌙',
    options: [
      { label: 'MOON', isCorrect: true },
      { label: 'STAR', isCorrect: false },
      { label: 'SUN', isCorrect: false }
    ]
  },
  {
    q: 'Galaxy Step 5: Find the YELLOW Star! ⭐',
    options: [
      { label: '⭐ Yellow Star', isCorrect: true },
      { label: '🍎 Apple', isCorrect: false },
      { label: '🍃 Leaf', isCorrect: false }
    ]
  }
];

export const SPACE_BOSS_QUESTIONS = [
  {
    q: 'Space Trial 1: Find the deep BLUE Earth! 🌍',
    options: ['🔴 Red', '🔵 Blue', '🟡 Yellow'],
    correct: '🔵 Blue',
    voice: 'Find the blue Earth!'
  },
  {
    q: 'Space Trial 2: Count 5 golden Stars! ⭐⭐⭐⭐⭐',
    options: ['4', '5', '6'],
    correct: '5',
    voice: 'How many stars?'
  },
  {
    q: 'Space Trial 3: Match the cosmic Planet! 🪐',
    options: ['🪐 Planet', '🚀 Rocket', '👽 Alien'],
    correct: '🪐 Planet',
    voice: 'Match the planet!'
  },
  {
    q: 'Space Trial 4: What letter starts ROCKET? 🚀',
    options: ['R', 'B', 'M'],
    correct: 'R',
    voice: 'What letter starts rocket?'
  },
  {
    q: 'Space Trial 5: Count 3 cosmic Comets! ☄️☄️☄️',
    options: ['2', '3', '4'],
    correct: '3',
    voice: 'How many comets?'
  },
  {
    q: 'Grand Space Final: Which color is the glowing Sun? ☀️',
    options: ['YELLOW', 'BLACK', 'GREY'],
    correct: 'YELLOW',
    voice: 'Which color is the bright glowing sun?'
  }
];
