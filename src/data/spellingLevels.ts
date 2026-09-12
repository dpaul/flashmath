export interface SpellingLevel {
  id: string;
  name: string;
  description: string;
  difficultyLabel: string;
  words: string[];
  sentences?: Record<string, string>;
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
    sentences: {
      thank: 'I want to thank you for helping me.',
      chief: 'The police chief gave a speech today.',
      theme: 'The theme of the party was outer space.',
      groan: 'He let out a groan when he saw the mess.',
      quote: 'Can you quote your favorite line from the story?',
      sharp: 'Be careful with the scissors because they are sharp.',
      smell: 'The sweet smell of flowers filled the room.',
      trust: 'You can always trust a good friend.',
      fruit: 'Fresh fruit is a healthy and delicious snack.',
      scout: 'The scout helped guide the hikers along the trail.',
      when: 'Call me when you are ready to leave.',
      quit: 'Do not quit when the task gets challenging.',
      wrap: 'Please help me wrap the birthday present.',
      twig: 'The bird picked up a dry twig for its nest.',
      clog: 'Too many wet leaves will clog the drain.',
      plot: 'The mystery book had an exciting plot.',
      brave: 'The brave firefighter entered the burning building.',
      front: 'Please wait for me at the front door.',
      whine: 'The hungry puppy began to whine for dinner.',
      climb: 'We watched the monkey climb the tall tree.',
      phone: 'She answered the phone when it rang.',
      scale: 'The nurse weighed the baby on the scale.',
      brief: 'The teacher gave a brief explanation of the rules.',
      stain: 'Wipe the spill quickly so it does not stain.',
    },
  },
];

export function getExampleSentence(word: string, levelId?: string): string | undefined {
  if (!word) return undefined;
  const normalized = word.trim().toLowerCase();

  if (levelId) {
    const level = SPELLING_LEVELS.find((lvl) => lvl.id === levelId);
    if (level?.sentences?.[normalized]) {
      return level.sentences[normalized];
    }
  }

  for (const level of SPELLING_LEVELS) {
    if (level.sentences?.[normalized]) {
      return level.sentences[normalized];
    }
  }

  return undefined;
}

