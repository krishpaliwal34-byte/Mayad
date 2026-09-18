'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog';
import { useApp } from '@/context/AppContext';

export default function BlogsPage() {
  const { language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isRaj = language === 'RAJ';

  const filteredBlogs = BLOG_POSTS.filter((blog) => {
    const title = isRaj ? blog.titleRaj : blog.title;
    const category = isRaj ? blog.categoryRaj : blog.category;
    const searchLower = searchTerm.toLowerCase();

    return (
      title.toLowerCase().includes(searchLower) ||
      category.toLowerCase().includes(searchLower) ||
      blog.author.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="min-h-screen bg-mayad-bg text-white pt-28 pb-20">
      
      {/* ================= HEADER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-mayad-gold/15 text-mayad-gold text-xs font-bold rounded-full uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>MAYAD JOURNAL</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white">
              {t('blogsTitle')}
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl text-base sm:text-lg leading-relaxed">
              {t('blogsSubtitle')}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isRaj ? 'ब्लॉग खोजो...' : 'Search articles...'}
              className="w-full pl-11 pr-4 py-3 bg-[#0D1226] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-mayad-gold transition-colors"
            />
          </div>
        </motion.div>
      </section>

      {/* ================= BLOGS GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredBlogs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">
              {isRaj ? 'कोई ब्लॉग नी मिलियो' : 'No articles found'}
            </h3>
            <p className="text-slate-400 mt-2 text-sm">
              {isRaj ? 'कृपया दूजी शब्द सूँ खोजो।' : 'Try searching for another keyword.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog, index) => {
              const title = isRaj ? blog.titleRaj : blog.title;
              const category = isRaj ? blog.categoryRaj : blog.category;
              const excerpt = isRaj ? blog.excerptRaj : blog.excerpt;
              const readTime = isRaj ? blog.readTimeRaj : blog.readTime;

              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group flex flex-col h-full bg-[#0D1226] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-mayad-gold/50 hover:shadow-glow-gold hover:-translate-y-1.5"
                  >
                    {/* Blog Cover */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                      <Image
                        src={blog.imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-mayad-gold text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
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

                        <h2 className="text-xl font-bold text-white group-hover:text-mayad-gold transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h2>

                        <p className="text-sm text-slate-300 line-clamp-3 mt-3 leading-relaxed">
                          {excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
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
        )}
      </section>

    </main>
  );
}
