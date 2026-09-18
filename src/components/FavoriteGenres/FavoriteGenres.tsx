'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clapperboard,
  Sparkles,
  Landmark,
  ArrowRight,
} from 'lucide-react';

import { useApp } from '@/context/AppContext';

const genres = [
  {
    titleKey: 'thrillerTitle' as const,
    subtitleKey: 'thrillerSub' as const,
    descKey: 'thrillerDesc' as const,
    image: '/Thriller.jpg',
    icon: Clapperboard,
    slug: 'thriller',
  },
  {
    titleKey: 'devotionalTitle' as const,
    subtitleKey: 'devotionalSub' as const,
    descKey: 'devotionalDesc' as const,
    image: '/devotional.jpg',
    icon: Sparkles,
    slug: 'devotional',
  },
  {
    titleKey: 'historicalTitle' as const,
    subtitleKey: 'historicalSub' as const,
    descKey: 'historicalDesc' as const,
    image: '/historical.jpg',
    icon: Landmark,
    slug: 'historical',
  },
];

export default function FavoriteGenres() {
  const { t } = useApp();

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-mayad-bg" id="favorite-genres">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-mayad-gold">
            {t('exploreByGenre')}
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {t('favoriteGenres')}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-400">
            {t('favoriteGenresSubtitle')}
          </p>
        </div>

        {/* Genre Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">

          {genres.map((genre, index) => {
            const Icon = genre.icon;
            const title = t(genre.titleKey);
            const subtitle = t(genre.subtitleKey);
            const description = t(genre.descKey);

            return (
              <motion.div
                key={genre.slug}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.1,
                }}
              >
                <Link
                  href={`/favorite-genres/${genre.slug}`}
                  className="group relative block h-64 sm:h-72 lg:h-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1226] transition-all duration-300 hover:border-mayad-gold/50 hover:-translate-y-1 hover:shadow-glow-gold"
                >

                  {/* Background Image */}
                  <Image
                    src={genre.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                  {/* Gold Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-mayad-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
                    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 transition-all duration-300 group-hover:bg-mayad-gold/20 group-hover:border-mayad-gold/40 group-hover:scale-110">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-mayad-gold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">

                    <p className="text-xs font-semibold uppercase tracking-widest text-mayad-gold">
                      {subtitle}
                    </p>

                    <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-[300px] text-sm text-slate-300 leading-relaxed">
                      {description}
                    </p>

                    {/* Explore */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="transition-colors group-hover:text-mayad-gold">
                        {t('watchNow')}
                      </span>

                      <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-mayad-gold" />
                    </div>

                  </div>

                  {/* Bottom Gold Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mayad-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                </Link>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}