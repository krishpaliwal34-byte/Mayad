import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAYAD Journal & Blogs',

  description:
    'Read the latest stories, insights, culture, cinema and entertainment articles from MAYAD and the world of Rajasthani storytelling.',

  keywords: [
    'MAYAD Blog',
    'MAYAD Journal',
    'MAYAD Articles',
    'Rajasthani Blog',
    'Rajasthani Culture Blog',
    'Rajasthani Cinema Blog',
    'Rajasthan Culture',
    'Rajasthani Entertainment',
    'Rajasthani Stories',
    'MAYAD OTT',
  ],

  alternates: {
    canonical: 'https://mayad.in/blogs',
  },

  openGraph: {
    type: 'website',

    title: 'MAYAD Journal & Blogs | MAYAD OTT',

    description:
      'Read stories, insights, culture, cinema and entertainment articles from MAYAD and the world of Rajasthani storytelling.',

    url: 'https://mayad.in/blogs',

    siteName: 'MAYAD OTT',

    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD Journal & Blogs',
      },
    ],

    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'MAYAD Journal & Blogs | MAYAD OTT',

    description:
      'Explore stories, culture, cinema and entertainment articles from MAYAD.',

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

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}