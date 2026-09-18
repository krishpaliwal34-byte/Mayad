'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Camera,
  Layers,
  Sparkles,
  Users,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  Star,
} from 'lucide-react';

import { useApp } from '@/context/AppContext';
import { GALLERY_PHOTOS } from '@/data/gallery';

export default function GalleryPage() {
  const { language } = useApp();

  const isRaj = language === 'RAJ';

  const [activeTab, setActiveTab] =
    useState<string>('all');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [selectedPhotoIndex, setSelectedPhotoIndex] =
    useState<number | null>(null);

  // ========================================================
  // FILTER CATEGORIES
  // ========================================================

  const categories = [
    {
      id: 'all',
      label: 'All Photos',
      labelRaj: 'सगळी फोटो',
    },
    {
      id: 'highlights',
      label: 'Mayad Highlight',
      labelRaj: 'मायड़ हाईलाइट',
    },
    {
      id: 'moments',
      label: 'Mayad Moments',
      labelRaj: 'मायड़ मोमेंट्स',
    },
    {
      id: 'artists',
      label: 'Our Team',
      labelRaj: 'म्हारी टीम',
    },
  ];

  // ========================================================
  // FILTER PHOTOS
  // ========================================================

  const filteredPhotos = GALLERY_PHOTOS.filter(
    (photo) => {
      const matchesTab =
        activeTab === 'all' ||
        photo.category === activeTab;

      const title = isRaj
        ? photo.titleRaj
        : photo.title;

      const desc = isRaj
        ? photo.descriptionRaj
        : photo.description;

      const search =
        searchQuery.toLowerCase().trim();

      const matchesSearch =
        search === '' ||
        title
          .toLowerCase()
          .includes(search) ||
        desc
          .toLowerCase()
          .includes(search) ||
        (photo.location &&
          photo.location
            .toLowerCase()
            .includes(search));

      return (
        matchesTab &&
        matchesSearch
      );
    }
  );

  // ========================================================
  // SELECTED PHOTO
  // ========================================================

  const selectedPhoto =
    selectedPhotoIndex !== null
      ? filteredPhotos[selectedPhotoIndex]
      : null;

  // ========================================================
  // PREVIOUS PHOTO
  // ========================================================

  const handlePrevPhoto = () => {
    if (
      selectedPhotoIndex === null ||
      filteredPhotos.length === 0
    ) {
      return;
    }

    setSelectedPhotoIndex(
      (selectedPhotoIndex -
        1 +
        filteredPhotos.length) %
        filteredPhotos.length
    );
  };

  // ========================================================
  // NEXT PHOTO
  // ========================================================

  const handleNextPhoto = () => {
    if (
      selectedPhotoIndex === null ||
      filteredPhotos.length === 0
    ) {
      return;
    }

    setSelectedPhotoIndex(
      (selectedPhotoIndex + 1) %
        filteredPhotos.length
    );
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <main className="min-h-screen bg-mayad-bg pb-24 pt-28 text-white selection:bg-mayad-gold selection:text-black">

      {/* ========================================================
          HERO BANNER
      ======================================================== */}

      <section className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0D1226] via-[#121936] to-[#050816] p-8 shadow-2xl sm:p-12">

          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-mayad-gold/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            {/* BADGE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-mayad-gold/30 bg-mayad-gold/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-mayad-gold shadow-glow-gold"
            >
              <Camera className="h-4 w-4" />

              <span>
                {isRaj
                  ? 'मायड़ फोटो गैलरी'
                  : 'MAYAD PHOTO GALLERY'}
              </span>

            </motion.div>

            {/* TITLE */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mb-4 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {isRaj ? (
                <>
                  मायड़ और राजस्थान री{' '}

                  <span className="bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    अमर तस्वीरें
                  </span>
                </>
              ) : (
                <>
                  Visual Journey of{' '}

                  <span className="bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    MAYAD & Rajasthan
                  </span>
                </>
              )}
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="text-lg font-medium leading-relaxed text-slate-300"
            >
              {isRaj
                ? 'मायड़ हाईलाइट्स, मोमेंट्स और म्हारी टीम री ख़ास तस्वीरों रो संग्रह।'
                : 'Explore high-resolution moments from MAYAD highlights, special moments, and Our Team.'}
            </motion.p>

          </div>
        </div>

      </section>

      {/* ========================================================
          SEARCH & FILTER
      ======================================================== */}

      <section className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center">

          {/* FILTER TABS */}

          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">

            {categories.map((cat) => {

              const isActive =
                activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveTab(cat.id)
                  }
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                    isActive
                      ? 'scale-105 bg-mayad-gold text-black shadow-glow-gold'
                      : 'border border-white/10 bg-[#0D1226] text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >

                  {cat.id === 'all' && (
                    <Layers className="h-3.5 w-3.5" />
                  )}

                  {cat.id === 'highlights' && (
                    <Star className="h-3.5 w-3.5" />
                  )}

                  {cat.id === 'moments' && (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}

                  {cat.id === 'artists' && (
                    <Users className="h-3.5 w-3.5" />
                  )}

                  <span>
                    {isRaj
                      ? cat.labelRaj
                      : cat.label}
                  </span>

                </button>
              );
            })}

          </div>

          {/* SEARCH */}

          <div className="relative w-full flex-shrink-0 md:w-72">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder={
                isRaj
                  ? 'फोटो खोजो...'
                  : 'Search photos...'
              }
              className="w-full rounded-xl border border-white/10 bg-[#0D1226] py-2.5 pl-11 pr-10 text-xs text-white outline-none transition-colors placeholder:text-slate-400 focus:border-mayad-gold sm:text-sm"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery('')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </div>

        </div>

      </section>

      {/* ========================================================
          GALLERY PHOTO GRID
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {filteredPhotos.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-[#0D1226] py-20 text-center">

            <Camera className="mx-auto mb-4 h-12 w-12 text-mayad-gold opacity-50" />

            <h3 className="text-xl font-bold text-white">
              {isRaj
                ? 'कोई फोटो नी मिली'
                : 'No photos found'}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              {isRaj
                ? 'कृपया दूजी श्रेणी या शब्द सूँ खोजो।'
                : 'Try searching with another keyword or category.'}
            </p>

          </div>

        ) : (

          /*
           * IMPORTANT:
           * Width/layout SAME रखा है.
           * Desktop पर 3 columns ही हैं.
           * सिर्फ height बढ़ाई गई है.
           */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">

            {filteredPhotos.map(
              (photo, index) => {

                const title = isRaj
                  ? photo.titleRaj
                  : photo.title;

                const catLabel = isRaj
                  ? photo.categoryLabelRaj
                  : photo.categoryLabel;

                const desc = isRaj
                  ? photo.descriptionRaj
                  : photo.description;

                return (

                  <motion.div
                    key={photo.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04,
                    }}
                    onClick={() =>
                      setSelectedPhotoIndex(
                        index
                      )
                    }

                    /*
                     * ONLY HEIGHT CHANGE
                     * Same width, taller card.
                     */

                    className="group relative aspect-[16/18] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0D1226] shadow-lg transition-all duration-500 hover:border-mayad-gold/70 hover:shadow-glow-gold"
                  >

                    {/* IMAGE */}

                    <Image
                      src={photo.imageUrl}
                      alt={
                        title ||
                        'MAYAD Photo'
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* GRADIENT OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* GOLD TOP LINE */}

                    <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-mayad-gold transition-transform duration-500 group-hover:scale-x-100" />

                    {/* CATEGORY BADGE */}

                    <div className="absolute left-4 top-4 z-10 translate-y-[-8px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                      <span className="inline-flex rounded-full bg-mayad-gold px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-black shadow-lg">
                        {catLabel}
                      </span>

                    </div>

                    {/* ZOOM BUTTON */}

                    <div className="absolute right-4 top-4 z-10 translate-y-[-8px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-mayad-gold hover:text-black">

                        <Maximize2 className="h-4 w-4" />

                      </div>

                    </div>

                    {/* BOTTOM CONTENT */}

                    {(title || desc) && (

                      <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">

                        {title && (
                          <h3 className="line-clamp-1 text-lg font-black text-white sm:text-xl">
                            {title}
                          </h3>
                        )}

                        {desc && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-300 sm:text-sm">
                            {desc}
                          </p>
                        )}

                      </div>

                    )}

                  </motion.div>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* ========================================================
          LIGHTBOX
      ======================================================== */}

      <AnimatePresence>

        {selectedPhoto &&
          selectedPhotoIndex !== null && (

            <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-6">

              {/* BACKDROP */}

              <div
                className="absolute inset-0"
                onClick={() =>
                  setSelectedPhotoIndex(null)
                }
              />

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setSelectedPhotoIndex(null)
                }
                className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-mayad-gold hover:text-black sm:right-6 sm:top-6"
                aria-label="Close photo"
              >
                <X className="h-6 w-6" />
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-colors hover:bg-mayad-gold hover:text-black sm:left-8"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-colors hover:bg-mayad-gold hover:text-black sm:right-8"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* =================================================
                  LIGHTBOX CONTENT
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="relative z-20 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0D1226] shadow-2xl"
              >

                {/* PHOTO DISPLAY */}

                <div className="relative min-h-[55vh] w-full bg-black sm:min-h-[65vh]">

                  <Image
                    src={
                      selectedPhoto.imageUrl
                    }
                    alt={
                      (isRaj
                        ? selectedPhoto.titleRaj
                        : selectedPhoto.title) ||
                      'MAYAD Photo'
                    }
                    fill
                    className="object-contain"
                    priority
                  />

                </div>

                {/* PHOTO DETAILS */}

                <div className="flex flex-col justify-between gap-4 border-t border-white/10 bg-[#050816] p-5 sm:flex-row sm:items-center sm:p-6">

                  <div>

                    <div className="mb-2 flex flex-wrap items-center gap-3">

                      <span className="rounded-full bg-mayad-gold px-2.5 py-0.5 text-xs font-black uppercase text-black">
                        {isRaj
                          ? selectedPhoto.categoryLabelRaj
                          : selectedPhoto.categoryLabel}
                      </span>

                      {selectedPhoto.location && (

                        <span className="flex items-center gap-1 text-xs font-medium text-amber-300">

                          <MapPin className="h-3.5 w-3.5 text-mayad-gold" />

                          <span>
                            {selectedPhoto.location}
                          </span>

                        </span>

                      )}

                    </div>

                    {(isRaj
                      ? selectedPhoto.titleRaj
                      : selectedPhoto.title) && (

                      <h3 className="text-xl font-black text-white sm:text-2xl">
                        {isRaj
                          ? selectedPhoto.titleRaj
                          : selectedPhoto.title}
                      </h3>

                    )}

                    {(isRaj
                      ? selectedPhoto.descriptionRaj
                      : selectedPhoto.description) && (

                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {isRaj
                          ? selectedPhoto.descriptionRaj
                          : selectedPhoto.description}
                      </p>

                    )}

                  </div>

                  {/* COUNT */}

                  <div className="flex flex-shrink-0 items-center gap-3">

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
                      {selectedPhotoIndex + 1}{' '}
                      /{' '}
                      {filteredPhotos.length}
                    </span>

                  </div>

                </div>

              </motion.div>

            </div>

          )}

      </AnimatePresence>

    </main>
  );
}