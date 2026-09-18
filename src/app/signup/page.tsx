'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============================================================
  // CUSTOM SUCCESS ALERT
  // ============================================================

  const [showSuccess, setShowSuccess] = useState(false);

  // ============================================================
  // SIGNUP
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log('🔥 Signup button clicked');

    setLoading(true);
    setError('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const firstName = String(
        formData.get('firstName') || ''
      ).trim();

      const lastName = String(
        formData.get('lastName') || ''
      ).trim();

      const email = String(
        formData.get('email') || ''
      ).trim();

      const phone = String(
        formData.get('phone') || ''
      ).trim();

      const password = String(
        formData.get('password') || ''
      );

      const confirmPassword = String(
        formData.get('confirmPassword') || ''
      );

      console.log('📦 Signup Data:', {
        firstName,
        lastName,
        email,
        phone,
        password: password ? '******' : '',
        confirmPassword: confirmPassword ? '******' : '',
        rememberMe,
      });

      // ========================================================
      // VALIDATION
      // ========================================================

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        setError('Please fill all required fields');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // ========================================================
      // SIGNUP REQUEST
      // ========================================================

      console.log('🚀 Sending signup request...');

      const response = await authService.signup({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        rememberMe,
      });

      console.log('✅ Signup Response:', response);

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
      // CUSTOM SUCCESS ALERT
      // ========================================================

      setShowSuccess(true);

      // Auto hide after 2.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);

      // ========================================================
      // GO TO LOGIN
      // ========================================================

      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (error) {
      console.error(
        '❌ Signup Error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Signup failed. Please try again.'
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
            className="fixed left-1/2 top-5 z-[9999] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2"
          >
            <div className="relative overflow-hidden rounded-2xl border border-mayad-gold/30 bg-[#0b0b0b]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">

              {/* GOLD GLOW */}

              <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-mayad-gold/15 blur-3xl" />

              {/* CONTENT */}

              <div className="relative flex items-center gap-4 px-4 py-4 sm:px-5">

                {/* SUCCESS ICON */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mayad-gold shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                  <Check className="h-5 w-5 text-black stroke-[3]" />
                </div>

                {/* MESSAGE */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <Sparkles className="h-4 w-4 text-mayad-gold" />

                    <p className="text-sm font-bold text-white">
                      खाता बन गया! 🎉
                    </p>

                  </div>

                  <p className="mt-0.5 text-xs text-white/60 sm:text-sm">
                    आपका MAYAD अकाउंट सफलतापूर्वक बन गया है
                  </p>

                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              {/* PROGRESS BAR */}

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
          BACKGROUND IMAGE
      ====================================================== */}

      <div className="absolute inset-0 z-0">

        <Image
          src="/loginbg.jpg"
          alt="MAYAD Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Light overlay */}

        <div className="absolute inset-0 bg-black/20" />

        {/* Bottom gradient */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />

      </div>

      {/* =====================================================
          SIGNUP CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="w-full max-w-[500px]"
        >

          {/* =================================================
              SIGNUP CARD
          ================================================== */}

          <div className="rounded-2xl border border-white/20 bg-black/60 px-5 py-6 shadow-2xl backdrop-blur-sm sm:px-7 sm:py-7">

            {/* LOGO */}

            <div className="mb-4 flex justify-center">

              <div className="relative h-12 w-48">

                <Image
                  src="/mayadlogo.jpg"
                  alt="MAYAD"
                  fill
                  priority
                  sizes="190px"
                  className="object-contain"
                />

              </div>

            </div>

            {/* HEADING */}

            <div className="mb-6 text-center">

              <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                आप रो सफर शुरू करण रो खातिर
                <br />
                साइन अप करो
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                MAYAD पर अपन खाता बनाओ
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
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FIRST NAME */}

              <div className="relative">

                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type="text"
                  name="firstName"
                  placeholder="पहिलो नाम"
                  required
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
                />

              </div>

              {/* LAST NAME */}

              <div className="relative">

                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type="text"
                  name="lastName"
                  placeholder="अंतिम नाम"
                  required
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
                />

              </div>

              {/* EMAIL */}

              <div className="relative">

                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type="email"
                  name="email"
                  placeholder="ईमेल"
                  required
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
                />

              </div>

              {/* MOBILE NUMBER */}

              <div className="relative">

                <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">

                  <span className="text-base">
                    🇮🇳
                  </span>

                  <span className="text-sm text-slate-300">
                    +91
                  </span>

                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="जैसे: 9723454740"
                  required
                  maxLength={10}
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-[90px] pr-4 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
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
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-12 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
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

              {/* CONFIRM PASSWORD */}

              <div className="relative">

                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="पासवर्ड पुष्टि करो"
                  name="confirmPassword"
                  required
                  className="h-12 w-full rounded-xl border border-white/25 bg-black/30 pl-12 pr-12 text-white outline-none transition-colors placeholder:text-slate-300 focus:border-mayad-gold"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

              {/* REMEMBER ME */}

              <button
                type="button"
                onClick={() =>
                  setRememberMe(!rememberMe)
                }
                className="flex items-center gap-2 text-sm text-slate-300"
              >

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                    rememberMe
                      ? 'border-mayad-gold bg-mayad-gold'
                      : 'border-white/40 bg-transparent'
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

              {/* SIGNUP BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold text-base font-bold text-black shadow-glow-gold transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <span>
                  {loading
                    ? 'साइन अप हो रहा है...'
                    : 'साइन अप करो'}
                </span>

                {!loading && (
                  <ArrowRight className="h-5 w-5" />
                )}

              </button>

            </form>

            {/* =================================================
                LOGIN LINK
            ================================================== */}

            <div className="mt-5 text-center">

              <span className="text-sm text-slate-300">
                पहले से खाता है?{' '}
              </span>

              <Link
                href="/login"
                className="text-sm font-semibold text-mayad-gold transition-colors hover:text-yellow-300"
              >
                साइन इन करो
              </Link>

            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/20" />

              <span className="text-xs text-slate-400">
                या
              </span>

              <div className="h-px flex-1 bg-white/20" />

            </div>

            {/* =================================================
                GOOGLE SIGNUP
            ================================================== */}

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >

              <span className="text-base font-bold">
                G
              </span>

              <span>
                Google से साइन अप करो
              </span>

            </button>

            {/* =================================================
                TERMS
            ================================================== */}

            <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">

              साइन अप करके, आप MAYAD की{' '}

              <Link
                href="/terms"
                className="text-mayad-gold hover:text-yellow-300"
              >
                Terms & Conditions
              </Link>

              {' '}और{' '}

              <Link
                href="/privacy"
                className="text-mayad-gold hover:text-yellow-300"
              >
                Privacy Policy
              </Link>

              {' '}से सहमत हैं।

            </p>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================== */}

          <p className="mt-4 text-center text-xs text-white/60">
            © {new Date().getFullYear()} MAYAD. All rights reserved.
          </p>

        </motion.div>

      </div>

    </main>
  );
}