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
    id: 'my-parents',
    title: 'My Parents',
    subtitle: 'English Speaking & Reading',
    emoji: '👨‍👩‍👧',
    badge: 'Lesson 1',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    borderColor: 'border-orange-500',
    paragraphs: [
      'Today I want to speak about my parents.',
      'My parents love me very much. They take care of me.',
      'They teach me good manners and habits.'
    ]
  }
];
