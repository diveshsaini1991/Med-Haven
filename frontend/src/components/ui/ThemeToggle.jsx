import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Context } from '../../main';

const ThemeToggle = ({ className = '' }) => {
  const { theme, setTheme } = useContext(Context);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle color theme"
      className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-teal-200 text-teal-600 transition hover:border-teal-400 hover:text-teal-500 dark:border-ink-600 dark:text-teal-200 dark:hover:border-teal-400 ${className}`}
    >
      {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
    </button>
  );
};

export default ThemeToggle;
