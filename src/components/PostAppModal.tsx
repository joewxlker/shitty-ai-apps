'use client';

import { useActionState, useState } from 'react';
import { createAppAction, CreateAppState } from '@/actions/createApp';
import { Category, CoverTheme } from '@/lib/types';
import { EmojiPicker } from './EmojiPicker';
import { LimitedInput, LimitedTextarea } from './LimitedInput';
import { XIcon } from './icons';

const CATEGORIES: Category[] = ['SaaS', 'Lifestyle', 'Productivity', 'Dev Tools', 'Fun'];

const THEMES: { id: CoverTheme; label: string }[] = [
  { id: 'dark', label: 'Dark / terminal' },
  { id: 'light', label: 'Light / lavender' },
  { id: 'mint', label: 'Mint' },
  { id: 'sunset', label: 'Sunset' },
];

const initialState: CreateAppState = {};

export function PostAppModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(createAppAction, initialState);
  const [selectedEmoji, setSelectedEmoji] = useState('🤖');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-lg font-bold text-slate-900">Post your app</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form action={action} className="flex flex-col gap-4 p-5">
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
                required
                maxLength={60}
                placeholder="InvoiceGoblin"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />

              <FieldError errors={state.errors?.name?.errors} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">One-line tagline</label>

            <LimitedInput
              name="tagline"
              required
              maxLength={140}
              placeholder="AI that argues with vendors about invoices so you don't have to."
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
              maxLength={80}
              placeholder="Turn invoices into paid invoices"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <FieldError errors={state.errors?.coverHeadline?.errors} />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">About</label>

            <LimitedTextarea
              name="about"
              rows={3}
              maxLength={1000}
              placeholder="What does it actually do?"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <FieldError errors={state.errors?.about?.errors} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Built with</label>

              <LimitedInput
                name="builtWith"
                maxLength={100}
                defaultValue="Built with Claude"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />

              <FieldError errors={state.errors?.builtWith?.errors} />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500">Website URL</label>

              <LimitedInput
                name="websiteUrl"
                type="url"
                maxLength={200}
                placeholder="https://"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />

              <FieldError errors={state.errors?.websiteUrl?.errors} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Category</label>

              <select
                name="category"
                defaultValue="SaaS"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <FieldError errors={state.errors?.category?.errors} />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500">Card style</label>

              <select
                name="coverTheme"
                defaultValue="dark"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>

              <FieldError errors={state.errors?.coverTheme?.errors} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              Need help with anything? (optional)
            </label>

            <LimitedInput
              name="needsHelpWith"
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
              maxLength={100}
              placeholder="founder@example.com (defaults to your account email)"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <FieldError errors={state.errors?.contactEmail?.errors} />
          </div>

          {state.message && <p className="text-sm text-red-600">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {pending ? 'Posting…' : 'Post your app'}
          </button>
        </form>
      </div>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

