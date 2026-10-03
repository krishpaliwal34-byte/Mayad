"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ChevronDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-60px)] w-full items-center overflow-hidden bg-[#650900] sm:min-h-[720px] lg:min-h-[calc(100vh-70px)]">
      {/* Background Image Artwork */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="MAYAD Rajasthan Cultural Voice"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[28%_center] sm:object-center"
        />
      </div>

      {/* Lighting & Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,_var(--tw-gradient-stops))] from-black/50 via-transparent to-black/65" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] items-center justify-center px-4 pt-12 pb-36 sm:px-8 sm:pt-16 sm:pb-32 lg:justify-end lg:pb-28 lg:pr-16 xl:pr-24">
        <div className="flex w-full max-w-xl flex-col items-center text-center lg:w-[60%] lg:max-w-none xl:w-[56%]">

          {/* Subtitle Badge */}
          <div className="mb-2 flex flex-col items-center sm:mb-3">
            <div className="mb-1 flex w-36 items-center justify-center gap-2 sm:w-64 sm:gap-3">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/50 to-white/90" />
              <span className="rotate-45 border border-white/60 bg-white/20 p-0.5 text-[8px] text-white sm:text-[10px]"></span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/50 to-white/90" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-xs sm:tracking-[0.28em] md:text-sm">
              RAJASTHAN'S CULTURAL VOICE
            </span>

            <div className="mt-1 h-[1px] w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-24" />
          </div>

          {/* Bold Stylish Main Heading */}
          <div className="relative my-2 flex -rotate-2 select-none flex-col items-center sm:my-4">

            {/* White Heading */}
            <div className="relative inline-block px-2 py-1 sm:px-3 sm:py-1.5">
              <div className="absolute inset-0 -z-10 scale-105 rounded-xl bg-black/60 blur-xl sm:blur-2xl" />

              <h1 className="relative font-black text-4xl tracking-wide text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6rem] [text-shadow:_2px_3px_6px_rgba(0,0,0,0.95)] sm:[text-shadow:_3px_4px_8px_rgba(0,0,0,0.95)]">
                हेलो मायड़
              </h1>
            </div>

            {/* Golden Yellow Heading */}
            <div className="relative mt-1 inline-block px-3 py-1.5 sm:mt-2 sm:px-4 sm:py-2">
              <div className="absolute inset-0 -z-10 scale-105 rounded-xl bg-black/65 blur-xl sm:blur-2xl" />

              <span className="relative font-black text-4xl tracking-wide text-[#ffc83b] drop-shadow-[0_6px_18px_rgba(0,0,0,0.95)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6rem] [text-shadow:_2px_3px_8px_rgba(0,0,0,0.95)] sm:[text-shadow:_3px_4px_10px_rgba(0,0,0,0.95)]">
                भाषा रो
              </span>
            </div>
          </div>

          {/* Subtext Description */}
          <p className="mt-3 max-w-md text-center text-[11px] font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:mt-4 sm:max-w-xl sm:text-sm sm:leading-relaxed md:text-base">
            राजस्थान री माटी, मायड़ री भाषा अर आपणी संस्कृति ने दुनिया तक पहुंचावां। आओ, एक साथ मिलकर राजस्थान री कला, हुनर अर कहाणी ने नवी पहचान देवां।
          </p>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-7 sm:gap-5">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffca28] via-[#ffd54f] to-[#ffb300] px-5 py-3 text-xs font-extrabold text-black shadow-[0_0_24px_rgba(255,202,40,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(255,202,40,0.85)] sm:gap-2 sm:px-8 sm:py-4 sm:text-base"
            >
              <span>Join the Movement</span>
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
            </Link>

            <a
              href="#movies"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/40 bg-black/40 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:bg-black/60 sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-white/10 transition-colors group-hover:border-yellow-400 group-hover:text-yellow-400 sm:h-6 sm:w-6">
                <Play className="ml-0.5 h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />
              </span>
              <span>Explore MAYAD</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 opacity-90 transition-opacity hover:opacity-100">
        <div className="flex h-6 w-3.5 justify-center rounded-full border-2 border-white/80 pt-1 shadow-md sm:h-7 sm:w-4">
          <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-white" />
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-widest text-white/90 drop-shadow-md sm:text-[10px]">
          Scroll Down
        </span>

        <ChevronDown className="-mt-0.5 h-3 w-3 animate-bounce text-white/90 sm:h-3.5 sm:w-3.5" />
      </div>
    </section>
  );
}
