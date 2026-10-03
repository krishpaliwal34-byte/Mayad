'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Maximize2, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { GALLERY_PHOTOS } from '@/data/gallery';

export default function GallerySection() {
  const { language } = useApp();
  const isRaj = language === 'RAJ';

  // Select 4 showcase photos from gallery
  const previewPhotos = GALLERY_PHOTOS.slice(0, 4);

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[#030914] py-14 sm:py-20 lg:py-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-mayad-gold/5 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-mayad-gold shadow-glow-gold sm:text-xs">
              <Camera className="h-3.5 w-3.5" />
              <span>{isRaj ? 'मायड़ फोटो गैलरी' : 'MAYAD GALLERY'}</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {isRaj ? (
                <>
                  देख्यो म्हारी{' '}
                  <span className="bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    फोटो गैलरी
                  </span>
                </>
              ) : (
                <>
                  See Our{' '}
                  <span className="bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    Gallery
                  </span>
                </>
              )}
            </h2>

            <p className="mt-2 max-w-xl text-xs font-medium text-slate-400 sm:text-sm md:text-base">
              {isRaj
                ? 'मायड़ रो ख़ास पल, संस्कृति अर इवेंट्स री ख़ास तस्वीरें।'
                : 'Explore iconic moments, cultural highlights, and behind-the-scenes from MAYAD.'}
            </p>
          </div>

          {/* See More Button Header Desktop */}
          <Link
            href="/gallery"
            className="group hidden items-center gap-2 rounded-full border border-mayad-gold/40 bg-mayad-gold/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-mayad-gold shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-mayad-gold hover:bg-mayad-gold hover:text-black hover:shadow-glow-gold sm:flex sm:text-sm"
          >
            <span>{isRaj ? 'सगळी फोटो देखो' : 'See More'}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Image Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {previewPhotos.map((photo, index) => {
            const title = isRaj ? photo.titleRaj || 'मायड़ फोटो' : photo.title || 'MAYAD Photo';
            const catLabel = isRaj ? photo.categoryLabelRaj : photo.categoryLabel;

            return (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  href="/gallery"
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F24] shadow-xl transition-all duration-500 hover:border-mayad-gold/70 hover:shadow-[0_0_30px_rgba(245,180,40,0.25)]"
                >
                  {/* Background Image */}
                  <Image
                    src={photo.imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Top Gold Border Accent */}
                  <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-mayad-gold transition-transform duration-500 group-hover:scale-x-100" />

                  {/* Category Badge */}
                  <div className="absolute left-3.5 top-3.5 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-mayad-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
                      <Sparkles className="h-3 w-3" />
                      {catLabel}
                    </span>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute right-3.5 top-3.5 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-colors group-hover:bg-mayad-gold group-hover:text-black">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-4 transition-transform duration-300 group-hover:-translate-y-1">
                    {title && (
                      <h3 className="line-clamp-1 text-base font-black text-white sm:text-lg">
                        {title}
                      </h3>
                    )}
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-mayad-gold transition-colors group-hover:text-amber-300">
                      <span>{isRaj ? 'गैलरी में देखो' : 'View in Gallery'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile See More Button */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/gallery"
            className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-mayad-gold/50 bg-mayad-gold px-6 py-3.5 text-center text-sm font-black uppercase tracking-wider text-black shadow-glow-gold transition-all duration-300 hover:scale-105"
          >
            <span>{isRaj ? 'सगळी फोटो देखो' : 'See More'}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
