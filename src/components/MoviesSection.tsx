'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import SectionHeader from './SectionHeader';
import MovieCard from './MovieCard';

import { MOVIES_LIST } from '@/data/movie';
import { useApp } from '@/context/AppContext';

export default function MoviesSection() {
  const { t } = useApp();

  return (
    <section className="py-12 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <SectionHeader
          title={t('mostLikedMovies')}
          subtitle={t('mostLikedSubtitle')}
          viewAllHref="/movies"
        />

        {/* ================= MOVIES GRID ================= */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">

          {MOVIES_LIST.map((movie, idx) => (
            <motion.div
              key={movie.id}
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
                delay: idx * 0.05,
              }}
            >
              {/* Movie → Detail Page */}
              <Link
                href={`/movies/${movie.slug}`}
                className="block"
              >
                <MovieCard item={movie} />
              </Link>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}