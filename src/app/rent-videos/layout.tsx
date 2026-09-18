import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Rent Videos',
  description:
    'Browse premium MAYAD movies available for rental and enjoy Rajasthani entertainment on demand.',

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

export default function RentVideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}