import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Account Settings',
  description:
    'Manage your MAYAD OTT account settings, subscription, devices and personal account preferences.',

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

export default function AccountSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}