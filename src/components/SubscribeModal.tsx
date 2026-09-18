'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SubscribeModal() {
  const { isSubscribeOpen, closeSubscribe, language, t } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isSubscribeOpen) return null;

  const isRaj = language === 'RAJ';

  const handleSubscribe = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      closeSubscribe();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSubscribe}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-2xl bg-[#0D1226] border border-mayad-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-glow-gold/20 overflow-hidden z-10 my-auto"
        >
          {/* Ambient Gold Glow Background */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-mayad-gold/15 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={closeSubscribe}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-mayad-gold/20 border-2 border-mayad-gold text-mayad-gold flex items-center justify-center mx-auto shadow-glow-gold">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                {isRaj ? 'सदस्यता सफल रही!' : 'Subscription Successful!'}
              </h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                {isRaj
                  ? 'आप री मायड़ प्रीमियम सदस्यता चालू हो गई है।'
                  : 'Welcome to MAYAD VIP! Enjoy unlimited 4K streaming.'}
              </p>
            </div>
          ) : (
            /* Plan Selection Form */
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-mayad-gold/15 text-mayad-gold text-xs font-black rounded-full uppercase tracking-widest border border-mayad-gold/30">
                  <Crown className="w-4 h-4" />
                  <span>MAYAD VIP PASS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {t('subscribeTitle')}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                  {t('subscribeSubtitle')}
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative cursor-pointer p-5 rounded-2xl border transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-mayad-gold/10 border-mayad-gold shadow-glow-gold'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase text-slate-300">
                      {t('monthlyPlan')}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'monthly'
                          ? 'border-mayad-gold bg-mayad-gold text-black'
                          : 'border-white/30'
                      }`}
                    >
                      {selectedPlan === 'monthly' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-black text-white">₹30.51</span>
                    <span className="text-xs font-semibold text-slate-400">{t('perMonth')}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    {isRaj ? '1 महिना असीमित स्ट्रीमिंग' : '1 Month Full 4K Access'}
                  </p>
                </div>

                {/* Yearly Plan (Best Value) */}
                <div
                  onClick={() => setSelectedPlan('yearly')}
                  className={`relative cursor-pointer p-5 rounded-2xl border transition-all ${
                    selectedPlan === 'yearly'
                      ? 'bg-gradient-to-b from-mayad-gold/20 via-mayad-gold/10 to-transparent border-mayad-gold shadow-glow-gold'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="absolute -top-3 right-4">
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-mayad-gold to-amber-500 text-black text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                      {t('bestValue')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase text-mayad-gold">
                      {t('yearlyPlan')}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'yearly'
                          ? 'border-mayad-gold bg-mayad-gold text-black'
                          : 'border-white/30'
                      }`}
                    >
                      {selectedPlan === 'yearly' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-black text-mayad-gold">₹335.59</span>
                    <span className="text-xs font-semibold text-slate-300">{t('perYear')}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2 font-medium">
                    {isRaj ? '1 साल री पूरी सदस्यता' : '1 Year Unlimited Pass'}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-mayad-gold shrink-0" />
                  <span>{t('planFeature1')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-mayad-gold shrink-0" />
                  <span>{t('planFeature2')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-mayad-gold shrink-0" />
                  <span>{t('planFeature3')}</span>
                </div>
              </div>

              {/* Subscribe CTA Button */}
              <button
                onClick={handleSubscribe}
                className="w-full py-4 bg-gradient-to-r from-mayad-gold via-amber-400 to-mayad-gold text-black font-extrabold text-base rounded-2xl shadow-glow-gold hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                <span>
                  {t('selectPlan')} — {selectedPlan === 'monthly' ? '₹30.51' : '₹335.59'}
                </span>
              </button>

              <p className="text-[11px] text-center text-slate-500">
                {isRaj
                  ? 'सुरक्षित भुगतान • कदे भी रद्द करो'
                  : 'Secure 256-Bit Encrypted Payment • Cancel Anytime'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
