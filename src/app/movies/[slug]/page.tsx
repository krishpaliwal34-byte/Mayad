'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import {
  Play,
  Plus,
  Check,
  Calendar,
} from 'lucide-react';

import MovieCard from '@/components/MovieCard';
import { MOVIES_LIST } from '@/data/movie';
import { POPULAR_PERSONALITIES } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    playVideo,
    toggleMyList,
    isInMyList,
  } = useApp();

  // ============================================================
  // FIND MOVIE
  // ============================================================

  const movie = MOVIES_LIST.find(
    (item) => item.slug === slug
  );

  // ============================================================
  // MOVIE NOT FOUND
  // ============================================================

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-mayad-bg px-4 text-white">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold">
            Movie Not Found
          </h1>

          <p className="mb-6 text-slate-400">
            The movie you are looking for does not exist.
          </p>

          <Link
            href="/movies"
            className="inline-flex rounded-full bg-mayad-gold px-6 py-3 font-bold text-black transition hover:brightness-110"
          >
            ← Back to Movies
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // MY LIST
  // ============================================================

  const isSaved = isInMyList(movie.id);

  // ============================================================
  // CAST MEMBERS
  // ============================================================

  const castMembers =
    movie.cast?.map((castName) => {
      const person = POPULAR_PERSONALITIES.find(
        (item) =>
          item.name.toLowerCase().trim() ===
          castName.toLowerCase().trim()
      );

      return {
        name: castName,
        image: person?.imageUrl || '/Default.jpg',
        id: person?.id,
      };
    }) || [];

  // ============================================================
  // RECOMMENDATIONS
  // ============================================================

  const recommendations = MOVIES_LIST.filter(
    (item) => item.id !== movie.id
  );

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-mayad-bg pt-16 text-white">

      {/* ======================================================
          BACKDROP HERO
      ====================================================== */}

      <section className="relative h-[50vh] min-h-[340px] max-h-[540px] w-full overflow-hidden sm:h-[54vh] lg:h-[56vh]">

        {/* BACKGROUND IMAGE */}

        <Image
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-black/30" />

        {/* LEFT DARK GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/85 via-[#050816]/35 to-transparent" />

        {/* BOTTOM GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/45 to-transparent" />

        {/* TOP GRADIENT */}

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

      </section>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="relative z-10 mx-auto -mt-28 max-w-7xl px-4 pb-16 sm:-mt-32 sm:px-6 lg:-mt-36 lg:px-8">

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-9">

          {/* ==================================================
              POSTER
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="lg:col-span-3 flex justify-center lg:justify-start"
          >

            {/* ==================================================
                POSTER

                Compact size
                Correct 2:3 ratio
                No crop
            ================================================== */}

            <div className="relative aspect-[2/3] w-[190px] overflow-hidden rounded-xl border border-white/10 bg-[#080C18] shadow-2xl sm:w-[210px] lg:w-[230px] xl:w-[240px]">

              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 640px) 190px, (max-width: 768px) 210px, (max-width: 1280px) 230px, 240px"
                className="object-contain"
              />

              {/* POSTER BORDER */}

              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

              {/* MAYAD ORIGINAL */}

              {movie.isOriginal && (
                <div className="absolute left-3 top-3">
                  <span className="rounded-md bg-mayad-gold px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-black shadow-glow-gold sm:text-[10px]">
                    MAYAD ORIGINAL
                  </span>
                </div>
              )}

            </div>

          </motion.div>


          {/* ==================================================
              MOVIE INFORMATION
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.08,
            }}
            className="lg:col-span-9"
          >

            {/* ==================================================
                META
            ================================================== */}

            <div className="mb-2.5 flex flex-wrap items-center gap-2">

              {movie.category && (
                <span className="rounded-md border border-mayad-gold/30 bg-mayad-gold/15 px-2.5 py-1 text-[10px] font-bold text-mayad-gold">
                  {movie.category}
                </span>
              )}

              {movie.language && (
                <span className="text-xs text-slate-300">
                  • {movie.language}
                </span>
              )}

              {movie.year && (
                <span className="flex items-center gap-1 text-xs text-slate-300">
                  <Calendar className="h-3.5 w-3.5 text-mayad-gold" />
                  {movie.year}
                </span>
              )}

              {movie.duration && (
                <span className="text-xs text-slate-300">
                  • {movie.duration}
                </span>
              )}

            </div>


            {/* ==================================================
                TITLE
            ================================================== */}

            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[46px]">
              {movie.title}
            </h1>


            {/* ==================================================
                ORIGINAL TITLE
            ================================================== */}

            {movie.originalTitle && (
              <p className="mt-1 text-lg font-semibold text-mayad-gold sm:text-xl">
                {movie.originalTitle}
              </p>
            )}


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            {movie.description && (
              <p className="mt-3 max-w-3xl text-sm leading-[1.55] text-slate-300 sm:text-[15px]">
                {movie.description}
              </p>
            )}


            {/* ==================================================
                CAST INFO
            ================================================== */}

            <div className="mt-4 max-w-3xl">

              <div className="rounded-xl border border-white/10 bg-[#0D1226] px-4 py-3">

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Cast
                </span>

                <p className="mt-1 text-sm font-semibold text-white">
                  {castMembers.length
                    ? `${castMembers.length} ${
                        castMembers.length === 1
                          ? 'Artist'
                          : 'Artists'
                      }`
                    : 'Cast information not available'}
                </p>

              </div>

            </div>


            {/* ==================================================
                CAST & CREW
            ================================================== */}

            {castMembers.length > 0 && (
              <div className="mt-5">

                <div className="mb-3 flex items-center gap-2.5">

                  <span className="h-6 w-1.5 rounded-full bg-mayad-gold" />

                  <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                    Cast & Crew
                  </h2>

                </div>


                <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide sm:gap-6">

                  {castMembers.map((person, index) => (

                    <motion.div
                      key={`${person.name}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="group shrink-0 text-center"
                    >

                      {person.id ? (

                        <Link
                          href={`/artists/${person.id}`}
                          className="block"
                        >

                          {/* ARTIST IMAGE */}

                          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-[#0D1226] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-mayad-gold group-hover:shadow-[0_0_20px_rgba(255,193,7,0.25)] sm:h-24 sm:w-24">

                            <Image
                              src={person.image}
                              alt={person.name}
                              fill
                              sizes="96px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                          </div>

                          <p className="mx-auto mt-2 max-w-24 text-xs font-bold text-white transition-colors group-hover:text-mayad-gold sm:text-sm">
                            {person.name}
                          </p>

                        </Link>

                      ) : (

                        <div>

                          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-[#0D1226] shadow-lg sm:h-24 sm:w-24">

                            <Image
                              src={person.image}
                              alt={person.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />

                          </div>

                          <p className="mx-auto mt-2 max-w-24 text-xs font-bold text-white sm:text-sm">
                            {person.name}
                          </p>

                        </div>

                      )}

                    </motion.div>

                  ))}

                </div>

              </div>
            )}


            {/* ==================================================
                DIRECTOR
            ================================================== */}

            <div
              id="director"
              className="mt-5 scroll-mt-24"
            >

              <div className="mb-3 flex items-center gap-2.5">

                <span className="h-6 w-1.5 rounded-full bg-mayad-gold" />

                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  Director
                </h2>

              </div>


              <Link
                href="/about#director"
                className="group inline-block"
              >

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                >

                  {/* DIRECTOR IMAGE */}

                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-[#0D1226] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-mayad-gold group-hover:shadow-[0_0_20px_rgba(255,193,7,0.25)] sm:h-24 sm:w-24">

                    <Image
                      src="/ceo.jpg"
                      alt="MAYAD Original Team"
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-2 text-center text-xs font-bold text-white transition-colors group-hover:text-mayad-gold sm:text-sm">
                    MAYAD Original Team
                  </p>

                  <p className="mt-0.5 text-center text-[10px] text-slate-500">
                    Director
                  </p>

                </motion.div>

              </Link>

            </div>


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="mt-5 flex flex-wrap items-center gap-3">

              {/* WATCH NOW */}

              <button
                onClick={() => playVideo(movie)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-6 py-3 text-sm font-bold text-black shadow-glow-gold transition-transform hover:scale-105"
              >
                <Play className="h-4 w-4 fill-current" />

                Watch Now
              </button>


              {/* MY LIST */}

              <button
                onClick={() => toggleMyList(movie.id)}
                className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                  isSaved
                    ? 'border-mayad-gold bg-mayad-gold/20 text-mayad-gold'
                    : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                }`}
              >

                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" />
                    In My List
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    My List
                  </>
                )}

              </button>

            </div>

          </motion.div>

        </div>


        {/* ======================================================
            MORE LIKE THIS
        ====================================================== */}

        {recommendations.length > 0 && (
          <section className="mt-12">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-white sm:text-2xl">

                <span className="h-6 w-1.5 rounded-full bg-mayad-gold" />

                More Like This

              </h2>

              <Link
                href="/movies"
                className="text-xs font-semibold text-mayad-gold hover:underline sm:text-sm"
              >
                View All →
              </Link>

            </div>


            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">

              {recommendations
                .slice(0, 5)
                .map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                  />
                ))}

            </div>

          </section>
        )}

      </section>

    </main>
  );
}