'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import {
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Settings,
  Bookmark,
  PlaySquare,
  CreditCard,
  Tv,
  ChevronRight,
  LogOut,
  Sparkles,
  Crown,
  CheckCircle2,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  rememberMe?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH REAL USER FROM BACKEND
  // ============================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('mayad_token');

        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || 'Unable to load profile'
          );
        }

        const backendUser = data?.user || data;

        setUser(backendUser);

        localStorage.setItem(
          'mayad_user',
          JSON.stringify(backendUser)
        );
      } catch (error) {
        console.error(
          'Profile fetch error:',
          error
        );

        localStorage.removeItem('mayad_token');
        localStorage.removeItem('mayad_user');

        window.dispatchEvent(
          new Event('mayad-auth-change')
        );

        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem('mayad_token');
    localStorage.removeItem('mayad_user');

    window.dispatchEvent(
      new Event('mayad-auth-change')
    );

    router.push('/');
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : '';

  const initials = (
    `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`
      .trim() || 'U'
  ).toUpperCase();

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      )
    : '—';

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#02070A] text-white">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-mayad-gold" />

          <p className="mt-5 text-sm font-semibold text-slate-400">
            Loading your profile...
          </p>

        </div>
      </main>
    );
  }

  // ============================================================
  // NO USER
  // ============================================================

  if (!user) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02070A] pb-20 pt-28 text-white">

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[130px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-40 top-[40%] h-[550px] w-[550px] rounded-full bg-amber-500/10 blur-[140px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.07),transparent_35%)]" />

      </div>


      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            PROFILE HERO
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-transparent shadow-2xl backdrop-blur-xl"
        >

          {/* Glow */}

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-mayad-gold/10 blur-[100px]" />


          <div className="relative p-6 sm:p-10 lg:p-12">

            <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">

              {/* ==================================================
                  AVATAR
              ================================================== */}

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-mayad-gold/30 bg-gradient-to-br from-mayad-gold to-amber-500 text-5xl font-black text-black shadow-[0_0_50px_rgba(255,193,7,0.2)] sm:h-36 sm:w-36 sm:text-6xl"
              >

                {initials}

                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#071015] bg-green-500">

                  <CheckCircle2 className="h-4 w-4 text-white" />

                </div>

              </motion.div>


              {/* ==================================================
                  USER INFORMATION
              ================================================== */}

              <div className="flex-1">

                <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    {fullName || 'MAYAD User'}
                  </h1>

                  <Sparkles className="h-6 w-6 text-mayad-gold" />

                </div>


                <p className="flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start sm:text-base">

                  <Mail className="h-4 w-4 text-mayad-gold" />

                  {user.email}

                </p>


                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                      user.isActive === false
                        ? 'border-red-500/20 bg-red-500/10 text-red-400'
                        : 'border-green-500/20 bg-green-500/10 text-green-400'
                    }`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.isActive === false
                          ? 'bg-red-400'
                          : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]'
                      }`}
                    />

                    {user.isActive === false
                      ? 'Inactive Account'
                      : 'Active Account'}

                  </span>


                  <span className="rounded-full border border-mayad-gold/20 bg-mayad-gold/10 px-4 py-2 text-xs font-bold text-mayad-gold">
                    {user.role || 'User'}
                  </span>

                </div>

              </div>


              {/* ==================================================
                  EDIT PROFILE
              ================================================== */}

              <Link
                href="/profile-details"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-mayad-gold to-amber-500 px-5 py-3.5 text-sm font-black text-black shadow-[0_0_25px_rgba(255,193,7,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,193,7,0.3)]"
              >

                <Settings className="h-4 w-4" />

                Edit Profile

              </Link>

            </div>

          </div>

        </motion.section>


        {/* ======================================================
            PROFILE CONTENT
        ====================================================== */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ====================================================
              PERSONAL INFORMATION
          ==================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mayad-gold/10">

                <UserCircle className="h-6 w-6 text-mayad-gold" />

              </div>


              <div>

                <p className="text-xs font-black uppercase tracking-widest text-mayad-gold">
                  PROFILE
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Personal Information
                </h2>

              </div>

            </div>


            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <ProfileItem
                icon={<UserCircle className="h-4 w-4" />}
                label="First Name"
                value={user.firstName || '—'}
              />


              <ProfileItem
                icon={<UserCircle className="h-4 w-4" />}
                label="Last Name"
                value={user.lastName || '—'}
              />


              <ProfileItem
                icon={<Mail className="h-4 w-4" />}
                label="Email Address"
                value={user.email || '—'}
              />


              <ProfileItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone Number"
                value={user.phone || '—'}
              />


              <ProfileItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Account Role"
                value={user.role || 'User'}
              />


              <ProfileItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Member Since"
                value={createdDate}
              />

            </div>

          </motion.section>


          {/* ====================================================
              ACCOUNT STATUS
          ==================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mayad-gold/10">

              <ShieldCheck className="h-7 w-7 text-mayad-gold" />

            </div>


            <p className="mt-6 text-xs font-black uppercase tracking-widest text-mayad-gold">
              ACCOUNT STATUS
            </p>


            <h2 className="mt-2 text-2xl font-black">
              {user.isActive === false
                ? 'Inactive'
                : 'Active'}
            </h2>


            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Your account status is provided directly by the
              MAYAD authentication system.
            </p>


            <div
              className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${
                user.isActive === false
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-green-500/20 bg-green-500/5'
              }`}
            >

              <span
                className={`h-3 w-3 rounded-full ${
                  user.isActive === false
                    ? 'bg-red-400'
                    : 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]'
                }`}
              />

              <span
                className={`text-sm font-bold ${
                  user.isActive === false
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}
              >
                {user.isActive === false
                  ? 'Account Inactive'
                  : 'Account Verified'}
              </span>

            </div>

          </motion.section>

        </div>


        {/* ======================================================
            QUICK ACCESS
        ====================================================== */}

        <motion.section
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
            delay: 0.2,
          }}
          className="mt-8"
        >

          <div className="mb-5">

            <p className="text-xs font-black uppercase tracking-widest text-mayad-gold">
              QUICK ACCESS
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Your MAYAD
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              href="/watchlist"
              icon={<Bookmark className="h-5 w-5" />}
              title="My Watchlist"
              description="Saved movies"
            />


            <QuickAction
              href="/rent-videos"
              icon={<PlaySquare className="h-5 w-5" />}
              title="Rent Videos"
              description="Your rented content"
            />


            <QuickAction
              href="/payment-history"
              icon={<CreditCard className="h-5 w-5" />}
              title="Payments"
              description="Payment history"
            />


            <QuickAction
              href="/pay-per-view"
              icon={<Tv className="h-5 w-5" />}
              title="Pay Per View"
              description="PPV history"
            />

          </div>

        </motion.section>


        {/* ======================================================
            MEMBERSHIP
        ====================================================== */}

        <motion.section
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
            delay: 0.3,
          }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mayad-gold/[0.08] to-white/[0.025] p-7 shadow-2xl backdrop-blur-xl"
        >

          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-mayad-gold/10 blur-3xl" />


          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mayad-gold/10">

                <Crown className="h-7 w-7 text-mayad-gold" />

              </div>


              <div>

                <p className="text-xs font-black uppercase tracking-widest text-mayad-gold">
                  MEMBERSHIP
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  Subscription Details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Subscription data will appear here once it is
                  available from the MAYAD backend.
                </p>

              </div>

            </div>


            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-slate-400">

              <CreditCard className="h-4 w-4 text-mayad-gold" />

              No subscription data

            </div>

          </div>

        </motion.section>


        {/* ======================================================
            LOGOUT
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="mt-6"
        >

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center justify-between rounded-2xl border border-red-500/10 bg-red-500/[0.03] px-5 py-4 text-left transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                <LogOut className="h-5 w-5 text-red-400" />

              </div>


              <div>

                <p className="font-bold text-red-400">
                  Logout
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Sign out from this device
                </p>

              </div>

            </div>


            <ChevronRight className="h-5 w-5 text-red-400 transition-transform group-hover:translate-x-1" />

          </button>

        </motion.div>


        {/* ======================================================
            SECURITY NOTE
        ====================================================== */}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/10 bg-green-500/[0.03] px-5 py-4 text-xs text-slate-400">

          <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />

          <span>
            Your profile information is securely loaded from
            the MAYAD authentication backend.
          </span>

        </div>

      </div>

    </main>
  );
}


// ============================================================
// PROFILE ITEM
// ============================================================

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#02070A]/70 p-5 transition-all duration-300 hover:border-mayad-gold/20 hover:bg-white/[0.045]">

      <div className="flex items-center gap-2 text-mayad-gold">

        {icon}

        <p className="text-xs font-semibold text-slate-500">
          {label}
        </p>

      </div>


      <p className="mt-3 break-all text-base font-bold text-white transition-colors group-hover:text-mayad-gold">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-mayad-gold/30 hover:bg-white/[0.06]"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold transition-transform duration-300 group-hover:scale-105">

          {icon}

        </div>


        <div>

          <p className="font-bold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <ChevronRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-mayad-gold" />

    </Link>
  );
}