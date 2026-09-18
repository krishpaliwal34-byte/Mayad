import type { Metadata } from 'next';
import { MOVIES_LIST } from '@/data/movie';

interface MovieLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: MovieLayoutProps): Promise<Metadata> {
  const { slug } = await params;

  const movie = MOVIES_LIST.find(
    (item) => item.slug === slug
  );

  // ============================================================
  // MOVIE NOT FOUND
  // ============================================================

  if (!movie) {
    return {
      title: 'Movie Not Found',
      description:
        'The requested movie could not be found on MAYAD OTT.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ============================================================
  // MOVIE DATA
  // ============================================================

  const description =
    movie.description ||
    `Watch ${movie.title} on MAYAD OTT. Discover Rajasthani cinema, stories and entertainment from Rajasthan.`;

  const poster = movie.posterUrl || '/mayad.jpg';

  const keywords = [
    movie.title,
    `${movie.title} MAYAD`,
    `${movie.title} movie`,
    `${movie.title} Rajasthani movie`,
    'Rajasthani Movies',
    'Rajasthani Cinema',
    'Rajasthani OTT',
    'MAYAD OTT',
    'Rajasthan Entertainment',
  ];

  // ============================================================
  // METADATA
  // ============================================================

  return {
    title: movie.title,

    description,

    keywords,

    alternates: {
      canonical: `https://mayad.in/movies/${movie.slug}`,
    },

    openGraph: {
      type: 'video.movie',

      title: `${movie.title} | MAYAD OTT`,

      description,

      url: `https://mayad.in/movies/${movie.slug}`,

      siteName: 'MAYAD OTT',

      images: [
        {
          url: poster,
          width: 1200,
          height: 630,
          alt: `${movie.title} - MAYAD OTT`,
        },
      ],

      locale: 'en_IN',

      ...(movie.year
        ? {
            releaseDate: String(movie.year),
          }
        : {}),

      ...(movie.genre || movie.genres
        ? {
            tags: movie.genres || [movie.genre].filter(Boolean),
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',

      title: `${movie.title} | MAYAD OTT`,

      description,

      images: [poster],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },
  };
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}