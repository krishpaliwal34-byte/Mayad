'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Film,
  Tv,
  Users,
  Crown,
} from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Movies',
    href: '/movies',
    icon: Film,
  },
  {
    label: 'TV Shows',
    href: '/series',
    icon: Tv,
  },
  {
    label: 'Artists',
    href: '/artists',
    icon: Users,
  },
  {
    label: 'Founder',
    href: '/founder',
    icon: Crown,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[9999]
        block
        px-3
        pb-[calc(8px+env(safe-area-inset-bottom))]
        pt-2
        sm:hidden
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[68px]
          max-w-md
          items-center
          justify-around
          rounded-[22px]
          border
          border-white/10
          bg-[#111116]/95
          px-1.5
          shadow-[0_-10px_35px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
        "
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="
                relative
                flex
                h-[58px]
                min-w-[58px]
                flex-1
                flex-col
                items-center
                justify-center
                gap-1
                rounded-[18px]
                transition-all
                duration-300
              "
            >
              {/* Active background */}
              {active && (
                <span
                  className="
                    absolute
                    inset-x-1
                    inset-y-0.5
                    rounded-[17px]
                    bg-mayad-gold
                    shadow-[0_6px_20px_rgba(212,175,55,0.22)]
                  "
                />
              )}

              {/* Icon */}
              <span
                className={`
                  relative
                  z-10
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  ${active
                    ? 'text-black'
                    : 'text-slate-400'}
                `}
              >
                <Icon
                  className={`
                    h-[19px]
                    w-[19px]
                    transition-transform
                    duration-300
                    ${active ? 'scale-105' : ''}
                  `}
                  strokeWidth={active ? 2.4 : 1.8}
                />
              </span>

              {/* Label */}
              <span
                className={`
                  relative
                  z-10
                  whitespace-nowrap
                  text-[9px]
                  font-semibold
                  leading-none
                  transition-colors
                  duration-300
                  ${active
                    ? 'text-black'
                    : 'text-slate-500'}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}