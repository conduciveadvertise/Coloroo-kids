export interface ColorDef {
  name: string;
  hex: string;
  emoji: string;
  textColor?: string;
}

export const CORE_COLORS: ColorDef[] = [
  { name: 'Red', hex: '#FF4757', emoji: '🔴', textColor: 'text-white' },
  { name: 'Blue', hex: '#1E90FF', emoji: '🔵', textColor: 'text-white' },
  { name: 'Yellow', hex: '#FFA502', emoji: '🟡', textColor: 'text-slate-900' },
  { name: 'Green', hex: '#2ED573', emoji: '🟢', textColor: 'text-white' },
  { name: 'Orange', hex: '#FF7F50', emoji: '🟠', textColor: 'text-white' },
  { name: 'Purple', hex: '#9B59B6', emoji: '🟣', textColor: 'text-white' },
  { name: 'Pink', hex: '#FF78CB', emoji: '🌸', textColor: 'text-white' },
  { name: 'Brown', hex: '#8B572A', emoji: '🟤', textColor: 'text-white' },
  { name: 'Black', hex: '#2F3542', emoji: '⚫', textColor: 'text-white' },
  { name: 'White', hex: '#F1F2F6', emoji: '⚪', textColor: 'text-slate-900' }
];

export interface ObjectToColor {
  id: string;
  name: string;
  prompt: string;
  correctColorName: string;
  correctHex: string;
  options: ColorDef[];
  svgType: 'apple' | 'banana' | 'leaf' | 'sun' | 'cloud' | 'flower' | 'car' | 'ball';
}

export const OBJECTS_TO_COLOR: ObjectToColor[] = [
  {
    id: 'obj-apple',
    name: 'Apple',
    prompt: 'Make the apple RED',
    correctColorName: 'Red',
    correctHex: '#FF4757',
    options: [
      { name: 'Red', hex: '#FF4757', emoji: '🔴' },
      { name: 'Blue', hex: '#1E90FF', emoji: '🔵' },
      { name: 'Green', hex: '#2ED573', emoji: '🟢' }
    ],
    svgType: 'apple'
  },
  {
    id: 'obj-banana',
    name: 'Banana',
    prompt: 'Make the banana YELLOW',
    correctColorName: 'Yellow',
    correctHex: '#FFA502',
    options: [
      { name: 'Purple', hex: '#9B59B6', emoji: '🟣' },
      { name: 'Yellow', hex: '#FFA502', emoji: '🟡' },
      { name: 'Blue', hex: '#1E90FF', emoji: '🔵' }
    ],
    svgType: 'banana'
  },
  {
    id: 'obj-leaf',
    name: 'Leaf',
    prompt: 'Make the leaf GREEN',
    correctColorName: 'Green',
    correctHex: '#2ED573',
    options: [
      { name: 'Green', hex: '#2ED573', emoji: '🟢' },
      { name: 'Red', hex: '#FF4757', emoji: '🔴' },
      { name: 'Pink', hex: '#FF78CB', emoji: '🌸' }
    ],
    svgType: 'leaf'
  },
  {
    id: 'obj-sun',
    name: 'Sun',
    prompt: 'Make the sun YELLOW',
    correctColorName: 'Yellow',
    correctHex: '#FFA502',
    options: [
      { name: 'Blue', hex: '#1E90FF', emoji: '🔵' },
      { name: 'Orange', hex: '#FF7F50', emoji: '🟠' },
      { name: 'Yellow', hex: '#FFA502', emoji: '🟡' }
    ],
    svgType: 'sun'
  },
  {
    id: 'obj-cloud',
    name: 'Sky Cloud',
    prompt: 'Make the cloud BLUE',
    correctColorName: 'Blue',
    correctHex: '#1E90FF',
    options: [
      { name: 'Red', hex: '#FF4757', emoji: '🔴' },
      { name: 'Blue', hex: '#1E90FF', emoji: '🔵' },
      { name: 'Brown', hex: '#8B572A', emoji: '🟤' }
    ],
    svgType: 'cloud'
  },
  {
    id: 'obj-flower',
    name: 'Flower',
    prompt: 'Make the flower PINK',
    correctColorName: 'Pink',
    correctHex: '#FF78CB',
    options: [
      { name: 'Green', hex: '#2ED573', emoji: '🟢' },
      { name: 'Pink', hex: '#FF78CB', emoji: '🌸' },
      { name: 'Brown', hex: '#8B572A', emoji: '🟤' }
    ],
    svgType: 'flower'
  },
  {
    id: 'obj-car',
    name: 'Toy Car',
    prompt: 'Make the car ORANGE',
    correctColorName: 'Orange',
    correctHex: '#FF7F50',
    options: [
      { name: 'Orange', hex: '#FF7F50', emoji: '🟠' },
      { name: 'Purple', hex: '#9B59B6', emoji: '🟣' },
      { name: 'Blue', hex: '#1E90FF', emoji: '🔵' }
    ],
    svgType: 'car'
  },
  {
    id: 'obj-ball',
    name: 'Play Ball',
    prompt: 'Make the ball PURPLE',
    correctColorName: 'Purple',
    correctHex: '#9B59B6',
    options: [
      { name: 'Red', hex: '#FF4757', emoji: '🔴' },
      { name: 'Yellow', hex: '#FFA502', emoji: '🟡' },
      { name: 'Purple', hex: '#9B59B6', emoji: '🟣' }
    ],
    svgType: 'ball'
  }
];

export interface DetectiveItem {
  id: number;
  name: string;
  emoji: string;
  colorName: string;
  isFound?: boolean;
}

export const DETECTIVE_POOL: Omit<DetectiveItem, 'id' | 'isFound'>[] = [
  { name: 'Red Apple', emoji: '🍎', colorName: 'Red' },
  { name: 'Red Balloon', emoji: '🎈', colorName: 'Red' },
  { name: 'Red Heart', emoji: '❤️', colorName: 'Red' },
  { name: 'Fire Engine', emoji: '🚒', colorName: 'Red' },
  { name: 'Strawberry', emoji: '🍓', colorName: 'Red' },

  { name: 'Blue Whale', emoji: '🐳', colorName: 'Blue' },
  { name: 'Blue Cap', emoji: '🧢', colorName: 'Blue' },
  { name: 'Blue Fish', emoji: '🐟', colorName: 'Blue' },
  { name: 'Water Drop', emoji: '💧', colorName: 'Blue' },
  { name: 'Blueberry', emoji: '🫐', colorName: 'Blue' },

  { name: 'Yellow Star', emoji: '⭐', colorName: 'Yellow' },
  { name: 'Banana', emoji: '🍌', colorName: 'Yellow' },
  { name: 'Sun', emoji: '☀️', colorName: 'Yellow' },
  { name: 'Lemon', emoji: '🍋', colorName: 'Yellow' },
  { name: 'Baby Chick', emoji: '🐥', colorName: 'Yellow' },

  { name: 'Green Leaf', emoji: '🍃', colorName: 'Green' },
  { name: 'Green Frog', emoji: '🐸', colorName: 'Green' },
  { name: 'Tree', emoji: '🌳', colorName: 'Green' },
  { name: 'Clover', emoji: '🍀', colorName: 'Green' },
  { name: 'Avocado', emoji: '🥑', colorName: 'Green' },

  { name: 'Purple Grapes', emoji: '🍇', colorName: 'Purple' },
  { name: 'Magic Crystal', emoji: '🔮', colorName: 'Purple' },
  { name: 'Eggplant', emoji: '🍆', colorName: 'Purple' },
  { name: 'Purple Ribbon', emoji: '🎀', colorName: 'Purple' },

  { name: 'Orange Fruit', emoji: '🍊', colorName: 'Orange' },
  { name: 'Carrot', emoji: '🥕', colorName: 'Orange' },
  { name: 'Basketball', emoji: '🏀', colorName: 'Orange' },
  { name: 'Tiger', emoji: '🐯', colorName: 'Orange' }
];
