import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'My Profile',
  description:
    'Manage your MAYAD OTT profile, account information, watchlist and entertainment preferences.',

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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}