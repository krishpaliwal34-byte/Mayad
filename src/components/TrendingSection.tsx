'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import SectionHeader from './SectionHeader';
import MovieCard from './MovieCard';

import { useApp } from '@/context/AppContext';
import { MOVIES_LIST } from '@/data/movie';

interface Movie {
  _id: string;
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  movieUrl?: string;
  type: 'movie' | 'series';
  category?: string;
  language?: string;
  year?: number;
  duration?: string;
  genre?: string;
  genres?: string[];
  description?: string;
  cast?: string[];
  director?: string;
  isOriginal?: boolean;
  isTrending?: boolean;
  isTop5?: boolean;
  likes?: number;
}

export default function TrendingSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useApp();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ============================================================
  // FETCH TRENDING MOVIES FROM MONGODB
  // ============================================================

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          'http://localhost:5000/api/movies/trending',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch trending movies');
        }

        const data = await response.json();

        if (
          data.success &&
          Array.isArray(data.movies) &&
          data.movies.length > 0
        ) {
          setMovies(
            data.movies.map((m: any) => ({
              ...m,
              id: m.id || m._id,
              movieUrl: m.movieUrl || '',
            }))
          );
        } else {
          const fallback = MOVIES_LIST
            .filter(
              (m) =>
                m.isTrending ||
                m.isOriginal
            )
            .map((m: any) => ({
              ...m,
              _id: m.id,
              id: m.id,
              movieUrl: m.movieUrl || '',
            }));

          setMovies(fallback as Movie[]);
        }
      } catch (err) {
        console.error(
          'Trending Movies API Error:',
          err
        );

        const fallback = MOVIES_LIST
          .filter(
            (m) =>
              m.isTrending ||
              m.isOriginal
          )
          .map((m: any) => ({
            ...m,
            _id: m.id,
            id: m.id,
            movieUrl: m.movieUrl || '',
          }));

        setMovies(fallback as Movie[]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // ============================================================
  // SLIDER CONTROLS
  // ============================================================

  const scrollLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -500,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: 500,
      behavior: 'smooth',
    });
  };

  // ============================================================
  // OPEN MOVIE URL
  // ============================================================

  const openMovie = (movie: Movie) => {
    const customUrl =
      movie.movieUrl?.trim();

    // ==========================================================
    // CUSTOM URL FROM MONGODB
    // ==========================================================

    if (customUrl) {
      // External URL
      if (
        customUrl.startsWith('http://') ||
        customUrl.startsWith('https://')
      ) {
        window.location.assign(customUrl);
        return;
      }

      // Internal URL
      if (customUrl.startsWith('/')) {
        router.push(customUrl);
        return;
      }

      // URL without /
      router.push(`/${customUrl}`);
      return;
    }

    // ==========================================================
    // FALLBACK
    // ==========================================================

    router.push(
      `/movies/${encodeURIComponent(
        movie.slug
      )}`
    );
  };

  // ============================================================
  // HANDLE ANY CLICK INSIDE MOVIE CARD
  // ============================================================

  const handleMovieClick = (
    event: React.MouseEvent<HTMLDivElement>,
    movie: Movie
  ) => {
    /*
     * IMPORTANT:
     *
     * MovieCard ke andar:
     * - image
     * - title
     * - Play icon
     * - Watch Now
     * - internal Link
     *
     * sab ho sakte hain.
     *
     * Isliye hum capture phase me event pakad rahe hain.
     */

    event.preventDefault();
    event.stopPropagation();

    openMovie(movie);
  };

  // ============================================================
  // KEYBOARD
  // ============================================================

  const handleMovieKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    movie: Movie
  ) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    openMovie(movie);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <section
        id="trending"
        className="
          relative
          overflow-hidden
          bg-mayad-bg
          py-12
          sm:py-16
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <SectionHeader
            title={t('trendingMovies')}
            subtitle={t('trendingSubtitle')}
          />

          <p className="mt-6 text-sm text-gray-400">
            Loading trending movies...
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY / ERROR
  // ============================================================

  if (
    error ||
    movies.length === 0
  ) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      id="trending"
      className="
        relative
        overflow-hidden
        bg-mayad-bg
        py-12
        sm:py-16
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mb-7
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div className="flex-1 min-w-0">
            <SectionHeader
              title={t('trendingMovies')}
              subtitle={t('trendingSubtitle')}
            />
          </div>

          {/* DESKTOP VIEW ALL */}

          <div
            className="
              hidden
              shrink-0
              items-center
              sm:flex
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push('/movies')
              }
              className="
                group
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-bold
                text-mayad-gold
                transition-all
                duration-300
                hover:gap-2.5
                hover:text-white
              "
            >
              <span>
                View All
              </span>

              <span
                className="
                  text-lg
                  leading-none
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================
            MOVIE SLIDER
        ====================================================== */}

        <div className="relative">

          {/* LEFT BUTTON */}

          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous movies"
            className="
              absolute
              left-0
              top-1/2
              z-20
              hidden
              h-11
              w-11
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-2xl
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-mayad-gold
              hover:bg-mayad-gold
              hover:text-black
              active:scale-95
              sm:flex
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* ====================================================
              MOVIE CARDS
          ==================================================== */}

          <div
            ref={sliderRef}
            className="
              flex
              gap-4
              overflow-x-auto
              scroll-smooth
              pb-4
              snap-x
              snap-mandatory
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              sm:gap-5
              lg:gap-6
            "
          >

            {movies.map(
              (item, idx) => (
                <motion.div
                  key={
                    item._id ||
                    item.slug
                  }

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
                    delay:
                      idx * 0.06,
                  }}

                  /*
                   * VERY IMPORTANT
                   *
                   * onClickCapture means:
                   * MovieCard ke andar jo bhi
                   * Link/button click hoga,
                   * parent capture phase me
                   * usse pehle event pakad lega.
                   *
                   * Isse old /movie-details URL
                   * open nahi hoga.
                   */

                  onClickCapture={(
                    event
                  ) =>
                    handleMovieClick(
                      event,
                      item
                    )
                  }

                  onKeyDown={(
                    event
                  ) =>
                    handleMovieKeyDown(
                      event,
                      item
                    )
                  }

                  role="link"
                  tabIndex={0}

                  className="
                    w-[185px]
                    min-w-[185px]
                    shrink-0
                    snap-start
                    cursor-pointer
                    sm:w-[210px]
                    sm:min-w-[210px]
                    md:w-[220px]
                    md:min-w-[220px]
                    lg:w-[230px]
                    lg:min-w-[230px]
                  "
                >
                  <MovieCard
                    item={item}
                  />
                </motion.div>
              )
            )}

          </div>

          {/* RIGHT BUTTON */}

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next movies"
            className="
              absolute
              right-0
              top-1/2
              z-20
              hidden
              h-11
              w-11
              translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/80
              text-white
              shadow-2xl
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-mayad-gold
              hover:bg-mayad-gold
              hover:text-black
              active:scale-95
              sm:flex
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

        {/* ======================================================
            MOBILE CONTROLS
        ====================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            sm:hidden
          "
        >

          {/* VIEW ALL */}

          <button
            type="button"
            onClick={() =>
              router.push('/movies')
            }
            className="
              group
              inline-flex
              items-center
              gap-1
              text-sm
              font-bold
              text-mayad-gold
              transition-all
              hover:text-white
            "
          >
            <span>
              View All
            </span>

            <span
              className="
                text-base
                leading-none
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>

          {/* MOBILE ARROWS */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous movies"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white
                transition-all
                hover:border-mayad-gold/50
                hover:bg-mayad-gold
                hover:text-black
                active:scale-95
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next movies"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white
                transition-all
                hover:border-mayad-gold/50
                hover:bg-mayad-gold
                hover:text-black
                active:scale-95
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}