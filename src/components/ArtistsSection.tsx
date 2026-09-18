'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import SectionHeader from './SectionHeader';
import ArtistCard from './ArtistCard';

import { ARTISTS_LIST } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function ArtistsSection() {
  const { t } = useApp();

  return (
    <section className="bg-gradient-to-b from-[#050816] via-[#090D24] to-[#050816] py-12">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <SectionHeader
          title={t('artistsTitle')}
          subtitle={t('artistsSubtitle')}
          viewAllHref="/artists"
        />

        {/* =====================================================
            ARTISTS GRID
        ====================================================== */}

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {ARTISTS_LIST.map((artist, idx) => (

            <motion.div
              key={artist.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: idx * 0.1,
              }}
              className="h-full"
            >

              {/* =================================================
                  ARTIST LINK
              ================================================== */}

              <Link
                href={`/artists/${artist.id}`}
                className="block h-full"
                aria-label={`View ${artist.name} profile`}
              >
                <ArtistCard artist={artist} />
              </Link>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}