import React from 'react';

const VARIANTS = {
  primary:
    'bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 disabled:bg-teal-300',
  outline:
    'border-2 border-teal-200 text-teal-700 hover:border-teal-400 dark:border-ink-600 dark:text-teal-100 dark:hover:border-teal-400',
  sand: 'bg-sand-400 text-teal-900 shadow-lg shadow-sand-400/30 hover:bg-sand-500',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600',
  ghost:
    'text-teal-700 hover:bg-teal-50 dark:text-teal-100 dark:hover:bg-ink-700',
};

const Button = ({
  variant = 'primary',
  className = '',
  pulse = false,
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    className={`rounded-2xl px-6 py-3 font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${
      VARIANTS[variant] || VARIANTS.primary
    } ${pulse ? 'anim-pulse' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
