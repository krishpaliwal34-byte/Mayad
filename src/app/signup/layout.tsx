import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Create Your Account',
  description:
    'Create your MAYAD OTT account and start exploring Rajasthani movies, series, music and premium entertainment.',

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

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}