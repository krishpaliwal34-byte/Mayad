"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function RajasthanConnect() {
  return (
    <section className="relative overflow-hidden bg-[#030611] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-mayad-gold/5 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-mayad-gold/30 bg-mayad-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-mayad-gold">
            <MapPin size={15} />
            Explore Rajasthan
          </div>

          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            MAYAD&apos;s{" "}
            <span className="bg-gradient-to-r from-[#F5D77F] via-[#D8B66A] to-[#B38F3F] bg-clip-text text-transparent">
              Rajasthan Connect
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Discover the vibrant culture of Rajasthan. Explore its
            regional languages, folk art, traditions, music, and
            the unique cultural identity of every region.
          </p>

          {/* Explore Button */}
          <div className="mt-8">
            <Link
              href="/culture"
              className="group inline-flex items-center gap-2 rounded-full bg-mayad-gold px-7 py-3.5 font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(216,182,106,0.3)]"
            >
              Explore More
              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* Right Side - Rajasthan Map */}
        <div className="relative">
          {/* Map Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mayad-gold/10 blur-[100px]" />

          <div className="relative flex min-h-[350px] w-full items-center justify-center overflow-hidden rounded-3xl border border-mayad-gold/20 bg-[#0C1226] p-5 sm:min-h-[430px] sm:p-8">
            {/* Decorative Background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "25px 25px",
              }}
            />

            {/* Rajasthan Map Image */}
            <div className="relative z-10 flex h-[270px] w-full items-center justify-center sm:h-[340px]">
              <Image
                src="/rajasthan.png"
                alt="Map of Rajasthan"
                width={500}
                height={500}
                priority
                className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(216,182,106,0.18)]"
              />
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-5 left-5 z-20 sm:bottom-7 sm:left-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mayad-gold">
                Explore the Regions
              </p>

              <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Discover Rajasthan
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}