# shitty ai apps (prototype)

A clone of the "shitty ai apps" directory: a feed of scrappy AI side projects, an "I need help" / "Can Help" matching flow, and a leaderboard.

## Stack

- **Next.js 16** (App Router with Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling
- **Server Components & Server Actions** for data fetching, mutations, and cache management.
- **No database (yet)** — a module-level in-memory store (`src/lib/db.ts`) stands in for Postgres/Supabase.
- **Tag-based Caching** (`unstable_cache` & `updateTag` in `src/lib/repo.ts` and `src/actions/`) ready for a drop-in Supabase migration.
- **Icons** are hand-written inline SVGs (`src/components/icons.tsx`) using `stroke="currentColor"`, recolored by any Tailwind text class.
- **Images**: avatars come from `picsum.photos` (placeholder service). App cover art is rendered with CSS themes (`src/lib/coverTheme.ts`), with fields ready for real uploaded screenshots.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's implemented

- **Feed**: Tabs (Latest, Popular, Need Help, Just Launched) with live instant search across app names, taglines, categories, and tech stack.
- **Post Your App**: Modal with a curated single-emoji picker, automatic collision-safe slug generation (`app-[uuid]` fallback for non-Latin/emoji names), immediately appearing at the top of Latest.
- **Upvoting**: Server Action with instant cache tag invalidation (`updateTag`).
- **Comments**: View comments and post new ones with auto-revalidation.
- **"I need help" / "Can Help"**:
  - App contributors can post and update what their project needs help with.
  - Visitors can view active help requests and explore the "Can Help" directory.
- **Leaderboard**: Ranked by upvotes.
- **Responsive Layout**: Desktop sidebar navigation and mobile bottom nav with quick action triggers.

## Project layout

```
src/
  actions/                 # Next.js Server Actions (createApp, upvoteApp, addComment, etc.)
  app/                     # App Router routes and page layouts
    (feed)/                # Feed tab routes (Latest, Popular, Need Help, Just Launched)
    apps/[slug]/           # App detail page
    can-help/              # Can Help community matching directory
    leaderboard/           # Leaderboard
  components/              # React Server & Client Components
  context/                 # Client React Contexts (Feed search, Post modal, Session)
  lib/
    types.ts               # Shared domain interfaces and types
    db.ts                  # Seed data + in-memory data store
    repo.ts                # Data access layer with cache tags (Supabase target)
    serverUtils.ts         # Session auth cookie management and feed filtering
    coverTheme.ts          # Card theme color classes
    formatters.ts          # Date and display formatting helpers
```

## Next steps & extensions

1. **Connect Supabase**: Replace the functions in `src/lib/repo.ts` with `supabase-js` database calls. All queries and Server Actions are already structured with cache tags (`'apps'`, `slug`) and `updateTag`.
2. **Real Auth**: Replace the mock cookie session in `src/lib/serverUtils.ts` with Supabase Auth or NextAuth.
3. **Image Uploads**: Wire up Supabase Storage or S3 for uploaded screenshots in `PostAppModal`, replacing the CSS cover fallback in `AppCover.tsx`.
4. **Per-user Upvotes**: Persist upvotes per user in a Supabase join table (`app_upvotes`) to prevent duplicate upvoting.
5. **Pagination**: Add infinite scroll or pagination on the feed once the database grows.
