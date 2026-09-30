'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MOVIES_LIST } from '@/data/movie';
import { useApp } from '@/context/AppContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function MoviesPage() {
  const { t } = useApp();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/movies`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.movies) && data.movies.length > 0) {
          setMovies(data.movies);
        } else {
          setMovies(MOVIES_LIST);
        }
      } catch (err) {
        console.error('Error fetching movies from database:', err);
        setMovies(MOVIES_LIST);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

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

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-mayad-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 mt-3 text-sm font-medium">Loading movies from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">

            {movies.map((movie, index) => {
              const mId = movie._id || movie.id || movie.slug;
              const poster = movie.posterUrl || '/placeholder.jpg';

              return (
                <motion.div
                  key={mId}
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
                        src={poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={poster.startsWith('http')}
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
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}