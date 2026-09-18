'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllText,
}: SectionHeaderProps) {
  const { t } = useApp();

  const label = viewAllText || `${t('viewAll')} →`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 sm:h-7 bg-mayad-gold rounded-full inline-block" />
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-mayad-muted font-normal ml-4">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-mayad-gold hover:text-white transition-colors ml-4 sm:ml-0"
        >
          <span>{label}</span>
        </Link>
      )}
    </div>
  );
}
