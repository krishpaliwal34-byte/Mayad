import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Rajasthani Artists & Actors',
  description:
    'Explore Rajasthani actors, artists, singers and creative talents on MAYAD OTT. Discover their profiles, filmography, roles and contributions to Rajasthani cinema and entertainment.',

  keywords: [
    'Rajasthani Actors',
    'Rajasthani Artists',
    'Rajasthani Actors List',
    'Rajasthani Singers',
    'Rajasthani Film Actors',
    'Rajasthani Cinema Artists',
    'Rajasthani Celebrities',
    'Rajasthan Artists',
    'Rajasthani Entertainment',
    'Rajasthani Movies Actors',
    'MAYAD Artists',
    'MAYAD Actors',
    'MAYAD OTT',
  ],

  alternates: {
    canonical: 'https://mayad.in/artists',
  },

  openGraph: {
    type: 'website',
    title: 'Rajasthani Artists & Actors | MAYAD OTT',
    description:
      'Discover Rajasthani actors, artists, singers and creative talents featured across MAYAD OTT and Rajasthani cinema.',
    url: 'https://mayad.in/artists',
    siteName: 'MAYAD OTT',
    locale: 'en_IN',
    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD OTT — Rajasthani Artists & Actors',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Rajasthani Artists & Actors | MAYAD OTT',
    description:
      'Explore artists, actors and creative talents from the world of Rajasthani cinema on MAYAD OTT.',
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
      'max-video-preview': -1,
    },
  },
};

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}