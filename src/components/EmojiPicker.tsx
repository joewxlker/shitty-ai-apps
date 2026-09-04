'use client';

import { useState } from 'react';

export const CURATED_EMOJIS = [
  '🤖',
  '⚡',
  '🚀',
  '🧠',
  '💡',
  '🛠️',
  '🔎',
  '⌨️',
  '▲',
  '✨',
  '💜',
  '🎵',
  '🥣',
  '📦',
  '💻',
  '🔮',
  '🎨',
  '📈',
  '💬',
  '🔥',
  '🦾',
  '🧪',
  '🌐',
  '🎯',
  '⚙️',
  '📊',
  '🥑',
  '🕹️',
  '🛡️',
  '🎙️',
];

export function EmojiPicker({
  selected,
  onSelect,
  name = 'emoji',
}: {
  selected: string;
  onSelect: (emoji: string) => void;
  name?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 flex h-[42px] w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-2xl transition-colors hover:border-brand-400 focus:border-brand-400 focus:outline-none"
        aria-label="Pick an emoji"
      >
        {selected}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 grid w-60 grid-cols-6 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-panel">
            {CURATED_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setIsOpen(false);
                }}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-slate-100',
                  selected === emoji ? 'bg-brand-50 ring-1 ring-brand-400' : '',
                ].join(' ')}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
