'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AppDownload() {
  const { t } = useApp();

  return (
    <section
      id="download-app"
      className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#050816] via-[#0D1335] to-[#050816] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* =========================================
              LEFT - TEXT & DOWNLOAD BUTTONS
          ========================================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-7"
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-mayad-gold/40 bg-mayad-gold/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-mayad-gold">
              <Smartphone className="h-4 w-4" />
              <span>{t('downloadMayadApp')}</span>
            </div>


            {/* Heading */}
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              {t('downloadMayadApp')}
            </h2>


            {/* Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t('downloadSubtitle')}
            </p>


            {/* Rating + Free Content */}
            <div className="flex flex-wrap items-center gap-6 pt-2">

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-mayad-gold">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current"
                    />
                  ))}
                </div>

                <span className="text-sm font-bold text-white">
                  4.6 Star Rating
                </span>
              </div>


              {/* Free Content */}
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-mayad-gold" />

                <span>
                 Premium Movies, Shows & Music
                </span>
              </div>

            </div>


            {/* =========================================
                APP STORE BUTTONS
            ========================================= */}
            <div className="flex flex-wrap items-center gap-4 pt-4">

              {/* =====================================
                  GOOGLE PLAY
              ===================================== */}
              <a
                href="https://play.google.com/store/apps/details?id=com.mayad.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download MAYAD on Google Play"
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >

                {/* Google Play Icon */}
                <svg
                  className="h-7 w-7 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L18.81,13.12C19.43,12.5 19.43,11.5 18.81,10.88L16.81,8.88L14.75,10.94L14.75,13.06L16.81,15.12M15.81,16.12L12.63,12.94L4.84,20.73C5.19,20.91 5.59,21 6,21C6.47,21 6.94,20.81 7.31,20.44L15.81,16.12M15.81,7.88L7.31,3.56C6.94,3.19 6.47,3 6,3C5.59,3 5.19,3.09 4.84,3.27L12.63,11.06L15.81,7.88Z" />
                </svg>

                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-300">
                    GET IT ON
                  </span>

                  <span className="block text-base font-bold leading-none">
                    Google Play
                  </span>
                </div>

              </a>


              {/* =====================================
                  APP STORE
              ===================================== */}
              <a
                href="https://apps.apple.com/in/app/mayad/id6759036727"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download MAYAD on App Store"
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >

                {/* Apple Icon */}
                <svg
                  className="h-7 w-7 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,21.97C7.79,22 6.81,20.68 5.97,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>

                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-300">
                    DOWNLOAD ON THE
                  </span>

                  <span className="block text-base font-bold leading-none">
                    App Store
                  </span>
                </div>

              </a>

            </div>

          </motion.div>


          {/* =========================================
              RIGHT - MOBILE PHONE MOCKUP
          ========================================= */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:col-span-5"
          >

            {/* Ambient Phone Glow */}
            <div className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-mayad-gold/20 blur-3xl" />


            {/* Phone */}
            <div className="relative z-10 flex h-[500px] w-64 flex-col justify-between overflow-hidden rounded-[40px] border-4 border-slate-700 bg-[#050816] p-3 shadow-2xl sm:w-72">

              {/* Camera Notch */}
              <div className="mx-auto mb-2 h-4 w-24 rounded-full bg-slate-800" />


              {/* App Header */}
              <div className="mb-2 flex items-center justify-between px-2">

                <div className="relative h-6 w-20">
                  <Image
                    src="/mayad.jpg"
                    alt="MAYAD"
                    fill
                    className="object-contain object-left"
                  />
                </div>

                <span className="text-[10px] font-bold text-mayad-gold">
                  LIVE
                </span>

              </div>


              {/* App Screen */}
              <div className="relative mb-2 flex-grow overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

                <Image
                  src="/vadliyahindva.jpg"
                  alt="MAYAD Mobile App Interface"
                  fill
                  className="object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />


                {/* Movie Info */}
                <div className="absolute bottom-3 left-3 right-3 text-left">

                  <span className="text-[9px] font-bold text-mayad-gold">
                    NOW STREAMING
                  </span>

                  <p className="text-xs font-bold text-white">
                    Vadlya Hindwa
                  </p>

                </div>

              </div>


              {/* Bottom Dock */}
              <div className="rounded-xl bg-[#0D1226] p-2 text-center">

                <span className="text-[10px] text-mayad-muted">
                  Tap to Install MAYAD App
                </span>

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}