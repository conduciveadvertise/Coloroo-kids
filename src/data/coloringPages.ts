import { ColoringPage, StickerItem } from '../types';

export const COLORING_PAGES: ColoringPage[] = [
  {
    id: 'roo-artist',
    title: 'Coloroo The Painter',
    category: 'animals',
    difficulty: 'easy',
    tags: ['mascot', 'kangaroo', 'cute', 'beret'],
    thumbnailSvg: 'M 100,50 C 70,50 50,80 50,110 C 50,140 70,170 100,170 C 130,170 150,140 150,110 C 150,80 130,50 100,50 Z',
    svgPaths: [
      // Beret Cap
      {
        id: 'beret',
        name: 'Artist Beret',
        d: 'M 70,60 C 50,45 80,25 120,30 C 160,35 155,55 140,65 C 120,58 90,56 70,60 Z',
        defaultFill: '#FF7675'
      },
      {
        id: 'beret-stalk',
        name: 'Beret Pom',
        d: 'M 108,30 C 108,20 116,20 116,30 Z',
        defaultFill: '#D63031'
      },
      // Left Ear
      {
        id: 'ear-left',
        name: 'Left Ear',
        d: 'M 55,75 C 30,30 50,15 70,45 C 65,55 60,65 55,75 Z',
        defaultFill: '#FDCB6E'
      },
      {
        id: 'ear-left-inner',
        name: 'Left Ear Inner',
        d: 'M 56,65 C 43,40 54,28 65,48 Z',
        defaultFill: '#FAB1A0'
      },
      // Right Ear
      {
        id: 'ear-right',
        name: 'Right Ear',
        d: 'M 145,75 C 170,30 150,15 130,45 C 135,55 140,65 145,75 Z',
        defaultFill: '#FDCB6E'
      },
      {
        id: 'ear-right-inner',
        name: 'Right Ear Inner',
        d: 'M 144,65 C 157,40 146,28 135,48 Z',
        defaultFill: '#FAB1A0'
      },
      // Head
      {
        id: 'head',
        name: 'Face',
        d: 'M 60,80 C 45,115 65,150 100,150 C 135,150 155,115 140,80 C 120,70 80,70 60,80 Z',
        defaultFill: '#FFEAA7'
      },
      // Snout / Cheeks
      {
        id: 'muzzle',
        name: 'Snout',
        d: 'M 75,110 C 75,95 125,95 125,110 C 125,135 75,135 75,110 Z',
        defaultFill: '#FFF'
      },
      // Nose
      {
        id: 'nose',
        name: 'Nose',
        d: 'M 93,105 C 93,100 107,100 107,105 C 107,112 93,112 93,105 Z',
        defaultFill: '#2D3436'
      },
      // Eyes
      {
        id: 'eye-left',
        name: 'Left Eye',
        d: 'M 78,92 C 78,86 86,86 86,92 C 86,98 78,98 78,92 Z',
        defaultFill: '#2D3436'
      },
      {
        id: 'eye-right',
        name: 'Right Eye',
        d: 'M 114,92 C 114,86 122,86 122,92 C 122,98 114,98 114,92 Z',
        defaultFill: '#2D3436'
      },
      // Cheek Blushes
      {
        id: 'blush-left',
        name: 'Left Cheek',
        d: 'M 65,115 C 65,108 77,108 77,115 C 77,122 65,122 65,115 Z',
        defaultFill: '#FD79A8'
      },
      {
        id: 'blush-right',
        name: 'Right Cheek',
        d: 'M 123,115 C 123,108 135,108 135,115 C 135,122 123,122 123,115 Z',
        defaultFill: '#FD79A8'
      },
      // Body
      {
        id: 'body',
        name: 'Body',
        d: 'M 70,145 C 50,170 50,220 70,240 C 90,250 110,250 130,240 C 150,220 150,170 130,145 Z',
        defaultFill: '#FDCB6E'
      },
      // Pouch Belly
      {
        id: 'belly-pouch',
        name: 'Pouch Belly',
        d: 'M 75,170 C 75,225 125,225 125,170 C 100,165 100,165 75,170 Z',
        defaultFill: '#FFEAA7'
      },
      // Left Arm Holding Palette
      {
        id: 'arm-left',
        name: 'Left Arm',
        d: 'M 65,155 C 40,160 30,185 45,195 C 55,195 65,185 70,170 Z',
        defaultFill: '#FDCB6E'
      },
      // Paint Palette
      {
        id: 'palette',
        name: 'Paint Palette',
        d: 'M 30,180 C 15,190 20,230 50,225 C 65,220 60,195 45,185 C 40,180 35,180 30,180 Z',
        defaultFill: '#DFE6E9'
      },
      // Paint Drops on Palette
      {
        id: 'paint-drop-1',
        name: 'Red Color Paint',
        d: 'M 28,195 A 4 4 0 1 0 36 195 A 4 4 0 1 0 28 195',
        defaultFill: '#E84393'
      },
      {
        id: 'paint-drop-2',
        name: 'Blue Color Paint',
        d: 'M 38,208 A 4 4 0 1 0 46 208 A 4 4 0 1 0 38 208',
        defaultFill: '#0984E3'
      },
      {
        id: 'paint-drop-3',
        name: 'Yellow Color Paint',
        d: 'M 48,198 A 4 4 0 1 0 56 198 A 4 4 0 1 0 48 198',
        defaultFill: '#F1C40F'
      },
      // Right Arm with Brush
      {
        id: 'arm-right',
        name: 'Right Arm',
        d: 'M 130,155 C 155,160 165,175 160,195 C 150,195 140,185 130,170 Z',
        defaultFill: '#FDCB6E'
      },
      // Brush Handle & Bristle
      {
        id: 'brush-handle',
        name: 'Brush Handle',
        d: 'M 155,170 L 178,140 L 182,143 L 159,173 Z',
        defaultFill: '#B2BEC3'
      },
      {
        id: 'brush-tip',
        name: 'Brush Tip Paint',
        d: 'M 178,140 C 182,130 190,130 188,145 Z',
        defaultFill: '#6C5CE7'
      },
      // Feet
      {
        id: 'foot-left',
        name: 'Left Foot',
        d: 'M 60,235 C 40,240 50,260 80,255 C 80,245 70,240 60,235 Z',
        defaultFill: '#FDCB6E'
      },
      {
        id: 'foot-right',
        name: 'Right Foot',
        d: 'M 140,235 C 160,240 150,260 120,255 C 120,245 130,240 140,235 Z',
        defaultFill: '#FDCB6E'
      }
    ]
  },
  {
    id: 'cute-dino',
    title: 'Happy Baby Dino',
    category: 'dinosaurs',
    difficulty: 'easy',
    tags: ['dinosaur', 'cute', 'nature', 'jurassic'],
    thumbnailSvg: 'M 50,150 C 40,90 120,70 150,100 C 170,120 160,180 120,190 Z',
    svgPaths: [
      // Dino Spikes
      {
        id: 'spike-1',
        name: 'Top Spike',
        d: 'M 80,75 L 75,55 L 95,68 Z',
        defaultFill: '#FF7675'
      },
      {
        id: 'spike-2',
        name: 'Middle Spike',
        d: 'M 105,70 L 110,48 L 122,68 Z',
        defaultFill: '#FFA502'
      },
      {
        id: 'spike-3',
        name: 'Back Spike',
        d: 'M 135,80 L 148,60 L 148,88 Z',
        defaultFill: '#F1C40F'
      },
      {
        id: 'spike-4',
        name: 'Tail Spike',
        d: 'M 160,110 L 180,105 L 168,125 Z',
        defaultFill: '#55EFC4'
      },
      // Head and Body
      {
        id: 'dino-body',
        name: 'Dino Body',
        d: 'M 60,100 C 60,65 125,65 140,100 C 155,130 155,160 185,150 C 190,175 160,195 135,185 C 125,215 75,215 65,185 C 45,165 45,120 60,100 Z',
        defaultFill: '#55EFC4'
      },
      // Belly Patch
      {
        id: 'dino-belly',
        name: 'Dino Belly',
        d: 'M 70,130 C 95,130 115,155 110,190 C 85,195 70,170 70,130 Z',
        defaultFill: '#FFEAA7'
      },
      // Eye & Cheek
      {
        id: 'dino-eye',
        name: 'Eye',
        d: 'M 80,95 A 7 7 0 1 0 94 95 A 7 7 0 1 0 80 95',
        defaultFill: '#2D3436'
      },
      {
        id: 'dino-blush',
        name: 'Cheek Blush',
        d: 'M 72,112 A 6 6 0 1 0 84 112 A 6 6 0 1 0 72 112',
        defaultFill: '#FD79A8'
      },
      // Legs
      {
        id: 'leg-front',
        name: 'Front Leg',
        d: 'M 68,185 C 68,225 90,225 90,185 Z',
        defaultFill: '#00B894'
      },
      {
        id: 'leg-back',
        name: 'Back Leg',
        d: 'M 115,185 C 115,225 138,225 138,185 Z',
        defaultFill: '#00B894'
      },
      // Cute Egg Shell on ground
      {
        id: 'egg-shell',
        name: 'Egg Shell',
        d: 'M 140,210 L 150,195 L 160,210 L 170,195 L 180,215 C 170,235 150,235 140,210 Z',
        defaultFill: '#74B9FF'
      }
    ]
  },
  {
    id: 'rainbow-unicorn',
    title: 'Magic Unicorn & Stars',
    category: 'fantasy',
    difficulty: 'medium',
    tags: ['unicorn', 'rainbow', 'stars', 'magic', 'glitter'],
    thumbnailSvg: 'M 80,100 C 60,60 140,40 160,90 C 170,130 120,180 80,170 Z',
    svgPaths: [
      // Golden Horn
      {
        id: 'horn',
        name: 'Magic Golden Horn',
        d: 'M 105,40 L 125,5 L 115,42 Z',
        defaultFill: '#FDCB6E'
      },
      // Unicorn Head & Neck
      {
        id: 'unicorn-head',
        name: 'Unicorn Face',
        d: 'M 85,60 C 95,45 130,50 140,70 C 150,90 125,120 100,120 C 80,120 70,85 85,60 Z',
        defaultFill: '#FFFFFF'
      },
      // Mane Strips (Rainbow Colors)
      {
        id: 'mane-1',
        name: 'Pink Mane Strand',
        d: 'M 125,55 C 145,45 165,65 155,85 C 140,75 135,65 125,55 Z',
        defaultFill: '#FD79A8'
      },
      {
        id: 'mane-2',
        name: 'Purple Mane Strand',
        d: 'M 135,75 C 160,75 175,95 160,115 C 145,100 140,90 135,75 Z',
        defaultFill: '#A29BFE'
      },
      {
        id: 'mane-3',
        name: 'Cyan Mane Strand',
        d: 'M 130,105 C 155,110 165,135 150,150 C 135,135 130,120 130,105 Z',
        defaultFill: '#81ECEC'
      },
      // Eye & Muzzle
      {
        id: 'unicorn-eye',
        name: 'Sparkle Eye',
        d: 'M 98,75 A 5 5 0 1 0 108 75 A 5 5 0 1 0 98 75',
        defaultFill: '#2D3436'
      },
      {
        id: 'unicorn-muzzle',
        name: 'Soft Snout',
        d: 'M 75,95 C 70,115 95,115 95,95 Z',
        defaultFill: '#FAB1A0'
      },
      // Body
      {
        id: 'unicorn-body',
        name: 'Body',
        d: 'M 85,120 C 65,140 65,190 90,205 C 125,210 150,195 145,145 C 130,130 105,120 85,120 Z',
        defaultFill: '#F8F9FA'
      },
      // Rainbow Arc 1
      {
        id: 'rainbow-red',
        name: 'Rainbow Coral',
        d: 'M 20,230 C 50,160 170,160 200,230 L 190,230 C 162,175 58,175 30,230 Z',
        defaultFill: '#FF7675'
      },
      // Rainbow Arc 2
      {
        id: 'rainbow-yellow',
        name: 'Rainbow Yellow',
        d: 'M 30,230 C 58,175 162,175 190,230 L 180,230 C 155,190 65,190 40,230 Z',
        defaultFill: '#FFEAA7'
      },
      // Rainbow Arc 3
      {
        id: 'rainbow-blue',
        name: 'Rainbow Blue',
        d: 'M 40,230 C 65,190 155,190 180,230 L 170,230 C 148,202 72,202 50,230 Z',
        defaultFill: '#74B9FF'
      },
      // Floating Star
      {
        id: 'magic-star',
        name: 'Magic Star',
        d: 'M 45,50 L 50,62 L 63,62 L 53,70 L 57,82 L 45,74 L 33,82 L 37,70 L 27,62 L 40,62 Z',
        defaultFill: '#FDCB6E'
      }
    ]
  },
  {
    id: 'space-rocket',
    title: 'Cosmic Star Rocket',
    category: 'vehicles',
    difficulty: 'easy',
    tags: ['space', 'rocket', 'planets', 'stars', 'astronaut'],
    thumbnailSvg: 'M 100,30 L 140,150 L 60,150 Z',
    svgPaths: [
      // Rocket Nose Cone
      {
        id: 'nose-cone',
        name: 'Rocket Nose Cone',
        d: 'M 100,30 C 110,50 125,75 125,95 L 75,95 C 75,75 90,50 100,30 Z',
        defaultFill: '#FF7675'
      },
      // Main Rocket Body
      {
        id: 'rocket-fuselage',
        name: 'Rocket Body',
        d: 'M 75,95 L 125,95 L 125,175 L 75,175 Z',
        defaultFill: '#F3F0FF'
      },
      // Porthole Window Outer
      {
        id: 'porthole-outer',
        name: 'Window Frame',
        d: 'M 85,130 A 15 15 0 1 0 115 130 A 15 15 0 1 0 85,130',
        defaultFill: '#FFEAA7'
      },
      // Porthole Glass
      {
        id: 'porthole-glass',
        name: 'Window Glass',
        d: 'M 89,130 A 11 11 0 1 0 111 130 A 11 11 0 1 0 89,130',
        defaultFill: '#74B9FF'
      },
      // Left Fin
      {
        id: 'fin-left',
        name: 'Left Wing Fin',
        d: 'M 75,145 L 45,190 L 75,180 Z',
        defaultFill: '#6C5CE7'
      },
      // Right Fin
      {
        id: 'fin-right',
        name: 'Right Wing Fin',
        d: 'M 125,145 L 155,190 L 125,180 Z',
        defaultFill: '#6C5CE7'
      },
      // Flame Thruster Outer
      {
        id: 'flame-outer',
        name: 'Orange Flame',
        d: 'M 82,175 L 100,225 L 118,175 Z',
        defaultFill: '#FFA502'
      },
      // Flame Thruster Core
      {
        id: 'flame-core',
        name: 'Yellow Core Flame',
        d: 'M 88,175 L 100,205 L 112,175 Z',
        defaultFill: '#FFF'
      },
      // Saturn Planet
      {
        id: 'planet-body',
        name: 'Ring Planet',
        d: 'M 155,70 A 18 18 0 1 0 191 70 A 18 18 0 1 0 155 70',
        defaultFill: '#A29BFE'
      },
      {
        id: 'planet-ring',
        name: 'Planet Ring',
        d: 'M 142,70 C 142,60 204,60 204,70 C 204,80 142,80 142,70 Z',
        defaultFill: '#FD79A8'
      }
    ]
  },
  {
    id: 'happy-firetruck',
    title: 'Brave Little Fire Truck',
    category: 'vehicles',
    difficulty: 'medium',
    tags: ['truck', 'fire', 'hero', 'wheels'],
    thumbnailSvg: 'M 40,100 L 160,100 L 160,180 L 40,180 Z',
    svgPaths: [
      // Siren Emergency Light
      {
        id: 'siren',
        name: 'Flashing Siren',
        d: 'M 90,80 C 90,70 110,70 110,80 Z',
        defaultFill: '#00CEC9'
      },
      // Truck Cabin Front
      {
        id: 'truck-cab',
        name: 'Truck Cab',
        d: 'M 120,85 L 165,115 L 165,160 L 120,160 Z',
        defaultFill: '#FF7675'
      },
      // Front Windshield
      {
        id: 'windshield',
        name: 'Windshield',
        d: 'M 125,95 L 155,115 L 125,115 Z',
        defaultFill: '#81ECEC'
      },
      // Main Body Tank
      {
        id: 'truck-body',
        name: 'Main Red Body',
        d: 'M 40,105 L 120,105 L 120,160 L 40,160 Z',
        defaultFill: '#D63031'
      },
      // Ladder on top
      {
        id: 'ladder',
        name: 'Rescue Ladder',
        d: 'M 45,95 L 115,95 L 115,102 L 45,102 Z',
        defaultFill: '#FFEAA7'
      },
      // Water Hose Reel
      {
        id: 'hose-reel',
        name: 'Water Hose',
        d: 'M 50,118 A 12 12 0 1 0 74 118 A 12 12 0 1 0 50 118',
        defaultFill: '#FDCB6E'
      },
      // Front Wheel
      {
        id: 'wheel-front',
        name: 'Front Wheel Tire',
        d: 'M 125,160 A 16 16 0 1 0 157 160 A 16 16 0 1 0 125 160',
        defaultFill: '#2D3436'
      },
      {
        id: 'hubcap-front',
        name: 'Front Hubcap',
        d: 'M 133,160 A 8 8 0 1 0 149 160 A 8 8 0 1 0 133 160',
        defaultFill: '#DFE6E9'
      },
      // Rear Wheel
      {
        id: 'wheel-rear',
        name: 'Rear Wheel Tire',
        d: 'M 50,160 A 16 16 0 1 0 82 160 A 16 16 0 1 0 50 160',
        defaultFill: '#2D3436'
      },
      {
        id: 'hubcap-rear',
        name: 'Rear Hubcap',
        d: 'M 58,160 A 8 8 0 1 0 74 160 A 8 8 0 1 0 58 160',
        defaultFill: '#DFE6E9'
      }
    ]
  },
  {
    id: 'ocean-turtle',
    title: 'Friendly Sea Turtle',
    category: 'nature',
    difficulty: 'easy',
    tags: ['ocean', 'turtle', 'coral', 'sea', 'water'],
    thumbnailSvg: 'M 80,100 C 60,80 140,80 120,140 C 100,160 80,140 80,100 Z',
    svgPaths: [
      // Turtle Shell
      {
        id: 'turtle-shell',
        name: 'Turtle Shell',
        d: 'M 70,120 C 70,65 145,65 145,120 C 145,160 70,160 70,120 Z',
        defaultFill: '#00B894'
      },
      // Shell Hex Pattern 1
      {
        id: 'shell-pattern-1',
        name: 'Shell Hex Center',
        d: 'M 95,90 L 115,90 L 125,108 L 115,125 L 95,125 L 85,108 Z',
        defaultFill: '#55EFC4'
      },
      // Head
      {
        id: 'turtle-head',
        name: 'Cute Head',
        d: 'M 135,110 C 150,90 180,100 175,125 C 170,140 145,135 135,110 Z',
        defaultFill: '#81ECEC'
      },
      // Eye & Smile
      {
        id: 'turtle-eye',
        name: 'Happy Eye',
        d: 'M 158,110 A 4 4 0 1 0 166 110 A 4 4 0 1 0 158 110',
        defaultFill: '#2D3436'
      },
      // Front Flippers
      {
        id: 'flipper-top',
        name: 'Top Flipper',
        d: 'M 115,75 C 130,40 160,50 145,75 Z',
        defaultFill: '#81ECEC'
      },
      {
        id: 'flipper-bottom',
        name: 'Bottom Flipper',
        d: 'M 115,145 C 130,180 160,170 145,145 Z',
        defaultFill: '#81ECEC'
      },
      // Back Flippers
      {
        id: 'flipper-back-1',
        name: 'Back Top Flipper',
        d: 'M 75,85 C 60,65 50,75 70,95 Z',
        defaultFill: '#81ECEC'
      },
      {
        id: 'flipper-back-2',
        name: 'Back Bottom Flipper',
        d: 'M 75,135 C 60,155 50,145 70,125 Z',
        defaultFill: '#81ECEC'
      },
      // Sea Bubbles
      {
        id: 'bubble-1',
        name: 'Sea Bubble 1',
        d: 'M 180,85 A 6 6 0 1 0 192 85 A 6 6 0 1 0 180 85',
        defaultFill: '#74B9FF'
      },
      {
        id: 'bubble-2',
        name: 'Sea Bubble 2',
        d: 'M 190,65 A 4 4 0 1 0 198 65 A 4 4 0 1 0 190 65',
        defaultFill: '#74B9FF'
      }
    ]
  }
];

export const PALETTE_COLORS = [
  // Primary Vibrant Row
  { id: 'c-red', name: 'Ruby Red', hex: '#FF4757', border: '#D63031' },
  { id: 'c-coral', name: 'Coral Kiss', hex: '#FF7675', border: '#E17055' },
  { id: 'c-orange', name: 'Sun Orange', hex: '#FFA502', border: '#E67E22' },
  { id: 'c-gold', name: 'Lemon Gold', hex: '#FDCB6E', border: '#F39C12' },
  { id: 'c-yellow', name: 'Banana Yellow', hex: '#FFEAA7', border: '#F1C40F' },
  { id: 'c-mint', name: 'Sweet Mint', hex: '#55EFC4', border: '#00B894' },
  { id: 'c-green', name: 'Jungle Green', hex: '#2ED573', border: '#10AC84' },
  { id: 'c-cyan', name: 'Sky Cyan', hex: '#00CEC9', border: '#00A8FF' },
  
  // Secondary Playful Row
  { id: 'c-blue', name: 'Ocean Blue', hex: '#74B9FF', border: '#0984E3' },
  { id: 'c-royal', name: 'Deep Royal', hex: '#0984E3', border: '#2980B9' },
  { id: 'c-purple', name: 'Coloroo Purple', hex: '#6C5CE7', border: '#5742CD' },
  { id: 'c-lavender', name: 'Soft Lavender', hex: '#A29BFE', border: '#8C7AE6' },
  { id: 'c-pink', name: 'Bubblegum Pink', hex: '#FD79A8', border: '#E84393' },
  { id: 'c-magenta', name: 'Berry Magenta', hex: '#E84393', border: '#D81B60' },
  { id: 'c-brown', name: 'Chocolate Brown', hex: '#B7791F', border: '#8C5209' },
  { id: 'c-cream', name: 'Warm Cream', hex: '#FFF5EB', border: '#FBD38D' },
  { id: 'c-white', name: 'Pure Cloud', hex: '#FFFFFF', border: '#CBD5E0' },
  { id: 'c-black', name: 'Midnight Charcoal', hex: '#2D3436', border: '#1A202C' }
];

export const UNLOCKABLE_STICKERS: StickerItem[] = [
  { id: 'st-star', name: 'Sparkle Star', emojiOrSvg: '⭐', category: 'sparkle', unlocked: true, requiredStars: 0 },
  { id: 'st-crown', name: 'Golden Crown', emojiOrSvg: '👑', category: 'rewards', unlocked: true, requiredStars: 0 },
  { id: 'st-rainbow', name: 'Magic Rainbow', emojiOrSvg: '🌈', category: 'cute', unlocked: true, requiredStars: 0 },
  { id: 'st-heart', name: 'Love Heart', emojiOrSvg: '💖', category: 'cute', unlocked: true, requiredStars: 0 },
  { id: 'st-palette', name: 'Painter Palette', emojiOrSvg: '🎨', category: 'rewards', unlocked: false, requiredStars: 3 },
  { id: 'st-sun', name: 'Happy Sun', emojiOrSvg: '☀️', category: 'nature', unlocked: false, requiredStars: 6 },
  { id: 'st-flower', name: 'Spring Flower', emojiOrSvg: '🌸', category: 'nature', unlocked: false, requiredStars: 9 },
  { id: 'st-cupcake', name: 'Sweet Cupcake', emojiOrSvg: '🧁', category: 'cute', unlocked: false, requiredStars: 12 },
  { id: 'st-butterfly', name: 'Baby Butterfly', emojiOrSvg: '🦋', category: 'nature', unlocked: false, requiredStars: 15 },
  { id: 'st-medal', name: 'Gold Medal', emojiOrSvg: '🥇', category: 'rewards', unlocked: false, requiredStars: 20 },
  { id: 'st-rocket', name: 'Space Rocket', emojiOrSvg: '🚀', category: 'cute', unlocked: false, requiredStars: 25 },
  { id: 'st-gem', name: 'Shiny Crystal', emojiOrSvg: '💎', category: 'sparkle', unlocked: false, requiredStars: 30 }
];
