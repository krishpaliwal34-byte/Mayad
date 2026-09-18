import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAYAD Photo Gallery',

  description:
    'Explore the MAYAD photo gallery featuring highlights, special moments, artists and visual stories from MAYAD and Rajasthan.',

  keywords: [
    'MAYAD Gallery',
    'MAYAD Photo Gallery',
    'MAYAD Photos',
    'MAYAD Images',
    'Rajasthan Photos',
    'Rajasthani Artists',
    'Rajasthani Cinema',
    'MAYAD OTT',
    'MAYAD Entertainment',
  ],

  alternates: {
    canonical: 'https://mayad.in/gallery',
  },

  openGraph: {
    type: 'website',

    title: 'MAYAD Photo Gallery | MAYAD OTT',

    description:
      'Explore MAYAD highlights, special moments, artists and visual stories from MAYAD and Rajasthan.',

    url: 'https://mayad.in/gallery',

    siteName: 'MAYAD OTT',

    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD Photo Gallery',
      },
    ],

    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'MAYAD Photo Gallery | MAYAD OTT',

    description:
      'Explore MAYAD highlights, special moments, artists and visual stories from MAYAD and Rajasthan.',

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

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}