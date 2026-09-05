import { AiApp, Comment, HelpOffer, Session } from './types';

const s3 = (key: string) => `https://shitty-ai-apps-assets.s3.amazonaws.com/${key}`;

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/64/64`;

function contributor(id: string, name: string): AiApp['contributors'][number] {
  return { id, name, avatarUrl: avatar(id) };
}

export const APPS: AiApp[] = [
  {
    id: '1',
    slug: 'perplexity',
    name: 'Perplexity',
    emoji: '🔎',
    tagline: 'AI-powered search that answers questions with sources.',
    about:
      'Ask questions in natural language and get synthesized answers backed by citations from across the web.',
    story:
      'Built around the idea that finding an answer should feel more like asking a knowledgeable researcher than digging through search results.',
    coverImageUrl: s3('covers/perplexity.png'),
    coverTheme: 'dark',
    coverHeadline: 'Where knowledge begins',
    builtWith: 'AI search + web retrieval',
    techStack: ['LLMs', 'Search', 'RAG', 'Web'],
    websiteUrl: 'https://www.perplexity.ai',
    users: 1200,
    mrr: 2400,
    category: 'Productivity',
    upvotes: 84,
    contributors: [contributor('user_123', 'John Doe')],
    needsHelpWith: null,
    launchedAt: '2022-08-01',
    helpCategories: [],
  },
  {
    id: '2',
    slug: 'cursor',
    name: 'Cursor',
    emoji: '⌨️',
    tagline: 'An AI code editor built for programming with models.',
    about:
      'A code editor with AI deeply integrated into editing, navigation, code generation, and understanding large codebases.',
    story:
      'Reimagines the code editor around collaborating with AI instead of adding AI as a separate chat window.',
    coverImageUrl: s3('covers/cursor.png'),
    coverTheme: 'dark',
    coverHeadline: 'Build software faster',
    builtWith: 'Built for AI-assisted coding',
    techStack: ['TypeScript', 'LLMs', 'Code Search', 'IDE'],
    websiteUrl: 'https://www.cursor.com',
    users: 2840,
    mrr: 5100,
    category: 'Dev Tools',
    upvotes: 132,
    contributors: [contributor('c2', 'Alex Chen')],
    needsHelpWith: null,
    launchedAt: '2023-03-01',
    helpCategories: [],
  },
  {
    id: '3',
    slug: 'v0',
    name: 'v0',
    emoji: '▲',
    tagline: 'Generate working web interfaces from natural language.',
    about:
      'Describe an interface or application and generate editable UI and code that can be iterated on conversationally.',
    story:
      'Turns the early stages of building an interface into a conversation instead of starting from an empty editor.',
    coverImageUrl: s3('covers/v0.png'),
    coverTheme: 'light',
    coverHeadline: 'What can we ship?',
    builtWith: 'Generative UI by Vercel',
    techStack: ['React', 'Next.js', 'Tailwind', 'LLMs'],
    websiteUrl: 'https://v0.dev',
    users: 930,
    mrr: 1800,
    category: 'Dev Tools',
    upvotes: 97,
    contributors: [contributor('c3', 'Maya Singh')],
    needsHelpWith: 'Design / UX',
    contactEmail: 'maya@v0.dev',
    launchedAt: '2023-10-01',
    helpCategories: [
      { id: 'h1', label: 'Product Design', peopleCount: 61, avatarUrl: avatar('h1') },
      { id: 'h2', label: 'Frontend', peopleCount: 40, avatarUrl: avatar('h2') },
    ],
  },
  {
    id: '4',
    slug: 'bolt',
    name: 'Bolt',
    emoji: '⚡',
    tagline: 'Build full-stack web apps by talking to AI.',
    about:
      'Create, edit, run, and deploy web applications from a browser using natural-language instructions.',
    story:
      'Brings AI generation and a complete development environment together so an idea can become a running application without leaving the browser.',
    coverImageUrl: s3('covers/bolt.png'),
    coverTheme: 'sunset',
    coverHeadline: 'What do you want to build?',
    builtWith: 'Built by StackBlitz',
    techStack: ['WebContainers', 'JavaScript', 'LLMs', 'Web'],
    websiteUrl: 'https://bolt.new',
    users: 1760,
    mrr: 3200,
    category: 'Dev Tools',
    upvotes: 118,
    contributors: [contributor('c4', 'Noah Williams')],
    needsHelpWith: 'Getting customers',
    contactEmail: 'noah@bolt.new',
    launchedAt: '2024-10-01',
    helpCategories: [
      { id: 'h3', label: 'Growth / Marketing', peopleCount: 124, avatarUrl: avatar('h3') },
    ],
  },
  {
    id: '5',
    slug: 'gamma',
    name: 'Gamma',
    emoji: '✨',
    tagline: 'Create presentations, documents, and webpages with AI.',
    about:
      'Generate polished presentations and visual documents from a prompt, then refine the content and layout interactively.',
    story:
      'Reworks presentation creation around generated, responsive content rather than manually arranging individual slides.',
    coverImageUrl: s3('covers/gamma.png'),
    coverTheme: 'mint',
    coverHeadline: 'Ideas in. Beautiful work out.',
    builtWith: 'AI-native presentations',
    techStack: ['LLMs', 'Generative UI', 'Web'],
    websiteUrl: 'https://gamma.app',
    users: 2100,
    mrr: 3900,
    category: 'Productivity',
    upvotes: 73,
    contributors: [contributor('c5', 'Sofia Martin')],
    needsHelpWith: null,
    launchedAt: '2022-08-01',
    helpCategories: [],
  },
  {
    id: '6',
    slug: 'lovable',
    name: 'Lovable',
    emoji: '💜',
    tagline: 'Build apps and websites by chatting with AI.',
    about:
      'Describe a product in natural language and generate a working web application that can be refined through conversation.',
    story:
      'Makes software creation feel closer to describing what you want than manually assembling every part of an application.',
    coverImageUrl: s3('covers/lovable.png'),
    coverTheme: 'light',
    coverHeadline: 'Build something Lovable',
    builtWith: 'AI full-stack app builder',
    techStack: ['React', 'Supabase', 'LLMs', 'Web'],
    websiteUrl: 'https://lovable.dev',
    users: 1450,
    mrr: 2700,
    category: 'Dev Tools',
    upvotes: 105,
    contributors: [contributor('c6', 'Leo Andersson')],
    needsHelpWith: 'Community / Content',
    launchedAt: '2024-01-01',
    helpCategories: [
      { id: 'h4', label: 'Community / Content', peopleCount: 73, avatarUrl: avatar('h4') },
    ],
  },
  {
    id: '7',
    slug: 'suno',
    name: 'Suno',
    emoji: '🎵',
    tagline: 'Turn an idea into a song with generative AI.',
    about:
      'Generate complete songs from text prompts, including vocals, instrumentation, and lyrics.',
    story:
      'Makes music generation accessible through prompts instead of requiring production software or musical training.',
    coverImageUrl: s3('covers/suno.png'),
    coverTheme: 'sunset',
    coverHeadline: 'Make any song you can imagine',
    builtWith: 'Generative music AI',
    techStack: ['Generative Audio', 'Music', 'LLMs'],
    websiteUrl: 'https://suno.com',
    users: 1980,
    mrr: 3600,
    category: 'Fun',
    upvotes: 91,
    contributors: [contributor('c7', 'Jamie Park')],
    needsHelpWith: null,
    launchedAt: '2023-01-01',
    helpCategories: [],
  },
  {
    id: '8',
    slug: 'granola',
    name: 'Granola',
    emoji: '🥣',
    tagline: 'An AI notepad that turns meeting notes into useful notes.',
    about:
      'Take lightweight notes during meetings while AI uses the transcript to fill in context, organize ideas, and produce a useful summary.',
    story:
      'Designed around augmenting the notes you actually write rather than replacing meetings with another recording bot.',
    coverImageUrl: s3('covers/granola.png'),
    coverTheme: 'mint',
    coverHeadline: 'The AI notepad for meetings',
    builtWith: 'AI-assisted meeting notes',
    techStack: ['Transcription', 'LLMs', 'Desktop'],
    websiteUrl: 'https://www.granola.ai',
    users: 740,
    mrr: 1300,
    category: 'Productivity',
    upvotes: 67,
    contributors: [contributor('c8', 'Taylor Brooks')],
    needsHelpWith: 'Distribution',
    launchedAt: '2023-01-01',
    helpCategories: [
      { id: 'h5', label: 'Growth / Marketing', peopleCount: 124, avatarUrl: avatar('h5') },
    ],
  },
];

export const COMMENTS: Record<string, Comment[]> = {
  perplexity: [
    {
      id: 'cm1',
      author: 'Maya Singh',
      avatarUrl: avatar('c3'),
      body: 'The source-first answer format is still one of the most useful patterns in AI search.',
      createdAt: '2024-08-01T10:00:00.000Z',
    },
  ],
  cursor: [
    {
      id: 'cm2',
      author: 'Alex Chen',
      avatarUrl: avatar('c2'),
      body: 'The codebase-aware editing workflow is the part I keep coming back to.',
      createdAt: '2024-08-02T14:30:00.000Z',
    },
  ],
  v0: [
    {
      id: 'cm3',
      author: 'Sofia Martin',
      avatarUrl: avatar('c5'),
      body: 'Really useful for getting from an interface idea to something concrete quickly.',
      createdAt: '2024-08-05T09:15:00.000Z',
    },
  ],
};

export const SESSION: Session = {
  user: {
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    icon: avatar('user_123'),
  },
};

export const HELP_OFFERS: Record<string, HelpOffer[]> = {
  perplexity: [
    {
      id: 'ho-1',
      appSlug: 'perplexity',
      senderId: 'c3',
      senderName: 'Maya Singh',
      senderAvatarUrl: avatar('c3'),
      senderContact: 'maya@v0.dev',
      message: 'I specialize in citation UX and source verification pipelines. Would love to help polish the citation formatting and source preview cards!',
      status: 'pending',
      createdAt: '2024-08-10T14:20:00.000Z',
    },
  ],
  v0: [
    {
      id: 'ho-2',
      appSlug: 'v0',
      senderId: 'user_123',
      senderName: 'John Doe',
      senderAvatarUrl: avatar('user_123'),
      senderContact: 'john@example.com',
      message: 'I can help test and benchmark generative UI response times across different LLM backends.',
      status: 'pending',
      createdAt: '2024-08-11T16:45:00.000Z',
    },
  ],
  bolt: [
    {
      id: 'ho-3',
      appSlug: 'bolt',
      senderId: 'c5',
      senderName: 'Sofia Martin',
      senderAvatarUrl: avatar('c5'),
      senderContact: 'sofia@gamma.app',
      message: 'Happy to collaborate on growth tactics and developer marketing for in-browser environments.',
      status: 'accepted',
      createdAt: '2024-08-08T09:10:00.000Z',
      respondedAt: '2024-08-09T11:00:00.000Z',
    },
  ],
};
