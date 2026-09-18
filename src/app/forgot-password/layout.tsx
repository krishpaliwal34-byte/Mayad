import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Reset your MAYAD OTT account password securely using your registered email and verification OTP.',

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

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}