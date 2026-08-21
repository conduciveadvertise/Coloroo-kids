export interface DinoLevelDef {
  id: number;
  title: string;
  type: 'dino-colors' | 'dino-count' | 'dino-match' | 'dino-words' | 'jurassic-quest' | 'dino-boss';
  icon: string;
  description: string;
}

export const DINO_LEVELS: DinoLevelDef[] = [
  {
    id: 1,
    title: 'Dino Colors',
    type: 'dino-colors',
    icon: '🦕',
    description: 'Find colorful friendly dinosaurs'
  },
  {
    id: 2,
    title: 'Dino Counting',
    type: 'dino-count',
    icon: '🥚',
    description: 'Count dino eggs, bones & volcanoes'
  },
  {
    id: 3,
    title: 'Dino Match',
    type: 'dino-match',
    icon: '🦖',
    description: 'Match prehistoric animal friends'
  },
  {
    id: 4,
    title: 'Dino Words',
    type: 'dino-words',
    icon: '📖',
    description: 'Learn dinosaur phonics & vocabulary'
  },
  {
    id: 5,
    title: 'Jurassic Quest',
    type: 'jurassic-quest',
    icon: '🌋',
    description: 'Complete the prehistoric multi-mission'
  },
  {
    id: 6,
    title: 'Dino Challenge',
    type: 'dino-boss',
    icon: '🏆',
    description: 'Final Adventure Challenge to become Super Dino Explorer!'
  }
];

export interface DinoColorQuestion {
  prompt: string;
  targetColorName: string;
  options: { name: string; colorName: string; hex: string; emoji: string; isCorrect: boolean }[];
}

export const DINO_COLOR_QUESTIONS: DinoColorQuestion[] = [
  {
    prompt: 'Find the GREEN Dinosaur!',
    targetColorName: 'Green',
    options: [
      { name: 'Green T-Rex', colorName: 'Green', hex: '#2ED573', emoji: '🦖', isCorrect: true },
      { name: 'Red Raptor', colorName: 'Red', hex: '#FF4757', emoji: '🦕', isCorrect: false },
      { name: 'Yellow Stego', colorName: 'Yellow', hex: '#FFA502', emoji: '🦖', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the BLUE Brontosaurus!',
    targetColorName: 'Blue',
    options: [
      { name: 'Purple Egg', colorName: 'Purple', hex: '#9B59B6', emoji: '🥚', isCorrect: false },
      { name: 'Blue Bronto', colorName: 'Blue', hex: '#1E90FF', emoji: '🦕', isCorrect: true },
      { name: 'Green Palm', colorName: 'Green', hex: '#2ED573', emoji: '🌴', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the ORANGE Flying Pterodactyl!',
    targetColorName: 'Orange',
    options: [
      { name: 'Orange Ptero', colorName: 'Orange', hex: '#FF7F50', emoji: '🦅', isCorrect: true },
      { name: 'Pink Shell', colorName: 'Pink', hex: '#FF78CB', emoji: '🐚', isCorrect: false },
      { name: 'Blue Volcano', colorName: 'Blue', hex: '#1E90FF', emoji: '🌋', isCorrect: false }
    ]
  },
  {
    prompt: 'Find the YELLOW Stegosaurus!',
    targetColorName: 'Yellow',
    options: [
      { name: 'Red Raptor', colorName: 'Red', hex: '#FF4757', emoji: '🦖', isCorrect: false },
      { name: 'Blue Bone', colorName: 'Blue', hex: '#1E90FF', emoji: '🦴', isCorrect: false },
      { name: 'Yellow Stego', colorName: 'Yellow', hex: '#FFA502', emoji: '🦕', isCorrect: true }
    ]
  },
  {
    prompt: 'Find the RED Dinosaur!',
    targetColorName: 'Red',
    options: [
      { name: 'Red T-Rex', colorName: 'Red', hex: '#FF4757', emoji: '🦖', isCorrect: true },
      { name: 'Green Leaf', colorName: 'Green', hex: '#2ED573', emoji: '🌿', isCorrect: false },
      { name: 'Purple Egg', colorName: 'Purple', hex: '#9B59B6', emoji: '🥚', isCorrect: false }
    ]
  }
];

export interface DinoCountQuestion {
  prompt: string;
  emoji: string;
  count: number;
  options: number[];
}

export const DINO_COUNT_QUESTIONS: DinoCountQuestion[] = [
  { prompt: 'How many friendly Dinosaurs roaming the valley?', emoji: '🦖', count: 4, options: [3, 4, 5] },
  { prompt: 'How many warm Dino Eggs in the nest?', emoji: '🥚', count: 3, options: [2, 3, 4] },
  { prompt: 'How many green Palm Leaves in the jungle?', emoji: '🌿', count: 5, options: [4, 5, 6] },
  { prompt: 'How many friendly smoking Volcanoes?', emoji: '🌋', count: 2, options: [1, 2, 3] },
  { prompt: 'How many prehistoric Fossils & Bones?', emoji: '🦴', count: 6, options: [5, 6, 7] }
];

export interface DinoWordQuestion {
  letter: string;
  prompt: string;
  correctWord: string;
  correctEmoji: string;
  options: { word: string; emoji: string; isCorrect: boolean }[];
}

export const DINO_WORD_QUESTIONS: DinoWordQuestion[] = [
  {
    letter: 'D',
    prompt: 'What prehistoric friend starts with D?',
    correctWord: 'Dino',
    correctEmoji: '🦖',
    options: [
      { word: 'Dino', emoji: '🦖', isCorrect: true },
      { word: 'Bone', emoji: '🦴', isCorrect: false },
      { word: 'Egg', emoji: '🥚', isCorrect: false }
    ]
  },
  {
    letter: 'E',
    prompt: 'What prehistoric treasure starts with E?',
    correctWord: 'Egg',
    correctEmoji: '🥚',
    options: [
      { word: 'Tree', emoji: '🌴', isCorrect: false },
      { word: 'Egg', emoji: '🥚', isCorrect: true },
      { word: 'Roar', emoji: '🦁', isCorrect: false }
    ]
  },
  {
    letter: 'B',
    prompt: 'What prehistoric item starts with B?',
    correctWord: 'Bone',
    correctEmoji: '🦴',
    options: [
      { word: 'Dino', emoji: '🦖', isCorrect: false },
      { word: 'Bone', emoji: '🦴', isCorrect: true },
      { word: 'Volcano', emoji: '🌋', isCorrect: false }
    ]
  },
  {
    letter: 'R',
    prompt: 'What big dino sound starts with R?',
    correctWord: 'Roar',
    correctEmoji: '📢',
    options: [
      { word: 'Roar', emoji: '📢', isCorrect: true },
      { word: 'Leaf', emoji: '🌿', isCorrect: false },
      { word: 'Egg', emoji: '🥚', isCorrect: false }
    ]
  }
];

export const JURASSIC_QUEST_STEPS = [
  {
    q: 'Jurassic Step 1: Find the GREEN T-Rex! 🦖',
    options: [
      { label: '🟢 Green T-Rex', isCorrect: true },
      { label: '🔵 Blue Bronto', isCorrect: false },
      { label: '🟡 Yellow Egg', isCorrect: false }
    ]
  },
  {
    q: 'Jurassic Step 2: How many prehistoric Eggs in the nest? 🥚🥚🥚',
    options: [
      { label: '2', isCorrect: false },
      { label: '3', isCorrect: true },
      { label: '4', isCorrect: false }
    ]
  },
  {
    q: 'Jurassic Step 3: Match the friendly Brontosaurus! 🦕',
    options: [
      { label: '🦖 T-Rex', isCorrect: false },
      { label: '🦕 Bronto', isCorrect: true },
      { label: '🌋 Volcano', isCorrect: false }
    ]
  },
  {
    q: 'Jurassic Step 4: Which word says BONE? 🦴',
    options: [
      { label: 'BONE', isCorrect: true },
      { label: 'DINO', isCorrect: false },
      { label: 'EGG', isCorrect: false }
    ]
  },
  {
    q: 'Jurassic Step 5: Find the friendly Volcano! 🌋',
    options: [
      { label: '🌋 Volcano', isCorrect: true },
      { label: '🍎 Apple', isCorrect: false },
      { label: '💧 Water Drop', isCorrect: false }
    ]
  }
];

export const DINO_BOSS_QUESTIONS = [
  {
    q: 'Dino Trial 1: Find the gentle BLUE Brontosaurus! 🦕',
    options: ['🔴 Red', '🔵 Blue', '🟡 Yellow'],
    correct: '🔵 Blue',
    voice: 'Find the blue brontosaurus!'
  },
  {
    q: 'Dino Trial 2: Count 5 speckled Dino Eggs! 🥚🥚🥚🥚🥚',
    options: ['4', '5', '6'],
    correct: '5',
    voice: 'How many eggs?'
  },
  {
    q: 'Dino Trial 3: Match the green T-Rex! 🦖',
    options: ['🦖 T-Rex', '🦕 Bronto', '🦅 Ptero'],
    correct: '🦖 T-Rex',
    voice: 'Match the T-Rex!'
  },
  {
    q: 'Dino Trial 4: What letter starts DINO? 🦖',
    options: ['D', 'B', 'M'],
    correct: 'D',
    voice: 'What letter starts dino?'
  },
  {
    q: 'Dino Trial 5: Count 3 green Palm Leaves! 🌿🌿🌿',
    options: ['2', '3', '4'],
    correct: '3',
    voice: 'How many leaves?'
  },
  {
    q: 'Grand Adventure Final: Which color is the glowing Volcano Lava? 🌋',
    options: ['ORANGE', 'BLUE', 'BLACK'],
    correct: 'ORANGE',
    voice: 'Which color is the warm glowing volcano lava?'
  }
];
