import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'My Watchlist',
  description:
    'View and manage your saved movies and favourite Rajasthani entertainment on MAYAD OTT.',

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}