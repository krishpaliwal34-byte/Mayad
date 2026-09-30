'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import { getBackendUrl } from '@/utils/config';

const BACKEND_URL = getBackendUrl();

export const CAREER_CATEGORIES = [
  {
    category: 'FILM & PRODUCTION',
    roles: [
      'Director',
      'Assistant Director',
      'Producer',
      'Production Manager',
      'Cinematographer / DOP',
      'Assistant Cinematographer',
      'Video Editor',
      'Sound Designer',
    ],
  },
  {
    category: 'ACTING & TALENT',
    roles: [
      'Actor',
      'Actress',
      'Supporting Artist',
      'Voice Artist',
      'Casting Coordinator',
    ],
  },
  {
    category: 'MUSIC',
    roles: [
      'Singer',
      'Music Director',
      'Composer',
      'Lyricist',
      'Music Producer',
    ],
  },
  {
    category: 'CREATIVE',
    roles: [
      'Script Writer',
      'Story Writer',
      'Screenplay Writer',
      'Dialogue Writer',
      'Costume Designer',
      'Makeup Artist',
    ],
  },
];

export interface JobItem {
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
  applicationEmail?: string;
  featured: boolean;
  status: 'Draft' | 'Published' | 'Closed';
  applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationItem {
  _id: string;
  job: {
    _id: string;
    title: string;
    category: string;
    location: string;
    employmentType: string;
    status: string;
  } | null;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  coverLetter?: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  createdAt: string;
}

export default function AdminCareerManagement() {
  const [activeSubTab, setActiveSubTab] = useState<'openings' | 'applications'>('openings');

  // Stats
  const [stats, setStats] = useState({
    totalJobs: 0,
    publishedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  // Jobs state
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobSearch, setJobSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Applications state
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appJobFilter, setAppJobFilter] = useState('All');

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Job Form Data
  const [formData, setFormData] = useState({
    title: '',
    category: 'FILM & PRODUCTION',
    location: 'Udaipir, India',
    employmentType: 'Full Time',
    experience: '2+ Years',
    salary: '',
    description: '',
    skills: '',
    deadline: '',
    applicationEmail: 'careers@mayad.com',
    featured: false,
    status: 'Published' as 'Draft' | 'Published' | 'Closed',
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getAdminToken = () => {
    return (
      localStorage.getItem('mayad_admin_token') ||
      localStorage.getItem('mayad_admin_jwt') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('token') ||
      ''
    );
  };

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'applications') {
      fetchApplications();
    } else {
      fetchJobs();
    }
  }, [activeSubTab, categoryFilter, statusFilter, appStatusFilter, appJobFilter]);

  const fetchStats = async () => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/stats`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const token = getAdminToken();
      let query = `?category=${categoryFilter}&status=${statusFilter}`;
      if (jobSearch.trim()) query += `&search=${encodeURIComponent(jobSearch.trim())}`;

      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/all${query}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
      showToast('Failed to load job openings', 'error');
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setAppsLoading(true);
      const token = getAdminToken();
      let query = `?status=${appStatusFilter}&jobId=${appJobFilter}`;
      if (appSearch.trim()) query += `&search=${encodeURIComponent(appSearch.trim())}`;

      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/applications${query}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Fetch applications error:', err);
      showToast('Failed to load applications', 'error');
    } finally {
      setAppsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      category: 'FILM & PRODUCTION',
      location: 'Udaipur, Rajasthan',
      employmentType: 'Full Time',
      experience: '1-3 Years',
      salary: '',
      description: '',
      skills: '',
      deadline: '',
      applicationEmail: 'careers@mayad.com',
      featured: false,
      status: 'Published',
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditModal = (job: JobItem) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      category: job.category || 'FILM & PRODUCTION',
      location: job.location || '',
      employmentType: job.employmentType || 'Full Time',
      experience: job.experience || '',
      salary: job.salary || '',
      description: job.description || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      applicationEmail: job.applicationEmail || '',
      featured: Boolean(job.featured),
      status: job.status || 'Published',
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Please fill in required fields (Title, Description)', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getAdminToken();

      const payload = {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        employmentType: formData.employmentType,
        experience: formData.experience,
        salary: formData.salary,
        description: formData.description,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: formData.deadline ? formData.deadline : undefined,
        applicationEmail: formData.applicationEmail,
        featured: formData.featured,
        status: formData.status,
      };

      const url = editingJob
        ? `${BACKEND_URL}/api/jobs/admin/${editingJob._id}`
        : `${BACKEND_URL}/api/jobs/admin/create`;

      const method = editingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
        setIsJobModalOpen(false);
        fetchJobs();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to save job opening', 'error');
      }
    } catch (err) {
      console.error('Save job error:', err);
      showToast('Error saving job opening', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (job: JobItem) => {
    const nextStatus = job.status === 'Published' ? 'Closed' : 'Published';
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/${job._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Job status updated to ${nextStatus}`);
        fetchJobs();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to change status', 'error');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Error changing job status', 'error');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening and all associated applications?')) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Job opening deleted successfully');
        fetchJobs();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to delete job', 'error');
      }
    } catch (err) {
      console.error('Delete job error:', err);
      showToast('Error deleting job opening', 'error');
    }
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Application marked as ${newStatus}`);
        if (selectedApplication && selectedApplication._id === appId) {
          setSelectedApplication({ ...selectedApplication, status: newStatus as any });
        }
        fetchApplications();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to update application status', 'error');
      }
    } catch (err) {
      console.error('Update app status error:', err);
      showToast('Error updating application status', 'error');
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/jobs/admin/applications/${appId}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Application deleted');
        if (selectedApplication?._id === appId) {
          setSelectedApplication(null);
        }
        fetchApplications();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to delete application', 'error');
      }
    } catch (err) {
      console.error('Delete app error:', err);
      showToast('Error deleting application', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Draft':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Closed':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getAppStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Shortlisted':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Interview':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-medium backdrop-blur-xl ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-amber-400" />
            Career Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage movie production job openings, industry talent requirements & candidate applications.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:brightness-110 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Job Opening
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{stats.totalJobs}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Openings</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{stats.publishedJobs}</div>
            <div className="text-[11px] text-slate-400 font-medium">Published Jobs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{stats.totalApplications}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Applications</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{stats.pendingApplications}</div>
            <div className="text-[11px] text-slate-400 font-medium">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-white/10 space-x-4">
        <button
          onClick={() => setActiveSubTab('openings')}
          className={`pb-3 px-2 font-bold text-sm transition-all relative ${
            activeSubTab === 'openings'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Job Openings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('applications')}
          className={`pb-3 px-2 font-bold text-sm transition-all relative ${
            activeSubTab === 'applications'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Candidate Applications ({stats.totalApplications})
        </button>
      </div>

      {/* TAB 1: JOB OPENINGS MANAGEMENT */}
      {activeSubTab === 'openings' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, location or keywords..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                className="w-full pl-10 pr-4 py-2 bg-[#050814] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#050814] border border-white/10 text-xs sm:text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Categories</option>
                {CAREER_CATEGORIES.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#050814] border border-white/10 text-xs sm:text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Jobs List / Table */}
          {jobsLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#090d1f] border border-white/10 text-center">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No job openings found</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Get started by creating a new job opening for MAYAD production and talent roles.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs inline-flex items-center gap-2 hover:bg-amber-500/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create First Opening
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl bg-[#090d1f] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {job.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md">
                      FEATURED
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                      <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                        {job.category}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {job.employmentType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Applicants:{' '}
                      <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
                        {job.applicantCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
                        title={job.status === 'Published' ? 'Unpublish Job' : 'Publish Job'}
                      >
                        {job.status === 'Published' ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
                        title="Edit Opening"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete Opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATIONS MANAGEMENT */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Applications Filters */}
          <div className="p-4 rounded-2xl bg-[#090d1f] border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, email, phone..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
                className="w-full pl-10 pr-4 py-2 bg-[#050814] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                value={appJobFilter}
                onChange={(e) => setAppJobFilter(e.target.value)}
                className="bg-[#050814] border border-white/10 text-xs sm:text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50 max-w-[200px] truncate"
              >
                <option value="All">All Jobs</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title}
                  </option>
                ))}
              </select>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="bg-[#050814] border border-white/10 text-xs sm:text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          {appsLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#090d1f] border border-white/10 text-center">
              <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No applications received yet</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Applications submitted by candidates through the public careers page will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#090d1f] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-[#050814] text-slate-400 uppercase text-[11px] font-bold border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Job Position</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div>{app.fullName}</div>
                          {app.resume && (
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <ExternalLink className="w-3 h-3" /> Resume Link
                            </a>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">
                            {app.job ? app.job.title : 'General / Removed Job'}
                          </div>
                          {app.job && (
                            <div className="text-[11px] text-slate-400">{app.job.category}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs">
                          <div>{app.email}</div>
                          <div className="text-slate-400">{app.phone}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getAppStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                              className="bg-[#050814] border border-white/10 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500/50"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview">Interview</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>

                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT JOB MODAL */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090d1f] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {editingJob ? 'Edit Job Opening' : 'Add New Job Opening'}
              </h2>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title / Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Video Editor"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  >
                    {CAREER_CATEGORIES.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Experience Level</label>
                  <input
                    type="text"
                    placeholder="e.g. 3+ Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Salary / Compensation (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8,00,000 - ₹12,00,000 / year"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed description of the job opening..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="DaVinci Resolve, Premiere Pro, Color Grading"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact / Application Email</label>
                  <input
                    type="email"
                    placeholder="careers@mayad.com"
                    value={formData.applicationEmail}
                    onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050814] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="accent-amber-400 w-4 h-4"
                    />
                    <span>Featured Opening</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">Status:</span>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="bg-[#050814] border border-white/10 text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsJobModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingJob ? 'Update Opening' : 'Create Opening'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICATION DETAIL MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090d1f] border border-white/10 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-extrabold text-white">{selectedApplication.fullName}</h2>
                <p className="text-xs text-amber-400 font-semibold">
                  Applied for:{' '}
                  {selectedApplication.job ? selectedApplication.job.title : 'General Application'}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-[#050814] border border-white/5">
                <div>
                  <span className="text-slate-400 text-[11px] block">Email</span>
                  <a href={`mailto:${selectedApplication.email}`} className="text-white hover:underline font-medium">
                    {selectedApplication.email}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Phone</span>
                  <a href={`tel:${selectedApplication.phone}`} className="text-white hover:underline font-medium">
                    {selectedApplication.phone}
                  </a>
                </div>
              </div>

              {selectedApplication.resume && (
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Resume / CV</span>
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Open Resume Link / Document
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedApplication.portfolioUrl && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">Portfolio URL</span>
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline truncate block"
                    >
                      {selectedApplication.portfolioUrl}
                    </a>
                  </div>
                )}

                {selectedApplication.linkedInUrl && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">LinkedIn URL</span>
                    <a
                      href={selectedApplication.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline truncate block"
                    >
                      {selectedApplication.linkedInUrl}
                    </a>
                  </div>
                )}
              </div>

              {selectedApplication.coverLetter && (
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Cover Letter</span>
                  <div className="p-3 rounded-xl bg-[#050814] border border-white/5 text-slate-200 text-xs whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-semibold">Change Status:</span>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => handleUpdateAppStatus(selectedApplication._id, e.target.value)}
                    className="bg-[#050814] border border-white/10 text-white rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDeleteApplication(selectedApplication._id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-all"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
