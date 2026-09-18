import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Parental Controls',
  description:
    'Manage parental controls, security PIN and protected device settings for your MAYAD OTT account.',

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

export default function ParentalControlsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}