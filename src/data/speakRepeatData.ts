export interface SpeakLesson {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
  gradient: string;
  borderColor: string;
  paragraphs: string[];
}

export const SPEAK_REPEAT_LESSONS: SpeakLesson[] = [
  {
    id: 'myself',
    title: 'MySelf',
    subtitle: 'English Speaking & Introduction',
    emoji: '🌸',
    badge: 'Lesson 1',
    gradient: 'from-pink-400 via-rose-500 to-amber-500',
    borderColor: 'border-rose-400',
    paragraphs: [
      'My name is [Your Name].',
      'I am 5 years old.',
      'I live in Delhi.',
      'I study in NURSERY class.',
      'I love to [Your Favorite Hobby, e.g., draw, play, dance].',
      'My favorite food is [Your Favorite Food].',
      'I like [Your Favorite Animal].',
      'I love my family and friends!'
    ]
  },
  {
    id: 'my-parents',
    title: 'My Parents',
    subtitle: 'English Speaking & Reading',
    emoji: '👨‍👩‍👧',
    badge: 'Lesson 2',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    borderColor: 'border-orange-500',
    paragraphs: [
      'Today I want to speak about my parents.',
      'My parents love me very much. They take care of me.',
      'They teach me good manners and habits.'
    ]
  }
];
