import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Sign in to your MAYAD OTT account to watch Rajasthani movies, series, music and premium entertainment.',

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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}