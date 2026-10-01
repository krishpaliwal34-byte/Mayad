
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import SectionHeader from './SectionHeader';
import ArtistCard from './ArtistCard';

import { useApp } from '@/context/AppContext';
import { getApiBaseUrl } from '@/utils/config';

interface Artist {
  id: string;
  slug?: string;

  // Legacy artist fields
  name?: string;
  originalName?: string;
  role?: string;
  imageUrl?: string;
  highlights?: string[];
  dob?: string;
  birthPlace?: string;
  tag?: string;

  // Registered artist fields
  fullName?: string;
  stageName?: string;
  category?: string;
  secondaryCategory?: string;
  experience?: string;
  location?: string;
  languages?: string[];
  bio?: string;
  profilePhoto?: string;
  showreel?: string;
  imdb?: string;
  instagram?: string;
  isVerified?: boolean;
}

export default function ArtistsSection() {
  const { t } = useApp();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError('');

        const apiBase = getApiBaseUrl();
        const response = await fetch(
          `${apiBase}/artist`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.artists)) {
          setArtists(data.artists);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError('Unable to load artists right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#050816] via-[#090D24] to-[#050816] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeader
          title={t('artistsTitle')}
          subtitle={t('artistsSubtitle')}
          viewAllHref="/artists"
        />

        {/* ARTISTS GRID */}

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-gray-400">
            {error}
          </div>
        ) : artists.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No artists available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {artists.map((artist, idx) => {
              // Support both legacy and registered artist formats
              const artistName =
                artist.name ||
                artist.stageName ||
                artist.fullName ||
                'Artist';

              const artistImage =
                artist.imageUrl ||
                artist.profilePhoto ||
                '/mayad.jpg';

              const artistId =
                artist.slug ||
                artist.id;

              const cardArtist = {
                ...artist,
                id: artist.id,
                name: artistName,
                image: artistImage,
                imageUrl: artistImage,
                profilePhoto: artistImage,
                role: artist.role || artist.category || 'Artist',
                highlights: artist.highlights || [],
                bio: artist.bio || '',
              };

              return (
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
                  <Link
                    href={`/artists/${artistId}`}
                    className="block h-full"
                    aria-label={`View ${artistName} profile`}
                  >
                    <ArtistCard artist={cardArtist} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
