'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#050816] to-[#0A0F29] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#0D1226]/90 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-mayad-gold/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Stay in the MAYAD Circle
          </h2>
          <p className="text-xs sm:text-sm text-mayad-muted mt-2 max-w-md mx-auto">
            Get exclusive premier notifications, behind-the-scenes stories, and new release alerts.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you for subscribing to MAYAD releases!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mayad-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#050816] text-white placeholder-mayad-muted text-sm pl-12 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-mayad-gold focus:outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-mayad-gold hover:bg-amber-400 text-black font-bold text-sm rounded-xl shadow-glow-gold transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
