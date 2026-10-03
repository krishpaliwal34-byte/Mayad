'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowRight,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getStoredFaqs, FAQItem } from '@/data/faqData';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  useEffect(() => {
    const loadFaqs = () => {
      setFaqs(getStoredFaqs());
    };
    loadFaqs();

    window.addEventListener('faqUpdated', loadFaqs);
    window.addEventListener('storage', loadFaqs);
    return () => {
      window.removeEventListener('faqUpdated', loadFaqs);
      window.removeEventListener('storage', loadFaqs);
    };
  }, []);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-grow">
        {/* Header Banner */}
        <div className="text-center mb-12 relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mayad-gold/10 rounded-full blur-3xl" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 text-mayad-gold text-xs font-bold uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-[#F5D77F] via-[#D8B66A] to-[#B38F3F] bg-clip-text text-transparent">Questions</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions about MAYAD? Find instant answers to commonly asked questions about our media platform, services, and opportunities below.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. services, contact, careers)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1326] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-mayad-gold/60 focus:ring-1 focus:ring-mayad-gold/60 transition-all shadow-xl"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-[#0D1326]/60 rounded-3xl border border-white/10 p-8">
              <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No questions found</h3>
              <p className="text-sm text-slate-400 mt-1">
                Try searching with different keywords or reach out to our team directly.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-mayad-gold/40 bg-[#0D1326] shadow-[0_10px_30px_rgba(216,182,106,0.1)]'
                      : 'border-white/10 bg-[#0A0E1F]/80 hover:border-white/20 hover:bg-[#0D1326]/60'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border transition-colors ${
                        isOpen
                          ? 'border-mayad-gold/40 bg-mayad-gold/15 text-mayad-gold'
                          : 'border-white/10 bg-white/5 text-slate-400 group-hover:text-white'
                      }`}>
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-mayad-gold transition-colors">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="text-[11px] font-semibold text-mayad-gold/80 uppercase tracking-wider">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-mayad-gold' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Call-to-Action Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0D1326] to-[#0A0E1F] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mayad-gold/15 border border-mayad-gold/30 flex items-center justify-center text-mayad-gold mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Have More Questions?</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Need more info or want to collaborate with MAYAD? Send us a message via our Contact Us page.
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-mayad-gold hover:text-white transition-colors group"
            >
              <span>Contact MAYAD Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="rounded-3xl border border-mayad-gold/20 bg-gradient-to-br from-mayad-gold/10 via-[#0D1326] to-[#0A0E1F] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mayad-gold/20 border border-mayad-gold/40 flex items-center justify-center text-mayad-gold mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Career Opportunities</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Join our growing network of artists, creators, and professionals in Rajasthan media industry.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-mayad-gold hover:text-white transition-colors group"
            >
              <span>Join MAYAD Network</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
