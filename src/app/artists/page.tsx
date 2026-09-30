'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtistsSection from '@/components/ArtistsSection';

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        {/* ARTISTS DIRECTORY GRID */}
        <ArtistsSection />
      </main>

      <Footer />
    </div>
  );
}