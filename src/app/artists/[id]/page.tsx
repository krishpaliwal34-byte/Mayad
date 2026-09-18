import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Calendar,
  Clapperboard,
  Film,
  MapPin,
  Music,
  Play,
  Sparkles,
  User,
} from 'lucide-react';

import { MOVIES_LIST } from '@/data/movie';
import { POPULAR_PERSONALITIES } from '@/data/content';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params;

  const person = POPULAR_PERSONALITIES.find((item) => item.id === id);

  if (!person) {
    notFound();
  }

  // ============================================================
  // ARTIST BIRTH DETAILS
  // ============================================================

  const birthDate = person.dob || 'Not available';
  const birthPlace = person.birthPlace || 'Not available';

  // ============================================================
  // DYNAMIC FILMOGRAPHY
  // ============================================================

  const artistMovies = MOVIES_LIST.filter((movie) =>
    movie.cast?.some(
      (actor) =>
        actor.toLowerCase().trim() === person.name.toLowerCase().trim()
    )
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#02090d] text-white">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#02090d]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={person.imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-top opacity-25 blur-[3px]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#02090d] via-[#02090d]/95 to-[#02090d]/80" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#02090d] via-[#02090d]/45 to-transparent" />
        </div>

        {/* Background Glow */}
        <div className="mayad-glow-1 pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-mayad-gold/10 blur-[130px]" />

        <div className="mayad-glow-2 pointer-events-none absolute right-0 top-10 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-[110px]" />

        {/* Top Line */}
        <div className="mayad-line absolute left-0 right-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-mayad-gold to-transparent" />

        {/* Hero Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">

            {/* ========================================================
                ARTIST PHOTO
            ======================================================== */}

            <div className="mayad-photo mx-auto w-full max-w-[300px] xl:max-w-[340px]">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/15 bg-[#071116] shadow-[0_25px_80px_rgba(0,0,0,0.55)]">

                {/* Only image zoom - NO YELLOW HOVER OVERLAY */}
                <Image
                  src={person.imageUrl}
                  alt={person.name}
                  fill
                  priority
                  sizes="340px"
                  className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                {/* Corner Design */}
                <div className="absolute bottom-4 left-4 z-20 h-8 w-8 border-b-2 border-l-2 border-white/40" />

                <div className="absolute right-4 top-4 z-20 h-8 w-8 border-r-2 border-t-2 border-white/40" />

                {/* Artist Badge */}
                <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5 text-mayad-gold" />
                  MAYAD Artist
                </div>
              </div>
            </div>

            {/* ========================================================
                ARTIST INFORMATION
            ======================================================== */}

            <div className="mayad-info">

              {/* Back Button */}
              <Link
                href="/artists"
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Artists
              </Link>

              {/* Tag */}
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse text-mayad-gold" />

                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-mayad-gold">
                  {person.tag}
                </span>
              </div>

              {/* Artist Name */}
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                {person.name}
              </h1>

              {/* Original Name */}
              {person.originalName && (
                <p className="mt-3 text-base font-medium text-amber-300">
                  {person.originalName}
                </p>
              )}

              {/* Role */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]">
                <User className="h-4 w-4 text-mayad-gold" />
                {person.role}
              </div>

              {/* Bio */}
              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {person.bio || 'Biography details will be updated soon.'}
              </p>

              {/* ======================================================
                  BIRTH DETAILS
              ====================================================== */}

              <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-2">

                {/* Birth Date */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mayad-gold/[0.08]">
                      <Calendar className="h-5 w-5 text-mayad-gold" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Birth Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-white sm:text-base">
                        {birthDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Birth Place */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mayad-gold/[0.08]">
                      <MapPin className="h-5 w-5 text-mayad-gold" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Birth Place
                      </p>

                      <p className="mt-1 text-sm font-bold text-white sm:text-base">
                        {birthPlace}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {person.highlights?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {person.highlights.slice(0, 4).map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-mayad-gold/20 bg-mayad-gold/[0.06] px-5 py-3">
                  <p className="text-2xl font-black text-mayad-gold">
                    {artistMovies.length}
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Movies
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
                  <p className="text-2xl font-black text-white">
                    MAYAD
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MOVIES
      ============================================================ */}

      <section className="relative border-t border-white/[0.06] bg-[#030b10] py-12 sm:py-16">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-mayad-gold/[0.035] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mayad-movies-heading mb-7 flex items-end justify-between gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Clapperboard className="h-4 w-4 text-mayad-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-mayad-gold">
                  Filmography
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Movies & Shows of {person.name}
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Explore content featuring {person.name}
              </p>
            </div>

            <div className="hidden shrink-0 rounded-full border border-mayad-gold/20 bg-mayad-gold/[0.06] px-4 py-2 text-xs font-bold text-mayad-gold sm:block">
              {artistMovies.length}{' '}
              {artistMovies.length === 1 ? 'Movie' : 'Movies'}
            </div>
          </div>

          {/* ========================================================
              MOVIE GRID
          ======================================================== */}

          {artistMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

              {artistMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.slug}`}
                  className="mayad-card group"
                  style={{ animationDelay: `${index * 90}ms` }}
                >

                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-[#081116] shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-mayad-gold/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.55)]">

                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      sizes="(max-width:640px) 45vw, (max-width:768px) 30vw, (max-width:1024px) 22vw, (max-width:1280px) 18vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Poster Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Type */}
                    <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                      {movie.type || 'Movie'}
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-mayad-gold text-black opacity-0 shadow-[0_0_45px_rgba(245,180,40,0.4)] transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </div>
                    </div>

                    {/* Movie Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="line-clamp-1 text-xs font-bold text-white">
                        {movie.title}
                      </p>
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="pt-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors duration-300 group-hover:text-mayad-gold">
                      {movie.title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                      {movie.year && (
                        <>
                          <Calendar className="h-3 w-3" />
                          <span>{movie.year}</span>
                        </>
                      )}

                      {movie.year && movie.duration && (
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                      )}

                      {movie.duration && (
                        <span>{movie.duration}</span>
                      )}
                    </div>

                    {movie.genre && (
                      <p className="mt-1 line-clamp-1 text-[10px] text-mayad-gold/70">
                        {movie.genre}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mayad-empty flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-mayad-gold/10">
                <Film className="h-7 w-7 text-mayad-gold" />
              </div>

              <h3 className="text-xl font-black text-white">
                No Movies Yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Movies featuring {person.name} will appear here when they are
                added to the MAYAD collection.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          ABOUT
      ============================================================ */}

      <section className="border-t border-white/[0.06] bg-[#050c11] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

            {/* About */}
            <div className="mayad-about rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                  <User className="h-5 w-5 text-mayad-gold" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mayad-gold">
                    Artist Profile
                  </p>

                  <h2 className="text-2xl font-black text-white">
                    About {person.name}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-8 text-slate-300 sm:text-base">
                {person.bio || 'Biography details will be updated soon.'}
              </p>
            </div>

            {/* Information Cards */}
            <div className="space-y-4">

              {/* Profession */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                    <User className="h-5 w-5 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Profession
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {person.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Birth Date */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                    <Calendar className="h-5 w-5 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Birth Date
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {birthDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                    <MapPin className="h-5 w-5 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Birth Place
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {birthPlace}
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                    <Film className="h-5 w-5 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Platform
                    </p>

                    <p className="mt-1 font-bold text-white">
                      MAYAD OTT
                    </p>
                  </div>
                </div>
              </div>

              {/* Culture */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                    <Music className="h-5 w-5 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Culture
                    </p>

                    <p className="mt-1 font-bold text-white">
                      Rajasthani
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================
              HIGHLIGHTS
          ======================================================== */}

          {person.highlights?.length > 0 && (
            <div className="mayad-about mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mayad-gold/10">
                  <Award className="h-5 w-5 text-mayad-gold" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mayad-gold">
                    Career
                  </p>

                  <h2 className="text-2xl font-black text-white">
                    Highlights
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {person.highlights.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/movies"
              className="group inline-flex items-center gap-2 rounded-xl bg-mayad-gold px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_35px_rgba(245,180,40,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_45px_rgba(245,180,40,0.2)]"
            >
              <Play className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" />
              Explore MAYAD Content
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`
        @keyframes mayadPhoto {
          from {
            opacity: 0;
            transform: translateX(-35px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes mayadInfo {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes mayadHeading {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes mayadCard {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mayadLine {
          from {
            transform: scaleX(0);
            opacity: 0;
          }

          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes mayadGlow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }

          50% {
            opacity: 0.75;
            transform: scale(1.12);
          }
        }

        .mayad-photo {
          animation: mayadPhoto 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .mayad-info {
          animation: mayadInfo 0.9s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .mayad-movies-heading {
          animation: mayadHeading 0.8s 0.2s ease-out both;
        }

        .mayad-card {
          animation: mayadCard 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .mayad-about {
          animation: mayadHeading 0.8s ease-out both;
        }

        .mayad-line {
          animation: mayadLine 1.4s ease-out forwards;
        }

        .mayad-glow-1 {
          animation: mayadGlow 6s ease-in-out infinite;
        }

        .mayad-glow-2 {
          animation: mayadGlow 8s 1s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mayad-photo,
          .mayad-info,
          .mayad-movies-heading,
          .mayad-card,
          .mayad-about,
          .mayad-line,
          .mayad-glow-1,
          .mayad-glow-2 {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}