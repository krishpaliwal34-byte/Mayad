import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';

import {
  MOVIES_LIST,
  MovieItem,
} from '@/data/movie';

type Genre =
  | 'thriller'
  | 'devotional'
  | 'historical';

const genreInfo: Record<
  Genre,
  {
    title: string;
    subtitle: string;
    description: string;
  }
> = {
  thriller: {
    title: 'Thriller',
    subtitle: 'Mystery & Suspense',
    description:
      'Explore stories filled with suspense, mystery, twists and unforgettable moments.',
  },

  devotional: {
    title: 'Devotional',
    subtitle: 'Faith & Spirituality',
    description:
      'Discover stories inspired by devotion, spirituality, faith and timeless traditions.',
  },

  historical: {
    title: 'Historical',
    subtitle: 'History & Heritage',
    description:
      'Experience stories of history, courage, culture and our rich heritage.',
  },
};

// ============================================================
// DYNAMIC SEO
// ============================================================

interface GenrePageProps {
  params: Promise<{
    genre: string;
  }>;
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { genre } = await params;

  // Invalid genre
  if (
    genre !== 'thriller' &&
    genre !== 'devotional' &&
    genre !== 'historical'
  ) {
    return {
      title: 'Genre Not Found',
      description:
        'The requested genre could not be found on MAYAD OTT.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const currentGenre = genre as Genre;
  const info = genreInfo[currentGenre];

  const title = `${info.title} Movies`;

  const description = `${info.description} Watch ${info.title.toLowerCase()} movies and stories on MAYAD OTT.`;

  return {
    title,

    description,

    keywords: [
      info.title,
      `${info.title} Movies`,
      `Rajasthani ${info.title} Movies`,
      `${info.title} Movies Rajasthan`,
      'Rajasthani Movies',
      'Rajasthani Cinema',
      'MAYAD OTT',
      'Rajasthani Entertainment',
    ],

    alternates: {
      canonical: `https://mayad.in/favorite-genres/${genre}`,
    },

    openGraph: {
      type: 'website',

      title: `${title} | MAYAD OTT`,

      description,

      url: `https://mayad.in/favorite-genres/${genre}`,

      siteName: 'MAYAD OTT',

      images: [
        {
          url: '/mayad.jpg',
          width: 1200,
          height: 630,
          alt: `${info.title} Movies - MAYAD OTT`,
        },
      ],

      locale: 'en_IN',
    },

    twitter: {
      card: 'summary_large_image',

      title: `${title} | MAYAD OTT`,

      description,

      images: ['/mayad.jpg'],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ============================================================
// PAGE
// ============================================================

export default async function GenrePage({
  params,
}: GenrePageProps) {
  const { genre } = await params;

  if (
    genre !== 'thriller' &&
    genre !== 'devotional' &&
    genre !== 'historical'
  ) {
    notFound();
  }

  const currentGenre = genre as Genre;
  const info = genreInfo[currentGenre];

  // Filter movies using the genres array from movie.ts
  const filteredMovies: MovieItem[] = MOVIES_LIST.filter(
    (movie) =>
      movie.genres?.includes(currentGenre)
  );

  return (
    <main className="min-h-screen bg-mayad-bg text-white">

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">

        {/* Background Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-mayad-gold/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <Link
            href="/#favorite-genres"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-mayad-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Favorite Genres
          </Link>

          {/* Heading */}
          <div className="max-w-3xl">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-mayad-gold">
              {info.subtitle}
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold">
              {info.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
              {info.description}
            </p>

            <p className="mt-4 text-sm text-slate-500">
              {filteredMovies.length}{' '}
              {filteredMovies.length === 1
                ? 'movie'
                : 'movies'}{' '}
              available
            </p>

          </div>
        </div>
      </section>

      {/* Movies */}
      <section className="pb-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {filteredMovies.length === 0 ? (
            <div className="py-20 text-center">

              <div className="text-5xl mb-5">
                🎬
              </div>

              <h2 className="text-2xl font-bold text-white">
                No movies found
              </h2>

              <p className="mt-2 text-slate-400">
                There are no movies available in this genre yet.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">

              {filteredMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.slug}`}
                  className="group"
                >

                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#0D1226] border border-white/10">

                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70" />

                    {/* MAYAD Original */}
                    {movie.isOriginal && (
                      <div className="absolute top-3 left-3">
                        <span className="rounded-md bg-mayad-gold px-2 py-1 text-[10px] sm:text-xs font-bold text-black">
                          MAYAD ORIGINAL
                        </span>
                      </div>
                    )}

                    {/* Play */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mayad-gold text-black shadow-lg">
                        <Play
                          className="w-5 h-5 ml-0.5"
                          fill="currentColor"
                        />
                      </div>

                    </div>

                  </div>

                  {/* Movie Info */}
                  <div className="mt-3">

                    <h3 className="font-semibold text-sm sm:text-base text-white truncate group-hover:text-mayad-gold transition-colors">
                      {movie.title}
                    </h3>

                    {movie.originalTitle && (
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 truncate">
                        {movie.originalTitle}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">

                      <span>
                        {movie.year}
                      </span>

                      <span>
                        {movie.duration}
                      </span>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>

    </main>
  );
}