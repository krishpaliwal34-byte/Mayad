'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import { ContentItem } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function SeriesCard({ item }: { item: ContentItem }) {
  const { playVideo } = useApp();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-[#0D1226] border border-white/10 rounded-xl overflow-hidden shadow-md hover:border-mayad-gold/40 transition-all"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <Image
          src={item.backdropUrl || item.posterUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-black/20 to-transparent" />

        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-mayad-gold text-[10px] font-bold rounded-md uppercase border border-white/10">
            {item.category}
          </span>
        </div>

        <button
          onClick={() => playVideo(item)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Play ${item.title}`}
        >
          <div className="w-12 h-12 rounded-full bg-mayad-gold text-black flex items-center justify-center shadow-glow-gold hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-mayad-muted mb-1">
            <span className="text-white font-medium">{item.language}</span>
            {item.year && <span>• {item.year}</span>}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-mayad-gold transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <button
          onClick={() => playVideo(item)}
          className="mt-4 w-full py-2 bg-white/5 hover:bg-mayad-gold hover:text-black text-slate-200 font-semibold text-xs rounded-lg transition-all border border-white/10 flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Stream Series
        </button>
      </div>
    </motion.div>
  );
}
