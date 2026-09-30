'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Mail,
  Phone,
  User,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  Tag,
  ChevronRight
} from 'lucide-react';

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Archived';
  isRead: boolean;
  createdAt: string;
}

import { getBackendUrl } from '@/utils/config';

const BACKEND_URL = getBackendUrl();

export default function AdminInquiriesManagement() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, categoryFilter]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
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

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      let query = `?status=${statusFilter}&category=${categoryFilter}`;
      if (searchQuery.trim()) query += `&q=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(`${BACKEND_URL}/api/admin/inquiries${query}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
        setPendingCount(data.pendingCount || 0);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleUpdateStatus = async (id: string, newStatus: string, isRead = true) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, isRead }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Inquiry status updated to ${newStatus}`);
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
        }
        fetchInquiries();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Inquiry record deleted');
        if (selectedInquiry && selectedInquiry._id === id) setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-amber-400/40 bg-slate-900 px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-md">
          <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-amber-400" />
              Contacts & User Inquiries Management
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Review and respond to inquiries submitted by visitors from the public MAYAD Contact page.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center">
              <span className="block text-xl font-black text-amber-300">{pendingCount}</span>
              <span className="text-[10px] font-bold text-amber-400/90 uppercase">Pending Inquiries</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-center">
              <span className="block text-xl font-black text-white">{inquiries.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Loaded</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10 overflow-x-auto">
            {(['all', 'Pending', 'In Review', 'Resolved', 'Archived'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="Production">Production</option>
              <option value="Casting">Casting</option>
              <option value="Business">Business</option>
              <option value="Media">Media</option>
            </select>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, subject..."
                className="w-48 sm:w-64 rounded-xl border border-white/10 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </form>
          </div>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="text-center text-amber-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Loading user inquiries from database...</p>
          </div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-6 text-center">
          <MessageSquare className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No Inquiries Found</h3>
          <p className="mt-1 text-xs text-slate-400">
            There are currently no inquiries matching the selected filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Sender Details</th>
                  <th className="p-4">Subject & Category</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiries.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-amber-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 shrink-0" /> {item.email}
                      </div>
                      {item.phone && (
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 shrink-0" /> {item.phone}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-200 line-clamp-1">{item.subject}</div>
                      <span className="inline-block mt-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-white/10">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                      <span className="block text-[10px] text-slate-500">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/80 px-2 py-1 text-[10px] font-bold text-amber-400">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                      {item.status === 'In Review' && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/40 bg-blue-950/80 px-2 py-1 text-[10px] font-bold text-blue-300">
                          <Clock className="h-3 w-3" /> In Review
                        </span>
                      )}
                      {item.status === 'Resolved' && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/80 px-2 py-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle className="h-3 w-3" /> Resolved
                        </span>
                      )}
                      {item.status === 'Archived' && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-950 px-2 py-1 text-[10px] font-bold text-slate-400">
                          Archived
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInquiry(item);
                            if (!item.isRead) handleUpdateStatus(item._id, item.status, true);
                          }}
                          className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
                        >
                          View Message
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              Inquiry Details
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
            </p>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-slate-950 p-3">
                <div>
                  <span className="block text-slate-400 text-[10px]">Sender Name</span>
                  <span className="font-bold text-white text-sm">{selectedInquiry.name}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Category</span>
                  <span className="font-bold text-amber-300 text-sm">{selectedInquiry.category}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Email</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-amber-400 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Phone</span>
                  <span className="font-bold text-white">{selectedInquiry.phone || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="block text-slate-400 text-[10px] mb-1 font-semibold">Subject</span>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3 font-bold text-white text-sm">
                  {selectedInquiry.subject}
                </div>
              </div>

              <div>
                <span className="block text-slate-400 text-[10px] mb-1 font-semibold">Message Content</span>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-200 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedInquiry._id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry._id)}
                  className="rounded-xl bg-red-600/80 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
