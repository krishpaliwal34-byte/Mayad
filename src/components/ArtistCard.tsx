'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArtistItem } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function ArtistCard({ artist }: { artist: ArtistItem }) {
  const { language } = useApp();
  const roleDisplay = language === 'RAJ' ? (artist.role === 'Actor' ? 'अभिनेता' : artist.role) : artist.role;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group flex flex-col items-center text-center bg-[#0D1226]/60 border border-white/10 rounded-2xl p-5 hover:border-mayad-gold/40 transition-all shadow-lg"
    >
      {/* Circular Avatar */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3.5 border-2 border-mayad-gold/30 group-hover:border-mayad-gold shadow-glow-gold transition-all">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          sizes="112px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <span className="px-3 py-0.5 bg-mayad-gold/15 text-mayad-gold text-[10px] font-bold uppercase rounded-full tracking-wider mb-1">
        {roleDisplay}
      </span>

      <h4 className="text-base font-bold text-white group-hover:text-mayad-gold transition-colors">
        {artist.name}
      </h4>

      <p className="text-xs text-slate-300 line-clamp-2 mt-1 max-w-[200px]">
        {artist.bio}
      </p>
    </motion.div>
  );
}
