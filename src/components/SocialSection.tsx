'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/data/content';

export default function SocialSection() {
  const socials = [
    {
      name: 'Instagram',
      handle: '@mayad_ott',
      url: SOCIAL_LINKS.instagram,
      icon: Instagram,
      color: 'hover:text-pink-500 hover:border-pink-500/50',
    },
    {
      name: 'Facebook',
      handle: 'mayadrajasthani',
      url: SOCIAL_LINKS.facebook,
      icon: Facebook,
      color: 'hover:text-blue-500 hover:border-blue-500/50',
    },
    {
      name: 'YouTube',
      handle: 'MAYAD OTT',
      url: SOCIAL_LINKS.youtube,
      icon: Youtube,
      color: 'hover:text-red-500 hover:border-red-500/50',
    },
    {
      name: 'Twitter / X',
      handle: '@mayad_ott',
      url: SOCIAL_LINKS.twitter,
      icon: XIcon,
      color: 'hover:text-sky-400 hover:border-sky-400/50',
    },
  ];

  return (
    <section className="border-t border-white/5 bg-[#050816] py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl space-y-3"
        >
          <h2 className="text-3xl font-extrabold text-white">
            Follow MAYAD
          </h2>

          <p className="text-sm text-mayad-muted">
            Stay connected with the latest movies, music, stories and updates
            across our official social channels.
          </p>
        </motion.div>

        {/* SOCIAL CARDS */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1226] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[#11182f] ${social.color}`}
              >
                <div className="flex items-center gap-4 text-left">

                  {/* ICON */}
                  <div className="rounded-xl bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white group-hover:text-current" />
                  </div>

                  {/* TEXT */}
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-current">
                      {social.name}
                    </h4>

                    <span className="text-xs text-mayad-muted">
                      {social.handle}
                    </span>
                  </div>

                </div>

                <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-current" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Twitter / X Icon */
function XIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}