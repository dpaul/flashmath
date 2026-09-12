import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, ArrowRight } from 'lucide-react';

export interface SpellingInputProps {
  targetWord: string;
  onSubmit: (answer: string) => void;
  onNextWord: () => void;
  lastAttemptCorrect: boolean | null;
  isRevealingWord: boolean;
  disabled?: boolean;
}

export const SpellingInput: React.FC<SpellingInputProps> = ({
  targetWord,
  onSubmit,
  onNextWord,
  isRevealingWord,
  disabled = false,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isRevealingWord) {
      nextButtonRef.current?.focus();
    } else {
      inputRef.current?.focus();
      setValue('');
    }
  }, [isRevealingWord, targetWord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters and spaces/hyphens
    setValue(e.target.value.replace(/[^a-zA-Z\s-]/g, ''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value.trim());
      }
    }
  };

  const handleSubmitClick = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {isRevealingWord ? (
        <div className="w-full flex flex-col items-center gap-3 py-2 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#cb4b16]/10 border border-[#cb4b16]/30 text-center">
            <span className="block text-xs uppercase font-bold tracking-wider text-[#cb4b16] mb-1">
              Correct Spelling:
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#073642] tracking-wider">
              {targetWord}
            </span>
          </div>

          <button
            ref={nextButtonRef}
            type="button"
            onClick={onNextWord}
            aria-label="Next Word"
            className="h-12 px-6 rounded-xl bg-[#2aa198] hover:bg-[#258b83] active:bg-[#1e726b] text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Next Word</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center gap-2.5">
          <div className="relative flex-1 max-w-sm h-14 sm:h-16 px-4 rounded-2xl bg-[#f7f0e0] border-2 border-[#2aa198]/60 flex items-center shadow-inner focus-within:ring-4 focus-within:ring-[#2aa198]/20 focus-within:border-[#2aa198] transition-all">
            <input
              ref={inputRef}
              id="spelling-word-input"
              aria-label="Type spelling here"
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Spell the word..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full h-full text-xl sm:text-2xl font-mono font-medium text-center text-[#073642] bg-transparent focus:outline-none placeholder:text-[#93a1a1]/70"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={disabled || value.trim() === ''}
            aria-label="Check Spelling"
            className="h-14 sm:h-16 px-4 rounded-2xl bg-[#2aa198] hover:bg-[#258b83] active:bg-[#1e726b] disabled:bg-[#eee8d5] disabled:text-[#93a1a1] text-white font-bold transition-all shadow-md active:scale-95 disabled:scale-100 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
          >
            <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline ml-1.5 text-xs font-sans uppercase font-bold">
              Check
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
