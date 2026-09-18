'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';

import { POPULAR_PERSONALITIES } from '@/data/content';
import { useApp } from '@/context/AppContext';

export default function PopularPersonalities() {
  const { t } = useApp();

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#02090d] pt-12 pb-10 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-14">

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute left-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />


      <div className="relative z-10 mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 text-center sm:mb-10">

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-mayad-gold sm:mb-3 sm:px-3 sm:py-1.5 sm:text-[10px]">

            <Star className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />

            <span>
              {t('rajasthaniEntertainment')}
            </span>

          </div>


          <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
            {t('popularPersonalities')}
          </h2>


          <p className="mx-auto mt-1.5 max-w-2xl text-[11px] leading-relaxed text-slate-400 sm:mt-2 sm:text-base">
            {t('personalitiesSubtitle')}
          </p>

        </div>


        {/* =====================================================
            PERSONALITIES
        ====================================================== */}

        <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-center sm:gap-7 lg:gap-10">

          {POPULAR_PERSONALITIES.map((person, index) => (

            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              whileHover={{ y: -6 }}
              className="min-w-0"
            >

              <Link
                href={`/artists/${person.id}`}
                className="group flex min-w-0 flex-col items-center text-center outline-none"
              >

                {/* =================================================
                    IMAGE
                ================================================== */}

                <div
                  className="
                    relative
                    h-[56px]
                    w-[56px]
                    overflow-hidden
                    rounded-full
                    border
                    border-white/20
                    bg-slate-900
                    shadow-[0_0_20px_rgba(0,0,0,0.4)]
                    transition-all
                    duration-500
                    group-hover:border-mayad-gold
                    group-hover:shadow-[0_0_25px_rgba(245,180,40,0.20)]
                    sm:h-[110px]
                    sm:w-[110px]
                    lg:h-[175px]
                    lg:w-[175px]
                  "
                >

                  <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    sizes="175px"
                    className="
                      object-cover
                      object-top
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />


                  {/* Gradient */}

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />


                  {/* Gold Ring */}

                  <div
                    className="
                      absolute
                      inset-0
                      rounded-full
                      border
                      border-transparent
                      transition-all
                      duration-500
                      group-hover:border-mayad-gold/70
                      sm:border-2
                    "
                  />


                  {/* Open Icon */}

                  <div
                    className="
                      absolute
                      bottom-0.5
                      right-0.5
                      flex
                      h-4
                      w-4
                      scale-75
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-black/75
                      text-white
                      opacity-0
                      backdrop-blur-md
                      transition-all
                      duration-300
                      group-hover:scale-100
                      group-hover:opacity-100
                      sm:bottom-2
                      sm:right-2
                      sm:h-7
                      sm:w-7
                    "
                  >
                    <ChevronRight className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                  </div>

                </div>


                {/* =================================================
                    NAME
                ================================================== */}

                <h3
                  className="
                    mt-2
                    w-full
                    truncate
                    px-0.5
                    text-[9px]
                    font-bold
                    leading-tight
                    text-white
                    transition-colors
                    duration-300
                    group-hover:text-mayad-gold
                    sm:mt-4
                    sm:text-sm
                    lg:text-lg
                  "
                >
                  {person.name}
                </h3>


                {/* =================================================
                    ROLE
                ================================================== */}

                <p
                  className="
                    mt-0.5
                    w-full
                    truncate
                    px-0.5
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                    sm:mt-1
                    sm:text-[9px]
                    lg:text-[11px]
                  "
                >
                  {person.role}
                </p>

              </Link>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}