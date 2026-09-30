'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  const isStandalonePage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname?.startsWith('/artist') ||
    pathname?.startsWith('/artist-portal') ||
    pathname?.startsWith('/admin');

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </>
  );
}