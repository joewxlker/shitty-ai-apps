'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { HelpOfferWithApp, HelpOfferStatus } from '@/lib/types';
import { SearchIcon, XIcon } from '@/components/icons';

interface ProfileOutboundManagerProps {
  offers: HelpOfferWithApp[];
}

export function ProfileOutboundManager({ offers }: ProfileOutboundManagerProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | HelpOfferStatus>('All');

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      if (statusFilter !== 'All' && offer.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchApp = offer.appName.toLowerCase().includes(q);
        const matchMsg = offer.message.toLowerCase().includes(q);
        const matchContact = offer.senderContact.toLowerCase().includes(q);
        if (!matchApp && !matchMsg && !matchContact) return false;
      }
      return true;
    });
  }, [offers, statusFilter, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Outbound offers ({offers.length})</h2>
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
              placeholder="Search your sent offers or apps..."
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | HelpOfferStatus)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500"
          >
            <option value="All">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Offers Cards List */}
      {filteredOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <span className="text-2xl">{offers.length === 0 ? '🤝' : '🔍'}</span>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            {offers.length === 0 ? 'No offers sent yet' : 'No offers found'}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {offers.length === 0
              ? 'Find apps needing help on the feed or Need Help section and offer your skills.'
              : 'No sent offers match your current search or filter criteria.'}
          </p>
          {offers.length === 0 ? (
            <Link
              href="/need-help"
              className="mt-3 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
            >
              Browse apps needing help
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
            >
              {/* Top header: App link & status badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <Link
                  href={`/apps/${offer.appSlug}`}
                  className="inline-flex items-center gap-1.5 font-bold text-slate-900 transition-colors hover:text-brand-600"
                >
                  <span className="text-lg">{offer.appEmoji}</span>
                  <span className="truncate">{offer.appName}</span>
                </Link>

                <div>
                  {offer.status === 'pending' && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Pending response
                    </span>
                  )}
                  {offer.status === 'accepted' && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Accepted 🎉
                    </span>
                  )}
                  {offer.status === 'declined' && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      Declined
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="rounded-lg bg-slate-50 p-3 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {offer.message}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span>
                    Contact shared:{' '}
                    <span className="font-medium text-slate-700">{offer.senderContact}</span>
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(offer.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <Link
                  href={`/apps/${offer.appSlug}`}
                  className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  View app &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
