'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserCircle,
  ShieldCheck,
  Bookmark,
  PlaySquare,
  CreditCard,
  Tv,
  Smartphone,
  Pencil,
  Crown,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Monitor,
  Smartphone as MobileIcon,
  Tablet,
  LogOut,
  Settings,
} from 'lucide-react';

export default function AccountSettingPage() {
  const menuItems = [
    {
      label: 'Account Settings',
      href: '/account-setting',
      icon: UserCircle,
      active: true,
    },
    {
      label: 'Parental Controls',
      href: '/parental-controls',
      icon: ShieldCheck,
    },
    {
      label: 'My Watchlist',
      href: '/watchlist',
      icon: Bookmark,
    },
    {
      label: 'Rent Videos',
      href: '/rent-videos',
      icon: PlaySquare,
    },
    {
      label: 'Payment History',
      href: '/payment-history',
      icon: CreditCard,
    },
    {
      label: 'Profile Details',
      href: "/profile",
      icon: UserCircle,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02070A] text-white pt-28 pb-20">

      {/* ============================================================
          BACKGROUND AMBIENT EFFECTS
      ============================================================ */}

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
          className="
            absolute
            -left-40
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-yellow-500/10
            blur-[120px]
          "
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
          className="
            absolute
            -right-40
            top-[35%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-amber-500/10
            blur-[130px]
          "
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.06),transparent_35%)]" />

      </div>


      {/* ============================================================
          MAIN CONTAINER
      ============================================================ */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            TOP PROFILE HEADER
        ============================================================ */}

        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            relative
            mb-8
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-br
            from-white/[0.08]
            via-white/[0.03]
            to-transparent
            p-6
            shadow-2xl
            backdrop-blur-xl
            sm:p-8
          "
        >

          {/* Header Glow */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mayad-gold/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="
                  relative
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-mayad-gold
                  to-amber-500
                  text-3xl
                  font-black
                  text-black
                  shadow-[0_0_40px_rgba(255,193,7,0.25)]
                "
              >
                K

                <span className="
                  absolute
                  -bottom-1
                  -right-1
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-[#071015]
                  bg-green-500
                ">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
              </motion.div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="text-2xl font-black sm:text-3xl">
                    Krish Paliwal
                  </h2>

                  <Sparkles className="h-5 w-5 text-mayad-gold" />
                </div>

                <p className="text-sm text-slate-400 sm:text-base">
                  krishpaliwal34@gmail.com
                </p>

                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  Account Active
                </div>
              </div>

            </div>

            <Link
              href="/profile-details"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition-all
                duration-300
                hover:border-mayad-gold/40
                hover:bg-mayad-gold/10
                hover:text-mayad-gold
              "
            >
              <Settings className="h-4 w-4" />
              Manage Profile
            </Link>

          </div>
        </motion.div>


        {/* ============================================================
            MAIN GRID
        ============================================================ */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* ========================================================
              SIDEBAR
          ======================================================== */}

          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >

            <div className="space-y-3">

              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        group
                        relative
                        flex
                        items-center
                        justify-between
                        overflow-hidden
                        rounded-2xl
                        border
                        px-5
                        py-4
                        transition-all
                        duration-300
                        ${item.active
                          ? `
                              border-mayad-gold/60
                              bg-gradient-to-r
                              from-mayad-gold
                              to-amber-500
                              text-black
                              shadow-[0_0_30px_rgba(255,193,7,0.18)]
                            `
                          : `
                              border-white/[0.07]
                              bg-white/[0.035]
                              text-white
                              backdrop-blur-xl
                              hover:-translate-y-0.5
                              hover:border-mayad-gold/30
                              hover:bg-white/[0.07]
                            `
                        }
                      `}
                    >

                      {!item.active && (
                        <div className="
                          absolute
                          inset-y-0
                          left-0
                          w-1
                          origin-bottom
                          scale-y-0
                          bg-mayad-gold
                          transition-transform
                          duration-300
                          group-hover:scale-y-100
                        " />
                      )}

                      <div className="flex items-center gap-4">

                        <Icon
                          className={`
                            h-5 w-5
                            ${item.active
                              ? 'text-black'
                              : 'text-mayad-gold'
                            }
                          `}
                        />

                        <span className="text-sm font-bold sm:text-base">
                          {item.label}
                        </span>

                      </div>

                      {!item.active && (
                        <ChevronRight className="
                          h-4
                          w-4
                          text-slate-500
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                          group-hover:text-mayad-gold
                        " />
                      )}

                    </Link>
                  </motion.div>
                );
              })}


              {/* Logout */}
              <button
                type="button"
                className="
                  group
                  mt-5
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-red-500/10
                  bg-red-500/[0.03]
                  px-5
                  py-4
                  text-left
                  text-sm
                  font-bold
                  text-red-400
                  transition-all
                  duration-300
                  hover:border-red-500/30
                  hover:bg-red-500/10
                "
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>

            </div>
          </motion.aside>


          {/* ========================================================
              CONTENT
          ======================================================== */}

          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-9"
          >

            {/* Page Heading */}

            <div className="mb-8">

              <p className="
                mb-2
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-mayad-gold
              ">
                ACCOUNT CENTER
              </p>

              <h1 className="
                text-4xl
                font-black
                tracking-tight
                text-white
                sm:text-5xl
              ">
                Account Setting
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Manage your subscription, devices and account preferences
                from one place.
              </p>

            </div>


            {/* ========================================================
                SUBSCRIPTION + CONTACT
            ======================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* Subscription */}

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-gradient-to-br
                  from-white/[0.07]
                  to-white/[0.025]
                  p-7
                  shadow-2xl
                  backdrop-blur-xl
                  xl:col-span-2
                "
              >

                <div className="
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-mayad-gold/10
                  blur-3xl
                  transition-all
                  duration-500
                  group-hover:bg-mayad-gold/20
                " />

                <div className="relative">

                  <div className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-mayad-gold/10
                    text-mayad-gold
                  ">
                    <Crown className="h-7 w-7" />
                  </div>

                  <p className="
                    text-xs
                    font-black
                    uppercase
                    tracking-widest
                    text-mayad-gold
                  ">
                    MEMBERSHIP
                  </p>

                  <h2 className="
                    mt-2
                    max-w-xl
                    text-2xl
                    font-black
                    leading-tight
                    sm:text-3xl
                  ">
                    You do not have an active subscription.
                  </h2>

                  <p className="mt-3 text-sm text-slate-400 sm:text-base">
                    Unlock premium Rajasthani cinema, MAYAD Originals and
                    exclusive content.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-7
                      inline-flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-gradient-to-r
                      from-mayad-gold
                      to-amber-500
                      px-6
                      py-3.5
                      text-sm
                      font-black
                      text-black
                      shadow-[0_0_25px_rgba(255,193,7,0.18)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_0_35px_rgba(255,193,7,0.3)]
                    "
                  >
                    <Crown className="h-5 w-5 fill-current" />
                    Subscribe Now
                  </button>

                </div>
              </motion.div>
            </div>


            {/* ========================================================
                ACTIVE DEVICES
            ======================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="
                mt-6
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                shadow-2xl
                backdrop-blur-xl
              "
            >

              <div className="border-b border-white/[0.07] p-7">

                <div className="flex items-center gap-5">

                  <div className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-mayad-gold/10
                  ">
                    <Monitor className="h-7 w-7 text-mayad-gold" />
                  </div>

                  <div>
                    <p className="
                      text-xs
                      font-black
                      uppercase
                      tracking-widest
                      text-mayad-gold
                    ">
                      SECURITY
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Active Devices
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Manage devices currently signed in to your account.
                    </p>
                  </div>

                </div>

              </div>


              {/* Device */}

              <div className="p-5 sm:p-7">

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#02070A]/80
                    p-5
                    transition-all
                    duration-300
                    hover:border-mayad-gold/20
                  "
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-mayad-gold
                        to-amber-500
                        text-xl
                        font-black
                        text-black
                        shadow-[0_0_20px_rgba(255,193,7,0.15)]
                      ">
                        K
                      </div>

                      <div>

                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">
                            Current Device
                          </p>

                          <span className="
                            rounded-full
                            bg-green-500/10
                            px-2
                            py-0.5
                            text-[10px]
                            font-bold
                            text-green-400
                          ">
                            THIS DEVICE
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Windows • Chrome
                        </p>

                      </div>

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-green-500/20
                      bg-green-500/10
                      px-4
                      py-2
                      text-xs
                      font-bold
                      text-green-400
                    ">
                      <span className="
                        h-2
                        w-2
                        rounded-full
                        bg-green-400
                        shadow-[0_0_10px_rgba(74,222,128,0.8)]
                      " />
                      Active
                    </div>

                  </div>

                </motion.div>

              </div>

            </motion.div>


            {/* ========================================================
                ACCOUNT INFORMATION
            ======================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="
                mt-6
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                p-7
                shadow-2xl
                backdrop-blur-xl
              "
            >

              <div className="flex items-center gap-4">

                <div className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-mayad-gold/10
                ">
                  <UserCircle className="h-6 w-6 text-mayad-gold" />
                </div>

                <div>
                  <p className="
                    text-xs
                    font-black
                    uppercase
                    tracking-widest
                    text-mayad-gold
                  ">
                    PERSONAL DETAILS
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Account Information
                  </h2>
                </div>

              </div>


              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Name */}

                <div className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#02070A]/70
                  p-5
                  transition-all
                  duration-300
                  hover:border-mayad-gold/20
                ">

                  <p className="text-xs font-semibold text-slate-500">
                    ACCOUNT NAME
                  </p>

                  <p className="
                    mt-2
                    text-base
                    font-bold
                    text-white
                    transition-colors
                    group-hover:text-mayad-gold
                  ">
                    Krish Paliwal
                  </p>

                </div>


                {/* Email */}

                <div className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#02070A]/70
                  p-5
                  transition-all
                  duration-300
                  hover:border-mayad-gold/20
                ">

                  <p className="text-xs font-semibold text-slate-500">
                    EMAIL ADDRESS
                  </p>

                  <p className="
                    mt-2
                    break-all
                    text-base
                    font-bold
                    text-white
                    transition-colors
                    group-hover:text-mayad-gold
                  ">
                    krishpaliwal34@gmail.com
                  </p>

                </div>

              </div>

            </motion.div>


            {/* ========================================================
                SECURITY FOOTER
            ======================================================== */}

            <div className="
              mt-6
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-green-500/10
              bg-green-500/[0.03]
              px-5
              py-4
              text-xs
              text-slate-400
            ">

              <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />

              <span>
                Your account information is protected with secure
                authentication and encrypted connections.
              </span>

            </div>

          </motion.section>

        </div>

      </div>

    </main>
  );
}