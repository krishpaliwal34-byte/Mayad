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

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password';

  if (isAuthPage) {
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