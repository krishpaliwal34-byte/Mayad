'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  Phone,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();

  const premiumShows = [
    {
      name: 'राजस्थानी फ़िल्म - वडल्या हिंदवा | Vadlya Hindva',
      href: '/movies',
    },
    {
      name: 'राजस्थानी फ़िल्म - सांवरिया सेठ | Sanwriya Seth Film',
      href: '/movies',
    },
  ];

  const latestReleased = [
    {
      name: 'राजस्थानी फ़िल्म - सांवरिया सेठ | Sanwriya Seth Film',
      href: '/movies',
    },
    {
      name: 'राजस्थानी फ़िल्म - वडल्या हिंदवा | Vadlya Hindva',
      href: '/movies',
    },
    {
      name: 'Song - दादा लाड लड़ाया | Dada Laad Ladaya',
      href: '/music',
    },
    {
      name: 'Song - सेठ म्हारो सांवरिया | Seth Maharo Sanwariya',
      href: '/music',
    },
  ];

  const legalLinks = [
    {
      name: 'Privacy Policy',
      href: '/privacy-policy',
    },
    {
      name: 'Terms & Conditions',
      href: '/terms-and-conditions',
    },
    {
      name: 'Help And Support',
      href: '/help-support',
    },
    {
      name: 'Refund And Cancellation Policy',
      href: '/refund-cancellation-policy',
    },
    {
      name: 'Data Deletion Request',
      href: '/data-deletion-request',
    },
  ];

  // =========================================
  // APP STORE LINKS
  // =========================================

  const GOOGLE_PLAY_URL =
    'https://play.google.com/store/apps/details?id=com.mayad.app';

  const APP_STORE_URL =
    'https://apps.apple.com/in/app/mayad/id6759036727';

  // =========================================
  // OPEN EXTERNAL APP STORE
  // =========================================

  const openGooglePlay = () => {
    window.open(GOOGLE_PLAY_URL, '_blank', 'noopener,noreferrer');
  };

  const openAppStore = () => {
    window.open(APP_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#071114] text-white">

      {/* =========================================
          MAIN FOOTER
      ========================================= */}
      <div className="mx-auto max-w-[1800px] px-6 pb-10 pt-12 sm:px-8 lg:px-12 lg:pt-14 xl:px-16">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">

          {/* =====================================
              COLUMN 1 - BRAND
          ===================================== */}
          <div className="lg:col-span-4 xl:col-span-4">

            {/* Logo */}
            <div className="relative mb-6 h-[44px] w-[175px]">
              <Image
                src="/mayadlogo.jpg"
                alt="MAYAD Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Description */}
            <p className="max-w-[420px] text-[14px] leading-[1.7] text-gray-300 sm:text-[15px]">
              {t('footerDesc')}
            </p>

            {/* Contact */}
            <div className="mt-7 space-y-4">

              <a
                href="mailto:info@mayad.in"
                className="group flex items-center gap-3 text-white transition-colors hover:text-[#FBBE16]"
              >
                <Mail className="h-[18px] w-[18px] shrink-0 text-gray-300 transition-colors group-hover:text-[#FBBE16]" />

                <span className="text-[14px] font-medium sm:text-[15px]">
                  info@mayad.in
                </span>
              </a>

              <a
                href="tel:+917984356179"
                className="group flex items-center gap-3 text-white transition-colors hover:text-[#FBBE16]"
              >
                <Phone className="h-[18px] w-[18px] shrink-0 text-gray-300 transition-colors group-hover:text-[#FBBE16]" />

                <span className="text-[14px] font-medium sm:text-[15px]">
                  +91 97843 56179
                </span>
              </a>

            </div>
          </div>


          {/* =====================================
              COLUMN 2 - PREMIUM SHOWS
          ===================================== */}
          <div className="lg:col-span-3 xl:col-span-3 lg:border-l lg:border-white/15 lg:pl-10">

            <h3 className="mb-7 text-[18px] font-bold text-white sm:text-[19px]">
              Premium shows
            </h3>

            <div className="space-y-5">

              {premiumShows.map((show) => (
                <Link
                  key={show.name}
                  href={show.href}
                  className="group flex items-start gap-2.5"
                >
                  <ChevronRight className="mt-[2px] h-[17px] w-[17px] shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-[#FBBE16]" />

                  <span className="text-[13px] leading-[1.55] text-gray-300 transition-colors group-hover:text-[#FBBE16] sm:text-[14px]">
                    {show.name}
                  </span>
                </Link>
              ))}

            </div>
          </div>


          {/* =====================================
              COLUMN 3 - LATEST RELEASED
          ===================================== */}
          <div className="lg:col-span-3 xl:col-span-3">

            <h3 className="mb-7 text-[18px] font-bold text-white sm:text-[19px]">
              Latest Released
            </h3>

            <div className="space-y-4">

              {latestReleased.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-start gap-2.5"
                >
                  <ChevronRight className="mt-[2px] h-[17px] w-[17px] shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-[#FBBE16]" />

                  <span className="text-[13px] leading-[1.55] text-gray-300 transition-colors group-hover:text-[#FBBE16] sm:text-[14px]">
                    {item.name}
                  </span>
                </Link>
              ))}

            </div>
          </div>


          {/* =====================================
              COLUMN 4 - APP DOWNLOAD
          ===================================== */}
          <div className="lg:col-span-2 xl:col-span-2">

            <h3 className="mb-6 text-[18px] font-bold text-white sm:text-[19px]">
              Download Our App
            </h3>

            <p className="mb-6 text-[14px] leading-[1.65] text-gray-300 sm:text-[15px]">
              Download our app for instant access to the best movies and
              shows!
            </p>


            {/* =================================
                APP STORE BUTTONS
            ================================= */}
            <div className="flex flex-col gap-3">

              {/* =================================
                  GOOGLE PLAY
              ================================= */}
              <button
                type="button"
                onClick={openGooglePlay}
                aria-label="Download on Google Play"
                className="block w-[105px] cursor-pointer border-0 bg-transparent p-0 text-left transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#FBBE16] focus:ring-offset-2 focus:ring-offset-[#071114] sm:w-[115px]"
              >
                <Image
                  src="/playstore.jpg.png"
                  alt="Get it on Google Play"
                  width={180}
                  height={54}
                  className="h-auto w-full object-contain"
                />
              </button>


              {/* =================================
                  APP STORE
              ================================= */}
              <button
                type="button"
                onClick={openAppStore}
                aria-label="Download on App Store"
                className="block w-[105px] cursor-pointer border-0 bg-transparent p-0 text-left transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#FBBE16] focus:ring-offset-2 focus:ring-offset-[#071114] sm:w-[115px]"
              >
                <Image
                  src="/appstore.jpg.png"
                  alt="Download on the App Store"
                  width={180}
                  height={54}
                  className="h-auto w-full object-contain"
                />
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* =========================================
          LEGAL NAVIGATION
      ========================================= */}
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6">

        <div className="rounded-t-lg border border-white/15 bg-[#02090c]">

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-5 py-5 sm:gap-x-7 sm:px-6 sm:py-6">

            {legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>

                <Link
                  href={link.href}
                  className="text-center text-[13px] text-gray-300 transition-colors hover:text-[#FBBE16] sm:text-[14px]"
                >
                  {link.name}
                </Link>

                {index !== legalLinks.length - 1 && (
                  <span className="hidden text-white/20 md:block">
                    |
                  </span>
                )}

              </React.Fragment>
            ))}

          </div>

        </div>
      </div>


      {/* =========================================
          COPYRIGHT
      ========================================= */}
      <div className="mx-auto max-w-[1800px] px-6 sm:px-8 lg:px-12 xl:px-16">

        <div className="border-t border-white/10 py-6">

          <div className="flex flex-col items-center justify-between gap-3 text-[12px] text-gray-500 md:flex-row sm:text-[13px]">

            <p>
              {t('copyright')}
            </p>

            <p>
              {t('taglineSubtitle')}
            </p>

          </div>

        </div>

      </div>


      {/* =========================================
          BACK TO TOP
      ========================================= */}
      <button
        type="button"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFBD00] text-black shadow-lg transition-all hover:scale-105 hover:bg-[#ffd04a] sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
      >
        <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

    </footer>
  );
}