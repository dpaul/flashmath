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
    <div className="w-full max-w-xs sm:max-w-sm mx-auto grid grid-cols-3 gap-2 sm:gap-2.5 p-3 bg-[#fdfbf7] dark:bg-[#1f2428] rounded-3xl border border-[#e4d9c7] dark:border-[#353c43] shadow-sm select-none">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(digit)}
          className="h-12 sm:h-14 text-xl sm:text-2xl font-mono font-bold text-[#073642] dark:text-[#eceff1] bg-white dark:bg-[#24292e] hover:bg-[#fcf9f2] dark:hover:bg-[#2a3036] active:bg-[#f4ece1] dark:active:bg-[#181b1e] rounded-2xl transition-all border border-[#e4d9c7] dark:border-[#353c43] shadow-[0_3px_0_#dcd3b6] dark:shadow-[0_3px_0_#14171a] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
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
        className="h-12 sm:h-14 inline-flex items-center justify-center text-[#586e75] dark:text-[#94a3b8] bg-[#f4ece1] dark:bg-[#282e34] hover:bg-[#ebdccb] dark:hover:bg-[#2f373e] active:bg-[#dfcebc] dark:active:bg-[#181b1e] rounded-2xl transition-all border border-[#e4d9c7] dark:border-[#353c43] shadow-[0_3px_0_#dcd3b6] dark:shadow-[0_3px_0_#14171a] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
      >
        <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 0 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit('0')}
        className="h-12 sm:h-14 text-xl sm:text-2xl font-mono font-bold text-[#073642] dark:text-[#eceff1] bg-white dark:bg-[#24292e] hover:bg-[#fcf9f2] dark:hover:bg-[#2a3036] active:bg-[#f4ece1] dark:active:bg-[#181b1e] rounded-2xl transition-all border border-[#e4d9c7] dark:border-[#353c43] shadow-[0_3px_0_#dcd3b6] dark:shadow-[0_3px_0_#14171a] active:shadow-none active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
      >
        0
      </button>

      {/* Enter */}
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        aria-label="Enter"
        className="h-12 sm:h-14 inline-flex items-center justify-center bg-[#cb4b16] dark:bg-[#eb937d] hover:bg-[#b83f0f] dark:hover:bg-[#df856e] active:bg-[#99370e] dark:active:bg-[#c9745f] text-white dark:text-[#1a1d20] rounded-2xl transition-all border border-[#99370e] dark:border-[#b86b58] shadow-[0_3px_0_#99370e] dark:shadow-[0_3px_0_#b86b58] active:shadow-none active:translate-y-0.5 disabled:opacity-40 font-bold cursor-pointer"
      >
        <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
