export type Category = 'SaaS' | 'Lifestyle' | 'Productivity' | 'Dev Tools' | 'Fun';

export type Tab = 'latest' | 'popular' | 'need-help' | 'just-launched';

export interface AppWithCommentCount extends AiApp {
  commentCount: number;
}

export type CoverTheme = 'dark' | 'light' | 'mint' | 'sunset';

export interface Contributor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface HelpCategory {
  id: string;
  label: string;
  peopleCount: number;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  body: string;
  createdAt: string; // ISO
}

export interface AiApp {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  about: string;
  story: string;
  coverImageUrl: string;
  coverTheme: CoverTheme;
  coverHeadline: string;
  builtWith: string;
  techStack: string[];
  websiteUrl: string;
  users: number;
  mrr: number;
  category: Category;
  upvotes: number;
  upvoters?: string[];
  contributors: Contributor[];
  needsHelpWith: string | null;
  contactEmail?: string;
  launchedAt: string; // ISO date
  createdAt?: string; // ISO date
  helpCategories: HelpCategory[];
}

export type HelpOfferStatus = 'pending' | 'accepted' | 'declined';

export interface HelpOffer {
  id: string;
  appSlug: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  senderContact: string;
  message: string;
  status: HelpOfferStatus;
  createdAt: string; // ISO
  respondedAt?: string; // ISO
}

export interface HelpOfferWithApp extends HelpOffer {
  appName: string;
  appEmoji: string;
}

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    icon?: string;
  };
}
