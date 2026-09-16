export interface SpellingLevel {
  id: string;
  name: string;
  description: string;
  difficultyLabel: string;
  words: string[];
  date?: string;
  sentences?: Record<string, string>;
}

export const SPELLING_LEVELS: SpellingLevel[] = [
  {
    id: '2026-09-12',
    name: 'September 12, 2026',
    description: 'Essential core spelling words and phonics patterns.',
    difficultyLabel: 'Sep 12, 2026',
    date: '2026-09-12',
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
  {
    id: '2026-09-15',
    name: 'September 15, 2026',
    description: 'Prefixes (post-, pre-, fore-, after-) and root word spelling.',
    difficultyLabel: 'Sep 15, 2026',
    date: '2026-09-15',
    words: [
      'postwar',
      'afternoon',
      'precede',
      'postseason',
      'foretell',
      'afterword',
      'foresight',
      'foreman',
      'preface',
      'foreward',
      'forefathers',
      'postdate',
      'aftertaste',
      'prewar',
      'afterthought',
      'postpone',
      'preseason',
      'prepare',
      'posttest',
      'forethought',
      'prefix',
      'predict',
      'preposition',
      'prehistoric',
    ],
    sentences: {
      postwar: 'The country rebuilt its economy during the postwar period.',
      afternoon: 'We played soccer in the park on Saturday afternoon.',
      precede: 'Dark clouds often precede a heavy rainstorm.',
      postseason: 'Our baseball team played hard to make the postseason.',
      foretell: 'Nobody can foretell the future with complete certainty.',
      afterword: 'The author wrote an afterword to explain the book.',
      foresight: 'She had the foresight to pack an umbrella before the storm.',
      foreman: 'The construction foreman inspected the new building site.',
      preface: 'The author included an introduction in the preface of the book.',
      foreward: 'He read the foreward at the beginning of the book.',
      forefathers: 'Our forefathers worked hard to build this nation.',
      postdate: 'Please do not postdate the check for next month.',
      aftertaste: 'The mint candy left a refreshing aftertaste.',
      prewar: 'The museum displayed antique cars from the prewar era.',
      afterthought: 'He added a postscript to the letter as an afterthought.',
      postpone: 'We had to postpone the outdoor picnic due to rain.',
      preseason: 'The team practiced conditioning during the preseason.',
      prepare: 'Students must prepare thoroughly for the upcoming exam.',
      posttest: 'We took a posttest to measure what we learned.',
      forethought: 'With a little forethought, we avoided making mistakes.',
      prefix: 'The letters un- form a common prefix meaning not.',
      predict: 'Scientists can predict the weather by studying storm patterns.',
      preposition: 'The word in is a common preposition of place.',
      prehistoric: 'Dinosaurs roamed the earth in prehistoric times.',
    },
  },
];

export function getExampleSentence(word: string, levelId?: string): string | undefined {
  if (!word) return undefined;
  const normalized = word.trim().toLowerCase();

  if (levelId) {
    const level =
      SPELLING_LEVELS.find((lvl) => lvl.id === levelId) ||
      (levelId === 'level-1' ? SPELLING_LEVELS[0] : undefined) ||
      (levelId === 'level-2' ? SPELLING_LEVELS[1] : undefined);
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


