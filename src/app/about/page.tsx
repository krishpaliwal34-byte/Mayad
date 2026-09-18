'use client';

import React from 'react';
import AboutSection from '@/components/AboutSection';
import FounderSection from '@/components/FounderSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-mayad-bg">
      <AboutSection />

      <div id="director" className="scroll-mt-24">
        <FounderSection />
      </div>
    </div>
  );
}