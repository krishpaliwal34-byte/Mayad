'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronLeft, Briefcase } from 'lucide-react';
import { adminService, AdminUser } from '@/services/adminService';
import AdminCareerManagement from '@/components/AdminCareerManagement';

export default function AdminCareerPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await adminService.getMe();
        if (res.success && (res.admin || res.user)) {
          setAdminUser((res.admin || res.user) as AdminUser);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAdmin();
  }, [router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#03050c] flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
          <ShieldCheck className="w-6 h-6 text-amber-400 absolute" />
        </div>
        <h2 className="text-xl font-bold tracking-wide text-amber-300">Verifying Admin Credentials...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050c] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white uppercase">
              MAYAD Admin Portal
            </span>
          </div>
        </div>

        <AdminCareerManagement />
      </div>
    </div>
  );
}
