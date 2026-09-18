'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Award } from 'lucide-react';
import { FOUNDER_INFO } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function FounderSection() {
  const { t } = useApp();

  return (
    <section className="py-16 relative bg-gradient-to-b from-[#050816] via-[#090E2A] to-[#050816] border-t border-white/5 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-mayad-gold/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-mayad-royal/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mayad-gold/15 border border-mayad-gold/30 text-mayad-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEADERSHIP & VISION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('ceoFounder')}
          </h2>

          <p className="text-sm sm:text-base text-mayad-muted mt-2">
            {t('founderSubtitle')}
          </p>
        </div>

        {/* Main Founder Showcase Card */}
        <div className="bg-[#0D1226]/90 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">

            {/* Left Column: Portrait Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-mayad-gold/40 shadow-glow-gold bg-slate-900 group">

                <Image
                  src={FOUNDER_INFO.imageUrl}
                  alt={FOUNDER_INFO.name}
                  fill
                  sizes="320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-transparent to-transparent opacity-80" />

                {/* Founder Name Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-center">
                  <span className="text-xs font-bold text-mayad-gold uppercase tracking-wider block">
                    {FOUNDER_INFO.role}
                  </span>

                  <h4 className="text-base font-extrabold text-white mt-0.5">
                    {FOUNDER_INFO.name}
                  </h4>
                </div>

              </div>
            </motion.div>

            {/* Right Column: Founder Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >

              {/* Name & Role */}
              <div>
                <span className="text-xs font-extrabold text-mayad-gold uppercase tracking-widest block mb-1">
                  {FOUNDER_INFO.role}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {FOUNDER_INFO.name}

                  {FOUNDER_INFO.originalName && (
                    <span className="block sm:inline text-lg font-normal text-amber-300 sm:ml-3">
                      ({FOUNDER_INFO.originalName})
                    </span>
                  )}
                </h3>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {FOUNDER_INFO.bio}
              </p>

              {/* Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {FOUNDER_INFO.pillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2"
                  >
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-mayad-gold" />
                      {pillar.title}
                    </h5>

                    <p className="text-xs text-mayad-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}