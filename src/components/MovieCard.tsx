'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Check } from 'lucide-react';
import { ContentItem } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function MovieCard({ item }: { item: ContentItem }) {
  const { playVideo, toggleMyList, isInMyList, language, t } = useApp();
  const isSaved = isInMyList(item.id);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-[#0D1226] border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-mayad-gold/50 hover:shadow-glow-gold"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <Image
          src={item.posterUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {item.isOriginal && (
            <span className="px-2 py-0.5 bg-mayad-gold text-black text-[10px] font-extrabold rounded-md shadow-md uppercase tracking-wider">
              {t('mayadOriginal')}
            </span>
          )}
        </div>

        {/* My List Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMyList(item.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md border transition-all ${
            isSaved
              ? 'bg-mayad-gold text-black border-mayad-gold'
              : 'bg-black/60 text-white border-white/20 hover:bg-white/20'
          }`}
          title={isSaved ? 'Remove from My List' : 'Add to My List'}
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={() => playVideo(item)}
            className="w-12 h-12 rounded-full bg-mayad-gold text-black flex items-center justify-center shadow-glow-gold hover:scale-110 transition-transform"
            aria-label={`Play ${item.title}`}
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-grow justify-between bg-[#0D1226]">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-mayad-muted mb-1">
            <span className="text-mayad-gold">{item.category}</span>
            {item.year && <span>{item.year}</span>}
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-mayad-gold transition-colors line-clamp-1">
            {item.title}
          </h3>

          {item.originalTitle && (
            <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
              {item.originalTitle}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            {item.language}
          </span>
          <button
            onClick={() => playVideo(item)}
            className="font-semibold text-mayad-gold hover:underline flex items-center gap-1"
          >
            {t('watchNow')} →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
