export interface SvgPath {
  id: string;
  d: string;
  defaultColor?: string;
}

export interface ColoringPage {
  id: string;
  title: string;
  category: string;
  viewBox: string;
  svgPaths: SvgPath[];
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  starsRequired: number;
  category: string;
  unlocked?: boolean;
}

export const PALETTE_COLORS = [
  { name: 'Red', hex: '#FF4757' },
  { name: 'Coral', hex: '#FF6B81' },
  { name: 'Orange', hex: '#FFA502' },
  { name: 'Yellow', hex: '#ECCC68' },
  { name: 'Warm Yellow', hex: '#FFEAA7' },
  { name: 'Mint Green', hex: '#2ED573' },
  { name: 'Emerald', hex: '#10AC84' },
  { name: 'Teal', hex: '#00D2D3' },
  { name: 'Sky Blue', hex: '#70A1FF' },
  { name: 'Royal Blue', hex: '#1E90FF' },
  { name: 'Indigo', hex: '#3742FA' },
  { name: 'Purple', hex: '#5F27CD' },
  { name: 'Pink', hex: '#FF78CB' },
  { name: 'Hot Pink', hex: '#FD79A8' },
  { name: 'Brown', hex: '#8B572A' },
  { name: 'Cream', hex: '#FFF2E2' },
  { name: 'Charcoal', hex: '#2F3542' },
  { name: 'Pure White', hex: '#FFFFFF' }
];

export const UNLOCKABLE_STICKERS = [
  { id: 'stk-1', name: 'Golden Star', emoji: '⭐', starsRequired: 0, category: 'Badges' },
  { id: 'stk-2', name: 'Rainbow Sparkle', emoji: '🌈', starsRequired: 5, category: 'Magic' },
  { id: 'stk-3', name: 'Royal Crown', emoji: '👑', starsRequired: 10, category: 'Royal' },
  { id: 'stk-4', name: 'Magic Unicorn', emoji: '🦄', starsRequired: 15, category: 'Magic' },
  { id: 'stk-5', name: 'Cosmic Rocket', emoji: '🚀', starsRequired: 20, category: 'Space' },
  { id: 'stk-6', name: 'Golden Trophy', emoji: '🏆', starsRequired: 25, category: 'Awards' },
  { id: 'stk-7', name: 'Diamond Gem', emoji: '💎', starsRequired: 30, category: 'Treasure' },
  { id: 'stk-8', name: 'Super Champion Medal', emoji: '🥇', starsRequired: 40, category: 'Awards' }
];

export const COLORING_PAGES: ColoringPage[] = [
  {
    id: 'roo-artist',
    title: 'Coloroo The Painter',
    category: 'Characters',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'hat-top', d: 'M95,36 C100,32 105,32 105,36 Z', defaultColor: '#FF4757' },
      { id: 'beret', d: 'M68,52 C70,38 130,38 132,52 C125,58 75,58 68,52 Z', defaultColor: '#FF6B81' },
      { id: 'ear-left', d: 'M55,42 C50,22 68,22 75,44 Z', defaultColor: '#FFA502' },
      { id: 'ear-right', d: 'M145,42 C150,22 132,22 125,44 Z', defaultColor: '#FFA502' },
      { id: 'head', d: 'M62,60 C55,100 145,100 138,60 C130,55 70,55 62,60 Z', defaultColor: '#FFEAA7' },
      { id: 'muzzle', d: 'M80,72 C80,66 120,66 120,72 C120,85 80,85 80,72 Z', defaultColor: '#FFFFFF' },
      { id: 'nose', d: 'M94,68 C96,65 104,65 106,68 C106,73 94,73 94,68 Z', defaultColor: '#2F3542' },
      { id: 'body', d: 'M65,108 C50,165 150,165 135,108 Z', defaultColor: '#FFA502' },
      { id: 'belly', d: 'M80,118 C75,152 125,152 120,118 Z', defaultColor: '#FFEAA7' },
      { id: 'palette', d: 'M40,125 C30,135 32,165 52,162 C62,160 62,130 40,125 Z', defaultColor: '#FFFFFF' },
      { id: 'palette-hole', d: 'M44,142 C42,142 42,146 44,146 C46,146 46,142 44,142 Z', defaultColor: '#2F3542' },
      { id: 'brush-handle', d: 'M130,125 L165,88', defaultColor: '#2F3542' },
      { id: 'brush-tip', d: 'M165,88 C168,85 172,88 170,92 Z', defaultColor: '#5F27CD' },
      { id: 'foot-left', d: 'M65,168 C55,178 80,182 85,170 Z', defaultColor: '#FFA502' },
      { id: 'foot-right', d: 'M135,168 C145,178 120,182 115,170 Z', defaultColor: '#FFA502' }
    ]
  },
  {
    id: 'baby-dino',
    title: 'Happy Baby Dino',
    category: 'Animals',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'dino-body', d: 'M70,70 C40,90 40,170 85,180 C130,190 170,140 150,90 C135,50 90,50 70,70 Z', defaultColor: '#2ED573' },
      { id: 'dino-belly', d: 'M80,110 C65,130 70,165 95,168 C120,170 125,135 110,110 Z', defaultColor: '#ECCC68' },
      { id: 'dino-spike1', d: 'M75,55 L82,40 L90,55 Z', defaultColor: '#FFA502' },
      { id: 'dino-spike2', d: 'M95,50 L104,35 L112,50 Z', defaultColor: '#FFA502' },
      { id: 'dino-spike3', d: 'M118,52 L128,38 L134,55 Z', defaultColor: '#FFA502' },
      { id: 'dino-eye', d: 'M85,82 C82,82 82,90 85,90 C88,90 88,82 85,82 Z', defaultColor: '#2F3542' },
      { id: 'dino-foot1', d: 'M70,178 C60,192 88,195 90,180 Z', defaultColor: '#10AC84' },
      { id: 'dino-foot2', d: 'M115,178 C110,195 138,192 130,180 Z', defaultColor: '#10AC84' }
    ]
  },
  {
    id: 'magic-unicorn',
    title: 'Magic Unicorn & Stars',
    category: 'Fantasy',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'uni-horn', d: 'M95,30 L105,30 L100,5 Z', defaultColor: '#ECCC68' },
      { id: 'uni-head', d: 'M70,50 C55,80 80,110 110,105 C135,100 135,60 115,45 Z', defaultColor: '#FFFFFF' },
      { id: 'uni-ear', d: 'M112,38 C118,25 125,32 122,45 Z', defaultColor: '#FF78CB' },
      { id: 'uni-mane1', d: 'M120,55 C145,50 150,75 130,85 Z', defaultColor: '#70A1FF' },
      { id: 'uni-mane2', d: 'M125,85 C150,85 150,110 120,115 Z', defaultColor: '#FF78CB' },
      { id: 'uni-body', d: 'M60,105 C40,160 145,170 140,115 Z', defaultColor: '#FFFFFF' },
      { id: 'uni-star', d: 'M160,35 L163,42 L170,43 L165,48 L166,55 L160,51 L154,55 L155,48 L150,43 L157,42 Z', defaultColor: '#FFA502' }
    ]
  },
  {
    id: 'cosmic-rocket',
    title: 'Cosmic Star Rocket',
    category: 'Space',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'rocket-nose', d: 'M100,20 C85,45 115,45 100,20 Z', defaultColor: '#FF4757' },
      { id: 'rocket-body', d: 'M80,45 C75,110 125,110 120,45 Z', defaultColor: '#FFFFFF' },
      { id: 'rocket-window', d: 'M92,68 C88,68 88,82 92,82 C108,82 108,68 92,68 Z', defaultColor: '#70A1FF' },
      { id: 'fin-left', d: 'M78,95 L55,128 L80,120 Z', defaultColor: '#FF4757' },
      { id: 'fin-right', d: 'M122,95 L145,128 L120,120 Z', defaultColor: '#FF4757' },
      { id: 'fire-outer', d: 'M85,122 L100,165 L115,122 Z', defaultColor: '#FFA502' },
      { id: 'fire-inner', d: 'M92,122 L100,150 L108,122 Z', defaultColor: '#ECCC68' }
    ]
  },
  {
    id: 'fire-truck',
    title: 'Brave Little Fire Truck',
    category: 'Vehicles',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'truck-cab', d: 'M40,95 L100,95 L100,150 L40,150 Z', defaultColor: '#FF4757' },
      { id: 'truck-window', d: 'M48,105 L82,105 L82,125 L48,125 Z', defaultColor: '#70A1FF' },
      { id: 'truck-body', d: 'M100,110 L165,110 L165,150 L100,150 Z', defaultColor: '#FF4757' },
      { id: 'ladder', d: 'M105,92 L160,92 L160,105 L105,105 Z', defaultColor: '#FFEAA7' },
      { id: 'siren', d: 'M60,85 C60,78 72,78 72,85 Z', defaultColor: '#00D2D3' },
      { id: 'wheel-left', d: 'M55,150 C45,150 45,175 55,175 C75,175 75,150 55,150 Z', defaultColor: '#2F3542' },
      { id: 'wheel-right', d: 'M135,150 C125,150 125,175 135,175 C155,175 155,150 135,150 Z', defaultColor: '#2F3542' }
    ]
  },
  {
    id: 'cute-puppy',
    title: 'Cute Playful Puppy',
    category: 'Animals',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'pup-ear-l', d: 'M50,45 C35,70 50,100 65,85 Z', defaultColor: '#8B572A' },
      { id: 'pup-ear-r', d: 'M150,45 C165,70 150,100 135,85 Z', defaultColor: '#8B572A' },
      { id: 'pup-head', d: 'M62,48 C55,95 145,95 138,48 C120,40 80,40 62,48 Z', defaultColor: '#FFEAA7' },
      { id: 'pup-muzzle', d: 'M80,70 C75,90 125,90 120,70 Z', defaultColor: '#FFFFFF' },
      { id: 'pup-nose', d: 'M94,68 C94,62 106,62 106,68 C106,74 94,74 94,68 Z', defaultColor: '#2F3542' },
      { id: 'pup-body', d: 'M68,98 C50,165 150,165 132,98 Z', defaultColor: '#FFEAA7' },
      { id: 'pup-collar', d: 'M70,96 C90,105 110,105 130,96 L130,104 C110,113 90,113 70,104 Z', defaultColor: '#FF4757' },
      { id: 'pup-paw-l', d: 'M65,160 C55,175 85,175 80,160 Z', defaultColor: '#FFFFFF' },
      { id: 'pup-paw-r', d: 'M120,160 C115,175 145,175 135,160 Z', defaultColor: '#FFFFFF' }
    ]
  },
  {
    id: 'sweet-cupcake',
    title: 'Sweet Birthday Cupcake',
    category: 'Treats',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'cherry', d: 'M95,30 C88,25 112,25 105,30 C112,42 88,42 95,30 Z', defaultColor: '#FF4757' },
      { id: 'cherry-stem', d: 'M100,24 C100,10 115,12 118,8', defaultColor: '#2ED573' },
      { id: 'frosting-top', d: 'M65,65 C60,40 140,40 135,65 Z', defaultColor: '#FF78CB' },
      { id: 'frosting-mid', d: 'M50,90 C45,62 155,62 150,90 Z', defaultColor: '#FF6B81' },
      { id: 'cup-base', d: 'M55,95 L70,165 L130,165 L145,95 Z', defaultColor: '#70A1FF' },
      { id: 'cup-stripe1', d: 'M75,95 L84,165', defaultColor: '#FFFFFF' },
      { id: 'cup-stripe2', d: 'M100,95 L100,165', defaultColor: '#FFFFFF' },
      { id: 'cup-stripe3', d: 'M125,95 L116,165', defaultColor: '#FFFFFF' }
    ]
  },
  {
    id: 'friendly-lion',
    title: 'Friendly Brave Lion',
    category: 'Animals',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'lion-mane', d: 'M50,45 C30,95 30,125 55,145 C100,175 160,140 155,90 C150,40 100,20 50,45 Z', defaultColor: '#FFA502' },
      { id: 'lion-face', d: 'M68,62 C60,110 140,110 132,62 C125,50 75,50 68,62 Z', defaultColor: '#FFEAA7' },
      { id: 'lion-nose', d: 'M92,80 L108,80 L100,90 Z', defaultColor: '#8B572A' },
      { id: 'lion-body', d: 'M70,140 C55,185 145,185 130,140 Z', defaultColor: '#ECCC68' },
      { id: 'lion-belly', d: 'M85,145 C78,175 122,175 115,145 Z', defaultColor: '#FFF2E2' }
    ]
  },
  {
    id: 'magic-butterfly',
    title: 'Magic Butterfly Garden',
    category: 'Nature',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'wing-tl', d: 'M95,85 C60,25 25,65 75,100 Z', defaultColor: '#FF78CB' },
      { id: 'wing-tr', d: 'M105,85 C140,25 175,65 125,100 Z', defaultColor: '#FF78CB' },
      { id: 'wing-bl', d: 'M95,105 C55,105 45,150 85,135 Z', defaultColor: '#70A1FF' },
      { id: 'wing-br', d: 'M105,105 C145,105 155,150 115,135 Z', defaultColor: '#70A1FF' },
      { id: 'bf-body', d: 'M96,65 C92,120 108,120 104,65 Z', defaultColor: '#2F3542' },
      { id: 'bf-head', d: 'M95,58 C92,50 108,50 105,58 Z', defaultColor: '#2F3542' }
    ]
  },
  {
    id: 'sunny-sailboat',
    title: 'Little Sunny Sailboat',
    category: 'Vehicles',
    viewBox: '0 0 200 260',
    svgPaths: [
      { id: 'sun', d: 'M150,30 C140,30 140,55 150,55 C165,55 165,30 150,30 Z', defaultColor: '#FFA502' },
      { id: 'sail-big', d: 'M95,40 L95,120 L45,120 Z', defaultColor: '#FF4757' },
      { id: 'sail-small', d: 'M102,55 L102,120 L145,120 Z', defaultColor: '#ECCC68' },
      { id: 'boat-hull', d: 'M40,128 L60,165 L140,165 L160,128 Z', defaultColor: '#8B572A' },
      { id: 'sea-wave', d: 'M25,165 C55,160 85,175 115,165 C145,160 175,175 185,165 L185,185 L25,185 Z', defaultColor: '#00D2D3' }
    ]
  }
];
