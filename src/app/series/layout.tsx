import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rajasthani Series',

  description:
    'Watch Rajasthani web series, original shows and regional stories on MAYAD OTT. Discover engaging entertainment from Rajasthan.',

  keywords: [
    'Rajasthani TV Shows',
    'Rajasthani Web Series',
    'Rajasthani Shows',
    'Rajasthan Web Series',
    'Rajasthani OTT',
    'MAYAD Series',
    'MAYAD OTT',
    'Rajasthani Entertainment',
    'Rajasthani Stories',
  ],

  alternates: {
    canonical: 'https://mayad.in/series',
  },

  openGraph: {
    type: 'website',
    title: 'Rajasthani Series | MAYAD OTT',
    description:
      'Watch Rajasthani web series, original shows and regional stories on MAYAD OTT.',
    url: 'https://mayad.in/series',
    siteName: 'MAYAD OTT',
    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD OTT — Rajasthani Series',
      },
    ],
    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Rajasthani Series | MAYAD OTT',
    description:
      'Watch Rajasthani web series, original shows and regional stories on MAYAD OTT.',
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

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}