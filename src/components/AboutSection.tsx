'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Film, Globe, Sparkles, Heart, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AboutSection() {
  const { t } = useApp();

  const highlights = [
    { icon: Film, title: 'Rajasthani Cinema', text: 'Empowering local filmmakers and cinematic creators.' },
    { icon: Globe, title: 'Global Distribution', text: 'Reaching the Rajasthani diaspora across 50+ countries.' },
    { icon: Sparkles, title: 'Authentic Language', text: 'Celebrating native Marwari, Mewari & Shekhawati dialects.' },
    { icon: Heart, title: 'Emerging Talent', text: 'Spotlighting actors, singers, writers & folk artistes.' },
  ];

  return (
    <section className="py-20 relative bg-gradient-to-b from-[#050816] via-[#0B0F28] to-[#050816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1226]/80 border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-mayad-royal/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Logo Anchor */}
            <div className="relative w-36 h-12 mb-6">
              <Image
                src="/mayad.jpg"
                alt="MAYAD Brand Logo"
                fill
                className="object-contain object-left"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              {t('aboutTitle')}
            </h2>

            <p className="text-lg sm:text-xl text-mayad-gold font-semibold mb-4">
              {t('aboutSubtitle')}
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {t('aboutContent1')}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 bg-mayad-gold/20 rounded-lg text-mayad-gold">
                    <h.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{h.title}</h4>
                    <p className="text-xs text-mayad-muted mt-0.5">{h.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mayad-gold to-mayad-goldHover text-black font-bold text-base rounded-full shadow-glow-gold hover:scale-105 transition-transform"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Discover MAYAD</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
