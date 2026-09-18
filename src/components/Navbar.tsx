'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Search,
  User,
  Menu,
  X,
  Smartphone,
  Settings,
  UserRound,
  LogOut,
  ChevronRight,
  ChevronDown,
  Globe,
  Crown,
  Film,
  BookOpen,
  Landmark,
  Images,
} from 'lucide-react';

import { useApp } from '@/context/AppContext';

interface LoggedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
  rememberMe?: boolean;
  isActive?: boolean;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const {
    openSearch,
    openSubscribe,
    language,
    setLanguage,
    t,
  } = useApp();

  // ============================================================
  // CHECK LOGIN USER
  // ============================================================

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('mayad_user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener('mayad-auth-change', loadUser);

    return () => {
      window.removeEventListener('mayad-auth-change', loadUser);
    };
  }, []);

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
  // CLOSE DROPDOWNS OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        categoryRef.current &&
        !categoryRef.current.contains(target)
      ) {
        setCategoryOpen(false);
      }

      if (
        moreRef.current &&
        !moreRef.current.contains(target)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // NAV LINKS
  // BLOGS REMOVED FROM MAIN NAV
  // ============================================================

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('movies'), href: '/movies' },
    { name: t('tvShows'), href: '/series' },
    { name: t('artists'), href: '/artists' },
  ];

  // ============================================================
  // CATEGORY LINKS
  // ============================================================

  const categoryLinks = [
    {
      name: 'Thriller',
      href: '/favorite-genres/thriller',
    },
    {
      name: 'Devotional',
      href: '/favorite-genres/devotional',
    },
    {
      name: 'Historical',
      href: '/favorite-genres/historical',
    },
  ];

  // ============================================================
  // MORE LINKS
  // ============================================================

  const moreLinks = [
    {
      name: 'Blogs',
      href: '/blogs',
      icon: BookOpen,
    },
    {
      name: 'Culture',
      href: '/culture',
      icon: Landmark,
    },
    {
      name: 'Gallery',
      href: '/gallery',
      icon: Images,
    },
  ];

  // ============================================================
  // CATEGORY ACTIVE
  // ============================================================

  const isCategoryActive = categoryLinks.some(
    (category) => pathname === category.href
  );

  // ============================================================
  // MORE ACTIVE
  // ============================================================

  const isMoreActive = moreLinks.some(
    (item) => pathname === item.href
  );

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = () => {
    setMobileMenuOpen(false);
    router.push('/login');
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem('mayad_user');
    localStorage.removeItem('mayad_token');

    setUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);

    window.dispatchEvent(
      new Event('mayad-auth-change')
    );

    router.push('/');
  };

  // ============================================================
  // ACCOUNT SETTING
  // ============================================================

  const handleAccountSetting = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);

    router.push('/account-setting');
  };

  // ============================================================
  // MANAGE PROFILE
  // ============================================================

  const handleManageProfile = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);

    router.push('/profile');
  };

  // ============================================================
  // USER INITIAL
  // ============================================================

  const userInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : 'U';

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
        <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">

          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-8">

            {/* ==================================================
                LOGO
            ================================================== */}

            <Link
              href="/"
              className="group relative flex shrink-0 items-center gap-2"
            >
              <div className="relative h-8 w-24 overflow-hidden transition-transform group-hover:scale-105 sm:h-11 sm:w-36">
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


            {/* ==================================================
                DESKTOP NAV
            ================================================== */}

            <nav className="hidden min-w-0 items-center space-x-1 md:flex lg:space-x-2">

              {/* NORMAL LINKS */}

              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/5 font-semibold text-mayad-gold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}


              {/* ==================================================
                  CATEGORY DROPDOWN
                  HOVER -> OPTIONS
              ================================================== */}

              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >

                <button
                  type="button"
                  onClick={() =>
                    setCategoryOpen(!categoryOpen)
                  }
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isCategoryActive || categoryOpen
                      ? 'bg-white/5 font-semibold text-mayad-gold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>Category</span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      categoryOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>


                {/* CATEGORY MENU */}

                <AnimatePresence>
                  {categoryOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.97,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-white/10 p-2 shadow-2xl backdrop-blur-2xl"
                      style={{
                        background: 'rgba(10, 15, 20, 0.97)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                      }}
                    >

                      {categoryLinks.map((category) => {
                        const active =
                          pathname === category.href;

                        return (
                          <Link
                            key={category.href}
                            href={category.href}
                            onClick={() =>
                              setCategoryOpen(false)
                            }
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                              active
                                ? 'bg-mayad-gold text-black'
                                : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                            }`}
                          >

                            <Film
                              className={`h-4 w-4 ${
                                active
                                  ? 'text-black'
                                  : 'text-mayad-gold'
                              }`}
                            />

                            <span>
                              {category.name}
                            </span>

                            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />

                          </Link>
                        );
                      })}

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>


              {/* ==================================================
                  MORE DROPDOWN
                  HOVER -> BLOGS + CULTURE
              ================================================== */}

              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >

                <button
                  type="button"
                  onClick={() =>
                    setMoreOpen(!moreOpen)
                  }
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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


                {/* MORE MENU */}

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.97,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-white/10 p-2 shadow-2xl backdrop-blur-2xl"
                      style={{
                        background: 'rgba(10, 15, 20, 0.97)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                      }}
                    >

                      {moreLinks.map((item) => {
                        const Icon = item.icon;
                        const active =
                          pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() =>
                              setMoreOpen(false)
                            }
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                              active
                                ? 'bg-mayad-gold text-black'
                                : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                            }`}
                          >

                            <Icon
                              className={`h-4 w-4 ${
                                active
                                  ? 'text-black'
                                  : 'text-mayad-gold'
                              }`}
                            />

                            <span>
                              {item.name}
                            </span>

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


          {/* ====================================================
              RIGHT DESKTOP
          ==================================================== */}

          <div className="hidden shrink-0 items-center gap-4 md:flex">

            {/* ==================================================
                SEARCH
            ================================================== */}

            <button
              onClick={openSearch}
              className="p-2 text-slate-300 transition-colors hover:text-mayad-gold focus:outline-none"
              title="Search titles"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>


            {/* ==================================================
                LANGUAGE
            ================================================== */}

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


            {/* ==================================================
                DOWNLOAD APP
            ================================================== */}

            <a
              href="#download-app"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition-all duration-300 hover:bg-mayad-gold hover:text-black"
              title={t('downloadApp')}
              aria-label={t('downloadApp')}
            >
              <Smartphone className="h-5 w-5" />
            </a>


            {/* ==================================================
                SUBSCRIBE
            ================================================== */}

            <button
              onClick={openSubscribe}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-4 py-2 text-xs font-bold text-black shadow-glow-gold transition-all hover:brightness-110 sm:text-sm"
            >
              <Crown className="h-4 w-4 fill-current" />

              <span>
                {t('subscribe')}
              </span>
            </button>


            {/* ==================================================
                LOGIN / USER
                LAST
            ================================================== */}

            {!user ? (

              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors hover:text-mayad-gold"
              >
                <User className="h-4 w-4 text-mayad-gold" />

                <span>
                  {t('login')}
                </span>
              </button>

            ) : (

              <div
                ref={profileRef}
                className="relative"
              >

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all hover:border-mayad-gold/60 hover:bg-white/15"
                  aria-label="User menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mayad-gold text-sm font-bold text-black">
                    {userInitial}
                  </div>
                </button>


                {/* PROFILE DROPDOWN */}

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute right-0 top-14 w-[330px] overflow-hidden rounded-2xl border border-white/10 bg-[#1c2329]/95 shadow-2xl backdrop-blur-xl"
                    >

                      {/* USER INFO */}

                      <div className="p-4">

                        <div className="flex items-center gap-4 rounded-xl bg-[#050b10] p-4">

                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-mayad-gold text-xl font-bold text-black">
                            {userInitial}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-white">
                              {user.firstName} {user.lastName}
                            </h3>

                            <p className="mt-1 truncate text-sm text-slate-300">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* PROFILE MENU */}

                      <div className="space-y-1 px-4 pb-4">

                        {/* MANAGE PROFILE */}

                        <button
                          onClick={handleManageProfile}
                          className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-white transition-colors hover:bg-white/10"
                        >

                          <div className="flex items-center gap-3">

                            <UserRound className="h-5 w-5 text-slate-300 group-hover:text-mayad-gold" />

                            <span className="text-sm font-semibold">
                              {t('manageProfile')}
                            </span>

                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-mayad-gold" />

                        </button>


                        {/* ACCOUNT SETTING */}

                        <button
                          onClick={handleAccountSetting}
                          className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-white transition-colors hover:bg-white/10"
                        >

                          <div className="flex items-center gap-3">

                            <Settings className="h-5 w-5 text-slate-300 group-hover:text-mayad-gold" />

                            <span className="text-sm font-semibold">
                              {t('accountSetting')}
                            </span>

                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-mayad-gold" />

                        </button>


                        {/* LOGOUT */}

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-mayad-gold transition-colors hover:bg-white/10"
                        >

                          <LogOut className="h-5 w-5" />

                          <span className="text-sm font-semibold">
                            {t('logout')}
                          </span>

                        </button>

                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>


          {/* ====================================================
              MOBILE CONTROLS
          ==================================================== */}

          <div className="flex shrink-0 items-center gap-1.5 md:hidden">

            {/* MOBILE LANGUAGE */}

            <button
              onClick={() =>
                setLanguage(
                  language === 'ENG'
                    ? 'RAJ'
                    : 'ENG'
                )
              }
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


            {/* MOBILE DOWNLOAD */}

            <a
              href="#download-app"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-200 transition-colors hover:text-mayad-gold min-[400px]:flex"
              title={t('downloadApp')}
              aria-label={t('downloadApp')}
            >
              <Smartphone className="h-5 w-5" />
            </a>


            {/* MOBILE SUBSCRIBE */}

            <button
              onClick={openSubscribe}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-mayad-gold text-black shadow-glow-gold"
              title={t('subscribe')}
              aria-label={t('subscribe')}
            >
              <Crown className="h-4 w-4 fill-current" />
            </button>


            {/* MOBILE USER */}

            {user && (
              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mayad-gold text-sm font-bold text-black"
                aria-label="User menu"
              >
                {userInitial}
              </button>
            )}


            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
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
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="p-2 text-slate-300 hover:text-mayad-gold"
                >
                  <X className="h-6 w-6" />
                </button>

              </div>


              {/* MOBILE LANGUAGE SWITCHER */}

              <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">

                  <Globe className="h-4 w-4 text-mayad-gold" />

                  <span>
                    {t('languageLabel')}:
                  </span>

                </span>


                <div className="flex items-center rounded-full border border-white/15 bg-black/50 p-0.5 text-xs font-bold">

                  <button
                    onClick={() =>
                      setLanguage('ENG')
                    }
                    className={`rounded-full px-3 py-1 transition-all ${
                      language === 'ENG'
                        ? 'bg-mayad-gold font-extrabold text-black shadow-glow-gold'
                        : 'text-slate-300'
                    }`}
                  >
                    ENG
                  </button>

                  <button
                    onClick={() =>
                      setLanguage('RAJ')
                    }
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


              {/* ==================================================
                  MOBILE LINKS
              ================================================== */}

              <nav className="flex min-w-0 flex-col space-y-2.5">

                {/* NORMAL LINKS */}

                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
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


                {/* ==================================================
                    MOBILE CATEGORY
                ================================================== */}

                <div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileCategoryOpen(
                        !mobileCategoryOpen
                      )
                    }
                    className={`flex w-full min-w-0 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold leading-6 transition-colors ${
                      isCategoryActive ||
                      mobileCategoryOpen
                        ? 'bg-white/10 text-mayad-gold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-mayad-gold'
                    }`}
                  >

                    <span className="flex min-w-0 items-center gap-2">
                      <Film className="h-5 w-5" />
                      Category
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        mobileCategoryOpen
                          ? 'rotate-180'
                          : ''
                      }`}
                    />

                  </button>


                  <AnimatePresence>
                    {mobileCategoryOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mt-2 overflow-hidden rounded-xl border border-white/10"
                        style={{
                          background: 'rgba(10, 15, 20, 0.97)',
                          backdropFilter: 'blur(24px)',
                          WebkitBackdropFilter: 'blur(24px)',
                        }}
                      >

                        {categoryLinks.map(
                          (category) => {
                            const active =
                              pathname ===
                              category.href;

                            return (
                              <Link
                                key={category.href}
                                href={category.href}
                                onClick={() => {
                                  setMobileCategoryOpen(
                                    false
                                  );
                                  setMobileMenuOpen(
                                    false
                                  );
                                }}
                                className={`flex w-full min-w-0 items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                                  active
                                    ? 'bg-mayad-gold text-black'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                                }`}
                              >

                                <Film
                                  className={`h-4 w-4 ${
                                    active
                                      ? 'text-black'
                                      : 'text-mayad-gold'
                                  }`}
                                />

                                {category.name}

                                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />

                              </Link>
                            );
                          }
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>


                {/* ==================================================
                    MOBILE MORE
                ================================================== */}

                <div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileMoreOpen(
                        !mobileMoreOpen
                      )
                    }
                    className={`flex w-full min-w-0 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold leading-6 transition-colors ${
                      isMoreActive ||
                      mobileMoreOpen
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
                        mobileMoreOpen
                          ? 'rotate-180'
                          : ''
                      }`}
                    />

                  </button>


                  <AnimatePresence>
                    {mobileMoreOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mt-2 overflow-hidden rounded-xl border border-white/10"
                        style={{
                          background: 'rgba(10, 15, 20, 0.97)',
                          backdropFilter: 'blur(24px)',
                          WebkitBackdropFilter: 'blur(24px)',
                        }}
                      >

                        {moreLinks.map((item) => {
                          const Icon = item.icon;
                          const active =
                            pathname === item.href;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setMobileMoreOpen(
                                  false
                                );
                                setMobileMenuOpen(
                                  false
                                );
                              }}
                              className={`flex w-full min-w-0 items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                                active
                                  ? 'bg-mayad-gold text-black'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-mayad-gold'
                              }`}
                            >

                              <Icon
                                className={`h-4 w-4 ${
                                  active
                                    ? 'text-black'
                                    : 'text-mayad-gold'
                                }`}
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


                {/* ==================================================
                    MOBILE SUBSCRIBE
                ================================================== */}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSubscribe();
                  }}
                  className="flex w-full min-w-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-mayad-gold to-amber-500 px-4 py-3 text-base font-bold text-black shadow-glow-gold"
                >
                  <Crown className="h-5 w-5 fill-current" />

                  <span>
                    {t('subscribe')}
                  </span>
                </button>

              </nav>

            </div>


            {/* ==================================================
                MOBILE FOOTER
            ================================================== */}

            <div className="space-y-3 border-t border-white/10 pt-6">

              {/* LOGIN / LOGOUT */}

              {!user ? (

                <button
                  onClick={handleLogin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <User className="h-4 w-4 text-mayad-gold" />

                  <span>
                    {t('login')}
                  </span>
                </button>

              ) : (

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold text-mayad-gold transition-colors hover:bg-white/15"
                >
                  <LogOut className="h-4 w-4" />

                  <span>
                    {t('logout')}
                  </span>
                </button>

              )}


              {/* DOWNLOAD APP */}

              <a
                href="https://play.google.com/store/apps/details?id=com.mayad.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold py-3 text-sm font-bold text-black shadow-glow-gold"
              >
                <Smartphone className="h-4 w-4" />

                <span>
                  {t('downloadApp')}
                </span>
              </a>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}