import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rajasthani Movies',

  description:
    'Watch Rajasthani movies, original films and regional cinema on MAYAD OTT. Discover stories, artists and entertainment from Rajasthan.',

  keywords: [
    'Rajasthani Movies',
    'Rajasthani Films',
    'Rajasthani Cinema',
    'Rajasthani OTT',
    'Marwari Movies',
    'Mewari Movies',
    'Rajasthan Movies',
    'Rajasthani Entertainment',
    'MAYAD Movies',
    'MAYAD OTT',
  ],

  alternates: {
    canonical: 'https://mayad.in/movies',
  },

  openGraph: {
    type: 'website',

    title: 'Rajasthani Movies | MAYAD OTT',

    description:
      'Watch Rajasthani movies, original films and regional cinema on MAYAD OTT.',

    url: 'https://mayad.in/movies',

    siteName: 'MAYAD OTT',

    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD OTT — Rajasthani Movies',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Rajasthani Movies | MAYAD OTT',

    description:
      'Watch Rajasthani movies and regional cinema from Rajasthan on MAYAD OTT.',

    images: ['/mayad.jpg'],
  },
};

export default function MoviesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}