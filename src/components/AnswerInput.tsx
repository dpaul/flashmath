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
    <div className="w-full max-w-sm sm:max-w-md mx-auto mt-4 flex items-center gap-3">
      <div className="relative flex-1">
        <input
          ref={inputRef}
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
          className="w-full h-16 px-6 text-3xl font-mono font-bold text-center text-white bg-slate-900/80 border-2 border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 placeholder:text-slate-600 transition-all shadow-inner"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={disabled || value.trim() === ''}
        aria-label="Submit Answer"
        className="h-16 px-6 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:scale-100 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
      >
        <CornerDownLeft className="w-6 h-6" />
        <span className="hidden sm:inline">Enter</span>
      </button>
    </div>
  );
};
