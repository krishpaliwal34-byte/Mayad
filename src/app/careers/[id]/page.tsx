'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Clock,
  Award,
  Calendar,
  DollarSign,
  ChevronLeft,
  CheckCircle,
  FileText,
  Send,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  User,
  Globe,
  Link as LinkIcon,
  X,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PublicJob } from '../page';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Application form state
  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    portfolioUrl: '',
    linkedInUrl: '',
    coverLetter: '',
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/jobs/detail/${jobId}`);
      const data = await res.json();

      if (res.ok && data.success && data.job) {
        setJob(data.job);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Fetch job detail error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!appForm.fullName || !appForm.email || !appForm.phone || !appForm.resume) {
      setErrorMsg('Please fill in all required fields (Full Name, Email, Phone, Resume Link).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Apply submit error:', err);
      setErrorMsg('An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03050c] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-semibold">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[#03050c] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-32 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-2xl font-black text-white">Position Not Found</h1>
          <p className="text-slate-400 text-sm">
            This job opening may have been closed or removed by MAYAD administration.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm hover:bg-amber-500/30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Careers
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050c] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Back Navigation */}
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back to All Jobs
          </Link>

          {/* Job Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070b19] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                {job.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                {job.employmentType}
              </span>
              {job.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md">
                  FEATURED POSITION
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  {job.location}
                </span>

                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  Experience: {job.experience}
                </span>

                {job.salary && (
                  <span className="flex items-center gap-2 text-amber-300 font-bold">
                    <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
                    {job.salary}
                  </span>
                )}

                {job.deadline && (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    Deadline:{' '}
                    {new Date(job.deadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Organization</span>
                <span className="text-sm font-extrabold text-white">MAYAD Productions & Entertainment</span>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base shadow-[0_0_25px_rgba(245,197,24,0.35)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-black" />
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Details Content */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070b19] border border-white/10 space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Job Overview & Description
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-white border-b border-white/10 pb-2">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-white border-b border-white/10 pb-2">
                  Requirements & Qualifications
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-white border-b border-white/10 pb-2">
                  Required Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prominent Bottom Apply Action */}
            <div className="p-6 rounded-2xl bg-[#03050c] border border-amber-500/20 text-center space-y-4 mt-8">
              <h3 className="text-xl font-extrabold text-white">Ready to Join MAYAD?</h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                Submit your application and portfolio today. Our talent & production team will review your application.
              </p>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base shadow-[0_0_25px_rgba(245,197,24,0.35)] hover:brightness-110 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-black" />
                Apply Now For This Position
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* APPLICATION FORM MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#070b19] border border-white/10 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Submit Application</h2>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    Position: {job.title} ({job.category})
                  </p>
                </div>

                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Application Submitted Successfully</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for applying to MAYAD Entertainment. Our production & recruitment team will review your application and contact you if your profile matches our requirements.
                  </p>
                  <button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm hover:bg-amber-500/30 transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs sm:text-sm">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-center gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={appForm.fullName}
                          onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="rahul@example.com"
                          value={appForm.email}
                          onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={appForm.phone}
                          onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Resume / CV Link *
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          required
                          placeholder="Google Drive / Dropbox / Cloudinary Link"
                          value={appForm.resume}
                          onChange={(e) => setAppForm({ ...appForm, resume: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Portfolio / Showreel URL</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="https://myportfolio.com or Vimeo reel"
                          value={appForm.portfolioUrl}
                          onChange={(e) => setAppForm({ ...appForm, portfolioUrl: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile URL</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={appForm.linkedInUrl}
                          onChange={(e) => setAppForm({ ...appForm, linkedInUrl: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cover Letter / Note to Recruiters</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe your relevant experience, passion for film/entertainment, and why you are a great fit..."
                      value={appForm.coverLetter}
                      onChange={(e) => setAppForm({ ...appForm, coverLetter: e.target.value })}
                      className="w-full p-3 bg-[#03050c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 shadow-md"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 fill-black" />
                      )}
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
