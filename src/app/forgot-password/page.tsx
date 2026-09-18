'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [resendTimer, setResendTimer] = useState(0);

  // ============================================================
  // SEND OTP
  // ============================================================

  const handleSendOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to send OTP.'
        );
      }

      setMessage(
        data.message ||
          'OTP has been sent to your registered email.'
      );

      setStep('otp');
      startResendTimer();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/verify-reset-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Invalid OTP.'
        );
      }

      setMessage(
        data.message || 'OTP verified successfully.'
      );

      setStep('password');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            otp,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to reset password.'
        );
      }

      setStep('success');
      setMessage(
        data.message ||
          'Your password has been changed successfully.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESEND TIMER
  // ============================================================

  const startResendTimer = () => {
    setResendTimer(60);

    const timer = window.setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  };

  // ============================================================
  // RESEND OTP
  // ============================================================

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendLoading) return;

    setError('');
    setMessage('');
    setResendLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to resend OTP.'
        );
      }

      setMessage(
        data.message || 'A new OTP has been sent.'
      );

      startResendTimer();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to resend OTP.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    setError('');
    setMessage('');

    if (step === 'otp') {
      setStep('email');
    } else if (step === 'password') {
      setStep('otp');
    }
  };

  // ============================================================
  // STEP DATA
  // ============================================================

  const stepNumber =
    step === 'email'
      ? 1
      : step === 'otp'
        ? 2
        : step === 'password'
          ? 3
          : 4;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020609] text-white">

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* MAYAD Background Image */}

        <Image
          src="/loginbg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Light cinematic overlay - keeps the image clearly visible */}

        <div className="absolute inset-0 bg-black/25" />

        {/* Very subtle cinematic vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.22)_100%)]" />

      </div>


      {/* ========================================================
          BACK TO LOGIN
      ======================================================== */}

      <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8">

        <Link
          href="/login"
          className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>

      </div>


      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-md"
        >

          {/* LOGO */}

          <div className="mb-7 flex justify-center">

            <Link href="/">
              <div className="relative h-12 w-36 sm:h-14 sm:w-44">
                <img
                  src="/mayadlogo.jpg"
                  alt="MAYAD"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

          </div>


          {/* CARD */}

          <div className="rounded-3xl border border-white/10 bg-[#0a1116]/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {step === 'success' ? (

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="py-6 text-center"
              >

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">

                  <CheckCircle2 className="h-11 w-11 text-emerald-400" />

                </div>

                <h1 className="text-2xl font-black text-white sm:text-3xl">
                  Password Changed
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Your MAYAD account password has been
                  successfully updated.
                </p>

                <Link
                  href="/login"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold px-5 py-3.5 text-sm font-bold text-black shadow-glow-gold transition hover:brightness-110"
                >
                  Continue to Login
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </motion.div>

            ) : (

              <>
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-7 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-mayad-gold/20 bg-mayad-gold/10">

                    {step === 'email' && (
                      <KeyRound className="h-7 w-7 text-mayad-gold" />
                    )}

                    {step === 'otp' && (
                      <ShieldCheck className="h-7 w-7 text-mayad-gold" />
                    )}

                    {step === 'password' && (
                      <LockKeyhole className="h-7 w-7 text-mayad-gold" />
                    )}

                  </div>

                  <h1 className="text-2xl font-black text-white sm:text-3xl">
                    {step === 'email' &&
                      'Forgot Password?'}

                    {step === 'otp' &&
                      'Verify OTP'}

                    {step === 'password' &&
                      'Create New Password'}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-400">

                    {step === 'email' &&
                      'Enter your registered email and we’ll send you a verification OTP.'}

                    {step === 'otp' &&
                      `Enter the 6-digit OTP sent to ${email}.`}

                    {step === 'password' &&
                      'Create a strong new password for your MAYAD account.'}

                  </p>

                </div>


                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mb-7 flex items-center gap-2">

                  {[1, 2, 3].map((number) => (

                    <React.Fragment key={number}>

                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          stepNumber >= number
                            ? 'bg-mayad-gold'
                            : 'bg-white/10'
                        }`}
                      />

                    </React.Fragment>

                  ))}

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                <AnimatePresence>

                  {error && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                    >
                      {error}
                    </motion.div>

                  )}

                </AnimatePresence>


                {/* ==================================================
                    MESSAGE
                ================================================== */}

                {message && (

                  <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                    {message}
                  </div>

                )}


                {/* ==================================================
                    EMAIL STEP
                ================================================== */}

                {step === 'email' && (

                  <form
                    onSubmit={handleSendOtp}
                    className="space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Email Address
                      </label>

                      <div className="relative">

                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          type="email"
                          value={email}
                          onChange={(event) =>
                            setEmail(event.target.value)
                          }
                          placeholder="Enter your email"
                          autoComplete="email"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-mayad-gold/50 focus:bg-white/[0.07]"
                        />

                      </div>

                    </div>


                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold py-3.5 text-sm font-bold text-black shadow-glow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}

                    </button>

                  </form>

                )}


                {/* ==================================================
                    OTP STEP
                ================================================== */}

                {step === 'otp' && (

                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Verification Code
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(event) =>
                          setOtp(
                            event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 6)
                          )
                        }
                        placeholder="000000"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-mayad-gold/50"
                      />

                    </div>


                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold py-3.5 text-sm font-bold text-black shadow-glow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify OTP
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}

                    </button>


                    <div className="flex items-center justify-between text-sm">

                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1 text-slate-400 transition hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Change email
                      </button>


                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={
                          resendTimer > 0 ||
                          resendLoading
                        }
                        className="font-semibold text-mayad-gold transition hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
                      >
                        {resendLoading
                          ? 'Sending...'
                          : resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : 'Resend OTP'}
                      </button>

                    </div>

                  </form>

                )}


                {/* ==================================================
                    PASSWORD STEP
                ================================================== */}

                {step === 'password' && (

                  <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >

                    {/* PASSWORD */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        New Password
                      </label>

                      <div className="relative">

                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-mayad-gold/50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Confirm Password
                      </label>

                      <div className="relative">

                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-mayad-gold/50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </div>


                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">

                      <div className="flex items-start gap-2">

                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-mayad-gold" />

                        <p className="text-xs leading-5 text-slate-500">
                          Use at least 6 characters. Avoid
                          using passwords that you use on
                          other websites.
                        </p>

                      </div>

                    </div>


                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-mayad-gold py-3.5 text-sm font-bold text-black shadow-glow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      )}

                    </button>


                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex w-full items-center justify-center gap-2 text-sm text-slate-500 transition hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to OTP
                    </button>

                  </form>

                )}

              </>

            )}

          </div>


          {/* FOOTER */}

          <p className="mt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} MAYAD. All rights reserved.
          </p>

        </motion.div>

      </div>

    </main>
  );
}