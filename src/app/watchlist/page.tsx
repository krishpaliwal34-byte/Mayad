'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Play, Trash2, ArrowLeft } from 'lucide-react';

import { useApp } from '@/context/AppContext';
import { MOVIES_LIST } from '@/data/movie';

export default function WatchlistPage() {
  const {
    myList,
    toggleMyList,
  } = useApp();

  // ============================================================
  // GET MOVIES FROM MOVIES_LIST
  // ============================================================

  const watchlistMovies = MOVIES_LIST.filter((movie) =>
  myList.includes(movie.slug)
);

  // ============================================================
  // EMPTY WATCHLIST
  // ============================================================

  if (watchlistMovies.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-24">
          <div className="text-center">

            {/* Icon */}
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-mayad-gold/20 bg-mayad-gold/5">
              <Heart className="h-10 w-10 text-mayad-gold" />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-mayad-gold">
              MY LIST
            </p>

            <h1 className="text-4xl font-black md:text-5xl">
              Your Watchlist is Empty
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50 md:text-base">
              Movies you add to My List will appear here.
              Start exploring MAYAD and save your favourites.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mayad-gold px-7 py-3.5 text-sm font-black text-black transition-all duration-300 hover:scale-105 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore MAYAD
            </Link>

          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // WATCHLIST
  // ============================================================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Top spacing for Navbar */}
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-10">

          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-mayad-gold">
            YOUR COLLECTION
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                My List
              </h1>

              <p className="mt-3 text-sm text-white/50 md:text-base">
                {watchlistMovies.length}{' '}
                {watchlistMovies.length === 1
                  ? 'title'
                  : 'titles'}{' '}
                saved to your list
              </p>
            </div>

            <div className="hidden h-px flex-1 bg-white/10 md:ml-10 md:block" />

          </div>
        </div>

        {/* ====================================================
            MOVIE GRID
        ==================================================== */}

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

          {watchlistMovies.map((movie) => (

            <div
              key={movie.id}
              className="group relative"
            >

              {/* =================================================
                  POSTER
              ================================================= */}

              <Link
                href={`/movies/${movie.slug}`}
                className="relative block overflow-hidden rounded-xl bg-white/5"
              >

                <div className="relative aspect-[2/3] w-full">

                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    sizes="
                      (max-width: 640px) 45vw,
                      (max-width: 768px) 30vw,
                      (max-width: 1024px) 23vw,
                      (max-width: 1280px) 18vw,
                      16vw
                    "
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mayad-gold text-black shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      <Play
                        className="ml-0.5 h-5 w-5 fill-current"
                      />
                    </div>

                  </div>

                </div>

              </Link>

              {/* =================================================
                  REMOVE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                toggleMyList(movie.slug)
                }
                aria-label={`Remove ${movie.title} from My List`}
                className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/80 opacity-100 backdrop-blur-md transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* =================================================
                  MOVIE INFO
              ================================================= */}

              <div className="mt-3">

                <h2 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-mayad-gold">
                  {movie.title}
                </h2>

                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/40">

                  {movie.year && (
                    <span>
                      {movie.year}
                    </span>
                  )}

                  {movie.year &&
                    movie.duration && (
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                    )}

                  {movie.duration && (
                    <span>
                      {movie.duration}
                    </span>
                  )}

                </div>

                {movie.genre && (
                  <p className="mt-1 line-clamp-1 text-[11px] text-mayad-gold/70">
                    {movie.genre}
                  </p>
                )}

              </div>

            </div>

          ))}

        </div>
      </div>
    </main>
  );
}