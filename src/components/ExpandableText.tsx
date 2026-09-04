'use client';

import { useState } from 'react';

export function ExpandableText({
  text,
  limit = 200,
  className = 'text-sm text-slate-600',
}: {
  text: string;
  limit?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const lines = text.split('\n');
  const isLong = text.length > limit || lines.length > 3;

  if (!isLong) {
    return <p className={`whitespace-pre-line break-words ${className}`}>{text}</p>;
  }

  let previewText = text;
  if (lines.length > 3) {
    previewText = lines.slice(0, 3).join('\n');
  }
  if (previewText.length > limit) {
    previewText = previewText.slice(0, limit).trim();
  }

  const displayText = expanded ? text : `${previewText.trim()}…`;

  return (
    <div>
      <p className={`whitespace-pre-line break-words ${className}`}>{displayText}</p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-1 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
      >
        {expanded ? 'Show less' : 'See more'}
      </button>
    </div>
  );
}
