'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Sparkles,
  Loader2,
  Filter,
  Play,
  X,
  User,
  AlertCircle,
  ExternalLink,
  Film,
  Camera
} from 'lucide-react';

interface PopulatedArtist {
  _id: string;
  fullName?: string;
  stageName?: string;
  email?: string;
  category?: string;
  profilePhoto?: string;
}

interface MediaItem {
  _id: string;
  artist: PopulatedArtist | string;
  mediaType: 'photo' | 'reel';
  mediaUrl: string;
  thumbnailUrl?: string;
  cloudinaryPublicId: string;
  caption?: string;
  hashtags?: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function AdminMediaModeration() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [typeFilter, setTypeFilter] = useState<'All' | 'photo' | 'reel'>('All');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState<MediaItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Delete Modal
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Lightbox
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchAdminMedia();
  }, [statusFilter, typeFilter]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
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

  const fetchAdminMedia = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      let query = `?limit=100`;
      if (statusFilter !== 'All') query += `&status=${statusFilter}`;
      if (typeFilter !== 'All') query += `&mediaType=${typeFilter}`;

      const res = await fetch(`${BACKEND_URL}/api/artist-media/admin/all${query}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList(data.media || []);
      } else {
        showToast(data.message || 'Failed to load media moderation list', 'error');
      }
    } catch (err) {
      console.error('Fetch admin media error:', err);
      showToast('Error connecting to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    try {
      setProcessing(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/artist-media/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
          rejectionReason: reason || '',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Media marked as ${status}`);
        setRejectingItem(null);
        setRejectionReason('');
        fetchAdminMedia();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Update status error:', err);
      showToast('Error updating status', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/artist-media/admin/${deletingId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Media item deleted');
        setDeletingId(null);
        fetchAdminMedia();
      } else {
        showToast(data.message || 'Failed to delete media item', 'error');
      }
    } catch (err) {
      console.error('Delete media error:', err);
      showToast('Error deleting media item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-md ${
          toastType === 'success'
            ? 'border-emerald-500/40 bg-slate-900/90 text-emerald-300'
            : 'border-red-500/40 bg-slate-900/90 text-red-300'
        }`}>
          <Sparkles className="h-5 w-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header & Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Camera className="h-6 w-6 text-amber-400" />
              Artist Media Moderation
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Review, approve, or reject artist photo and reel uploads before they appear on the public MAYAD website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
              {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    statusFilter === st
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="photo">Photos Only</option>
              <option value="reel">Reels Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moderation Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="text-center text-amber-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Loading artist submissions...</p>
          </div>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-6 text-center">
          <CheckCircle className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No {statusFilter} Submissions</h3>
          <p className="mt-1 text-xs text-slate-400">
            There are currently no media items matching the "{statusFilter}" filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaList.map((item) => {
            const artistObj = typeof item.artist === 'object' ? item.artist : null;
            const artistName = artistObj?.stageName || artistObj?.fullName || 'Artist';

            return (
              <div
                key={item._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl transition hover:border-amber-400/40"
              >
                {/* Artist Info Top Header */}
                <div className="flex items-center gap-3 border-b border-white/5 bg-slate-950/60 p-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-800 border border-amber-400/30">
                    <Image
                      src={artistObj?.profilePhoto || '/mayad.jpg'}
                      alt={artistName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-white">{artistName}</h4>
                    <p className="truncate text-[10px] text-amber-400">
                      {artistObj?.category || 'Artist'} • {artistObj?.email || ''}
                    </p>
                  </div>
                </div>

                {/* Media Content Box */}
                <div
                  className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-slate-950"
                  onClick={() => setLightboxItem(item)}
                >
                  {item.mediaType === 'photo' ? (
                    <Image
                      src={item.mediaUrl}
                      alt={item.caption || 'Artist Submission'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.caption || 'Reel Thumbnail'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          className="h-full w-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/90 text-slate-950 shadow-lg backdrop-blur-sm">
                          <Play className="h-6 w-6 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                    {item.mediaType === 'photo' ? 'Photo' : 'Reel'}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {item.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/80 px-2 py-1 text-[10px] font-bold text-emerald-400 backdrop-blur-md">
                        <CheckCircle className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/80 px-2 py-1 text-[10px] font-bold text-amber-400 backdrop-blur-md">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    {item.status === 'Rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-950/80 px-2 py-1 text-[10px] font-bold text-red-400 backdrop-blur-md">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption & Controls */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="line-clamp-2 text-xs font-medium text-slate-200">
                      {item.caption || <span className="italic text-slate-500">No caption</span>}
                    </p>

                    {item.hashtags && item.hashtags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.hashtags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-semibold text-amber-400/80">
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.status === 'Rejected' && item.rejectionReason && (
                      <p className="mt-2 text-[10px] text-red-400 italic">
                        Reason: {item.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 gap-2">
                    {item.status !== 'Approved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item._id, 'Approved')}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}

                    {item.status !== 'Rejected' && (
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingItem(item);
                          setRejectionReason('');
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 transition"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeletingId(item._id)}
                      className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setRejectingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Reject Media Submission
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Specify a reason for rejecting this media upload. The artist will see this feedback in their dashboard.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Low resolution, improper content, copyright violation..."
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-red-400 focus:outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleUpdateStatus(rejectingItem._id, 'Rejected', rejectionReason)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl text-center">
            <Trash2 className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Delete Media Permanently?</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              This action will delete the media asset from Cloudinary storage and database permanently.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="flex flex-col max-w-4xl max-h-[90vh] w-full items-center justify-center">
            <div className="relative aspect-[9/16] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-black">
              {lightboxItem.mediaType === 'photo' ? (
                <Image
                  src={lightboxItem.mediaUrl}
                  alt={lightboxItem.caption || 'Photo'}
                  fill
                  className="object-contain"
                />
              ) : (
                <video
                  src={lightboxItem.mediaUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {lightboxItem.caption && (
              <p className="mt-4 text-center text-sm font-medium text-slate-200">
                {lightboxItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
