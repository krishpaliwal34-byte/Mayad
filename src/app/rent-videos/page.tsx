'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Clock3,
  Crown,
  Lock,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';

import { MOVIES_LIST, type MovieItem } from '@/data/movie';

export default function RentVideosPage() {
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);

  const rentVideos = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return MOVIES_LIST;
    }

    return MOVIES_LIST.filter((movie) => {
      return (
        movie.title.toLowerCase().includes(query) ||
        movie.originalTitle?.toLowerCase().includes(query) ||
        movie.genre?.toLowerCase().includes(query) ||
        movie.language?.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <main className="min-h-screen bg-[#020506] text-white">
      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/4 h-[600px] w-[600px] rounded-full bg-yellow-500/[0.055] blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-amber-400/[0.035] blur-[140px]" />
      </div>

      {/* ============================================================
          PAGE
      ============================================================ */}

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* BACK */}

        <Link
          href="/account-setting"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-mayad-gold"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Account Settings
        </Link>

        {/* ========================================================
            HERO
        ======================================================== */}

        <section className="relative mb-10 overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#171711] via-[#0c0f0e] to-[#050708] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mayad-gold/[0.08] blur-[90px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mayad-gold/20 bg-mayad-gold/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-mayad-gold">
                <Ticket className="h-4 w-4" />
                Rent & Watch
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Rent Videos
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Unlock your favourite MAYAD movies and enjoy premium
                Rajasthani entertainment whenever you want.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-semibold text-slate-300">
                  <Play className="h-4 w-4 text-mayad-gold" />
                  Premium Movies
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-semibold text-slate-300">
                  <Clock3 className="h-4 w-4 text-mayad-gold" />
                  Flexible Viewing
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-mayad-gold" />
                  Secure Access
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:h-36 lg:w-36 lg:shrink-0 lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-mayad-gold/20 lg:bg-mayad-gold/[0.05]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-mayad-gold to-mayad-goldHover text-black shadow-[0_0_50px_rgba(255,193,7,0.2)]">
                <Crown className="h-11 w-11 fill-current" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SEARCH + TITLE
        ======================================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-mayad-gold">
              Available Now
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Unlock Movies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a movie and unlock it to start watching.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="h-11 w-full rounded-full border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-mayad-gold/40 focus:ring-1 focus:ring-mayad-gold/10"
            />
          </div>
        </div>

        {/* ========================================================
            MOVIES
        ======================================================== */}

        {rentVideos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {rentVideos.map((movie) => (
              <RentMovieCard
                key={movie.id}
                movie={movie}
                onRent={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-700" />

            <h3 className="mt-4 text-lg font-bold text-white">
              No movies found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another movie name.
            </p>
          </div>
        )}

        {/* ========================================================
            INFO
        ======================================================== */}

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<Lock className="h-5 w-5" />}
            title="Secure Unlock"
            text="Your rented content stays protected with your MAYAD account."
          />

          <InfoCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Watch Anytime"
            text="Access your unlocked movie according to the rental period."
          />

          <InfoCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Premium Content"
            text="Enjoy selected premium movies from the MAYAD library."
          />
        </section>
      </div>

      {/* ============================================================
          RENT MODAL
      ============================================================ */}

      {selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0a0e0d] shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedMovie(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-black/50 text-slate-400 transition-colors hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative h-56">
              <Image
                src={
                  selectedMovie.backdropUrl ||
                  selectedMovie.posterUrl
                }
                alt={selectedMovie.title}
                fill
                sizes="500px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e0d] via-black/20 to-transparent" />
            </div>

            <div className="p-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-mayad-gold/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-mayad-gold">
                <Ticket className="h-3.5 w-3.5" />
                Rent Video
              </div>

              <h3 className="text-2xl font-black text-white">
                {selectedMovie.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Unlock this movie and start watching premium MAYAD content.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Movie
                  </span>

                  <span className="max-w-[180px] truncate text-sm font-bold text-white">
                    {selectedMovie.title}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Access
                  </span>

                  <span className="text-sm font-bold text-mayad-gold">
                    Premium
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(
                    'Payment and video unlock backend is not connected yet.'
                  );
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-6 py-3.5 text-sm font-black text-black shadow-glow-gold transition-all hover:brightness-110"
              >
                <Lock className="h-4 w-4" />
                Rent & Unlock
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
                Secure payment and rental access will be available once
                the payment backend is connected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STYLES
      ============================================================ */}

      <style jsx>{`
        @keyframes pageFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        main {
          animation: pageFade 0.45s ease-out;
        }
      `}</style>
    </main>
  );
}

/* ================================================================
   RENT MOVIE CARD
================================================================ */

function RentMovieCard({
  movie,
  onRent,
}: {
  movie: MovieItem;
  onRent: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0e0d] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-mayad-gold/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-mayad-gold/20 bg-black/70 px-2.5 py-1 text-[10px] font-bold text-mayad-gold backdrop-blur-md">
          <Lock className="h-3 w-3" />
          RENT
        </div>

        {movie.year && (
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-md">
            {movie.year}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-bold text-white sm:text-base">
          {movie.title}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
          {movie.language && <span>{movie.language}</span>}

          {movie.language && movie.duration && (
            <span className="text-slate-700">•</span>
          )}

          {movie.duration && <span>{movie.duration}</span>}
        </div>

        <button
          type="button"
          onClick={onRent}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-3 py-2.5 text-xs font-black text-black transition-all hover:brightness-110 sm:text-sm"
        >
          <Ticket className="h-4 w-4" />
          Rent Now
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   INFO CARD
================================================================ */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-mayad-gold/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}