'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { TOP_5_MOVIES } from '@/data/movie';
import { useApp } from '@/context/AppContext';

export default function Top5() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { t } = useApp();

  // ============================================================
  // TODAY'S TOP 5
  // ============================================================

  const top5 = TOP_5_MOVIES;

  // ============================================================
  // LEFT SCROLL
  // ============================================================

  const scrollLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -270,
      behavior: 'smooth',
    });
  };

  // ============================================================
  // RIGHT SCROLL
  // ============================================================

  const scrollRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: 270,
      behavior: 'smooth',
    });
  };

  // ============================================================
  // DESKTOP WHEEL CONTROL
  //
  // Vertical mouse wheel = PAGE SCROLL
  // Horizontal mouse wheel = BLOCK SLIDER SCROLL
  //
  // Mobile touch scrolling is NOT affected by this.
  // ============================================================

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (window.innerWidth < 640) {
      return;
    }

    // Only stop horizontal wheel movement on desktop.
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
    }
  };

  if (!top5.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#0b0b0d] py-6 sm:py-8 lg:py-10">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 sm:px-8 lg:px-12">
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
          {t('top5ThisWeek')}
        </h2>
      </div>

      {/* =====================================================
          LEFT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={scrollLeft}
        aria-label="Previous"
        className="absolute left-1 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center text-white transition hover:scale-110 sm:flex lg:left-2"
      >
        <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>

      {/* =====================================================
          SLIDER
      ====================================================== */}

      <div
        ref={sliderRef}
        onWheel={handleWheel}
        className="
          mt-4
          flex
          gap-3
          overflow-x-auto
          overflow-y-visible
          px-4
          pb-2
          touch-pan-y
          overscroll-x-contain
          sm:mt-5
          sm:gap-5
          sm:overflow-x-hidden
          sm:px-8
          lg:gap-6
          lg:px-12
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >

        {top5.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.slug}`}
            className="
              group
              relative
              flex
              h-[245px]
              min-w-[175px]
              shrink-0
              items-end
              sm:h-[305px]
              sm:min-w-[225px]
              lg:h-[325px]
              lg:min-w-[240px]
            "
          >

            {/* =================================================
                POSTER
            ================================================== */}

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[76%]
                overflow-hidden
                rounded-lg
                bg-[#17171a]
                shadow-xl
              "
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                sizes="240px"
                draggable={false}
                className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              {/* Poster Gradient */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* =================================================
                NUMBER
            ================================================== */}

            <div
              className="
                relative
                z-10
                -mb-1
                -ml-1
                select-none
                text-[82px]
                font-black
                leading-none
                tracking-[-0.08em]
                text-white
                drop-shadow-[0_6px_9px_rgba(0,0,0,0.85)]
                transition-transform
                duration-500
                group-hover:-translate-y-1
                sm:text-[115px]
                lg:text-[125px]
              "
            >
              {index + 1}
            </div>

          </Link>
        ))}

      </div>

      {/* =====================================================
          RIGHT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={scrollRight}
        aria-label="Next"
        className="absolute right-1 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center text-white transition hover:scale-110 sm:flex lg:right-2"
      >
        <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>

    </section>
  );
}