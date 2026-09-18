import type { Metadata } from 'next';
import { POPULAR_PERSONALITIES } from '@/data/content';

interface ArtistLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArtistLayoutProps): Promise<Metadata> {
  const { id } = await params;

  const artist = POPULAR_PERSONALITIES.find(
    (person) => person.id === id
  );

  // ============================================================
  // ARTIST NOT FOUND
  // ============================================================

  if (!artist) {
    return {
      title: 'Artist Not Found',
      description:
        'The requested artist could not be found on MAYAD OTT.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ============================================================
  // DESCRIPTION
  // ============================================================

  const description =
    artist.bio ||
    `Discover ${artist.name}, their movies, work and journey on MAYAD OTT — a platform for Rajasthani cinema, stories and entertainment.`;

  // ============================================================
  // IMAGE
  // ============================================================

  const image = artist.imageUrl || '/Default.jpg';

  // ============================================================
  // KEYWORDS
  // ============================================================

  const keywords = [
    artist.name,
    `${artist.name} MAYAD`,
    `${artist.name} Rajasthani`,
    `${artist.name} movies`,
    `${artist.name} actor`,
    'Rajasthani Actors',
    'Rajasthani Artists',
    'Rajasthani Cinema',
    'Rajasthani Movies',
    'MAYAD OTT',
  ];

  // ============================================================
  // METADATA
  // ============================================================

  return {
    title: artist.name,

    description,

    keywords,

    alternates: {
      canonical: `https://mayad.in/artists/${artist.id}`,
    },

    openGraph: {
      type: 'profile',

      title: `${artist.name} | MAYAD OTT`,

      description,

      url: `https://mayad.in/artists/${artist.id}`,

      siteName: 'MAYAD OTT',

      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: `${artist.name} - MAYAD OTT`,
        },
      ],

      locale: 'en_IN',
    },

    twitter: {
      card: 'summary_large_image',

      title: `${artist.name} | MAYAD OTT`,

      description,

      images: [image],
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

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}