import { CoverTheme } from './types';

export const coverThemeClasses: Record<CoverTheme, { bg: string; text: string; sub: string }> = {
  dark: {
    bg: 'bg-[#0c0f12]',
    text: 'text-[#8ef58c]',
    sub: 'text-[#8ef58c]/50',
  },
  light: {
    bg: 'bg-[#ece7fb]',
    text: 'text-slate-900',
    sub: 'text-slate-500',
  },
  mint: {
    bg: 'bg-[#e4f7ea]',
    text: 'text-emerald-900',
    sub: 'text-emerald-700/60',
  },
  sunset: {
    bg: 'bg-gradient-to-br from-[#ffb37a] to-[#ff7a7a]',
    text: 'text-white',
    sub: 'text-white/70',
  },
};
