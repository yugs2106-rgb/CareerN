import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'expanded';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className,
  variant = 'icon',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'expanded') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border",
          isDark 
            ? "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60" 
            : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200",
          className
        )}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600 transition-transform duration-300" />
          )}
          <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
        </span>
        <span className={cn(
          "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
          isDark ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" : "bg-blue-50 text-blue-700 border border-blue-200"
        )}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center p-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isDark
          ? "bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700/70"
          : "bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-xs",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-all duration-200 transform scale-100 rotate-0 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-all duration-200 transform scale-100 rotate-0 text-slate-700" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
