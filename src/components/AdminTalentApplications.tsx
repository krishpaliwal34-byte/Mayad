'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  FileText,
  Video,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  User,
  X,
  FileCheck,
} from 'lucide-react';
import {
  adminService,
  AdminTalentApplicationRecord,
} from '@/services/adminService';

interface AdminTalentApplicationsProps {
  showToast?: (text: string, type?: 'success' | 'error') => void;
  onStatsUpdate?: () => void;
}

const ALL_ROLES = [
  'All',
  'Director',
  'Actor',
  'Actress',
  'Writer',
  'Cinematographer',
  'Editor',
  'Singer',
  'Dancer',
  'Anchor',
  'Others',
];

const STATUS_OPTIONS: Array<
  'All' | 'Pending' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Rejected'
> = ['All', 'Pending', 'Under Review', 'Shortlisted', 'Approved', 'Rejected'];

export default function AdminTalentApplications({
  showToast,
  onStatsUpdate,
}: AdminTalentApplicationsProps) {
  const [applications, setApplications] = useState<AdminTalentApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    shortlisted: 0,
    approved: 0,
    rejected: 0,
  });

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal & Delete Confirmation State
  const [selectedApplication, setSelectedApplication] = useState<AdminTalentApplicationRecord | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<AdminTalentApplicationRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    if (showToast) showToast(text, type);
    else alert(text);
  };

  // Load Talent Applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTalentApplications({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        role: roleFilter,
        experienceLevel: experienceFilter,
        status: statusFilter,
      });

      if (res.success) {
        setApplications(res.applications);
        setStats(res.stats);
        setTotalPages(res.pagination.pages);
      }
    } catch (err: any) {
      console.error('Error loading talent applications:', err);
      notify(err?.message || 'Failed to load talent applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentPage, roleFilter, experienceFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadApplications();
  };

  // Update Application Status
  const handleUpdateStatus = async (
    id: string,
    newStatus: 'Pending' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Rejected'
  ) => {
    try {
      setStatusUpdateLoading(true);
      const res = await adminService.updateTalentApplicationStatus(id, newStatus);
      if (res.success) {
        notify(`Application status updated to "${newStatus}"`);
        if (selectedApplication && selectedApplication.id === id) {
          setSelectedApplication(res.application);
        }
        loadApplications();
        if (onStatsUpdate) onStatsUpdate();
      } else {
        notify(res.message || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      notify(err?.message || 'Failed to update application status', 'error');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Delete Application
  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;

    try {
      setDeleteLoading(true);
      const res = await adminService.deleteTalentApplication(applicationToDelete.id);
      if (res.success) {
        notify('Talent application deleted successfully');
        if (selectedApplication && selectedApplication.id === applicationToDelete.id) {
          setSelectedApplication(null);
        }
        setApplicationToDelete(null);
        loadApplications();
        if (onStatsUpdate) onStatsUpdate();
      } else {
        notify(res.message || 'Failed to delete application', 'error');
      }
    } catch (err: any) {
      console.error('Delete application error:', err);
      notify(err?.message || 'Failed to delete application', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper badge color for status
  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Shortlisted':
        return 'bg-[#D4AF37]/20 text-[#F5D77A] border-[#D4AF37]/40';
      case 'Under Review':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          STATS CARDS
      ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Applications</span>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
        </div>

        <div className="rounded-2xl bg-[#090d1f]/90 border border-yellow-500/30 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">Pending Review</span>
          <div className="text-2xl font-black text-yellow-300 mt-1">{stats.pending}</div>
        </div>

        <div className="rounded-2xl bg-[#090d1f]/90 border border-blue-500/30 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Under Review</span>
          <div className="text-2xl font-black text-blue-300 mt-1">{stats.underReview}</div>
        </div>

        <div className="rounded-2xl bg-[#090d1f]/90 border border-[#D4AF37]/40 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5D77A]">Shortlisted</span>
          <div className="text-2xl font-black text-[#F5D77A] mt-1">{stats.shortlisted}</div>
        </div>

        <div className="rounded-2xl bg-[#090d1f]/90 border border-emerald-500/30 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Approved</span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{stats.approved}</div>
        </div>

        <div className="rounded-2xl bg-[#090d1f]/90 border border-red-500/30 p-4 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">Rejected</span>
          <div className="text-2xl font-black text-red-300 mt-1">{stats.rejected}</div>
        </div>
      </div>

      {/* =========================================================
          FILTER & SEARCH BAR
      ========================================================= */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-2xl bg-[#090d1f]/90 border border-white/10 p-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name, email, city, state, or phone..."
            className="w-full rounded-xl bg-black/60 border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#F5D77A]" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none text-xs font-semibold cursor-pointer"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#090d1f] text-white">
                  Role: {r}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs">
            <select
              value={experienceFilter}
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="All" className="bg-[#090d1f] text-white">Exp Level: All</option>
              <option value="Newcomer" className="bg-[#090d1f] text-white">Exp Level: Newcomer</option>
              <option value="Experienced" className="bg-[#090d1f] text-white">Exp Level: Experienced</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none text-xs font-semibold cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="bg-[#090d1f] text-white">
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadApplications()}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* =========================================================
          TALENT APPLICATIONS TABLE
      ========================================================= */}
      <div className="rounded-2xl border border-white/10 bg-[#090d1f]/90 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#F5D77A]" />
            <p className="text-sm font-semibold">Loading Talent Applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Sparkles className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-lg font-bold text-white">No Talent Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registration submissions match your current search query or filter parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  <th className="py-4 px-4">Applicant</th>
                  <th className="py-4 px-4">Age / Gender</th>
                  <th className="py-4 px-4">Interested Roles</th>
                  <th className="py-4 px-4">Experience</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Submitted Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* APPLICANT PHOTO & NAME */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/30 shrink-0">
                          <img
                            src={app.profilePhoto || '/Default.jpg'}
                            alt={app.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Default.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <span className="block font-bold text-white">{app.fullName}</span>
                          <span className="text-[11px] text-slate-400">{app.city}, {app.state}</span>
                        </div>
                      </div>
                    </td>

                    {/* AGE / GENDER */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">{app.age} Yrs</span>
                      <span className="block text-[11px] text-slate-400">{app.gender}</span>
                    </td>

                    {/* INTERESTED ROLES */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.interestedRoles.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37]/15 text-[#F5D77A] border border-[#D4AF37]/30"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* EXPERIENCE */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">{app.experienceLevel}</span>
                      <span className="block text-[11px] text-slate-400">{app.yearsOfExperience || '0'} Yrs Exp</span>
                    </td>

                    {/* CONTACT */}
                    <td className="py-3 px-4">
                      <span className="block font-medium text-slate-200">{app.email}</span>
                      <span className="text-[11px] text-slate-400">WA: {app.whatsAppNumber}</span>
                    </td>

                    {/* SUBMITTED DATE */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-all"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setApplicationToDelete(app)}
                          className="p-2 rounded-lg bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 text-red-300 transition-all"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/40 text-xs">
            <span className="text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          APPLICANT FULL DETAILS MODAL
      ========================================================= */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#090d1f] p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto my-8"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedApplication(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL HEADER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-white/10 pb-6 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black border-2 border-[#D4AF37]/50 shrink-0 shadow-lg">
                  <img
                    src={selectedApplication.profilePhoto || '/Default.jpg'}
                    alt={selectedApplication.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-white">{selectedApplication.fullName}</h2>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadge(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Age {selectedApplication.age} • {selectedApplication.gender} • {selectedApplication.city}, {selectedApplication.state}, {selectedApplication.country}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedApplication.interestedRoles.map((r, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-[#F5D77A] border border-[#D4AF37]/40">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STATUS CHANGE ACTION BAR */}
              <div className="rounded-2xl bg-black/60 border border-white/10 p-4 mb-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Application Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'Under Review', 'Shortlisted', 'Approved', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      disabled={statusUpdateLoading}
                      onClick={() => handleUpdateStatus(selectedApplication.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                        selectedApplication.status === st
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* DETAILS SECTIONS GRID */}
              <div className="space-y-6 text-xs text-slate-300">
                {/* CONTACT & ADDRESS */}
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider text-[#F5D77A] border-b border-white/10 pb-2">
                    Contact & Location Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><span className="text-slate-400">Email:</span> <strong className="text-white">{selectedApplication.email}</strong></div>
                    <div><span className="text-slate-400">WhatsApp:</span> <strong className="text-white">{selectedApplication.whatsAppNumber}</strong></div>
                    <div><span className="text-slate-400">Calling Number:</span> <strong className="text-white">{selectedApplication.callingNumber}</strong></div>
                    <div><span className="text-slate-400">Preferred Lang:</span> <strong className="text-white">{selectedApplication.preferredLanguage}</strong></div>
                    <div className="sm:col-span-2"><span className="text-slate-400">Address:</span> <strong className="text-white">{selectedApplication.fullAddress}, {selectedApplication.city}, {selectedApplication.state}, {selectedApplication.country}</strong></div>
                  </div>
                </div>

                {/* PROFESSIONAL & EXPERIENCE */}
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider text-[#F5D77A] border-b border-white/10 pb-2">
                    Experience & Portfolio Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><span className="text-slate-400">Experience Level:</span> <strong className="text-white">{selectedApplication.experienceLevel}</strong></div>
                    <div><span className="text-slate-400">Years of Experience:</span> <strong className="text-white">{selectedApplication.yearsOfExperience || '0'} Years</strong></div>
                  </div>

                  {selectedApplication.previousProjects && (
                    <div className="pt-2">
                      <span className="block text-slate-400 mb-1 font-semibold">Previous Projects Summary:</span>
                      <p className="p-3 rounded-xl bg-black/60 border border-white/10 text-slate-200 leading-relaxed">
                        {selectedApplication.previousProjects}
                      </p>
                    </div>
                  )}
                </div>

                {/* CINEMATIC PROFILE & PDF (IF PRESENT) */}
                {(selectedApplication.aboutYourself || selectedApplication.synopsisPdfUrl) && (
                  <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider text-[#F5D77A] border-b border-white/10 pb-2">
                      About Yourself & Synopsis PDF
                    </h3>

                    {selectedApplication.aboutYourself && (
                      <p className="p-3 rounded-xl bg-black/60 border border-white/10 text-slate-200 leading-relaxed">
                        {selectedApplication.aboutYourself}
                      </p>
                    )}

                    {selectedApplication.synopsisPdfUrl && (
                      <div className="pt-1">
                        <a
                          href={selectedApplication.synopsisPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77A] font-bold text-xs hover:bg-[#D4AF37]/30 transition-all"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>View Uploaded PDF Synopsis / Portfolio</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* VIDEO LINKS */}
                {((selectedApplication.projectVideoUrls && selectedApplication.projectVideoUrls.length > 0) || selectedApplication.introductoryVideoUrl) && (
                  <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider text-[#F5D77A] border-b border-white/10 pb-2">
                      Video & Reel Links
                    </h3>

                    {selectedApplication.introductoryVideoUrl && (
                      <div>
                        <span className="text-slate-400 block mb-1">Introductory Video:</span>
                        <a
                          href={selectedApplication.introductoryVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-400 font-bold hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{selectedApplication.introductoryVideoUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {selectedApplication.projectVideoUrls && selectedApplication.projectVideoUrls.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-slate-400 block font-semibold">Project Video Links:</span>
                        {selectedApplication.projectVideoUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-400 font-bold hover:underline"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{url}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SOCIAL LINKS */}
                {(selectedApplication.socialLink1 || selectedApplication.socialLink2) && (
                  <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider text-[#F5D77A] border-b border-white/10 pb-2">
                      Social Media Links
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {selectedApplication.socialLink1 && (
                        <a href={selectedApplication.socialLink1} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{selectedApplication.socialLink1}</span>
                        </a>
                      )}
                      {selectedApplication.socialLink2 && (
                        <a href={selectedApplication.socialLink2} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{selectedApplication.socialLink2}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      <AnimatePresence>
        {applicationToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#090d1f] p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-white">Delete Talent Application?</h3>

              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete <strong className="text-white">{applicationToDelete.fullName}</strong>&apos;s registration application? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplicationToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteApplication}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-500 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {deleteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
