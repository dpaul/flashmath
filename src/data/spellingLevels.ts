export interface SpellingLevel {
  id: string;
  name: string;
  description: string;
  difficultyLabel: string;
  words: string[];
}

export const SPELLING_LEVELS: SpellingLevel[] = [
  {
    id: 'grade-4',
    name: '4th Grade Words',
    description: 'Foundational intermediate vocabulary and common spelling patterns.',
    difficultyLabel: 'Intermediate',
    words: [
      'calendar',
      'definite',
      'describe',
      'grammar',
      'island',
      'library',
      'mystery',
      'opposite',
      'remember',
      'separate',
      'surprise',
      'tomorrow',
    ],
  },
];
