export interface ArcadeGameInfo {
  id: 'balloon-math' | 'memory-match' | 'shape-sorter' | 'count-catch' | 'word-pop';
  title: string;
  subtitle: string;
  tagline: string;
  iconEmoji: string;
  secondaryEmoji: string;
  gradient: string;
  borderAccent: string;
}

export const ARCADE_GAMES_LIST: ArcadeGameInfo[] = [
  {
    id: 'balloon-math',
    title: 'Balloon Math',
    subtitle: 'Pop the right answer!',
    tagline: 'Math equations & number popping',
    iconEmoji: '🎈',
    secondaryEmoji: '➕',
    gradient: 'from-[#ff7675] via-[#e17055] to-[#d63031]',
    borderAccent: 'border-b-[#d63031]'
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    subtitle: 'Pair animals & words!',
    tagline: 'Vocabulary & visual memory',
    iconEmoji: '🧠',
    secondaryEmoji: '🃏',
    gradient: 'from-[#a29bfe] via-[#6c5ce7] to-[#4834d4]',
    borderAccent: 'border-b-[#4834d4]'
  },
  {
    id: 'shape-sorter',
    title: 'Shape Sorter',
    subtitle: 'Sort shapes into bins!',
    tagline: 'Visual discrimination & sorting',
    iconEmoji: '🔷',
    secondaryEmoji: '📦',
    gradient: 'from-[#00cec9] via-[#0984e3] to-[#00d2d3]',
    borderAccent: 'border-b-[#0984e3]'
  },
  {
    id: 'count-catch',
    title: 'Count & Catch',
    subtitle: 'Catch targets on screen!',
    tagline: 'Hand-eye coordination & counting',
    iconEmoji: '🍎',
    secondaryEmoji: '⭐',
    gradient: 'from-[#fdcb6e] via-[#f39c12] to-[#e67e22]',
    borderAccent: 'border-b-[#e67e22]'
  },
  {
    id: 'word-pop',
    title: 'Word Pop',
    subtitle: 'Pop the right sound!',
    tagline: 'Phonics & letter-word links',
    iconEmoji: '🔤',
    secondaryEmoji: '🫧',
    gradient: 'from-[#55efc4] via-[#00b894] to-[#10ac84]',
    borderAccent: 'border-b-[#10ac84]'
  }
];

export interface VocabMemoryPair {
  pairId: number;
  word: string;
  emoji: string;
  category: string;
}

export const VOCAB_MEMORY_PAIRS: VocabMemoryPair[] = [
  { pairId: 1, word: 'Dog', emoji: '🐶', category: 'Animals' },
  { pairId: 2, word: 'Cat', emoji: '🐱', category: 'Animals' },
  { pairId: 3, word: 'Apple', emoji: '🍎', category: 'Fruits' },
  { pairId: 4, word: 'Banana', emoji: '🍌', category: 'Fruits' },
  { pairId: 5, word: 'Star', emoji: '⭐', category: 'Shapes' },
  { pairId: 6, word: 'Heart', emoji: '💖', category: 'Shapes' }
];

export interface ShapeItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const SHAPES_LIST: ShapeItem[] = [
  { id: 'circle', name: 'Circle', icon: '🔴', color: '#FF4757' },
  { id: 'square', name: 'Square', icon: '🟦', color: '#1E90FF' },
  { id: 'triangle', name: 'Triangle', icon: '🔺', color: '#2ED573' },
  { id: 'star', name: 'Star', icon: '⭐', color: '#FFA502' },
  { id: 'heart', name: 'Heart', icon: '💖', color: '#FF78CB' }
];

export interface WordPopQuestion {
  letter: string;
  prompt: string;
  correctWord: string;
  correctEmoji: string;
  options: { word: string; emoji: string }[];
}

export const WORD_POP_QUESTIONS: WordPopQuestion[] = [
  {
    letter: 'B',
    prompt: 'Pop the word that starts with B!',
    correctWord: 'Ball',
    correctEmoji: '⚽',
    options: [
      { word: 'Dog', emoji: '🐶' },
      { word: 'Ball', emoji: '⚽' },
      { word: 'Apple', emoji: '🍎' }
    ]
  },
  {
    letter: 'A',
    prompt: 'Pop the word that starts with A!',
    correctWord: 'Apple',
    correctEmoji: '🍎',
    options: [
      { word: 'Apple', emoji: '🍎' },
      { word: 'Cat', emoji: '🐱' },
      { word: 'Fish', emoji: '🐟' }
    ]
  },
  {
    letter: 'C',
    prompt: 'Pop the word that starts with C!',
    correctWord: 'Cat',
    correctEmoji: '🐱',
    options: [
      { word: 'Banana', emoji: '🍌' },
      { word: 'Elephant', emoji: '🐘' },
      { word: 'Cat', emoji: '🐱' }
    ]
  },
  {
    letter: 'D',
    prompt: 'Pop the word that starts with D!',
    correctWord: 'Dolphin',
    correctEmoji: '🐬',
    options: [
      { word: 'Dolphin', emoji: '🐬' },
      { word: 'Star', emoji: '⭐' },
      { word: 'Giraffe', emoji: '🦒' }
    ]
  },
  {
    letter: 'F',
    prompt: 'Pop the word that starts with F!',
    correctWord: 'Frog',
    correctEmoji: '🐸',
    options: [
      { word: 'Monkey', emoji: '🐵' },
      { word: 'Frog', emoji: '🐸' },
      { word: 'Ice Cream', emoji: '🍦' }
    ]
  }
];
