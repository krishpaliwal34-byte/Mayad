'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { authService } from '@/services/authService';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // ============================================================
  // CUSTOM SUCCESS ALERT
  // ============================================================

  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  // ============================================================
  // LOGIN
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const email = String(
        formData.get('email') || ''
      )
        .trim()
        .toLowerCase();

      const password = String(
        formData.get('password') || ''
      );

      // ========================================================
      // VALIDATION
      // ========================================================

      if (!email || !password) {
        setError(
          'ईमेल और पासवर्ड दोनों जरूरी हैं'
        );

        setLoading(false);
        return;
      }

      // ========================================================
      // BACKEND LOGIN
      // ========================================================

      const response =
        await authService.login({
          email,
          password,
          rememberMe,
        });

      console.log(
        '✅ Login successful:',
        response
      );

      // ========================================================
      // SAVE TOKEN
      // ========================================================

      if (response.token) {
        localStorage.setItem(
          'mayad_token',
          response.token
        );
      }

      // ========================================================
      // SAVE USER
      // ========================================================

      if (response.user) {
        localStorage.setItem(
          'mayad_user',
          JSON.stringify(response.user)
        );
      }

      // ========================================================
      // NOTIFY APP ABOUT LOGIN
      // This will make AppContext load the
      // user's watchlist from MongoDB.
      // ========================================================

      window.dispatchEvent(
        new Event('mayad-auth-change')
      );

      // ========================================================
      // CUSTOM SUCCESS ALERT
      // ========================================================

      setShowSuccess(true);

      // Auto hide after 2.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);

      // ========================================================
      // GO HOME
      // ========================================================

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error(
        '❌ Login Error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* =====================================================
          CUSTOM SUCCESS ALERT
      ====================================================== */}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{
              opacity: 0,
              y: -30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-32px)] max-w-[420px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-mayad-gold/30 bg-[#0b0b0b]/95 backdrop-blur-xl shadow-2xl shadow-black/50">

              {/* GOLD GLOW */}
              <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-mayad-gold/15 blur-3xl" />

              <div className="relative flex items-center gap-4 px-4 py-4 sm:px-5">

                {/* ICON */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mayad-gold shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                  <Check className="h-5 w-5 text-black stroke-[3]" />
                </div>

                {/* TEXT */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mayad-gold" />

                    <p className="text-sm font-bold text-white">
                      स्वागत है! 🎉
                    </p>
                  </div>

                  <p className="mt-0.5 text-xs text-white/60 sm:text-sm">
                    {`${
                      'आप सफलतापूर्वक लॉगिन हो गए हैं'
                    }`}
                  </p>
                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowSuccess(false)
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* PROGRESS */}

              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: 2.5,
                  ease: 'linear',
                }}
                className="h-[2px] bg-mayad-gold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          FULL SCREEN BACKGROUND
      ====================================================== */}

      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/loginbg.jpg')",
        }}
      />

      {/* Light overlay */}

      <div className="fixed inset-0 z-[1] bg-black/25" />

      {/* =====================================================
          LOGIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
          }}
          className="w-full max-w-[430px]"
        >

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div className="w-full rounded-2xl border border-white/20 bg-black/65 px-6 py-7 shadow-2xl backdrop-blur-md sm:px-8">

            {/* =================================================
                MAYAD LOGO
            ================================================== */}

            <div className="mb-5 flex justify-center">

              <div
                className="h-14 w-44 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('/mayadlogo.jpg')",
                }}
              />

            </div>

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="mb-6 text-center">

              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                हेलो मायड़ भाषा रो!
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                अपने MAYAD खाते में लॉगिन करें
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* EMAIL */}

              <div className="relative">

                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type="email"
                  name="email"
                  placeholder="ईमेल"
                  required
                  autoComplete="email"
                  className="h-14 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-400 focus:border-mayad-gold focus:ring-1 focus:ring-mayad-gold/30"
                />

              </div>

              {/* PASSWORD */}

              <div className="relative">

                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  placeholder="पासवर्ड"
                  required
                  autoComplete="current-password"
                  className="h-14 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-12 text-white outline-none transition-all placeholder:text-slate-400 focus:border-mayad-gold focus:ring-1 focus:ring-mayad-gold/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

              {/* =================================================
                  REMEMBER + FORGOT PASSWORD
              ================================================== */}

              <div className="flex items-center justify-between gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setRememberMe(
                      !rememberMe
                    )
                  }
                  className="flex items-center gap-2 text-sm text-slate-200"
                >

                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                      rememberMe
                        ? 'border-mayad-gold bg-mayad-gold'
                        : 'border-white/40 bg-black/20'
                    }`}
                  >
                    {rememberMe && (
                      <Check className="h-3.5 w-3.5 text-black" />
                    )}
                  </span>

                  <span>
                    म्हाने याद राखो
                  </span>

                </button>

                <Link
                  href="/forgot-password"
                  className="whitespace-nowrap text-sm text-mayad-gold transition-colors hover:text-yellow-300"
                >
                  पासवर्ड भूल गया?
                </Link>

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold text-base font-bold text-black shadow-glow-gold transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <span>
                  {loading
                    ? 'लॉगिन हो रहा है...'
                    : 'साइन इन करो'}
                </span>

                {!loading && (
                  <ArrowRight className="h-5 w-5" />
                )}

              </button>

            </form>

            {/* =================================================
                SIGN UP
            ================================================== */}

            <div className="mt-5 text-center">

              <span className="text-sm text-slate-300">
                खाता नहीं है?{' '}
              </span>

              <Link
                href="/signup"
                className="text-sm font-semibold text-mayad-gold transition-colors hover:text-yellow-300"
              >
                साइन अप करो
              </Link>

            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/20" />

              <span className="text-xs text-slate-300">
                या
              </span>

              <div className="h-px flex-1 bg-white/20" />

            </div>

            {/* =================================================
                GOOGLE LOGIN
            ================================================== */}

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >

              <span className="text-base font-bold">
                G
              </span>

              <span>
                Google से साइन इन करो
              </span>

            </button>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================== */}

          <p className="mt-5 text-center text-xs text-white/50">
            © {new Date().getFullYear()} MAYAD. All rights reserved.
          </p>

        </motion.div>

      </div>

    </main>
  );
}