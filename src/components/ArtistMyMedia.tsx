'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  Film,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Edit2,
  Sparkles,
  Loader2,
  X,
  Play,
  Filter,
  AlertCircle,
  Camera
} from 'lucide-react';

interface MediaItem {
  _id: string;
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

import { getBackendUrl } from '@/utils/config';

const BACKEND_URL = getBackendUrl();

export default function ArtistMyMedia() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Upload Modal & State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'reel'>('photo');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Edit Caption Modal
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation Modal
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Preview Lightbox
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const reelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      const statusParam = activeTab === 'All' ? '' : `&status=${activeTab}`;
      
      const res = await fetch(`${BACKEND_URL}/api/artist-media/my-media?limit=50${statusParam}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList(data.media || []);
      } else {
        showToast(data.message || 'Failed to load media items', 'error');
      }
    } catch (err) {
      console.error('Fetch media error:', err);
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File, type: 'photo' | 'reel') => {
    if (type === 'photo') {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Photo size must be 10MB or less', 'error');
        return;
      }
    } else {
      if (!file.type.startsWith('video/')) {
        showToast('Please select a valid video file (MP4, MOV, WEBM)', 'error');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        showToast('Reel size must be 100MB or less', 'error');
        return;
      }
    }

    setSelectedFile(file);
    setMediaType(type);
    setPreviewUrl(URL.createObjectURL(file));
    setCaption('');
    setHashtags('');
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(20);

      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('mediaType', mediaType);
      if (caption.trim()) formData.append('caption', caption.trim());
      if (hashtags.trim()) formData.append('hashtags', hashtags.trim());

      setUploadProgress(50);

      const res = await fetch(`${BACKEND_URL}/api/artist-media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: formData,
      });

      setUploadProgress(90);
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`${mediaType === 'photo' ? 'Photo' : 'Reel'} uploaded and published successfully!`);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchMedia();
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Network error while uploading', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateCaptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/artist-media/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          caption: editCaption,
          hashtags: editHashtags,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Caption updated successfully');
        setEditingItem(null);
        fetchMedia();
      } else {
        showToast(data.message || 'Failed to update caption', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      showToast('Error updating media details', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('mayad_artist_jwt') || localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/artist-media/${deletingId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Media deleted successfully');
        setDeletingId(null);
        fetchMedia();
      } else {
        showToast(data.message || 'Failed to delete media', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting media', 'error');
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

      {/* Top Action Header */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Camera className="h-6 w-6 text-amber-400" />
              My Photos & Video Reels
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Upload portfolio photos and video reels. Submissions appear publicly once approved by MAYAD Admin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Hidden Photo File Input */}
            <input
              type="file"
              ref={photoInputRef}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'photo')}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-400 transition hover:bg-amber-400 hover:text-slate-950"
            >
              <ImageIcon className="h-4 w-4" />
              Upload Photo (≤10MB)
            </button>

            {/* Hidden Reel File Input */}
            <input
              type="file"
              ref={reelInputRef}
              accept="video/mp4, video/quicktime, video/webm"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'reel')}
            />
            <button
              type="button"
              onClick={() => reelInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-bold text-indigo-300 transition hover:bg-indigo-500 hover:text-white"
            >
              <Film className="h-4 w-4" />
              Upload Reel (≤100MB)
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Media' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid Display */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="text-center text-amber-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Loading your media items...</p>
          </div>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-center p-6">
          <Upload className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No Media Found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md">
            You haven't uploaded any {activeTab !== 'All' ? activeTab.toLowerCase() : ''} photos or video reels yet. Use the upload buttons above to showcase your work!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaList.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:border-amber-400/40"
            >
              {/* Media Thumbnail Container */}
              <div 
                className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-slate-950"
                onClick={() => setLightboxItem(item)}
              >
                {item.mediaType === 'photo' ? (
                  <Image
                    src={item.mediaUrl}
                    alt={item.caption || 'Artist Photo'}
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

                {/* Badge Type Tag */}
                <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
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
                      <Clock className="h-3 w-3" /> Pending Review
                    </span>
                  )}
                  {item.status === 'Rejected' && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-950/80 px-2 py-1 text-[10px] font-bold text-red-400 backdrop-blur-md">
                      <XCircle className="h-3 w-3" /> Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Caption & Info Section */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <p className="line-clamp-2 text-xs font-medium text-slate-200">
                    {item.caption || <span className="italic text-slate-500">No caption provided</span>}
                  </p>
                  
                  {item.hashtags && item.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-amber-400/80">
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.status === 'Rejected' && item.rejectionReason && (
                    <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-[11px] text-red-300">
                      <p className="font-bold flex items-center gap-1 mb-0.5">
                        <AlertCircle className="h-3 w-3 shrink-0" /> Rejection Reason:
                      </p>
                      <p className="text-slate-300 leading-snug">{item.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setEditCaption(item.caption || '');
                        setEditHashtags(item.hashtags ? item.hashtags.join(', ') : '');
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-amber-400 transition"
                      title="Edit Caption"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(item._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                      title="Delete Media"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Preview & Details Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl my-8">
            <button
              onClick={() => {
                if (!uploading) {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-400" />
              Upload {mediaType === 'photo' ? 'Photo' : 'Video Reel'}
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Media Preview */}
              {previewUrl && (
                <div className="relative aspect-[9/16] max-h-72 w-full mx-auto overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  {mediaType === 'photo' ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                  ) : (
                    <video src={previewUrl} controls className="h-full w-full object-contain" />
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Description</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a brief description or caption..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hashtags (comma separated)</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="e.g. model, acting, photoshoot, rajasthani"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-amber-400 font-bold">
                    <span>Uploading & Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setUploadModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Submit for Approval'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-amber-400" />
              Edit Caption & Tags
            </h3>

            <form onSubmit={handleUpdateCaptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Caption</label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={editHashtags}
                  onChange={(e) => setEditHashtags(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl text-center">
            <Trash2 className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Delete Media Item?</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this media item? This action will permanently remove it from Cloudinary and MAYAD database.
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
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
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
