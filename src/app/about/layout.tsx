import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About MAYAD',

  description:
    'Learn about MAYAD, its vision, creative journey and commitment to Rajasthani cinema, stories, music and entertainment.',

  keywords: [
    'About MAYAD',
    'MAYAD OTT',
    'MAYAD Entertainment',
    'MAYAD Studios',
    'Rajasthani Cinema',
    'Rajasthani Entertainment',
    'Rajasthani Movies',
    'Rajasthani Stories',
    'Rajasthan Film',
  ],

  alternates: {
    canonical: 'https://mayad.in/about',
  },

  openGraph: {
    type: 'website',

    title: 'About MAYAD | Rajasthani Cinema & Entertainment',

    description:
      'Learn about MAYAD, its vision, creative journey and commitment to Rajasthani cinema, stories, music and entertainment.',

    url: 'https://mayad.in/about',

    siteName: 'MAYAD OTT',

    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'About MAYAD - Rajasthani Cinema & Entertainment',
      },
    ],

    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'About MAYAD | Rajasthani Cinema & Entertainment',

    description:
      'Learn about MAYAD, its vision, creative journey and commitment to Rajasthani cinema and entertainment.',

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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}