import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Rajasthan Culture & Heritage',
  description:
    'Explore the rich culture and heritage of Rajasthan on MAYAD OTT — Rajasthani language, folk dances, folk music, historic forts, festivals, handicrafts, textiles and traditional cuisine.',

  keywords: [
    'Rajasthan Culture',
    'Rajasthan Heritage',
    'Rajasthani Culture',
    'Rajasthani Heritage',
    'Rajasthani Folk Dance',
    'Rajasthani Folk Music',
    'Ghoomar',
    'Kalbelia',
    'Manganiyar Music',
    'Rajasthan Forts',
    'Rajasthan Festivals',
    'Rajasthani Handicrafts',
    'Rajasthani Cuisine',
    'Rajasthani Language',
    'Rajasthan Tourism',
    'MAYAD Culture',
    'MAYAD OTT',
  ],

  alternates: {
    canonical: 'https://mayad.in/culture',
  },

  openGraph: {
    type: 'website',
    title: 'Rajasthan Culture & Heritage | MAYAD OTT',
    description:
      'Discover the authentic culture, heritage, folk traditions, historic forts, festivals, crafts and cuisine of Rajasthan on MAYAD OTT.',
    url: 'https://mayad.in/culture',
    siteName: 'MAYAD OTT',
    locale: 'en_IN',
    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD OTT — Rajasthan Culture & Heritage',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Rajasthan Culture & Heritage | MAYAD OTT',
    description:
      'Explore Rajasthani culture, folk traditions, heritage, festivals, crafts and cuisine on MAYAD OTT.',
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

export default function CultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}