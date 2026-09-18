'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

import { MAYAD_ORIGINALS } from '@/data/movie';
import { useApp } from '@/context/AppContext';

export default function OriginalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playVideo, t } = useApp();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;

      const scrollAmount =
        direction === 'left'
          ? -clientWidth * 0.75
          : clientWidth * 0.75;

      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-[#050816] via-[#0A0E26] to-[#050816] py-16">

      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-mayad-royal/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-mayad-gold/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-mayad-gold/15 px-3 py-1 text-xs font-bold text-mayad-gold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('mayadOriginal')}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t('mayadOriginals')}
            </h2>

            <p className="mt-1 text-sm text-mayad-muted">
              {t('originalsSubtitle')}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="hidden items-center gap-2 sm:flex">

            <button
              type="button"
              onClick={() => scroll('left')}
              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white transition-colors hover:bg-mayad-gold hover:text-black"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white transition-colors hover:bg-mayad-gold hover:text-black"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="
            flex
            gap-6
            overflow-x-auto
            pb-6
            scroll-smooth
            snap-x
            snap-mandatory
            no-scrollbar
          "
        >

          {MAYAD_ORIGINALS.map((item) => (

            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="
                group
                flex-shrink-0
                snap-start
                w-[300px]
                overflow-hidden
                rounded-2xl
                border
                border-white/15
                bg-[#0D1226]
                shadow-2xl
                transition-all
                duration-300
                hover:border-mayad-gold/50
                sm:w-[420px]
                lg:w-[500px]
              "
            >

              {/* =========================================
                  CLICKABLE MOVIE AREA
              ========================================== */}

              <Link
                href={`/movies/${item.slug}`}
                className="block"
              >

                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">

                  <Image
                    src={item.backdropUrl || item.posterUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 300px, 500px"
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-lg bg-gradient-to-r from-mayad-gold to-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-black shadow-glow-gold">
                      {t('mayadOriginal')}
                    </span>
                  </div>

                  {/* View Details */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-mayad-gold px-5 py-2.5 text-sm font-bold text-black shadow-glow-gold">
                      {t('moreInfo')}
                    </span>
                  </div>

                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-6">

                  <div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-mayad-gold">
                      {item.category}
                    </span>

                    <h3 className="mt-1 text-xl font-bold text-white transition-colors group-hover:text-mayad-gold sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {item.description}
                    </p>

                  </div>

                </div>

              </Link>

              {/* =========================================
                  BOTTOM ACTION
              ========================================== */}

              <div className="px-6 pb-6">

                <div className="flex items-center justify-between">

                  <button
                    type="button"
                    onClick={() => playVideo(item)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-mayad-gold
                      px-6
                      py-2.5
                      text-sm
                      font-bold
                      text-black
                      shadow-glow-gold
                      transition-all
                      hover:bg-amber-400
                    "
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Now</span>
                  </button>

                  {item.year && (
                    <span className="text-xs font-semibold text-mayad-muted">
                      {item.year} Release
                    </span>
                  )}

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}