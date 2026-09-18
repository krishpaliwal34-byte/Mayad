'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useApp } from '@/context/AppContext';
import { MOVIES_LIST, MovieItem } from '@/data/movie';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, playVideo, t } = useApp();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieItem[]>([]);

  // ============================================================
  // SEARCH MOVIES
  // ============================================================

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();

      const filtered = MOVIES_LIST.filter((movie) => {
        const matchesTitle =
          movie.title.toLowerCase().includes(q);

        const matchesOriginalTitle =
          movie.originalTitle?.toLowerCase().includes(q);

        const matchesCategory =
          movie.category?.toLowerCase().includes(q);

        const matchesGenre =
          movie.genre?.toLowerCase().includes(q);

        const matchesLanguage =
          movie.language?.toLowerCase().includes(q);

        const matchesDescription =
          movie.description?.toLowerCase().includes(q);

        return (
          matchesTitle ||
          matchesOriginalTitle ||
          matchesCategory ||
          matchesGenre ||
          matchesLanguage ||
          matchesDescription
        );
      });

      setResults(filtered);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="
            relative
            w-full
            max-w-3xl
            bg-[#0D1226]
            border border-white/10
            rounded-2xl
            overflow-hidden
            shadow-2xl
            z-10
            p-6
          "
        >

          {/* ================================================== */}
          {/* SEARCH BAR */}
          {/* ================================================== */}

          <div className="relative flex items-center mb-6">

            <Search className="
              absolute
              left-4
              w-5 h-5
              text-mayad-gold
            " />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="
                w-full
                bg-[#050816]
                text-white
                placeholder-mayad-muted
                text-base sm:text-lg
                pl-12
                pr-12
                py-4
                rounded-xl
                border border-white/10
                focus:border-mayad-gold
                focus:outline-none
                transition-colors
              "
              autoFocus
            />

            <button
              onClick={closeSearch}
              className="
                absolute
                right-4
                text-mayad-muted
                hover:text-white
                p-1
              "
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* ================================================== */}
          {/* SEARCH OUTPUT */}
          {/* ================================================== */}

          <div className="
            max-h-[60vh]
            overflow-y-auto
            pr-1
            no-scrollbar
            space-y-4
          ">

            {/* Empty Search */}
            {!query.trim() ? (

              <div className="text-center py-10">

                <p className="
                  text-mayad-muted
                  text-sm
                  mb-4
                ">
                  Popular Searches on MAYAD
                </p>

                <div className="
                  flex
                  flex-wrap
                  justify-center
                  gap-2
                ">

                  {[
                    'Vadlya Hindwa',
                    'Seth Maharo Sanwariya',
                    'Maa Padmavati',
                    'Sawariya Seth',
                    'Dada Laad Ladaya',
                  ].map((tag) => (

                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="
                        px-3.5
                        py-1.5
                        rounded-lg
                        bg-white/5
                        hover:bg-mayad-gold/20
                        hover:text-mayad-gold
                        text-xs
                        text-slate-300
                        transition-colors
                        border border-white/5
                      "
                    >
                      {tag}
                    </button>

                  ))}

                </div>

              </div>

            ) : results.length === 0 ? (

              /* No Results */

              <div className="text-center py-12">

                <p className="text-slate-400 text-base">
                  No movies found matching &quot;{query}&quot;
                </p>

                <p className="
                  text-mayad-muted
                  text-xs
                  mt-1
                ">
                  Try searching for a movie title or category.
                </p>

              </div>

            ) : (

              /* Results */

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              ">

                {results.map((movie) => (

                  <div
                    key={movie.id}
                    className="
                      flex
                      items-center
                      gap-4
                      bg-[#050816]
                      p-3
                      rounded-xl
                      border border-white/5
                      hover:border-mayad-gold/40
                      transition-all
                      group
                    "
                  >

                    {/* Poster */}

                    <div className="
                      relative
                      w-16
                      h-20
                      rounded-lg
                      overflow-hidden
                      flex-shrink-0
                      bg-slate-800
                    ">

                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        sizes="64px"
                        className="
                          object-cover
                          group-hover:scale-105
                          transition-transform
                        "
                      />

                    </div>

                    {/* Movie Information */}

                    <div className="
                      flex-grow
                      min-w-0
                    ">

                      {/* Category */}

                      <span className="
                        text-[10px]
                        font-bold
                        text-mayad-gold
                        uppercase
                        tracking-wider
                      ">
                        {movie.category || 'Movie'}
                      </span>

                      {/* Title */}

                      <h4 className="
                        text-white
                        font-semibold
                        text-sm
                        truncate
                        group-hover:text-mayad-gold
                        transition-colors
                      ">
                        {movie.title}
                      </h4>

                      {/* Original Title */}

                      {movie.originalTitle && (
                        <p className="
                          text-slate-400
                          text-xs
                          truncate
                          mt-0.5
                        ">
                          {movie.originalTitle}
                        </p>
                      )}

                      {/* Description */}

                      {movie.description && (
                        <p className="
                          text-mayad-muted
                          text-xs
                          line-clamp-1
                          mt-0.5
                        ">
                          {movie.description}
                        </p>
                      )}

                      {/* Actions */}

                      <div className="
                        flex
                        items-center
                        gap-3
                        mt-2
                      ">

                        {/* Watch */}

                        <button
                          onClick={() => {
                            closeSearch();
                            playVideo(movie);
                          }}
                          className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-mayad-gold
                            hover:underline
                          "
                        >
                          <Play className="
                            w-3 h-3
                            fill-current
                          " />

                          Watch Now
                        </button>

                        {/* Details */}

                        <Link
                          href={`/movies/${movie.slug}`}
                          onClick={closeSearch}
                          className="
                            text-xs
                            text-slate-400
                            hover:text-white
                          "
                        >
                          Details →
                        </Link>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}