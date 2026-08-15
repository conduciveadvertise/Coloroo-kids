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
  { letter: 'K', word: 'Kangaroo', icon: '🦘', color: '#FFA502', audioPrompt: 'K is for Kangaroo! Kuh, kuh, Kangaroo!', phonicsSound: 'kuh' },
  { letter: 'L', word: 'Lion', icon: '🦁', color: '#E67E22', audioPrompt: 'L is for Lion! Lll, lll, Lion!', phonicsSound: 'lll' },
  { letter: 'M', word: 'Moon', icon: '🌙', color: '#F1C40F', audioPrompt: 'M is for Moon! Mmm, mmm, Moon!', phonicsSound: 'mmm' },
  { letter: 'R', word: 'Rainbow', icon: '🌈', color: '#6C5CE7', audioPrompt: 'R is for Rainbow! Rrr, rrr, Rainbow!', phonicsSound: 'rrr' },
  { letter: 'S', word: 'Star', icon: '⭐', color: '#FDCB6E', audioPrompt: 'S is for Star! Sss, sss, Star!', phonicsSound: 'sss' },
  { letter: 'U', word: 'Unicorn', icon: '🦄', color: '#E84393', audioPrompt: 'U is for Unicorn! You, you, Unicorn!', phonicsSound: 'you' }
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
  { number: 7, word: 'Seven', itemEmoji: '🐟', itemName: 'Little Fishes', color: '#00CEC9' },
  { number: 8, word: 'Eight', itemEmoji: '🍎', itemName: 'Crisp Apples', color: '#D63031' },
  { number: 9, word: 'Nine', itemEmoji: '🚀', itemName: 'Rockets', color: '#6C5CE7' },
  { number: 10, word: 'Ten', itemEmoji: '💎', itemName: 'Sparkly Gems', color: '#00B894' }
];

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
