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
    <div className="w-full max-w-xs sm:max-w-sm mx-auto grid grid-cols-3 gap-2 sm:gap-2.5 p-3 bg-[#fdfbf7] rounded-3xl border border-[#e4d9c7] shadow-sm select-none">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(digit)}
          className="h-12 sm:h-14 text-xl sm:text-2xl font-mono font-bold text-[#073642] bg-white hover:bg-[#fcf9f2] active:bg-[#f4ece1] rounded-2xl transition-all border border-[#e4d9c7] shadow-[0_3px_0_#dcd3b6] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
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
        className="h-12 sm:h-14 inline-flex items-center justify-center text-[#586e75] bg-[#f4ece1] hover:bg-[#ebdccb] active:bg-[#dfcebc] rounded-2xl transition-all border border-[#e4d9c7] shadow-[0_3px_0_#dcd3b6] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
      >
        <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 0 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit('0')}
        className="h-12 sm:h-14 text-xl sm:text-2xl font-mono font-bold text-[#073642] bg-white hover:bg-[#fcf9f2] active:bg-[#f4ece1] rounded-2xl transition-all border border-[#e4d9c7] shadow-[0_3px_0_#dcd3b6] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
      >
        0
      </button>

      {/* Enter */}
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        aria-label="Enter"
        className="h-12 sm:h-14 inline-flex items-center justify-center bg-[#cb4b16] hover:bg-[#b83f0f] active:bg-[#99370e] text-white rounded-2xl transition-all border border-[#99370e] shadow-[0_3px_0_#99370e] active:shadow-none active:translate-y-0.5 disabled:opacity-40 font-bold cursor-pointer"
      >
        <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
