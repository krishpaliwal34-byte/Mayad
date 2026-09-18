'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Info,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

import { HERO_ITEMS } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function Hero() {
  const {
    playVideo,
    toggleMyList,
    isInMyList,
    t,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const activeHero =
    HERO_ITEMS[currentIndex] || HERO_ITEMS[0];

  if (!activeHero) {
    return null;
  }

  const videoUrl =
    activeHero.videoUrl ||
    activeHero.trailerUrl ||
    '';

  const backgroundImage =
    activeHero.bg ||
    activeHero.backdropUrl ||
    activeHero.posterUrl ||
    '';

  const hasVideo =
    videoUrl.trim().length > 0 &&
    !videoError;

  const inMyList = isInMyList(activeHero.slug);

  // ============================================================
  // AUTO SLIDER
  // ============================================================

  useEffect(() => {
    if (
      isHovered ||
      HERO_ITEMS.length <= 1
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => {
        return (prev + 1) % HERO_ITEMS.length;
      });
    }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentIndex, isHovered]);

  // ============================================================
  // VIDEO RESTART WHEN SLIDE CHANGES
  // ============================================================

  useEffect(() => {
    setVideoError(false);

    const video = videoRef.current;

    if (!video || !videoUrl) {
      return;
    }

    video.pause();
    video.currentTime = 0;
    video.load();

    const playVideoBackground = async () => {
      try {
        await video.play();
      } catch {
        // Browser autoplay restriction
      }
    };

    playVideoBackground();
  }, [currentIndex, videoUrl]);

  // ============================================================
  // VIDEO ERROR
  // ============================================================

  const handleVideoError = () => {
    setVideoError(true);
  };

  // ============================================================
  // NEXT
  // ============================================================

  const nextSlide = () => {
    setVideoError(false);

    setCurrentIndex((prev) => {
      return (prev + 1) % HERO_ITEMS.length;
    });
  };

  // ============================================================
  // PREVIOUS
  // ============================================================

  const previousSlide = () => {
    setVideoError(false);

    setCurrentIndex((prev) => {
      return (
        (prev - 1 + HERO_ITEMS.length) %
        HERO_ITEMS.length
      );
    });
  };

  // ============================================================
  // SELECT SLIDE
  // ============================================================

  const selectSlide = (index: number) => {
    setVideoError(false);
    setCurrentIndex(index);
  };

  // ============================================================
  // MUTE
  // ============================================================

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <section
      className="relative h-[82vh] min-h-[650px] max-h-[900px] w-full overflow-hidden bg-[#02090d]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeHero.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-0"
        >
          {/* BACKGROUND IMAGE */}

          {backgroundImage && (
            <Image
              src={backgroundImage}
              alt={activeHero.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}

          {/* BACKGROUND VIDEO */}

          {hasVideo && (
            <video
              ref={videoRef}
              key={`${activeHero.id}-${videoUrl}`}
              src={videoUrl}
              poster={backgroundImage}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              preload="auto"
              onError={handleVideoError}
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
            />
          )}

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 z-20 bg-black/10" />

          {/* LEFT GRADIENT */}

          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

          {/* BOTTOM GRADIENT */}

          <div className="absolute inset-x-0 bottom-0 z-20 h-[38%] bg-gradient-to-t from-[#02090d]/70 via-[#02090d]/20 to-transparent" />

          {/* TOP GRADIENT */}

          <div className="absolute inset-x-0 top-0 z-20 h-48 bg-gradient-to-b from-black/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="relative z-30 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl -translate-y-6 pt-20 sm:-translate-y-8 sm:pt-24 lg:-translate-y-8 lg:pt-10"
            >
              {/* =================================================
                  MAYAD ORIGINAL
              ================================================= */}

              {activeHero.isOriginal && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-mayad-gold/50 bg-black/40 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-mayad-gold backdrop-blur-md sm:text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  MAYAD ORIGINAL
                </div>
              )}

              {/* =================================================
                  TITLE
              ================================================= */}

              <h1 className="max-w-3xl text-4xl font-black leading-[1] tracking-[-0.025em] text-white drop-shadow-[0_5px_30px_rgba(0,0,0,0.95)] sm:text-[46px] md:text-[52px] lg:text-[60px] xl:text-[64px]">
                {activeHero.title}
              </h1>

              {/* =================================================
                  ORIGINAL TITLE
              ================================================= */}

              {activeHero.originalTitle && (
                <h2 className="mt-2 text-xl font-bold text-mayad-gold drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] sm:text-2xl lg:text-3xl">
                  {activeHero.originalTitle}
                </h2>
              )}

              {/* =================================================
                  META
              ================================================= */}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/90 sm:gap-3 sm:text-xs">
                {activeHero.year && (
                  <span className="rounded-md border border-white/15 bg-black/40 px-2 py-1 backdrop-blur-sm">
                    {activeHero.year}
                  </span>
                )}

                <span className="text-mayad-gold">
                  •
                </span>

                <span className="text-mayad-gold">
                  {activeHero.language}
                </span>

                {activeHero.genre && (
                  <>
                    <span className="text-mayad-gold">
                      •
                    </span>

                    <span>
                      {activeHero.genre}
                    </span>
                  </>
                )}

                {activeHero.duration && (
                  <>
                    <span className="text-mayad-gold">
                      •
                    </span>

                    <span>
                      {activeHero.duration}
                    </span>
                  </>
                )}
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <p className="mt-4 max-w-lg text-sm leading-[1.6] text-slate-100 drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)] sm:text-[15px] md:text-base">
                {activeHero.description}
              </p>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-6 flex flex-wrap gap-2.5">
                {/* WATCH */}

                <button
                  onClick={() =>
                    playVideo(activeHero)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-mayad-gold px-5 py-3 text-sm font-extrabold text-black shadow-[0_0_35px_rgba(245,180,40,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(245,180,40,0.4)] active:scale-95 sm:px-6 sm:py-3"
                >
                  <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />

                  {t('watchNow')}
                </button>

                {/* MORE INFO */}

                <Link
                  href={`/movies/${activeHero.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 active:scale-95 sm:px-6 sm:py-3"
                >
                  <Info className="h-4 w-4 text-mayad-gold sm:h-5 sm:w-5" />

                  {t('moreInfo')}
                </Link>

                {/* MY LIST */}

                <button
                  onClick={() =>
                    toggleMyList(activeHero.slug)
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold backdrop-blur-md transition active:scale-95 ${
                    inMyList
                      ? 'border-mayad-gold/60 bg-mayad-gold/15 text-mayad-gold'
                      : 'border-white/25 bg-black/45 text-white hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  {inMyList ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}

                  <span className="hidden sm:inline">
                    {inMyList
                      ? t('inMyList')
                      : t('myList')}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================
          MUTE BUTTON
      ======================================================== */}

      {hasVideo && (
        <button
          onClick={toggleMute}
          aria-label={
            isMuted
              ? 'Unmute video'
              : 'Mute video'
          }
          className="absolute bottom-24 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/15 sm:right-8"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      )}

      {/* ========================================================
          DESKTOP CONTROLS
      ======================================================== */}

      <div className="absolute bottom-3 left-1/2 z-40 hidden w-[78%] max-w-[760px] -translate-x-1/2 items-center gap-2 lg:flex">

        {/* PREVIOUS */}

        <button
          onClick={previousSlide}
          aria-label="Previous"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/15"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* THUMBNAILS */}

        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-full border border-white/10 bg-black/45 p-1.5 backdrop-blur-md">

          {HERO_ITEMS.map(
            (item, index) => {
              const thumbnail =
                item.bg ||
                item.backdropUrl ||
                item.posterUrl ||
                '';

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    selectSlide(index)
                  }
                  aria-label={`Show ${item.title}`}
                  className={`relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                    index === currentIndex
                      ? 'scale-105 border-mayad-gold shadow-[0_0_15px_rgba(245,180,40,0.3)]'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  {thumbnail && (
                    <Image
                      src={thumbnail}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="object-cover object-center"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/20" />
                </button>
              );
            }
          )}

        </div>

        {/* NEXT */}

        <button
          onClick={nextSlide}
          aria-label="Next"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/15"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>

      {/* ========================================================
          MOBILE CONTROLS
      ======================================================== */}

      <div className="absolute bottom-2 right-5 z-40 flex translate-y-2 items-center gap-2 lg:hidden">

        {/* PREVIOUS */}

        <button
          onClick={previousSlide}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* DOTS */}

        <div className="flex max-w-[180px] items-center gap-1.5 overflow-hidden rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">

          {HERO_ITEMS.map(
            (item, index) => (
              <button
                key={item.id}
                onClick={() =>
                  selectSlide(index)
                }
                aria-label={`Show ${item.title}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-mayad-gold'
                    : 'w-2 bg-white/40'
                }`}
              />
            )
          )}

        </div>

        {/* NEXT */}

        <button
          onClick={nextSlide}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>

    </section>
  );
}