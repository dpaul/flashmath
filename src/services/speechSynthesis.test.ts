import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isSpeechSynthesisSupported,
  speakWord,
  cancelSpeech,
  speakSentence,
} from './speechSynthesis';

describe('Speech Synthesis Service', () => {
  const originalSpeechSynthesis = window.speechSynthesis;
  const originalUtterance = (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;

  let mockSpeak: ReturnType<typeof vi.fn>;
  let mockCancel: ReturnType<typeof vi.fn>;
  let mockUtteranceConstructor: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();
    mockUtteranceConstructor = vi.fn().mockImplementation((text: string) => ({
      text,
      rate: 1,
      pitch: 1,
      lang: 'en-US',
    }));

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        speaking: false,
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: mockUtteranceConstructor,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: originalUtterance,
      writable: true,
      configurable: true,
    });
  });

  it('detects when speech synthesis is supported', () => {
    expect(isSpeechSynthesisSupported()).toBe(true);
  });

  it('cancels ongoing speech and triggers utterance with word', () => {
    speakWord('calendar');
    expect(mockCancel).toHaveBeenCalled();
    expect(mockUtteranceConstructor).toHaveBeenCalledWith('calendar');
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('allows customizing speech rate or pitch', () => {
    speakWord('calendar', { rate: 0.85, pitch: 1.1 });
    expect(mockSpeak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'calendar',
        rate: 0.85,
        pitch: 1.1,
      })
    );
  });

  it('can explicitly cancel speech', () => {
    cancelSpeech();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('cancels ongoing speech and triggers utterance with full sentence', () => {
    speakSentence('I want to thank you for helping me.');
    expect(mockCancel).toHaveBeenCalled();
    expect(mockUtteranceConstructor).toHaveBeenCalledWith('I want to thank you for helping me.');
    expect(mockSpeak).toHaveBeenCalled();
  });
});

