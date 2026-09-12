import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  externalValue?: string;
  onValueChange?: (val: string) => void;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  autoFocus = true,
  disabled = false,
  externalValue,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  useEffect(() => {
    if (autoFocus && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/[^0-9]/g, '');
    if (onValueChange) {
      onValueChange(next);
    } else {
      setInternalValue(next);
    }
  };

  const submit = () => {
    if (value.trim() === '') return;
    onSubmit(value.trim());
    if (onValueChange) {
      onValueChange('');
    } else {
      setInternalValue('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div className="relative min-w-[100px] sm:min-w-[135px] h-14 sm:h-20 px-2 sm:px-4 rounded-2xl bg-[#f7f0e0] border-2 border-[#cb4b16]/70 flex items-center justify-center shadow-inner transition-transform duration-100 focus-within:ring-4 focus-within:ring-[#cb4b16]/20 focus-within:border-[#cb4b16]">
        <input
          ref={inputRef}
          id="math-answer-input"
          aria-label="Your calculation answer"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Answer..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full h-full text-3xl sm:text-5xl font-mono font-semibold text-center text-[#073642] bg-transparent focus:outline-none placeholder:text-transparent selection:bg-amber-200/60"
        />

        {value === '' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="w-[3px] sm:w-[4px] h-7 sm:h-10 bg-[#cb4b16] blinking-cursor rounded-full" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={disabled || value.trim() === ''}
        aria-label="Submit Answer"
        className="h-14 sm:h-20 px-3 sm:px-4 rounded-2xl bg-[#cb4b16] hover:bg-[#b83f0f] active:bg-[#99370e] disabled:bg-[#eee8d5] disabled:text-[#93a1a1] text-white font-bold transition-all shadow-md active:scale-95 disabled:scale-100 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center"
      >
        <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="hidden sm:inline ml-1 text-xs font-sans uppercase font-bold">Submit</span>
      </button>
    </div>
  );
};
