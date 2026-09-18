'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import SeriesCard from './SeriesCard';
import { TV_SHOWS } from '@/data/movie';
import { useApp } from '@/context/AppContext';

export default function SeriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { t } = useApp();

  const categories = ['All', 'Drama', 'Culture', 'Documentary', 'Folk Music'];

  const filteredSeries =
    selectedCategory === 'All'
      ? TV_SHOWS
      : TV_SHOWS.filter(
          (series) =>
            series.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <section className="py-12 bg-mayad-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeader
          title={t('tvShows')}
          subtitle={t('rajasthaniCinemaSubtitle')}
          viewAllHref="/series"
        />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-mayad-gold text-black shadow-glow-gold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSeries.map((series, idx) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
              }}
            >
              <SeriesCard item={series} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}