export interface SpellingLevel {
  id: string;
  name: string;
  description: string;
  difficultyLabel: string;
  words: string[];
}

export const SPELLING_LEVELS: SpellingLevel[] = [
  {
    id: 'level-1',
    name: 'Level 1 Words',
    description: 'Essential core spelling words and phonics patterns.',
    difficultyLabel: 'Level 1',
    words: [
      'thank',
      'chief',
      'theme',
      'groan',
      'quote',
      'sharp',
      'smell',
      'trust',
      'fruit',
      'scout',
      'when',
      'quit',
      'wrap',
      'twig',
      'clog',
      'plot',
      'brave',
      'front',
      'whine',
      'climb',
      'phone',
      'scale',
      'brief',
      'stain',
    ],
  },
];
