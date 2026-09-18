import type { MetadataRoute } from 'next';

import { MOVIES_LIST } from '@/data/movie';
import { POPULAR_PERSONALITIES } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mayad.in';

  // ============================================================
  // STATIC PAGES
  // ============================================================

  const staticPages = [
    '',
    '/about',
    '/movies',
    '/tv-shows',
    '/artists',
    '/culture',
    '/gallery',
    '/blogs',
  ];

  // ============================================================
  // STATIC PAGE SITEMAP
  // ============================================================

  const staticSitemap: MetadataRoute.Sitemap =
    staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency:
        page === '' || page === '/movies'
          ? 'weekly'
          : 'monthly',
      priority:
        page === ''
          ? 1
          : page === '/movies'
            ? 0.9
            : 0.6,
    }));

  // ============================================================
  // MOVIE PAGES
  // ============================================================

  const moviePages: MetadataRoute.Sitemap =
    MOVIES_LIST.map((movie) => ({
      url: `${baseUrl}/movies/${movie.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // ============================================================
  // ARTIST PAGES
  // ============================================================

  const artistPages: MetadataRoute.Sitemap =
    POPULAR_PERSONALITIES.map((artist) => ({
      url: `${baseUrl}/artists/${artist.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // ============================================================
  // FINAL SITEMAP
  // ============================================================

  return [
    ...staticSitemap,
    ...moviePages,
    ...artistPages,
  ];
}