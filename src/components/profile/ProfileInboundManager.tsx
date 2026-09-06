'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { respondHelpOfferAction } from '@/actions/respondHelpOffer';
import type { HelpOfferWithApp, HelpOfferStatus } from '@/lib/types';
import { CheckIcon, LoaderIcon, MailIcon, SearchIcon, XIcon } from '@/components/icons';

interface ProfileInboundManagerProps {
  offers: HelpOfferWithApp[];
}

export function ProfileInboundManager({ offers }: ProfileInboundManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | HelpOfferStatus>('All');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, HelpOfferStatus>>({});
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const appOptions = useMemo(() => {
    const map = new Map<string, string>();
    offers.forEach((o) => {
      if (!map.has(o.appSlug)) {
        map.set(o.appSlug, o.appName);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [offers]);

  const effectiveOffers = useMemo(() => {
    return offers.map((offer) => {
      if (statusOverrides[offer.id]) {
        return { ...offer, status: statusOverrides[offer.id] };
      }
      return offer;
    });
  }, [offers, statusOverrides]);

  const filteredOffers = useMemo(() => {
    return effectiveOffers.filter((offer) => {
      if (statusFilter !== 'All' && offer.status !== statusFilter) return false;
      if (appFilter !== 'All' && offer.appSlug !== appFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = offer.senderName.toLowerCase().includes(q);
        const matchApp = offer.appName.toLowerCase().includes(q);
        const matchMsg = offer.message.toLowerCase().includes(q);
        const matchContact = offer.senderContact.toLowerCase().includes(q);
        if (!matchName && !matchApp && !matchMsg && !matchContact) return false;
      }
      return true;
    });
  }, [effectiveOffers, statusFilter, appFilter, search]);

  const handleRespond = (appSlug: string, offerId: string, status: 'accepted' | 'declined') => {
    setRespondingId(offerId);
    setStatusOverrides((prev) => ({ ...prev, [offerId]: status }));

    startTransition(async () => {
      try {
        const res = await respondHelpOfferAction(appSlug, offerId, status);
        if (res?.error) {
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[offerId];
            return next;
          });
        } else {
          router.refresh();
        }
      } finally {
        setRespondingId(null);
      }
    });
  };

  const pendingCount = effectiveOffers.filter((o) => o.status === 'pending').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Inbound requests ({offers.length})</h2>
          {pendingCount > 0 && (
            <p className="text-xs text-amber-700">
              {pendingCount} {pendingCount === 1 ? 'request requires' : 'requests require'} your
              review
            </p>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests, applicants, or apps..."
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-8 text-xs outline-none focus:border-brand-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as HelpOfferStatus)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500"
            >
              <option value="All">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>

            {appOptions.length > 1 && (
              <select
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500 max-w-[150px] truncate"
              >
                <option value="All">All apps</option>
                {appOptions.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Offer Cards List */}
      {filteredOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <span className="text-2xl">{offers.length === 0 ? '📬' : '🔍'}</span>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            {offers.length === 0 ? 'No inbound requests yet' : 'No requests found'}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {offers.length === 0
              ? 'When community members offer to collaborate on your apps, their requests will appear here.'
              : 'No requests match your current search or filter criteria.'}
          </p>
          {offers.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setAppFilter('All');
              }}
              className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOffers.map((offer) => {
            const isBusy = respondingId === offer.id && isPending;

            return (
              <div
                key={offer.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
              >
                {/* Top header: Target App & Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <Link
                    href={`/apps/${offer.appSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition-colors hover:text-brand-600"
                  >
                    <span>{offer.appEmoji}</span>
                    <span className="truncate">{offer.appName}</span>
                    <span className="text-slate-400 font-normal">&rarr;</span>
                  </Link>

                  <div>
                    {offer.status === 'pending' && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        Pending
                      </span>
                    )}
                    {offer.status === 'accepted' && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Accepted
                      </span>
                    )}
                    {offer.status === 'declined' && (
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Sender Profile & Contact Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {offer.senderAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={offer.senderAvatarUrl}
                        alt={offer.senderName}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase">
                        {offer.senderName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{offer.senderName}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MailIcon className="h-3.5 w-3.5 text-slate-400" />
                        <a
                          href={`mailto:${offer.senderContact}`}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {offer.senderContact}
                        </a>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(offer.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Message */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {offer.message}
                </div>

                {/* Actions / Status Footer */}
                <div className="flex items-center justify-between pt-1">
                  {offer.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleRespond(offer.appSlug, offer.id, 'accepted')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                      >
                        {isBusy ? (
                          <LoaderIcon className="h-3.5 w-3.5" />
                        ) : (
                          <CheckIcon className="h-3.5 w-3.5" />
                        )}
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleRespond(offer.appSlug, offer.id, 'declined')}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  ) : offer.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <CheckIcon className="h-3.5 w-3.5" />
                      Collaborator added to project
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Request declined</span>
                  )}

                  <Link
                    href={`/apps/${offer.appSlug}`}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                  >
                    View app details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


