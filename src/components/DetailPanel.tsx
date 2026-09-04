'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { addCommentAction } from '@/actions/addComment';
import { requestHelpAction } from '@/actions/requestHelp';
import { updateAppAction, type UpdateAppState } from '@/actions/updateApp';
import { upvoteAppAction } from '@/actions/upvoteApp';
import { formatDate } from '@/lib/formatters';
import type { AppWithCommentCount, Category, Comment, CoverTheme } from '@/lib/types';

import { AppCover } from './AppCover';
import { CategoryPill } from './CategoryPill';
import { EmojiPicker } from './EmojiPicker';
import {
  ArrowLeftIcon,
  DollarIcon,
  ExternalLinkIcon,
  MailIcon,
  MessageCircleIcon,
  PencilIcon,
  UsersIcon,
  XIcon,
} from './icons';
import { useSession } from '@/context/SessionContext';

const CATEGORIES: Category[] = ['SaaS', 'Lifestyle', 'Productivity', 'Dev Tools', 'Fun'];

const THEMES: { id: CoverTheme; label: string }[] = [
  { id: 'dark', label: 'Dark / terminal' },
  { id: 'light', label: 'Light / lavender' },
  { id: 'mint', label: 'Mint' },
  { id: 'sunset', label: 'Sunset' },
];

type DetailPanelProps = {
  app: AppWithCommentCount;
  comments: Comment[];
  onClose?: () => void;
  initialShowHelpForm?: boolean;
};

type App = AppWithCommentCount;
type HelpCategory = App['helpCategories'][number];

export function DetailPanel({
  app,
  comments,
  onClose,
  initialShowHelpForm = false,
}: DetailPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const handleClose = onClose ?? (() => router.back());

  const sessionIsContributor = session && !!app.contributors.find((x) => x.id == session.user.id);
  const isEditing = searchParams.get('edit') === '1';
  const isContributorEditing = sessionIsContributor && isEditing;
  const hasUpvoted = Boolean(session?.user?.id && app.upvoters?.includes(session.user.id));

  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleDiscussInComments = () => {
    if (commentInputRef.current) {
      commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      commentInputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-panel">
      <PanelHeader
        onClose={handleClose}
        title={isContributorEditing ? 'Edit project' : undefined}
      />

      {isContributorEditing ? (
        <EditAppForm app={app} onCancel={handleClose} />
      ) : (
        <div className="flex flex-col gap-6 px-5 pb-8 pt-4">
          <AppCover app={app} size="lg" />
          <AppSummary app={app} />
          <AppActions
            app={app}
            canEdit={!!sessionIsContributor}
            hasUpvoted={hasUpvoted}
          />
          <About app={app} />
          <TechStack app={app} />
          {app.story && <Story story={app.story} />}
          {sessionIsContributor ? (
            <HelpRequest
              slug={app.slug}
              needsHelpWith={app.needsHelpWith}
              contactEmail={app.contactEmail}
              initialOpen={initialShowHelpForm}
            />
          ) : (
            <VisitorHelpBlock
              app={app}
              onDiscussInComments={handleDiscussInComments}
            />
          )}
          <HelpCategories categories={app.helpCategories} />
          <Comments
            slug={app.slug}
            comments={comments}
            inputRef={commentInputRef}
          />
        </div>
      )}
    </div>
  );
}

function PanelHeader({ onClose, title }: { onClose: () => void; title?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 p-4">
      <button
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      {title && <span className="text-sm font-bold text-slate-900">{title}</span>}

      <button
        onClick={onClose}
        className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function AppSummary({ app }: { app: App }) {
  return (
    <>
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <span>{app.emoji}</span>
          {app.name}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{app.tagline}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <UsersIcon className="h-3.5 w-3.5" />
          {app.users} users
        </span>
        <span className="inline-flex items-center gap-1">
          <DollarIcon className="h-3.5 w-3.5" />${app.mrr} MRR
        </span>
        <span>Launched {formatDate(app.launchedAt)}</span>
      </div>
    </>
  );
}

function AppActions({
  app,
  canEdit,
  hasUpvoted,
}: {
  app: App;
  canEdit?: boolean;
  hasUpvoted?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {app.websiteUrl ? (
        <a
          href={app.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Try it
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
      ) : null}

      {canEdit && (
        <Link
          href={`/apps/${app.slug}?edit=1`}
          scroll={false}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </Link>
      )}

      <form action={upvoteAppAction.bind(null, app.slug)}>
        <SubmitButton
          pendingLabel={`▲ ${app.upvotes}`}
          disabled={hasUpvoted}
          title={hasUpvoted ? 'You already upvoted this app' : 'Upvote'}
          className={[
            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-75',
            hasUpvoted
              ? 'border-brand-300 bg-brand-50 text-brand-600 font-semibold cursor-default'
              : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600',
          ].join(' ')}
        >
          ▲ {app.upvotes}
        </SubmitButton>
      </form>
    </div>
  );
}

function About({ app }: { app: App }) {
  return (
    <Section title="About">
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{app.about}</p>
    </Section>
  );
}

function TechStack({ app }: { app: App }) {
  return (
    <Section title="Tech stack">
      <div className="mt-2 flex flex-wrap gap-1.5">
        {app.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
          >
            {tech}
          </span>
        ))}
        <CategoryPill category={app.category} />
      </div>
    </Section>
  );
}

function Story({ story }: { story: string }) {
  return (
    <Section title="The story">
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{story}</p>
    </Section>
  );
}

function VisitorHelpBlock({
  app,
  onDiscussInComments,
}: {
  app: App;
  onDiscussInComments?: () => void;
}) {
  if (!app.needsHelpWith) return null;

  const mailSubject = encodeURIComponent(`[shitty ai apps] Offer to help with ${app.name}`);
  const mailBody = encodeURIComponent(
    `Hi,\n\nI saw your project "${app.name}" on shitty ai apps and that you're looking for help with:\n"${app.needsHelpWith}"\n\nHere is how I can help:\n`
  );
  const mailtoUrl = app.contactEmail
    ? `mailto:${app.contactEmail}?subject=${mailSubject}&body=${mailBody}`
    : undefined;

  const handleDiscuss = () => {
    if (onDiscussInComments) {
      onDiscussInComments();
    } else {
      const input = document.getElementById(`comment-input-${app.slug}`) as HTMLInputElement | null;
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus({ preventScroll: true });
      }
    }
  };

  return (
    <section>
      <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            They need help with
          </p>
        </div>

        <p className="mt-2 text-base font-semibold leading-relaxed text-slate-900">
          {app.needsHelpWith}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {mailtoUrl ? (
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <MailIcon className="h-4 w-4" />
              Offer to help via Email
            </a>
          ) : null}

          <button
            type="button"
            onClick={handleDiscuss}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <MessageCircleIcon className="h-3.5 w-3.5" />
            Discuss in comments
          </button>
        </div>
      </div>
    </section>
  );
}

function HelpRequest({
  slug,
  needsHelpWith,
  contactEmail,
  initialOpen,
}: {
  slug: string;
  needsHelpWith: App['needsHelpWith'];
  contactEmail?: string;
  initialOpen: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);

  async function submit(formData: FormData) {
    await requestHelpAction(slug, formData);
    setOpen(false);
  }

  return (
    <section>
      <div className="rounded-xl bg-brand-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          I need help with
        </p>

        {needsHelpWith ? (
          <>
            <p className="mt-1 text-base font-medium text-slate-900">{needsHelpWith}</p>
            {contactEmail && (
              <p className="mt-1 text-xs text-brand-700">
                Inquiries will be sent to: <span className="font-semibold">{contactEmail}</span>
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm text-slate-500">
            Nothing right now — this one&apos;s smooth sailing.
          </p>
        )}

        {open ? (
          <form action={submit} className="mt-3 flex flex-col gap-2">
            <input
              autoFocus
              name="help"
              defaultValue={needsHelpWith || ''}
              placeholder="e.g. Getting customers, Design feedback…"
              className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <div className="flex gap-2">
              <SubmitButton
                pendingLabel="Saving…"
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                Save
              </SubmitButton>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="mt-3 text-xs font-semibold text-brand-700 hover:underline"
          >
            {needsHelpWith ? 'Update this' : 'Ask for help'}
          </button>
        )}
      </div>
    </section>
  );
}

function HelpCategories({ categories }: { categories: HelpCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <Section title="People who can help">
      <div className="mt-2 flex flex-col gap-2">
        {categories.map((help) => (
          <div
            key={help.id}
            className="flex items-center gap-3 rounded-lg border border-slate-100 p-2"
          >
            <Image
              src={help.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium text-slate-900">{help.label}</p>
              <p className="text-xs text-slate-500">{help.peopleCount} people</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Comments({
  slug,
  comments,
  inputRef,
}: {
  slug: string;
  comments: Comment[];
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div id="comments-section">
      <Section title={`Comments (${comments.length})`}>
      <div className="mt-3 flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2.5">
            <Image
              src={comment.avatarUrl}
              alt={comment.author}
              width={28}
              height={28}
              className="mt-0.5 rounded-full object-cover"
            />
            <div className="flex-1 rounded-lg bg-slate-50 p-2.5">
              <p className="text-xs font-semibold text-slate-900">{comment.author}</p>
              <p className="mt-0.5 text-sm text-slate-600">{comment.body}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet. Be first.</p>
        )}
      </div>

      <form action={addCommentAction.bind(null, slug)} className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          id={`comment-input-${slug}`}
          name="comment"
          placeholder="Add a comment…"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <SubmitButton
          pendingLabel="Posting…"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40"
        >
          Post
        </SubmitButton>
      </form>
    </Section>
  </div>
);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
  title,
}: {
  children: ReactNode;
  pendingLabel: ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending || disabled} title={title} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}

function EditAppForm({ app, onCancel }: { app: App; onCancel: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UpdateAppState>({});
  const [selectedEmoji, setSelectedEmoji] = useState(app.emoji);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateAppAction(app.slug, {}, formData);
      if (res.success) {
        onCancel();
        router.refresh();
      } else {
        setState(res);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <div className="flex gap-3">
        <div className="w-20">
          <label className="text-xs font-medium text-slate-500">Emoji</label>
          <EmojiPicker selected={selectedEmoji} onSelect={setSelectedEmoji} />
          <FieldError errors={state.errors?.emoji?.errors} />
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium text-slate-500">App name</label>
          <input
            name="name"
            defaultValue={app.name}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <FieldError errors={state.errors?.name?.errors} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">One-line tagline</label>
        <input
          name="tagline"
          defaultValue={app.tagline}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.tagline?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">
          Cover headline (shown on the card)
        </label>
        <input
          name="coverHeadline"
          defaultValue={app.coverHeadline}
          placeholder="Defaults to app name (optional)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.coverHeadline?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">About the app</label>
        <textarea
          name="about"
          rows={3}
          defaultValue={app.about}
          placeholder="Tell people about your app (optional)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.about?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Built with</label>
        <input
          name="builtWith"
          defaultValue={app.builtWith}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.builtWith?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Website URL</label>
        <input
          name="websiteUrl"
          type="url"
          defaultValue={app.websiteUrl}
          placeholder="https://example.com (optional)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.websiteUrl?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Category</label>
        <select
          name="category"
          defaultValue={app.category}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.category?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Card theme</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {THEMES.map((theme) => (
            <label
              key={theme.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-700 hover:bg-slate-50 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
            >
              <input
                type="radio"
                name="coverTheme"
                value={theme.id}
                defaultChecked={app.coverTheme === theme.id}
                className="text-brand-600 focus:ring-brand-500"
              />
              {theme.label}
            </label>
          ))}
        </div>
        <FieldError errors={state.errors?.coverTheme?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">
          Need help with anything? (optional)
        </label>
        <input
          name="needsHelpWith"
          defaultValue={app.needsHelpWith || ''}
          placeholder="Getting customers, design feedback…"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.needsHelpWith?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">
          Contact email for inquiries / help (optional)
        </label>
        <input
          name="contactEmail"
          type="email"
          defaultValue={app.contactEmail || ''}
          placeholder="founder@example.com (defaults to your account email)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.contactEmail?.errors} />
      </div>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? 'Saving changes…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

