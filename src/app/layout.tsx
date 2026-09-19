import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AppProvider } from '@/context/AppContext';
import VideoModal from '@/components/VideoModal';
import SearchModal from '@/components/SearchModal';
import LoginModal from '@/components/LoginModal';
import SubscribeModal from '@/components/SubscribeModal';
import ConditionalLayout from '@/components/ConditionalLayout';
import MobileBottomNav from '@/components/MobileBottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// ============================================================
// MAYAD — GLOBAL SEO METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL('https://mayad.in'),

  title: {
    default: 'MAYAD — Rajasthani Movies, Music & Entertainment',
    template: '%s | MAYAD OTT',
  },

  description:
    'MAYAD is a Rajasthani OTT platform featuring Rajasthani movies, music, folk stories, culture, artists and original entertainment.',

  keywords: [
    'MAYAD',
    'MAYAD OTT',
    'MAYAD Entertainment',
    'Rajasthani OTT',
    'Rajasthani Movies',
    'Rajasthani Cinema',
    'Rajasthani Films',
    'Rajasthani Songs',
    'Rajasthani Music',
    'Rajasthani Web Series',
    'Rajasthani Entertainment',
    'Marwari Movies',
    'Marwari Cinema',
    'Mewari Movies',
    'Rajasthan Culture',
    'Rajasthani Folk Music',
    'Rajasthani Folk Dance',
    'Rajasthan Stories',
    'Vadlya Hindwa',
    'Seth Maharo Sanwariya',
    'Sawariya Seth',
  ],

  authors: [
    {
      name: 'MAYAD',
      url: 'https://mayad.in',
    },
  ],

  creator: 'MAYAD',

  publisher: 'MAYAD',

  applicationName: 'MAYAD OTT',

  category: 'Entertainment',

  alternates: {
    canonical: 'https://mayad.in',
  },

  // ==========================================================
  // OPEN GRAPH
  // ==========================================================

  openGraph: {
    type: 'website',

    locale: 'en_IN',

    url: 'https://mayad.in',

    siteName: 'MAYAD OTT',

    title: 'MAYAD — Rajasthani Movies, Music & Entertainment',

    description:
      'Watch Rajasthani movies, music, folk stories, culture and original entertainment on MAYAD OTT.',

    images: [
      {
        url: '/mayad.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYAD OTT — Rajasthani Movies, Music & Entertainment',
      },
    ],
  },

  // ==========================================================
  // TWITTER / X
  // ==========================================================

  twitter: {
    card: 'summary_large_image',

    title: 'MAYAD — Rajasthani Movies, Music & Entertainment',

    description:
      'Discover Rajasthani movies, music, culture, artists and original entertainment on MAYAD OTT.',

    images: ['/mayad.jpg'],
  },

  // ==========================================================
  // SEARCH ENGINE CRAWLING
  // ==========================================================

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

  // ==========================================================
  // FAVICON / APP ICONS
  // ==========================================================

  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],

    shortcut: ['/favicon.ico'],
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <body
        className="
          bg-mayad-bg
          text-slate-100
          antialiased
          font-sans
          flex
          flex-col
          min-h-screen
          pb-24
          sm:pb-0
        "
      >
        <AppProvider>

          {/* ==================================================
              MAIN WEBSITE LAYOUT
          ================================================== */}

          <ConditionalLayout>
            {children}
          </ConditionalLayout>

          {/* ==================================================
              MOBILE BOTTOM NAVIGATION
              
              Visible only on mobile.
              Hidden automatically on sm and larger screens.
          ================================================== */}

          <MobileBottomNav />

          {/* ==================================================
              GLOBAL MODALS
          ================================================== */}

          <VideoModal />

          <SearchModal />

          <LoginModal />

          <SubscribeModal />

        </AppProvider>
      </body>
    </html>
  );
}