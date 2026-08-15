export interface PhonicsCard {
  letter: string;
  word: string;
  icon: string;
  color: string;
  audioPrompt: string;
  phonicsSound: string;
}

export const PHONICS_LIST: PhonicsCard[] = [
  { letter: 'A', word: 'Apple', icon: '🍎', color: '#FF7675', audioPrompt: 'A is for Apple! Ah, ah, Apple!', phonicsSound: 'ah' },
  { letter: 'B', word: 'Butterfly', icon: '🦋', color: '#74B9FF', audioPrompt: 'B is for Butterfly! Buh, buh, Butterfly!', phonicsSound: 'buh' },
  { letter: 'C', word: 'Cat', icon: '🐱', color: '#FDCB6E', audioPrompt: 'C is for Cat! Kuh, kuh, Cat!', phonicsSound: 'kuh' },
  { letter: 'D', word: 'Dinosaur', icon: '🦕', color: '#55EFC4', audioPrompt: 'D is for Dinosaur! Duh, duh, Dinosaur!', phonicsSound: 'duh' },
  { letter: 'E', word: 'Elephant', icon: '🐘', color: '#A29BFE', audioPrompt: 'E is for Elephant! Eh, eh, Elephant!', phonicsSound: 'eh' },
  { letter: 'F', word: 'Frog', icon: '🐸', color: '#00B894', audioPrompt: 'F is for Frog! Fff, fff, Frog!', phonicsSound: 'fff' },
  { letter: 'G', word: 'Giraffe', icon: '🦒', color: '#F39C12', audioPrompt: 'G is for Giraffe! Juh, juh, Giraffe!', phonicsSound: 'juh' },
  { letter: 'H', word: 'Heart', icon: '💖', color: '#FD79A8', audioPrompt: 'H is for Heart! Hhh, hhh, Heart!', phonicsSound: 'hhh' },
  { letter: 'I', word: 'Ice Cream', icon: '🍦', color: '#81ECEC', audioPrompt: 'I is for Ice Cream! Eye, eye, Ice Cream!', phonicsSound: 'eye' },
  { letter: 'J', word: 'Jellyfish', icon: '🪼', color: '#E84393', audioPrompt: 'J is for Jellyfish! Juh, juh, Jellyfish!', phonicsSound: 'juh' },
  { letter: 'K', word: 'Kangaroo', icon: '🦘', color: '#FFA502', audioPrompt: 'K is for Kangaroo! Kuh, kuh, Kangaroo!', phonicsSound: 'kuh' },
  { letter: 'L', word: 'Lion', icon: '🦁', color: '#E67E22', audioPrompt: 'L is for Lion! Lll, lll, Lion!', phonicsSound: 'lll' },
  { letter: 'M', word: 'Moon', icon: '🌙', color: '#F1C40F', audioPrompt: 'M is for Moon! Mmm, mmm, Moon!', phonicsSound: 'mmm' },
  { letter: 'N', word: 'Nest', icon: '🪺', color: '#D35400', audioPrompt: 'N is for Nest! Nnn, nnn, Nest!', phonicsSound: 'nnn' },
  { letter: 'O', word: 'Octopus', icon: '🐙', color: '#FF7675', audioPrompt: 'O is for Octopus! Ah, ah, Octopus!', phonicsSound: 'ah' },
  { letter: 'P', word: 'Penguin', icon: '🐧', color: '#2D3436', audioPrompt: 'P is for Penguin! Puh, puh, Penguin!', phonicsSound: 'puh' },
  { letter: 'Q', word: 'Queen', icon: '👑', color: '#9B59B6', audioPrompt: 'Q is for Queen! Kwuh, kwuh, Queen!', phonicsSound: 'kwuh' },
  { letter: 'R', word: 'Rainbow', icon: '🌈', color: '#6C5CE7', audioPrompt: 'R is for Rainbow! Rrr, rrr, Rainbow!', phonicsSound: 'rrr' },
  { letter: 'S', word: 'Star', icon: '⭐', color: '#FDCB6E', audioPrompt: 'S is for Star! Sss, sss, Star!', phonicsSound: 'sss' },
  { letter: 'T', word: 'Tiger', icon: '🐯', color: '#E67E22', audioPrompt: 'T is for Tiger! Tuh, tuh, Tiger!', phonicsSound: 'tuh' },
  { letter: 'U', word: 'Unicorn', icon: '🦄', color: '#E84393', audioPrompt: 'U is for Unicorn! You, you, Unicorn!', phonicsSound: 'you' },
  { letter: 'V', word: 'Volcano', icon: '🌋', color: '#C0392B', audioPrompt: 'V is for Volcano! Vvv, vvv, Volcano!', phonicsSound: 'vvv' },
  { letter: 'W', word: 'Whale', icon: '🐳', color: '#0984E3', audioPrompt: 'W is for Whale! Wuh, wuh, Whale!', phonicsSound: 'wuh' },
  { letter: 'X', word: 'Xylophone', icon: '🎵', color: '#00CEC9', audioPrompt: 'X is for Xylophone! Zzzz, Xylophone!', phonicsSound: 'zyl' },
  { letter: 'Y', word: 'Yo-Yo', icon: '🪀', color: '#F39C12', audioPrompt: 'Y is for Yo-Yo! Yuh, yuh, Yo-Yo!', phonicsSound: 'yuh' },
  { letter: 'Z', word: 'Zebra', icon: '🦓', color: '#636E72', audioPrompt: 'Z is for Zebra! Zzz, zzz, Zebra!', phonicsSound: 'zzz' }
];

export interface MathCountingLevel {
  number: number;
  word: string;
  itemEmoji: string;
  itemName: string;
  color: string;
}

export const COUNTING_LEVELS: MathCountingLevel[] = [
  { number: 1, word: 'One', itemEmoji: '☀️', itemName: 'Sun', color: '#FDCB6E' },
  { number: 2, word: 'Two', itemEmoji: '🍓', itemName: 'Strawberries', color: '#FF7675' },
  { number: 3, word: 'Three', itemEmoji: '🎈', itemName: 'Balloons', color: '#74B9FF' },
  { number: 4, word: 'Four', itemEmoji: '🌸', itemName: 'Flowers', color: '#FD79A8' },
  { number: 5, word: 'Five', itemEmoji: '⭐', itemName: 'Stars', color: '#FFA502' },
  { number: 6, word: 'Six', itemEmoji: '🧁', itemName: 'Cupcakes', color: '#A29BFE' },
  { number: 7, word: 'Seven', itemEmoji: '🐟', itemName: 'Fishes', color: '#00CEC9' },
  { number: 8, word: 'Eight', itemEmoji: '🍎', itemName: 'Apples', color: '#D63031' },
  { number: 9, word: 'Nine', itemEmoji: '🚀', itemName: 'Rockets', color: '#6C5CE7' },
  { number: 10, word: 'Ten', itemEmoji: '💎', itemName: 'Sparkly Gems', color: '#00B894' },
  { number: 11, word: 'Eleven', itemEmoji: '🦋', itemName: 'Butterflies', color: '#74B9FF' },
  { number: 12, word: 'Twelve', itemEmoji: '🍪', itemName: 'Cookies', color: '#E67E22' },
  { number: 13, word: 'Thirteen', itemEmoji: '🍒', itemName: 'Cherries', color: '#E84393' },
  { number: 14, word: 'Fourteen', itemEmoji: '🐞', itemName: 'Ladybugs', color: '#FF7675' },
  { number: 15, word: 'Fifteen', itemEmoji: '🍬', itemName: 'Candies', color: '#FD79A8' },
  { number: 16, word: 'Sixteen', itemEmoji: '🐝', itemName: 'Buzzy Bees', color: '#F1C40F' },
  { number: 17, word: 'Seventeen', itemEmoji: '🍄', itemName: 'Mushrooms', color: '#D63031' },
  { number: 18, word: 'Eighteen', itemEmoji: '🍃', itemName: 'Green Leaves', color: '#2ED573' },
  { number: 19, word: 'Nineteen', itemEmoji: '🐬', itemName: 'Dolphins', color: '#0984E3' },
  { number: 20, word: 'Twenty', itemEmoji: '🌈', itemName: 'Rainbows', color: '#6C5CE7' }
];

export interface NumberNameItem {
  number: number;
  word: string;
  emoji: string;
  color: string;
  audioPrompt: string;
}

const NUMBER_NAME_WORDS: string[] = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
  'Twenty-One', 'Twenty-Two', 'Twenty-Three', 'Twenty-Four', 'Twenty-Five', 'Twenty-Six', 'Twenty-Seven', 'Twenty-Eight', 'Twenty-Nine', 'Thirty',
  'Thirty-One', 'Thirty-Two', 'Thirty-Three', 'Thirty-Four', 'Thirty-Five', 'Thirty-Six', 'Thirty-Seven', 'Thirty-Eight', 'Thirty-Nine', 'Forty',
  'Forty-One', 'Forty-Two', 'Forty-Three', 'Forty-Four', 'Forty-Five', 'Forty-Six', 'Forty-Seven', 'Forty-Eight', 'Forty-Nine', 'Fifty'
];

const NUMBER_EMOJIS: string[] = [
  '⭐', '🎈', '🍓', '🌸', '🧁', '🚀', '💎', '🐟', '🍎', '🦋',
  '🍪', '🍒', '🐞', '🍬', '🐝', '🍄', '🍃', '🐬', '🌈', '🍦',
  '🎨', '🌻', '🎁', '🐣', '🍉', '🪁', '🥥', '🍇', '🦁', '🥑',
  '🔔', '🍊', '🎠', '🍭', '🌮', '🦩', '🍩', '🐢', '🥞', '🥨',
  '🧸', '🎪', '⚽', '🎯', '🎸', '🎺', '⛵', '🔮', '🪐', '👑'
];

const PALETTE_BG_COLORS = [
  '#FF7675', '#74B9FF', '#FDCB6E', '#55EFC4', '#A29BFE',
  '#00B894', '#F39C12', '#FD79A8', '#6C5CE7', '#00CEC9'
];

export const NUMBER_NAMES_LIST: NumberNameItem[] = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const word = NUMBER_NAME_WORDS[num] || `${num}`;
  const emoji = NUMBER_EMOJIS[i % NUMBER_EMOJIS.length];
  const color = PALETTE_BG_COLORS[i % PALETTE_BG_COLORS.length];
  return {
    number: num,
    word,
    emoji,
    color,
    audioPrompt: `${num}! ${word}!`
  };
});

export interface ShapeItem {
  id: string;
  name: string;
  shapeType: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
  colorHex: string;
  colorName: string;
}

export const SHAPES_DATA: ShapeItem[] = [
  { id: 'sh-1', name: 'Yellow Star', shapeType: 'star', colorHex: '#FDCB6E', colorName: 'Yellow' },
  { id: 'sh-2', name: 'Red Heart', shapeType: 'heart', colorHex: '#FF7675', colorName: 'Red' },
  { id: 'sh-3', name: 'Blue Circle', shapeType: 'circle', colorHex: '#74B9FF', colorName: 'Blue' },
  { id: 'sh-4', name: 'Green Square', shapeType: 'square', colorHex: '#2ED573', colorName: 'Green' },
  { id: 'sh-5', name: 'Purple Triangle', shapeType: 'triangle', colorHex: '#A29BFE', colorName: 'Purple' },
  { id: 'sh-6', name: 'Orange Diamond', shapeType: 'diamond', colorHex: '#FFA502', colorName: 'Orange' }
];

export interface AnimalFact {
  id: string;
  name: string;
  icon: string;
  sound: string;
  habitat: 'Jungle' | 'Ocean' | 'Safari' | 'Farm';
  funFact: string;
  color: string;
}

export const ANIMAL_FACTS: AnimalFact[] = [
  { id: 'an-1', name: 'Coloroo Kangaroo', icon: '🦘', sound: 'Boing! Boing!', habitat: 'Safari', funFact: 'Kangaroos have a cozy front pouch to carry baby joeys!', color: '#FDCB6E' },
  { id: 'an-2', name: 'Playful Dolphin', icon: '🐬', sound: 'Click-click! Squeak!', habitat: 'Ocean', funFact: 'Dolphins are super smart and love jumping high in the waves!', color: '#74B9FF' },
  { id: 'an-3', name: 'Gentle Lion', icon: '🦁', sound: 'Rrrr-Oar!', habitat: 'Safari', funFact: 'Lions have giant fluffy manes and love taking afternoon naps!', color: '#FFA502' },
  { id: 'an-4', name: 'Cute Panda', icon: '🐼', sound: 'Munch! Crunch!', habitat: 'Jungle', funFact: 'Pandas eat yummy green bamboo all day long!', color: '#55EFC4' },
  { id: 'an-5', name: 'Happy Cow', icon: '🐮', sound: 'Moooo-Mooo!', habitat: 'Farm', funFact: 'Cows have best friends and love eating fresh sweet clover!', color: '#FD79A8' },
  { id: 'an-6', name: 'Little Froggy', icon: '🐸', sound: 'Ribbit! Croak!', habitat: 'Jungle', funFact: 'Frogs can jump up to 20 times their own body length!', color: '#00B894' }
];
