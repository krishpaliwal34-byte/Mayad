'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  BookOpen,
  Landmark,
  Images,
  UserRound,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getBackendUrl } from '@/utils/config';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [artistPhoto, setArtistPhoto] = useState<string | null>(null);

  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { openSearch, language, setLanguage, t } = useApp();

  // ============================================================
  // ARTIST PHOTO
  // ============================================================
  useEffect(() => {
    const updateArtistPhoto = () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      if (!token) {
        setArtistPhoto(null);
        return;
      }
      const savedPhoto = localStorage.getItem('mayad_artist_profile_photo');
      if (savedPhoto) {
        setArtistPhoto(savedPhoto);
      }
    };

    updateArtistPhoto();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      if (token && !localStorage.getItem('mayad_artist_profile_photo')) {
        const backendUrl = getBackendUrl();
        fetch(`${backendUrl}/api/artist/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.artist?.profilePhoto) {
              localStorage.setItem('mayad_artist_profile_photo', data.artist.profilePhoto);
              setArtistPhoto(data.artist.profilePhoto);
            }
          })
          .catch((err) => console.error('Navbar artist photo fetch error:', err));
      }
    }

    window.addEventListener('artistProfileUpdated', updateArtistPhoto);
    window.addEventListener('storage', updateArtistPhoto);

    return () => {
      window.removeEventListener('artistProfileUpdated', updateArtistPhoto);
      window.removeEventListener('storage', updateArtistPhoto);
    };
  }, []);

  const handleArtistAccount = () => {
    const token = window.localStorage.getItem('mayad_artist_jwt');
    router.push(token ? '/artist/dashboard' : '/artist/login');
  };

  // ============================================================
  // SCROLL
  // ============================================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ============================================================
  // NAV LINKS
  // ============================================================
  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('movies'), href: '/movies' },
    { name: t('artists'), href: '/artists' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Media', href: '/media' },
    { name: 'DP Singh Basni', href: '/founder' },
    { name: 'Career', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  // ============================================================
  // MORE LINKS
  // ============================================================
  const moreLinks = [
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
    { name: 'Culture', href: '/culture', icon: Landmark },
  ];

  const isMoreActive = moreLinks.some((item) => pathname === item.href);
  const isJoinActive = pathname === '/register';

  return (
    <>
      {/* ========================================================
          NAVBAR
      ======================================================== */}
      <header
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] min-w-0 items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-5 lg:gap-6">
            {/* LOGO */}
            <Link href="/" className="group relative flex shrink-0 items-center gap-2">
              <div className="relative h-8 w-24 shrink-0 overflow-hidden transition-transform group-hover:scale-105 sm:h-10 sm:w-32 lg:h-11 lg:w-36">
                <Image
                  src="/mayadlogo.jpg"
                  alt="MAYAD Logo"
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden min-w-0 flex-nowrap items-center gap-0.5 md:flex lg:gap-1">
              {/* NORMAL LINKS */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-white/5 font-semibold text-mayad-gold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* MORE DROPDOWN */}
              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                    isMoreActive || moreOpen
                      ? 'bg-white/5 font-semibold text-mayad-gold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      moreOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-white/10 p-2 shadow-2xl backdrop-blur-2xl"
                      style={{
                        background: 'rgba(10, 15, 20, 0.97)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                      }}
                    >
                      {moreLinks.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMoreOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                              active
                                ? 'bg-mayad-gold text-black'
                                : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${active ? 'text-black' : 'text-mayad-gold'}`}
                            />
                            <span>{item.name}</span>
                            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden shrink-0 items-center gap-2 lg:gap-3 md:flex">
            {/* SEARCH */}
            <button
              onClick={openSearch}
              className="p-2 text-slate-300 transition-colors hover:text-mayad-gold focus:outline-none"
              title="Search titles"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* LANGUAGE */}
            <div className="relative flex items-center rounded-full border border-white/15 bg-white/10 p-0.5 text-xs font-bold text-white shadow-inner backdrop-blur-md">
              <button
                onClick={() => setLanguage('ENG')}
                className={`rounded-full px-3 py-1 transition-all duration-200 ${
                  language === 'ENG'
                    ? 'bg-mayad-gold font-extrabold text-black shadow-glow-gold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English"
              >
                ENG
              </button>
              <button
                onClick={() => setLanguage('RAJ')}
                className={`rounded-full px-3 py-1 transition-all duration-200 ${
                  language === 'RAJ'
                    ? 'bg-mayad-gold font-extrabold text-black shadow-glow-gold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="राजस्थानी"
              >
                राजस्थानी
              </button>
            </div>

            {/* JOIN MAYAD (outline pill, fills gold on hover) */}
            <Link
              href="/register"
              className={`group inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[13px] font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mayad-gold/60 active:scale-95 ${
                isJoinActive
                  ? 'border-mayad-gold bg-mayad-gold text-black'
                  : 'border-mayad-gold/60 text-mayad-gold hover:border-mayad-gold hover:bg-mayad-gold hover:text-black'
              }`}
            >
              <span>Join MAYAD</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            {/* ARTIST ACCOUNT */}
            {/* <button
              type="button"
              onClick={handleArtistAccount}
              aria-label="Artist Login or Dashboard"
              title="Artist Login / Dashboard"
              className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent text-[#F5D77A] shadow-[0_0_20px_rgba(212,175,55,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-[#F5D77A] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full z-10" />
              {artistPhoto ? (
                <img
                  src={artistPhoto}
                  alt="Artist Profile"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setArtistPhoto(null)}
                />
              ) : (
                <UserRound className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button> */}
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            {/* MOBILE JOIN */}
            <Link
              href="/register"
              className="inline-flex h-8 items-center whitespace-nowrap rounded-full border border-mayad-gold/60 px-3 text-[11px] font-semibold text-mayad-gold transition-all active:scale-95 active:bg-mayad-gold active:text-black"
            >
              Join
            </Link>

            {/* MOBILE LANGUAGE */}
            <button
              onClick={() => setLanguage(language === 'ENG' ? 'RAJ' : 'ENG')}
              className="max-w-[52px] truncate whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-bold text-mayad-gold transition-all hover:bg-white/20 sm:max-w-none sm:px-2.5 sm:text-xs"
              title="Toggle Language"
            >
              {language === 'ENG' ? 'ENG' : 'राज'}
            </button>

            {/* MOBILE SEARCH */}
            <button
              onClick={openSearch}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-200 hover:text-mayad-gold"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* MOBILE ARTIST ACCOUNT */}
            {/* <button
              type="button"
              onClick={handleArtistAccount}
              aria-label="Artist Login or Dashboard"
              title="Artist Login / Dashboard"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D77A] transition-all duration-300 hover:border-[#F5D77A] active:scale-95"
            >
              {artistPhoto ? (
                <img
                  src={artistPhoto}
                  alt="Artist Profile"
                  className="h-full w-full object-cover"
                  onError={() => setArtistPhoto(null)}
                />
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </button> */}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-mayad-gold" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE MENU
      ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex w-full min-w-0 flex-col justify-between overflow-x-hidden overflow-y-auto bg-black/95 p-4 backdrop-blur-xl sm:p-6 md:hidden"
          >
            <div className="min-w-0">
              {/* MOBILE HEADER */}
              <div className="mb-5 flex min-w-0 items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="relative h-8 w-24 shrink-0 sm:h-9 sm:w-28">
                  <Image
                    src="/mayad.jpg"
                    alt="MAYAD"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-300 hover:text-mayad-gold"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* MOBILE LANGUAGE SWITCHER */}
              <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Globe className="h-4 w-4 text-mayad-gold" />
                  <span>{t('languageLabel')}:</span>
                </span>
                <div className="flex items-center rounded-full border border-white/15 bg-black/50 p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setLanguage('ENG')}
                    className={`rounded-full px-3 py-1 transition-all ${
                      language === 'ENG'
                        ? 'bg-mayad-gold font-extrabold text-black shadow-glow-gold'
                        : 'text-slate-300'
                    }`}
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => setLanguage('RAJ')}
                    className={`rounded-full px-3 py-1 transition-all ${
                      language === 'RAJ'
                        ? 'bg-mayad-gold font-extrabold text-black shadow-glow-gold'
                        : 'text-slate-300'
                    }`}
                  >
                    राजस्थानी
                  </button>
                </div>
              </div>

              {/* MOBILE LINKS */}
              <nav className="flex min-w-0 flex-col space-y-2.5">
                {/* NORMAL LINKS */}
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full min-w-0 break-words rounded-xl px-4 py-3 text-base font-semibold leading-6 transition-colors ${
                        isActive
                          ? 'bg-mayad-gold text-black'
                          : 'text-slate-200 hover:bg-white/10 hover:text-mayad-gold'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* MOBILE MORE */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                    className={`flex w-full min-w-0 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold leading-6 transition-colors ${
                      isMoreActive || mobileMoreOpen
                        ? 'bg-white/10 text-mayad-gold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-mayad-gold'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      More
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        mobileMoreOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileMoreOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden rounded-xl border border-white/10"
                        style={{
                          background: 'rgba(10, 15, 20, 0.97)',
                          backdropFilter: 'blur(24px)',
                          WebkitBackdropFilter: 'blur(24px)',
                        }}
                      >
                        {moreLinks.map((item) => {
                          const Icon = item.icon;
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setMobileMoreOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex w-full min-w-0 items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                                active
                                  ? 'bg-mayad-gold text-black'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${active ? 'text-black' : 'text-mayad-gold'}`}
                              />
                              {item.name}
                              <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>

            {/* MOBILE JOIN (full width, bottom of menu) */}
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-mayad-gold/60 px-4 py-3 text-base font-semibold text-mayad-gold transition-colors hover:bg-mayad-gold hover:text-black active:bg-mayad-gold active:text-black"
            >
              <span>Join MAYAD</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}