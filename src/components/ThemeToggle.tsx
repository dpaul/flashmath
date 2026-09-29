import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to paper light mode' : 'Switch to chalkboard dark mode'}
      title={isDark ? 'Switch to paper light mode' : 'Switch to chalkboard dark mode'}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 select-none ${
        isDark
          ? 'bg-[#24292e] hover:bg-[#2d353c] text-[#eed082] border-[#353c43] hover:border-[#eed082]/40 shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
          : 'bg-[#eee8d5] hover:bg-[#e4d9c7] text-[#586e75] hover:text-[#073642] border-[#e4d9c7]'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 hover:rotate-45 text-[#eed082]" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 -rotate-12 hover:rotate-0 text-[#586e75]" />
      )}
      <span className="sr-only">
        {isDark ? 'Active: Chalkboard Dark Mode' : 'Active: Paper Light Mode'}
      </span>
    </button>
  );
};
