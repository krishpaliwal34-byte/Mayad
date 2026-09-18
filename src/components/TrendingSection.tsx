'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import SectionHeader from './SectionHeader';
import MovieCard from './MovieCard';

import { useApp } from '@/context/AppContext';
import { TRENDING_MOVIES } from '@/data/movie';

export default function TrendingSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useApp();

  // ============================================================
  // SLIDER CONTROLS
  // ============================================================

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -500,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 500,
        behavior: 'smooth',
      });
    }
  };

  // ============================================================
  // MOVIE DETAIL
  // ============================================================

  const openMovie = (slug: string) => {
    router.push(`/movies/${slug}`);
  };

  return (
    <section
      id="trending"
      className="relative overflow-hidden bg-mayad-bg py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex items-end justify-between gap-4">

          {/* TITLE + SUBTITLE */}

          <div className="flex-1 min-w-0">
            <SectionHeader
              title={t('trendingMovies')}
              subtitle={t('trendingSubtitle')}
            />
          </div>

          {/* =================================================
              DESKTOP VIEW ALL
              ARROWS REMOVED FROM HERE
          ================================================= */}

          <div className="hidden shrink-0 items-center sm:flex">

            <button
              type="button"
              onClick={() => router.push('/movies')}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-mayad-gold transition-all duration-300 hover:gap-2.5 hover:text-white"
            >
              <span>
                View All
              </span>

              <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>

        </div>


        {/* =====================================================
            MOVIE SLIDER
        ====================================================== */}

        <div className="relative">

          {/* =================================================
              LEFT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous movies"
            className="
              absolute
              left-0
              top-1/2
              z-20
              hidden
              h-11
              w-11
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-2xl
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-mayad-gold
              hover:bg-mayad-gold
              hover:text-black
              active:scale-95
              sm:flex
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>


          {/* =================================================
              HORIZONTAL CARDS
          ================================================== */}

          <div
            ref={sliderRef}
            className="
              flex
              gap-4
              overflow-x-auto
              scroll-smooth
              pb-4
              snap-x
              snap-mandatory

              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]

              sm:gap-5
              lg:gap-6
            "
          >

            {TRENDING_MOVIES.map((item, idx) => (

              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                }}
                onClick={() => openMovie(item.slug)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                    openMovie(item.slug);
                  }
                }}
                className="
                  w-[185px]
                  min-w-[185px]
                  shrink-0
                  snap-start
                  cursor-pointer

                  sm:w-[210px]
                  sm:min-w-[210px]

                  md:w-[220px]
                  md:min-w-[220px]

                  lg:w-[230px]
                  lg:min-w-[230px]
                "
              >

                <MovieCard item={item} />

              </motion.div>

            ))}

          </div>


          {/* =================================================
              RIGHT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next movies"
            className="
              absolute
              right-0
              top-1/2
              z-20
              hidden
              h-11
              w-11
              translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-2xl
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-mayad-gold
              hover:bg-mayad-gold
              hover:text-black
              active:scale-95
              sm:flex
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>


        {/* =====================================================
            MOBILE CONTROLS
        ====================================================== */}

        <div className="mt-4 flex items-center justify-between sm:hidden">

          {/* MOBILE VIEW ALL */}

          <button
            type="button"
            onClick={() => router.push('/movies')}
            className="group inline-flex items-center gap-1 text-sm font-bold text-mayad-gold transition-all hover:text-white"
          >
            <span>
              View All
            </span>

            <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>


          {/* MOBILE ARROWS */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous movies"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white
                transition-all
                hover:border-mayad-gold/50
                hover:bg-mayad-gold
                hover:text-black
                active:scale-95
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next movies"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white
                transition-all
                hover:border-mayad-gold/50
                hover:bg-mayad-gold
                hover:text-black
                active:scale-95
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}