import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DP Singh Basni | Founder & CEO of MAYAD',

  description:
    'Learn about DP Singh Basni, Founder & CEO of MAYAD, Rajasthani filmmaker, director, writer, actor and singer. Explore his films, music, creative work and vision for Rajasthani cinema and culture.',

  keywords: [
    'DP Singh Basni',
    'DP Singh Basni Founder',
    'DP Singh Basni CEO',
    'DP Singh Basni MAYAD',
    'DP Singh Basni filmmaker',
    'DP Singh Basni director',
    'DP Singh Basni writer',
    'DP Singh Basni actor',
    'DP Singh Basni singer',
    'MAYAD Founder',
    'MAYAD CEO',
    'MAYAD Studios',
    'MAYAD OTT',
    'Rajasthani filmmaker',
    'Rajasthani director',
    'Rajasthani cinema',
    'Rajasthani movies',
    'Rajasthani films',
    'Rajasthani music',
    'Rajasthan cinema',
    'Rajasthan culture',
    'Vadlya Hindva',
    'Sanwariya Seth',
    'Maa Padmavati',
    'Maa Hadi Rani',
  ],

  authors: [
    {
      name: 'DP Singh Basni',
      url: 'https://mayad.in/founder',
    },
  ],

  creator: 'MAYAD',
  publisher: 'MAYAD',

  applicationName: 'MAYAD OTT',

  category: 'Entertainment',

  alternates: {
    canonical: 'https://mayad.in/founder',
  },

  // ============================================================
  // OPEN GRAPH
  // ============================================================

  openGraph: {
    type: 'profile',

    locale: 'en_IN',

    url: 'https://mayad.in/founder',

    siteName: 'MAYAD OTT',

    title: 'DP Singh Basni | Founder & CEO of MAYAD',

    description:
      'Meet DP Singh Basni, Founder & CEO of MAYAD and a Rajasthani filmmaker, director, writer, actor and singer working to build a digital ecosystem for Rajasthani cinema, music and culture.',

    images: [
      {
        url: '/ceo.jpg',
        width: 1200,
        height: 1500,
        alt: 'DP Singh Basni — Founder & CEO of MAYAD',
      },
    ],
  },

  // ============================================================
  // TWITTER / X
  // ============================================================

  twitter: {
    card: 'summary_large_image',

    title: 'DP Singh Basni | Founder & CEO of MAYAD',

    description:
      'DP Singh Basni is the Founder & CEO of MAYAD and a Rajasthani filmmaker, director, writer, actor and singer.',

    images: ['/ceo.jpg'],
  },

  // ============================================================
  // SEARCH ENGINE
  // ============================================================

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function FounderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}