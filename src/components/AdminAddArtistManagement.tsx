'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  User,
  ShieldCheck,
  Filter,
  Globe,
  Camera,
  Star,
} from 'lucide-react';
import { adminService, AdminArtistRecord } from '@/services/adminService';

interface AdminAddArtistManagementProps {
  showToast?: (text: string, type?: 'success' | 'error') => void;
  onStatsUpdate?: () => void;
}

export default function AdminAddArtistManagement({
  showToast,
  onStatsUpdate,
}: AdminAddArtistManagementProps) {
  const [artists, setArtists] = useState<AdminArtistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<AdminArtistRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    category: 'Actor',
    secondaryCategory: '',
    email: '',
    phone: '',
    location: 'Rajasthan',
    experience: '5+ Years',
    profilePhoto: '',
    bio: '',
    languagesText: 'Rajasthani, Hindi',
    showreel: '',
    imdb: '',
    instagram: '',
  });

  // Delete Confirmation Modal
  const [artistToDelete, setArtistToDelete] = useState<AdminArtistRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    if (showToast) showToast(text, type);
    else alert(text);
  };

  // Load All Public Artists for Admin
  const loadArtists = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPublicArtists();
      if (res.success && Array.isArray(res.artists)) {
        setArtists(res.artists);
      }
    } catch (err: any) {
      console.error('Error loading public artists:', err);
      notify(err?.message || 'Failed to load artists data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  // Filtered Artists
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (artist.fullName || '').toLowerCase().includes(q);
        const matchStage = (artist.stageName || '').toLowerCase().includes(q);
        const matchEmail = (artist.email || '').toLowerCase().includes(q);
        const matchCategory = (artist.category || '').toLowerCase().includes(q);
        const matchLoc = (artist.location || '').toLowerCase().includes(q);
        if (!matchName && !matchStage && !matchEmail && !matchCategory && !matchLoc) {
          return false;
        }
      }

      if (categoryFilter !== 'all' && artist.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [artists, searchQuery, categoryFilter]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingArtist(null);
    setFormData({
      fullName: '',
      stageName: '',
      category: 'Actor',
      secondaryCategory: '',
      email: '',
      phone: '',
      location: 'Rajasthan',
      experience: '5+ Years',
      profilePhoto: '',
      bio: '',
      languagesText: 'Rajasthani, Hindi',
      showreel: '',
      imdb: '',
      instagram: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (artist: AdminArtistRecord) => {
    setEditingArtist(artist);
    setFormData({
      fullName: artist.fullName || '',
      stageName: artist.stageName || '',
      category: artist.category || 'Actor',
      secondaryCategory: artist.secondaryCategory || '',
      email: artist.email || '',
      phone: artist.phone || '',
      location: artist.location || 'Rajasthan',
      experience: artist.experience || '5+ Years',
      profilePhoto: artist.profilePhoto || artist.imageUrl || '',
      bio: artist.bio || '',
      languagesText: (artist.languages || []).join(', ') || 'Rajasthani, Hindi',
      showreel: artist.showreel || '',
      imdb: artist.imdb || '',
      instagram: artist.instagram || '',
    });
    setIsModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      notify('Artist Full Name is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const languagesArr = formData.languagesText
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        fullName: formData.fullName,
        stageName: formData.stageName,
        category: formData.category,
        secondaryCategory: formData.secondaryCategory,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        profilePhoto: formData.profilePhoto,
        imageUrl: formData.profilePhoto,
        bio: formData.bio,
        languages: languagesArr,
        showreel: formData.showreel,
        imdb: formData.imdb,
        instagram: formData.instagram,
      };

      if (editingArtist) {
        const res = await adminService.updatePublicArtist(editingArtist.id, payload);
        if (res.success) {
          notify('Artist details updated successfully!');
          setIsModalOpen(false);
          loadArtists();
          if (onStatsUpdate) onStatsUpdate();
        } else {
          notify(res.message || 'Failed to update artist details', 'error');
        }
      } else {
        const res = await adminService.createPublicArtist(payload);
        if (res.success) {
          notify('Artist created and published to /artists directory!');
          setIsModalOpen(false);
          loadArtists();
          if (onStatsUpdate) onStatsUpdate();
        } else {
          notify(res.message || 'Failed to create artist', 'error');
        }
      }
    } catch (err: any) {
      console.error('Save artist error:', err);
      notify(err?.message || 'Error saving artist record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete Artist
  const handleDeleteArtist = async () => {
    if (!artistToDelete) return;

    try {
      setDeleteLoading(true);
      const res = await adminService.deletePublicArtist(artistToDelete.id);
      if (res.success) {
        notify('Artist profile deleted successfully');
        setArtistToDelete(null);
        loadArtists();
        if (onStatsUpdate) onStatsUpdate();
      } else {
        notify(res.message || 'Failed to delete artist profile', 'error');
      }
    } catch (err: any) {
      console.error('Delete artist error:', err);
      notify(err?.message || 'Error deleting artist profile', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER & ACTIONS BAR
      ========================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-[#090d1f]/90 border border-white/10 p-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists by name, stage name, category, city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Actor">Actor</option>
            <option value="Singer">Singer</option>
            <option value="Director">Director</option>
            <option value="Model">Model</option>
            <option value="Producer">Producer</option>
            <option value="Dancer">Dancer</option>
            <option value="Music Composer">Music Composer</option>
            <option value="Writer">Writer</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={loadArtists}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors"
            title="Reload artists list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Add Artist Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Artist</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          ARTISTS CARDS GRID
      ========================================================= */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
          <span>Loading artist directory...</span>
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-12 text-center">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Artists Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click "Add Artist" above to publish new artists to the MAYAD OTT directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtists.map((artist) => {
            const name = artist.stageName || artist.fullName || 'Artist';
            const photo = artist.profilePhoto || '/mayad.jpg';

            return (
              <div
                key={artist.id}
                className="group rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-lg"
              >
                {/* Photo Header */}
                <div className="relative aspect-square bg-slate-900 overflow-hidden">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as any).src = '/mayad.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-transparent opacity-80" />

                  {/* Verification Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-black shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-white/10">
                      {artist.category || 'Artist'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {name}
                    </h3>

                    {artist.stageName && artist.fullName && artist.stageName !== artist.fullName && (
                      <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                        Real: {artist.fullName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-2">
                      {artist.location && <span>📍 {artist.location}</span>}
                      {artist.experience && <span>• ⏱️ {artist.experience}</span>}
                    </div>

                    {artist.bio && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {artist.bio}
                      </p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={`/artists/${artist.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(artist)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
                        title="Edit Artist"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setArtistToDelete(artist)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                        title="Delete Artist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT ARTIST
      ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-[#090d1f] border border-amber-500/30 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {editingArtist ? 'Edit Artist Profile' : 'Add New Artist'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ravindra Mewadi"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stage Name / Screen Name</label>
                    <input
                      type="text"
                      value={formData.stageName}
                      onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                      placeholder="e.g. Ravindra Singh"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category / Primary Role *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Actor">Actor / Actress</option>
                      <option value="Singer">Singer / Vocalist</option>
                      <option value="Director">Director</option>
                      <option value="Model">Model</option>
                      <option value="Producer">Producer</option>
                      <option value="Dancer">Dancer / Choreographer</option>
                      <option value="Music Composer">Music Composer</option>
                      <option value="Writer">Writer / Scriptwriter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Secondary Category</label>
                    <input
                      type="text"
                      value={formData.secondaryCategory}
                      onChange={(e) => setFormData({ ...formData, secondaryCategory: e.target.value })}
                      placeholder="e.g. Action Director, Singer"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Profile Photo URL</label>
                    <input
                      type="text"
                      value={formData.profilePhoto}
                      onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                      placeholder="/historical.jpg or https://..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location / City</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Jaipur, Rajasthan"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Experience</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="5+ Years"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Languages (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.languagesText}
                      onChange={(e) => setFormData({ ...formData, languagesText: e.target.value })}
                      placeholder="Rajasthani, Hindi, English"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Biography / About</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief description of artist's background and notable works..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">Showreel URL</label>
                    <input
                      type="text"
                      value={formData.showreel}
                      onChange={(e) => setFormData({ ...formData, showreel: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">IMDb Profile</label>
                    <input
                      type="text"
                      value={formData.imdb}
                      onChange={(e) => setFormData({ ...formData, imdb: e.target.value })}
                      placeholder="https://imdb.com/..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">Instagram Handle</label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@artist_name"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingArtist ? 'Save Changes' : 'Save & Publish Artist'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MODAL: CONFIRM DELETE
      ========================================================= */}
      <AnimatePresence>
        {artistToDelete && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090d1f] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Delete Artist Profile?</h3>
                  <p className="text-xs text-rose-300/80 font-medium line-clamp-1">
                    {artistToDelete.stageName || artistToDelete.fullName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete this artist profile? They will no longer appear on http://localhost:3000/artists.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setArtistToDelete(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteArtist}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {deleteLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
