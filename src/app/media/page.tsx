'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Film,
  Sparkles,
  Play,
  X,
  Search,
  Filter,
  User,
  Heart,
  Share2,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PopulatedArtist {
  _id: string;
  fullName?: string;
  stageName?: string;
  category?: string;
  profilePhoto?: string;
  location?: string;
}

interface MediaItem {
  _id: string;
  artist: PopulatedArtist;
  mediaType: 'photo' | 'reel';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  hashtags?: string[];
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function MediaGalleryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'reel'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPublicMedia();
  }, [activeTab]);

  const fetchPublicMedia = async () => {
    try {
      setLoading(true);
      let query = `?limit=100`;
      if (activeTab !== 'all') query += `&mediaType=${activeTab}`;

      const res = await fetch(`${BACKEND_URL}/api/artist-media/public/all${query}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error('Error fetching public media:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const artistObj = typeof item.artist === 'object' ? item.artist : null;
    const artistName = artistObj?.stageName || artistObj?.fullName || '';
    const caption = item.caption || '';
    const category = artistObj?.category || '';
    const tags = item.hashtags?.join(' ') || '';

    return (
      artistName.toLowerCase().includes(q) ||
      caption.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q) ||
      tags.toLowerCase().includes(q)
    );
  });

  const selectedItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4"
          >
            <Sparkles className="h-4 w-4" />
            MAYAD Artist Showcase
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white"
          >
            Media <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Gallery & Reels</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300"
          >
            Discover stunning photos and video reels created by verified MAYAD artists across Rajasthan and India.
          </motion.p>

          {/* Search & Filter Controls */}
          <div className="mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artist, category, hashtag or caption..."
                className="w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-2xl border border-white/10 bg-slate-900/90 p-1.5 backdrop-blur-md w-full sm:w-auto shrink-0 justify-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'photo'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="h-3.5 w-3.5" /> Photos
              </button>
              <button
                onClick={() => setActiveTab('reel')}
                className={`flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'reel'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="h-3.5 w-3.5" /> Reels
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center text-amber-400">
              <Loader2 className="mx-auto h-10 w-10 animate-spin" />
              <p className="mt-3 text-sm text-slate-400">Loading MAYAD artist showcase...</p>
            </div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center">
            <Camera className="h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-xl font-bold text-white">No Media Found</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md">
              {searchQuery ? `No results matching "${searchQuery}"` : 'No media items available in this section yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMedia.map((item, index) => {
              const artistObj = typeof item.artist === 'object' ? item.artist : null;
              const artistName = artistObj?.stageName || artistObj?.fullName || 'MAYAD Artist';
              const artistCategory = artistObj?.category || 'Artist';

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl transition hover:-translate-y-1 hover:border-amber-400/40"
                >
                  {/* Media Content Box */}
                  <div
                    className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-slate-950"
                    onClick={() => setLightboxIndex(index)}
                  >
                    {item.mediaType === 'photo' ? (
                      <Image
                        src={item.mediaUrl}
                        alt={item.caption || artistName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.caption || 'Reel'}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.mediaUrl}
                            className="h-full w-full object-cover"
                            muted
                            preload="metadata"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-xl backdrop-blur-sm group-hover:scale-110 transition duration-300">
                            <Play className="h-7 w-7 ml-1 fill-current" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400 backdrop-blur-md border border-white/10">
                      {item.mediaType === 'photo' ? 'Photo' : 'Reel'}
                    </div>
                  </div>

                  {/* Bottom Artist Card Info */}
                  <div className="flex flex-1 flex-col justify-between p-4 bg-gradient-to-b from-slate-900 to-slate-950">
                    <div>
                      {item.caption && (
                        <p className="line-clamp-2 text-xs font-medium text-slate-200 leading-relaxed mb-3">
                          {item.caption}
                        </p>
                      )}

                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.hashtags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold text-amber-400/90">
                              #{tag.replace(/^#/, '')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Artist Profile Link */}
                    {artistObj && (
                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <Link
                          href={`/artists/${artistObj._id}`}
                          className="flex items-center gap-2.5 group/link hover:opacity-80 transition min-w-0"
                        >
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-400/50 bg-slate-800">
                            <Image
                              src={artistObj.profilePhoto || '/mayad.jpg'}
                              alt={artistName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="truncate text-xs font-bold text-white group-hover/link:text-amber-400 transition">
                              {artistName}
                            </h4>
                            <p className="truncate text-[10px] text-slate-400">
                              {artistCategory}
                            </p>
                          </div>
                        </Link>

                        <Link
                          href={`/artists/${artistObj._id}`}
                          className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-amber-400 hover:text-slate-950 transition"
                          title="View Artist Profile"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Video Reel & Photo Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous / Next Controls */}
          {lightboxIndex! > 0 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex! - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-amber-400 hover:text-slate-950 transition backdrop-blur-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {lightboxIndex! < filteredMedia.length - 1 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex! + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-amber-400 hover:text-slate-950 transition backdrop-blur-md"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="flex flex-col items-center justify-center max-w-4xl w-full max-h-[90vh]">
            <div className="relative aspect-[9/16] max-h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-950 border border-white/10 shadow-2xl">
              {selectedItem.mediaType === 'photo' ? (
                <Image
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.caption || 'Photo'}
                  fill
                  className="object-contain"
                />
              ) : (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Bottom Caption & Artist Details */}
            <div className="mt-4 flex flex-col items-center text-center max-w-lg">
              {selectedItem.caption && (
                <p className="text-sm font-medium text-slate-200">
                  {selectedItem.caption}
                </p>
              )}

              {typeof selectedItem.artist === 'object' && selectedItem.artist && (
                <Link
                  href={`/artists/${selectedItem.artist._id}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition"
                >
                  <User className="h-3.5 w-3.5" />
                  View {selectedItem.artist.stageName || selectedItem.artist.fullName}'s Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
