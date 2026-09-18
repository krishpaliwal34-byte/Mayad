'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog';
import { useApp } from '@/context/AppContext';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const { language, t } = useApp();

  const blog = BLOG_POSTS.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const isRaj = language === 'RAJ';
  const title = isRaj ? blog.titleRaj : blog.title;
  const category = isRaj ? blog.categoryRaj : blog.category;
  const readTime = isRaj ? blog.readTimeRaj : blog.readTime;
  const excerpt = isRaj ? blog.excerptRaj : blog.excerpt;

  const relatedBlogs = BLOG_POSTS.filter((b) => b.id !== blog.id).slice(0, 2);

  return (
    <main className="min-h-screen bg-mayad-bg text-white pt-28 pb-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-mayad-gold transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('backToBlogs')}</span>
        </Link>

        {/* Category & Title */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-mayad-gold/20 text-mayad-gold text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-mayad-gold/30">
            {category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            {excerpt}
          </p>
        </div>

        {/* Author & Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 mb-8 text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mayad-gold/20 border border-mayad-gold/40 flex items-center justify-center text-mayad-gold font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{blog.author}</p>
              <p className="text-xs text-mayad-muted">{blog.authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-mayad-gold" />
              {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-mayad-gold" />
              {readTime}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 border border-white/10 shadow-2xl bg-slate-900">
          <Image
            src={blog.imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="space-y-8 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
          {blog.content.map((section, idx) => {
            const sectionHeading = isRaj ? section.headingRaj : section.heading;
            const paragraphs = isRaj ? section.paragraphsRaj : section.paragraphs;

            return (
              <div key={idx} className="space-y-4">
                {sectionHeading && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 border-l-4 border-mayad-gold pl-4">
                    {sectionHeading}
                  </h2>
                )}
                {paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
          <Tag className="w-4 h-4 text-mayad-gold" />
          <span className="text-xs font-bold uppercase text-slate-400">Tags:</span>
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-medium text-slate-300 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">
              {isRaj ? 'आगे भी पढ़ो' : 'Related Articles'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedBlogs.map((rel) => {
                const relTitle = isRaj ? rel.titleRaj : rel.title;
                const relCategory = isRaj ? rel.categoryRaj : rel.category;

                return (
                  <Link
                    key={rel.id}
                    href={`/blogs/${rel.slug}`}
                    className="group flex gap-4 p-4 rounded-xl bg-[#0D1226] border border-white/10 hover:border-mayad-gold/40 transition-all"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                      <Image
                        src={rel.imageUrl}
                        alt={relTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-mayad-gold uppercase">
                          {relCategory}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-mayad-gold transition-colors line-clamp-2 mt-1">
                          {relTitle}
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-mayad-gold font-semibold">
                        <span>{t('readArticle')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </article>
    </main>
  );
}
