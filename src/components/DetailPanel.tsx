'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { addCommentAction } from '@/actions/addComment';
import { requestHelpAction } from '@/actions/requestHelp';
import { respondHelpOfferAction } from '@/actions/respondHelpOffer';
import { submitHelpOfferAction } from '@/actions/submitHelpOffer';
import { updateAppAction, type UpdateAppState } from '@/actions/updateApp';
import { upvoteAppAction } from '@/actions/upvoteApp';
import { formatDate } from '@/lib/formatters';
import type { AppWithCommentCount, Category, Comment, CoverTheme, HelpOffer } from '@/lib/types';

import { AppCover } from './AppCover';
import { CategoryPill } from './CategoryPill';
import { EmojiPicker } from './EmojiPicker';
import { ExpandableText } from './ExpandableText';
import { LimitedInput, LimitedTextarea } from './LimitedInput';
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  DollarIcon,
  ExternalLinkIcon,
  HeartHandshakeIcon,
  MessageCircleIcon,
  PencilIcon,
  SendIcon,
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
  helpOffers?: HelpOffer[];
  onClose?: () => void;
  initialShowHelpForm?: boolean;
};

type App = AppWithCommentCount;
type HelpCategory = App['helpCategories'][number];

export function DetailPanel({
  app,
  comments,
  helpOffers = [],
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
          <AppActions app={app} canEdit={!!sessionIsContributor} hasUpvoted={hasUpvoted} />
          <About app={app} />
          <TechStack app={app} />
          {app.story && <Story story={app.story} />}
          {sessionIsContributor ? (
            <>
              <HelpRequest
                slug={app.slug}
                needsHelpWith={app.needsHelpWith}
                contactEmail={app.contactEmail}
                initialOpen={initialShowHelpForm}
              />
              <OwnerHelpOffers slug={app.slug} offers={helpOffers} />
            </>
          ) : (
            <VisitorHelpBlock
              app={app}
              helpOffers={helpOffers}
              onDiscussInComments={handleDiscussInComments}
            />
          )}
          <HelpCategories categories={app.helpCategories} />
          <Comments slug={app.slug} comments={comments} inputRef={commentInputRef} />
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
      <ExpandableText
        text={app.about}
        limit={240}
        className="mt-1.5 text-sm leading-relaxed text-slate-600"
      />
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
      <ExpandableText
        text={story}
        limit={240}
        className="mt-1.5 text-sm leading-relaxed text-slate-600"
      />
    </Section>
  );
}

function VisitorHelpBlock({
  app,
  helpOffers = [],
  onDiscussInComments,
}: {
  app: App;
  helpOffers?: HelpOffer[];
  onDiscussInComments?: () => void;
}) {
  const session = useSession();
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!app.needsHelpWith) return null;

  const myOffer = session?.user?.id
    ? helpOffers.find((o) => o.senderId === session.user.id)
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

  async function handleSendOffer(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await submitHelpOfferAction(app.slug, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setShowOfferForm(false);
      }
    });
  }

  return (
    <section>
      <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            They need help with
          </p>
        </div>

        <ExpandableText
          text={app.needsHelpWith}
          limit={200}
          className="mt-2 text-base font-semibold leading-relaxed text-slate-900"
        />

        {/* Existing User Request Status Banner */}
        {myOffer && !showOfferForm && (
          <div className="mt-4">
            {myOffer.status === 'pending' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <ClockIcon className="h-4 w-4 shrink-0 text-amber-600" />
                  Your offer to help is awaiting confirmation from the owner
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
                  &ldquo;{myOffer.message}&rdquo;
                </p>
                <p className="mt-2 font-mono text-[11px] text-amber-700">
                  Shared contact: {myOffer.senderContact}
                </p>
              </div>
            )}

            {myOffer.status === 'accepted' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600" />
                  Offer accepted! You are now a contributor on this project.
                </div>
                <p className="mt-1 text-xs text-emerald-800">
                  Your profile avatar is displayed in the contributor list above.
                </p>
              </div>
            )}

            {myOffer.status === 'declined' && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600">
                <span>The owner was unable to take you up on this offer.</span>
                <button
                  type="button"
                  onClick={() => setShowOfferForm(true)}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  Send another request
                </button>
              </div>
            )}
          </div>
        )}

        {/* Offer Form */}
        {showOfferForm ? (
          <form
            action={handleSendOffer}
            className="mt-4 flex flex-col gap-3 rounded-xl border border-brand-200 bg-white p-4 shadow-xs"
          >
            <div>
              <label className="text-xs font-semibold text-slate-800">How can you help?</label>
              <LimitedTextarea
                name="message"
                required
                maxLength={500}
                rows={3}
                placeholder="Describe your skills, what you'd like to help build, or share links to your work…"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800">
                Your contact info (revealed upon confirmation)
              </label>
              <LimitedInput
                name="contact"
                required
                maxLength={100}
                defaultValue={session?.user?.email || ''}
                placeholder="Email, Twitter/X handle, or Discord username"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-500"
              />
            </div>

            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <SendIcon className="h-3.5 w-3.5" />
                {isPending ? 'Sending…' : 'Send request'}
              </button>
              <button
                type="button"
                onClick={() => setShowOfferForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          !myOffer && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowOfferForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <HeartHandshakeIcon className="h-4 w-4" />
                Offer to help
              </button>

              <button
                type="button"
                onClick={handleDiscuss}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <MessageCircleIcon className="h-3.5 w-3.5" />
                Discuss in comments
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function OwnerHelpOffers({ slug, offers = [] }: { slug: string; offers?: HelpOffer[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRespond = (offerId: string, status: 'accepted' | 'declined') => {
    startTransition(async () => {
      await respondHelpOfferAction(slug, offerId, status);
    });
  };

  const pendingCount = offers.filter((o) => o.status === 'pending').length;

  return (
    <Section
      title={`Inbound help offers (${offers.length})`}
      action={
        pendingCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            {pendingCount} pending
          </span>
        ) : undefined
      }
    >
      {offers.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          No offers to help yet. When visitors offer to help with your project, their requests will
          appear here for you to confirm and add as contributors.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={[
                'rounded-xl border p-4 transition-colors',
                offer.status === 'pending'
                  ? 'border-amber-200 bg-amber-50/40'
                  : offer.status === 'accepted'
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/50 opacity-75',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={offer.senderAvatarUrl}
                    alt={offer.senderName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{offer.senderName}</p>
                    <p className="text-xs text-slate-500">{formatDate(offer.createdAt)}</p>
                  </div>
                </div>

                <span
                  className={[
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    offer.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : offer.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600',
                  ].join(' ')}
                >
                  {offer.status === 'pending' && <ClockIcon className="h-3 w-3" />}
                  {offer.status === 'accepted' && <CheckIcon className="h-3 w-3" />}
                  {offer.status === 'pending'
                    ? 'Pending'
                    : offer.status === 'accepted'
                      ? 'Accepted · Contributor'
                      : 'Declined'}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {offer.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Contact:</span>{' '}
                  <span className="font-mono text-slate-800">{offer.senderContact}</span>
                </div>

                {offer.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRespond(offer.id, 'accepted')}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      Accept & Add Contributor
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRespond(offer.id, 'declined')}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
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
            <ExpandableText
              text={needsHelpWith}
              limit={200}
              className="mt-1 text-base font-medium text-slate-900"
            />
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
            <LimitedInput
              autoFocus
              name="help"
              maxLength={200}
              defaultValue={needsHelpWith || ''}
              placeholder="e.g. Getting customers, Design feedback…"
              className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
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
              className="h-8 w-8 shrink-0 rounded-full object-cover"
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
  const [commentText, setCommentText] = useState('');

  const handleAddComment = async (formData: FormData) => {
    await addCommentAction(slug, formData);
    setCommentText('');
  };

  return (
    <div id="comments-section">
      <Section title={`Comments (${comments.length})`}>
        <div className="mt-3 flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5">
              <Image
                src={comment.avatarUrl}
                alt={comment.author}
                width={28}
                height={28}
                className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1 rounded-lg bg-slate-50 p-2.5">
                <p className="text-xs font-semibold text-slate-900">{comment.author}</p>
                <ExpandableText
                  text={comment.body}
                  limit={180}
                  className="mt-0.5 text-sm text-slate-600"
                />
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-sm text-slate-400">No comments yet. Be first.</p>
          )}
        </div>

        <form action={handleAddComment} className="mt-3 flex items-start gap-2">
          <LimitedInput
            ref={inputRef}
            id={`comment-input-${slug}`}
            name="comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={500}
            placeholder="Add a comment…"
            containerClassName="flex-1"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
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

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
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
          <LimitedInput
            name="name"
            defaultValue={app.name}
            maxLength={60}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <FieldError errors={state.errors?.name?.errors} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">One-line tagline</label>
        <LimitedInput
          name="tagline"
          defaultValue={app.tagline}
          maxLength={140}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.tagline?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">
          Cover headline (shown on the card)
        </label>
        <LimitedInput
          name="coverHeadline"
          defaultValue={app.coverHeadline}
          maxLength={80}
          placeholder="Defaults to app name (optional)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.coverHeadline?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">About the app</label>
        <LimitedTextarea
          name="about"
          rows={3}
          defaultValue={app.about}
          maxLength={1000}
          placeholder="Tell people about your app (optional)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.about?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Built with</label>
        <LimitedInput
          name="builtWith"
          defaultValue={app.builtWith}
          maxLength={100}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.builtWith?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Website URL</label>
        <LimitedInput
          name="websiteUrl"
          type="url"
          defaultValue={app.websiteUrl}
          maxLength={200}
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
        <LimitedInput
          name="needsHelpWith"
          defaultValue={app.needsHelpWith || ''}
          maxLength={200}
          placeholder="Getting customers, design feedback…"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <FieldError errors={state.errors?.needsHelpWith?.errors} />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">
          Contact email for inquiries / help (optional)
        </label>
        <LimitedInput
          name="contactEmail"
          type="email"
          defaultValue={app.contactEmail || ''}
          maxLength={100}
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
