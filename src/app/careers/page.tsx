'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Loader2,
  Calendar,
  Filter,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

export interface PublicJob {
  _id: string;
  title: string;
  category: string;
  location: string;
  employmentType: string;
  experience: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  deadline?: string;
  featured: boolean;
  createdAt: string;
}

const CATEGORY_OPTIONS = [
  'All',
  'FILM & PRODUCTION',
  'ACTING & TALENT',
  'MUSIC',
  'CREATIVE',
];

const EMPLOYMENT_OPTIONS = ['All', 'Full Time', 'Part Time', 'Internship', 'Freelance', 'Contract'];

export default function CareersPage() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEmployment, setSelectedEmployment] = useState('All');

  useEffect(() => {
    fetchPublicJobs();
  }, [selectedCategory, selectedEmployment]);

  const fetchPublicJobs = async () => {
    try {
      setLoading(true);
      let query = `?category=${encodeURIComponent(selectedCategory)}&employmentType=${encodeURIComponent(selectedEmployment)}`;
      if (search.trim()) {
        query += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(`${BACKEND_URL}/api/jobs${query}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Fetch public jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPublicJobs();
  };

  return (
    <div className="min-h-screen bg-[#03050c] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-white/10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,197,24,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              MAYAD Entertainment Careers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Build Your Career With <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">MAYAD</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Join the team creating, discovering and promoting the next generation of entertainment.
            </motion.p>
          </div>
        </section>

        {/* SEARCH & FILTERS SECTION */}
        <section className="max-w-6xl mx-auto px-4 -mt-7 relative z-20">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#070b19] border border-white/10 shadow-2xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search positions by role, title, skills or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#03050c] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                Search Jobs
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-amber-400" /> Category:
                </span>
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Type:</span>
                <select
                  value={selectedEmployment}
                  onChange={(e) => setSelectedEmployment(e.target.value)}
                  className="bg-[#03050c] border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
                >
                  {EMPLOYMENT_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* OPEN POSITIONS LIST */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-amber-400" />
                Open Positions
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Explore available opportunities in film production, acting, music, and creative arts.
              </p>
            </div>

            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              {jobs.length} Active Opening{jobs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold">Loading current job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#070b19] border border-white/10 text-center space-y-4">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No positions matching criteria</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                We couldn't find any job openings matching your current search or category filter. Try clearing filters or check back soon!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedEmployment('All');
                  setSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-6 rounded-2xl bg-[#070b19] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xl"
                >
                  {job.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md">
                      FEATURED
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        {job.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">
                        {job.employmentType}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {job.experience}
                        </span>
                        {job.deadline && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            Apply by:{' '}
                            {new Date(job.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-semibold">
                      {job.salary ? job.salary : 'Competitive Compensation'}
                    </span>

                    <Link
                      href={`/careers/${job._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-md hover:brightness-110 transition-all"
                    >
                      View Details & Apply
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
