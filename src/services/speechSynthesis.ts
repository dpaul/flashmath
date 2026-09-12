export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  volume?: number;
}

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // safely ignore if cancel throws in headless/unsupported environments
    }
  }
}

export function speakWord(word: string, options: SpeechOptions = {}): void {
  if (!isSpeechSynthesisSupported() || !word) {
    return;
  }

  try {
    cancelSpeech();

    const utterance = new window.SpeechSynthesisUtterance(word);
    utterance.rate = options.rate ?? 0.9; // Slightly deliberate pace for spelling learners
    utterance.pitch = options.pitch ?? 1.0;
    utterance.lang = options.lang ?? 'en-US';
    if (typeof options.volume === 'number') {
      utterance.volume = options.volume;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn('Speech synthesis failed to speak word:', error);
  }
}

export function speakSentence(sentence: string, options: SpeechOptions = {}): void {
  if (!isSpeechSynthesisSupported() || !sentence) {
    return;
  }

  try {
    cancelSpeech();

    const utterance = new window.SpeechSynthesisUtterance(sentence);
    utterance.rate = options.rate ?? 0.88; // Comfortable natural pace for complete sentences
    utterance.pitch = options.pitch ?? 1.0;
    utterance.lang = options.lang ?? 'en-US';
    if (typeof options.volume === 'number') {
      utterance.volume = options.volume;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn('Speech synthesis failed to speak sentence:', error);
  }
}

