import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Payment History',
  description:
    'View your MAYAD OTT payment history, transactions, payment amounts and payment statuses securely.',

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

export default function PaymentHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}