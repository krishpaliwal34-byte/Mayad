'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Camera, Film, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  _id: string;
  mediaType: 'photo' | 'reel';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  hashtags?: string[];
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ArtistPublicMedia({ artistId }: { artistId: string }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'reel'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (artistId) fetchArtistMedia();
  }, [artistId]);

  const fetchArtistMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/artist-media/public/artist/${artistId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error('Error loading artist portfolio media:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    if (activeTab === 'all') return true;
    return item.mediaType === activeTab;
  });

  if (loading || mediaList.length === 0) {
    if (!loading && mediaList.length === 0) return null; // Hide section if no media
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        Loading artist portfolio & reels...
      </div>
    );
  }

  const selectedItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Camera className="h-6 w-6 text-amber-400" />
            Artist Photos & Reels
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Portfolio photos and video reels submitted by this artist.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex rounded-xl bg-slate-900 border border-white/10 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'all' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'photo' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Photos ({mediaList.filter((m) => m.mediaType === 'photo').length})
          </button>
          <button
            onClick={() => setActiveTab('reel')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'reel' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reels ({mediaList.filter((m) => m.mediaType === 'reel').length})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredMedia.map((item, index) => (
          <div
            key={item._id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-lg transition hover:scale-105 hover:border-amber-400/50"
          >
            {item.mediaType === 'photo' ? (
              <Image
                src={item.mediaUrl}
                alt={item.caption || 'Artist Photo'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            ) : (
              <div className="relative h-full w-full">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.caption || 'Reel Thumbnail'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video src={item.mediaUrl} className="h-full w-full object-cover" muted />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
                    <Play className="h-5 w-5 ml-0.5 fill-current" />
                  </div>
                </div>
              </div>
            )}

            <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-300">
              {item.mediaType}
            </div>

            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition duration-200">
                <p className="line-clamp-2 text-[11px] text-white leading-tight">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
          >
            <X className="h-8 w-8" />
          </button>

          {lightboxIndex! > 0 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex! - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-amber-400 hover:text-slate-950 transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {lightboxIndex! < filteredMedia.length - 1 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex! + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-amber-400 hover:text-slate-950 transition"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="flex flex-col max-w-4xl max-h-[90vh] w-full items-center justify-center">
            <div className="relative aspect-[9/16] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-black">
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

            {selectedItem.caption && (
              <p className="mt-4 text-center text-sm font-medium text-slate-200">
                {selectedItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
