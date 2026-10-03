
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Clapperboard,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    target: 7000,
    suffix: "+",
    label: "App Downloads",
    badge: "Active Growth",
    icon: Download,
  },
  {
    target: 6,
    suffix: "+",
    label: "Movies Produced",
    badge: "Cinematic Excellence",
    icon: Clapperboard,
  },
  {
    target: 20,
    suffix: "+",
    label: "Artists Working",
    badge: "Creative Community",
    icon: Users,
  },
];

export default function Numbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  // Start animation when the section becomes visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [started]);

  // Animate counters from zero
  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const startTime = performance.now();
    let frame: number;

    const animate = (time: number) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(
        stats.map((stat) =>
          Math.floor(stat.target * eased)
        )
      );

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-[#030611] via-[#080D21] to-[#030611] px-4 py-6 sm:px-6 sm:py-8 lg:py-10"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mayad-gold/10 blur-[120px]" />

      {/* Wider container */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Stat cards */}
        <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0C1226]/80 px-4 py-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-mayad-gold/40 hover:shadow-[0_15px_35px_rgba(216,182,106,0.12)] sm:px-5 sm:py-5"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mayad-gold/10 blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Badge */}
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-slate-300 sm:text-xs">
                    <TrendingUp className="h-3 w-3 text-mayad-gold" />
                    {stat.badge}
                  </span>

                  {/* Icon */}
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-mayad-gold/30 bg-mayad-gold/10 transition-transform duration-500 group-hover:scale-110">
                    <Icon
                      className="h-4 w-4 text-mayad-gold"
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Animated number */}
                  <div className="flex items-baseline gap-1">
                    <h3 className="bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                      {counts[index].toLocaleString("en-IN")}
                    </h3>

                    <span className="text-xl font-bold text-mayad-gold sm:text-2xl">
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="mt-1.5 text-sm font-bold tracking-wide text-white sm:text-base">
                    {stat.label}
                  </p>

                  {/* Accent line */}
                  <div className="mt-3 h-1 w-9 rounded-full bg-gradient-to-r from-transparent via-mayad-gold to-transparent transition-all duration-500 group-hover:w-16" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
