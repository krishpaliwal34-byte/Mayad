'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MOVIES_LIST } from '@/data/movie';
import { useApp } from '@/context/AppContext';

export default function MoviesPage() {
  const { t } = useApp();

  return (
    <main className="min-h-screen bg-mayad-bg text-white pt-28 pb-20">

      {/* ================= HEADER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-mayad-gold text-sm font-bold uppercase tracking-[0.2em] mb-2">
            {t('rajasthaniEntertainment')}
          </p>

          <h1 className="text-4xl sm:text-5xl font-black text-white">
            {t('moviesTitle')}
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            {t('moviesSubtitle')}
          </p>
        </motion.div>

      </section>

      {/* ================= MOVIES GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">

          {MOVIES_LIST.map((movie, index) => (

            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.04,
              }}
            >

              {/* ================= MOVIE LINK ================= */}
              <Link
                href={`/movies/${movie.slug}`}
                className="group block"
              >

                {/* ================= POSTER ================= */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-900 border border-white/10">

                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* MAYAD ORIGINAL */}
                  {movie.isOriginal && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-mayad-gold text-black text-[10px] font-black rounded-md uppercase tracking-wider">
                        {t('mayadOriginal')}
                      </span>
                    </div>
                  )}

                  {/* View Details */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center px-4 py-2 bg-mayad-gold text-black rounded-full text-xs font-bold">
                      {t('moreInfo')}
                    </span>
                  </div>

                </div>

                {/* ================= MOVIE INFO ================= */}
                <div className="mt-3">

                  <h2 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-mayad-gold transition-colors">
                    {movie.title}
                  </h2>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">

                    {movie.year && (
                      <span>{movie.year}</span>
                    )}

                    {movie.language && (
                      <>
                        <span>•</span>
                        <span>{movie.language}</span>
                      </>
                    )}

                  </div>

                </div>

              </Link>

            </motion.div>

          ))}

        </div>

      </section>

    </main>
  );
}