import React from 'react';

const SectionHeading = ({ eyebrow, title, subtitle, className = '' }) => (
  <div className={`text-center ${className}`}>
    {eyebrow && (
      <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700 dark:bg-ink-700 dark:text-teal-200">
        {eyebrow}
      </span>
    )}
    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50 sm:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mx-auto mt-3 max-w-2xl text-teal-700/80 dark:text-teal-100/70">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
