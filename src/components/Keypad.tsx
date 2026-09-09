import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({ onDigit, onBackspace, onSubmit, disabled = false }) => {
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

  return (
    <div className="w-full max-w-sm mx-auto grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-slate-900/40 rounded-3xl border border-slate-800/80 backdrop-blur select-none">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(digit)}
          className="h-14 sm:h-16 text-2xl font-mono font-bold text-slate-100 bg-slate-800/70 hover:bg-slate-700/80 active:bg-slate-600 rounded-2xl transition border border-slate-700/50 shadow-sm active:scale-95 disabled:opacity-50"
        >
          {digit}
        </button>
      ))}

      {/* Backspace */}
      <button
        type="button"
        disabled={disabled}
        onClick={onBackspace}
        aria-label="Backspace"
        className="h-14 sm:h-16 inline-flex items-center justify-center text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 active:bg-slate-600 rounded-2xl transition border border-slate-700/50 shadow-sm active:scale-95 disabled:opacity-50"
      >
        <Delete className="w-6 h-6" />
      </button>

      {/* 0 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit('0')}
        className="h-14 sm:h-16 text-2xl font-mono font-bold text-slate-100 bg-slate-800/70 hover:bg-slate-700/80 active:bg-slate-600 rounded-2xl transition border border-slate-700/50 shadow-sm active:scale-95 disabled:opacity-50"
      >
        0
      </button>

      {/* Enter */}
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        aria-label="Enter"
        className="h-14 sm:h-16 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl transition border border-indigo-500/50 shadow-md active:scale-95 disabled:opacity-50 font-bold"
      >
        <CornerDownLeft className="w-6 h-6" />
      </button>
    </div>
  );
};
