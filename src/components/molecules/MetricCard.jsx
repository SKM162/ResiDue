import React from 'react';

export function MetricCard({ title, amount, type = 'neutral' }) {
  const textColors = {
    neutral: 'text-neutral-900',
    inflow: 'text-neutral-900', // keeping text dark and minimalist per designTokens
    outflow: 'text-neutral-800'
  };

  const indicators = {
    neutral: 'border-neutral-200',
    inflow: 'border-l-4 border-l-emerald-600', // simple muted left border accent
    outflow: 'border-l-4 border-l-neutral-400'
  };

  return (
    <div className={`p-5 border bg-white rounded-md shadow-sm ${indicators[type]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</p>
      <p className={`text-xl font-mono font-medium mt-2 ${textColors[type]}`}>
        {type === 'inflow' && '+'}
        {type === 'outflow' && '-'}
        {amount}
      </p>
    </div>
  );
}
