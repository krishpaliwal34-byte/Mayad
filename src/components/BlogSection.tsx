'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { BLOG_POSTS } from '@/data/blog';
import { useApp } from '@/context/AppContext';

export default function BlogSection() {
  const { language, t } = useApp();

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-[#050816] via-[#0D1226] to-[#050816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          title={t('blogsTitle')}
          subtitle={t('blogsSubtitle')}
          viewAllHref="/blogs"
        />

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {BLOG_POSTS.slice(0, 3).map((blog, idx) => {
            const isRaj = language === 'RAJ';
            const title = isRaj ? blog.titleRaj : blog.title;
            const category = isRaj ? blog.categoryRaj : blog.category;
            const excerpt = isRaj ? blog.excerptRaj : blog.excerpt;
            const readTime = isRaj ? blog.readTimeRaj : blog.readTime;

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col h-full bg-[#0D1226]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-mayad-gold/50 hover:shadow-glow-gold hover:-translate-y-1.5"
                >
                  {/* Blog Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={blog.imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-transparent to-transparent opacity-80" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-mayad-gold text-black text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Details */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-mayad-muted mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-mayad-gold" />
                          {blog.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-mayad-gold" />
                          {readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-mayad-gold transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                        {excerpt}
                      </p>
                    </div>

                    {/* Footer / Read More */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        {blog.author}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-mayad-gold group-hover:translate-x-1 transition-transform">
                        <span>{t('readArticle')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
