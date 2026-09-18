'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  EyeOff,
  ChevronRight,
  Check,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

export default function ParentalControlsPage() {
  const [parentalControl, setParentalControl] = useState(true);
  const [showPin, setShowPin] = useState(false);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (pin && pin.length < 4) {
      alert('PIN must be at least 4 digits.');
      return;
    }

    if (pin && pin !== confirmPin) {
      alert('PIN and Confirm PIN do not match.');
      return;
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#020506] text-white">
      {/* ============================================================
          TOP BACKGROUND GLOW
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-yellow-500/[0.06] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/[0.04] blur-[120px]" />
      </div>

      {/* ============================================================
          PAGE
      ============================================================ */}

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* ========================================================
            BACK BUTTON
        ======================================================== */}

        <Link
          href="/account-setting"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-mayad-gold"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Account Settings
        </Link>

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="mb-8 overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#151915] via-[#0b0f0e] to-[#050708] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-mayad-gold/10 text-mayad-gold shadow-[0_0_35px_rgba(255,193,7,0.08)] sm:h-20 sm:w-20">
                <ShieldCheck className="h-9 w-9 sm:h-10 sm:w-10" />
              </div>

              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.25em] text-mayad-gold">
                  Security & Privacy
                </p>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Security Control
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Protect your MAYAD account and manage your security settings
                  safely.
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10">
                <Check className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Protection
                </p>

                <p className="text-sm font-semibold text-white">
                  {parentalControl ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            MAIN GRID
        ======================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* ======================================================
              LEFT
          ====================================================== */}

          <div className="space-y-6">
            {/* ====================================================
                SECURITY CONTROL
            ==================================================== */}

            <section className="rounded-[24px] border border-white/[0.08] bg-[#0b0f0e]/90 p-6 shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Security Protection
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                      Turn security protection on to help protect important
                      settings on this account.
                    </p>
                  </div>
                </div>

                {/* TOGGLE */}

                <button
                  type="button"
                  onClick={() => setParentalControl(!parentalControl)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${
                    parentalControl
                      ? 'bg-mayad-gold shadow-[0_0_18px_rgba(255,193,7,0.25)]'
                      : 'bg-white/10'
                  }`}
                  aria-label="Toggle security protection"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                      parentalControl ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* ====================================================
                PIN
            ==================================================== */}

            <section className="rounded-[24px] border border-white/[0.08] bg-[#0b0f0e]/90 p-6 shadow-xl sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
                  <Lock className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Security PIN
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a PIN to protect your important account settings.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* PIN */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    New PIN
                  </label>

                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={6}
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="Enter 4-6 digit PIN"
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 pr-12 text-white outline-none transition-all placeholder:text-slate-600 focus:border-mayad-gold/50 focus:ring-1 focus:ring-mayad-gold/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-mayad-gold"
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5 opacity-60" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PIN */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Confirm PIN
                  </label>

                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) =>
                      setConfirmPin(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="Confirm your PIN"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-mayad-gold/50 focus:ring-1 focus:ring-mayad-gold/20"
                  />
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mayad-gold" />
                Keep your security PIN private and never share it with anyone.
              </p>
            </section>

            {/* ====================================================
                DEVICES
            ==================================================== */}

            <section className="rounded-[24px] border border-white/[0.08] bg-[#0b0f0e]/90 p-6 shadow-xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
                    <Smartphone className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Protected Devices
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Security settings apply to devices using this account.
                    </p>
                  </div>
                </div>

                <ChevronRight className="hidden h-5 w-5 text-slate-600 sm:block" />
              </div>
            </section>

            {/* ====================================================
                SAVE
            ==================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {saved && (
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400">
                  <Check className="h-4 w-4" />
                  Settings saved successfully
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-7 py-3 text-sm font-black text-black shadow-glow-gold transition-all hover:brightness-110"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* ======================================================
              RIGHT INFO
          ====================================================== */}

          <aside className="h-fit space-y-6 lg:sticky lg:top-28">
            {/* SECURITY CARD */}

            <section className="rounded-[24px] border border-mayad-gold/10 bg-gradient-to-br from-[#15150d] to-[#080b0a] p-6 shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
                <Lock className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Keep your account safe
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use a secure PIN to protect your MAYAD account settings.
              </p>

              <div className="mt-6 space-y-3">
                <InfoItem text="Protect your account settings" />
                <InfoItem text="Keep security settings private" />
                <InfoItem text="Prevent unauthorized changes" />
              </div>
            </section>

            {/* WARNING */}

            <section className="rounded-[24px] border border-amber-400/10 bg-amber-400/[0.04] p-6">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Important
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Make sure your security PIN is different from your account
                    password and keep it private.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* ============================================================
          STYLES
      ============================================================ */}

      <style jsx>{`
        @keyframes pageFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        main {
          animation: pageFade 0.45s ease-out;
        }
      `}</style>
    </main>
  );
}

/* ================================================================
   INFO ITEM
================================================================ */

function InfoItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-mayad-gold/10">
        <Check className="h-3 w-3 text-mayad-gold" />
      </div>

      <span className="text-xs font-semibold text-slate-300">
        {text}
      </span>
    </div>
  );
}