'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  Sparkles,
  TrendingUp,
  Award,
  LayoutGrid,
  List,
  RotateCcw,
  CheckCircle,
  XCircle,
  X,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tag,
  Calendar,
  Tv,
  RefreshCw,
  AlertTriangle,
  Info,
  Users,
} from 'lucide-react';
import { adminService, AdminMovieRecord } from '@/services/adminService';
import AdminCastRoleModal from './AdminCastRoleModal';

interface AdminMoviesManagementProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
  onStatsUpdate?: () => void;
}

export default function AdminMoviesManagement({ showToast, onStatsUpdate }: AdminMoviesManagementProps) {
  // Data state
  const [movies, setMovies] = useState<AdminMovieRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'original' | 'trending' | 'top5'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'year'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<AdminMovieRecord | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<AdminMovieRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [selectedMovieForCast, setSelectedMovieForCast] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<{
    slug: string;
    title: string;
    originalTitle: string;
    posterUrl: string;
    backdropUrl: string;
    movieUrl: string;
    type: 'movie' | 'series';
    category: string;
    language: string;
    year: number | '';
    duration: string;
    genre: string;
    genresText: string;
    description: string;
    castText: string;
    director: string;
    isOriginal: boolean;
    isTrending: boolean;
    isTop5: boolean;
    isPublished: boolean;
  }>({
    slug: '',
    title: '',
    originalTitle: '',
    posterUrl: '',
    backdropUrl: '',
    movieUrl: '',
    type: 'movie',
    category: 'Cinema',
    language: 'Rajasthani',
    year: new Date().getFullYear(),
    duration: '',
    genre: '',
    genresText: '',
    description: '',
    castText: '',
    director: 'MAYAD Original Team',
    isOriginal: true,
    isTrending: false,
    isTop5: false,
    isPublished: true,
  });

  // Fetch Movies from Backend
  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminMovies();
      if (res.success) {
        setMovies(res.movies || []);
        if (onStatsUpdate) onStatsUpdate();
      } else {
        setError('Failed to load movies data.');
      }
    } catch (err: any) {
      console.error('Error fetching admin movies:', err);
      setError(err?.message || 'Failed to fetch movies from database.');
      showToast(err?.message || 'Error connecting to movie API', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Dynamically extract categories & languages for filter dropdowns
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [movies]);

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.language) set.add(m.language);
    });
    return Array.from(set);
  }, [movies]);

  // Filter & Search & Sort logic
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = movie.title.toLowerCase().includes(q);
          const matchOriginalTitle = (movie.originalTitle || '').toLowerCase().includes(q);
          const matchSlug = movie.slug.toLowerCase().includes(q);
          const matchDirector = (movie.director || '').toLowerCase().includes(q);
          if (!matchTitle && !matchOriginalTitle && !matchSlug && !matchDirector) {
            return false;
          }
        }

        // Type filter
        if (typeFilter !== 'all' && movie.type !== typeFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === 'published' && !movie.isPublished) return false;
        if (statusFilter === 'draft' && movie.isPublished) return false;

        // Badge filter
        if (badgeFilter === 'original' && !movie.isOriginal) return false;
        if (badgeFilter === 'trending' && !movie.isTrending) return false;
        if (badgeFilter === 'top5' && !movie.isTop5) return false;

        // Category filter
        if (categoryFilter !== 'all' && movie.category !== categoryFilter) {
          return false;
        }

        // Language filter
        if (languageFilter !== 'all' && movie.language !== languageFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'year') {
          return (b.year || 0) - (a.year || 0);
        }
        return 0;
      });
  }, [movies, searchQuery, typeFilter, statusFilter, badgeFilter, categoryFilter, languageFilter, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter, badgeFilter, categoryFilter, languageFilter, sortBy]);

  // Paginated movies
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setBadgeFilter('all');
    setCategoryFilter('all');
    setLanguageFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      slug: '',
      title: '',
      originalTitle: '',
      posterUrl: '',
      backdropUrl: '',
      movieUrl: '',
      type: 'movie',
      category: 'Cinema',
      language: 'Rajasthani',
      year: new Date().getFullYear(),
      duration: '2h 00m',
      genre: '',
      genresText: '',
      description: '',
      castText: '',
      director: 'MAYAD Original Team',
      isOriginal: true,
      isTrending: false,
      isTop5: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (movie: AdminMovieRecord) => {
    setEditingMovie(movie);
    setFormData({
      slug: movie.slug || '',
      title: movie.title || '',
      originalTitle: movie.originalTitle || '',
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      movieUrl: movie.movieUrl || movie.videoUrl || (movie as any).url || '',
      type: movie.type || 'movie',
      category: movie.category || 'Cinema',
      language: movie.language || 'Rajasthani',
      year: movie.year || new Date().getFullYear(),
      duration: movie.duration || '',
      genre: movie.genre || '',
      genresText: (movie.genres || []).join(', '),
      description: movie.description || '',
      castText: (movie.cast || []).join(', '),
      director: movie.director || '',
      isOriginal: Boolean(movie.isOriginal),
      isTrending: Boolean(movie.isTrending),
      isTop5: Boolean(movie.isTop5),
      isPublished: Boolean(movie.isPublished),
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes (if creating new movie)
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!editingMovie && !prev.slug) {
        updated.slug = val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return updated;
    });
  };

  // Submit Form (Create / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Movie title is required', 'error');
      return;
    }
    if (!formData.posterUrl.trim()) {
      showToast('Movie poster URL is required', 'error');
      return;
    }

    const computedSlug = (formData.slug || formData.title)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const genresArray = formData.genresText
      .split(',')
      .map((g) => g.trim().toLowerCase())
      .filter(Boolean);

    const castArray = formData.castText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const normalizeImageUrl = (url?: string) => {
      if (!url || typeof url !== 'string') return '/placeholder.jpg';
      const trimmed = url.trim();
      if (!trimmed) return '/placeholder.jpg';
      if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      return `/${trimmed}`;
    };

    const normalizedPoster = normalizeImageUrl(formData.posterUrl);
    const normalizedBackdrop = formData.backdropUrl.trim()
      ? normalizeImageUrl(formData.backdropUrl)
      : normalizedPoster;

    const payload: Partial<AdminMovieRecord> = {
      slug: computedSlug,
      title: formData.title.trim(),
      originalTitle: formData.originalTitle.trim(),
      posterUrl: normalizedPoster,
      backdropUrl: normalizedBackdrop,
      movieUrl: formData.movieUrl.trim(),
      videoUrl: formData.movieUrl.trim(),
      type: formData.type,
      category: formData.category.trim(),
      language: formData.language.trim() || 'Rajasthani',
      year: formData.year !== '' ? Number(formData.year) : new Date().getFullYear(),
      duration: formData.duration.trim(),
      genre: formData.genre.trim() || genresArray.join(' | '),
      genres: genresArray,
      description: formData.description.trim(),
      cast: castArray,
      director: formData.director.trim(),
      isOriginal: formData.isOriginal,
      isTrending: formData.isTrending,
      isTop5: formData.isTop5,
      isPublished: formData.isPublished,
    };

    setSubmitting(true);
    try {
      if (editingMovie) {
        const id = editingMovie._id || editingMovie.id;
        if (!id) throw new Error('Movie ID missing');
        const res = await adminService.updateMovie(id, payload);
        if (res.success) {
          showToast(`"${formData.title}" updated successfully!`, 'success');
          setIsModalOpen(false);
          loadMovies();
        }
      } else {
        const res = await adminService.createMovie(payload);
        if (res.success) {
          showToast(`"${formData.title}" created successfully!`, 'success');
          setIsModalOpen(false);
          loadMovies();
        }
      }
    } catch (err: any) {
      console.error('Error saving movie:', err);
      showToast(err?.message || 'Failed to save movie details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Publish Status Quick Action
  const handleTogglePublish = async (movie: AdminMovieRecord) => {
    const id = movie._id || movie.id;
    if (!id) return;
    setToggleLoadingId(id);
    try {
      const res = await adminService.updateMovie(id, {
        isPublished: !movie.isPublished,
      });
      if (res.success) {
        showToast(
          `"${movie.title}" is now ${!movie.isPublished ? 'Published' : 'Unpublished (Draft)'}!`,
          'success'
        );
        loadMovies();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update publish status', 'error');
    } finally {
      setToggleLoadingId(null);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingMovie) return;
    const id = deletingMovie._id || deletingMovie.id;
    if (!id) return;

    setDeleteLoading(true);
    try {
      const res = await adminService.deleteMovie(id);
      if (res.success) {
        showToast(`"${deletingMovie.title}" deleted successfully.`, 'success');
        setDeletingMovie(null);
        loadMovies();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete movie', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER STATS & ACTION CONTROLS BAR
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#090d1f]/90 border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                Movies & Series Management
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                MongoDB Real-Time
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage all published titles, drafts, metadata, banners, and streaming attributes on MAYAD platform.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          <button
            onClick={loadMovies}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:scale-[1.02] transition-transform active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Movie / Series</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          FILTERS, SEARCH & SORTING TOOLBAR
      ========================================================= */}
      <div className="bg-[#090d1f]/90 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Row 1: Search + View Toggle + Counts */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title, original title, director, slug..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Counts & View Mode Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="text-xs text-slate-400 font-medium px-3 py-2 rounded-xl bg-slate-900 border border-white/5">
              Showing <span className="font-bold text-amber-400">{filteredMovies.length}</span> of{' '}
              <span className="font-bold text-white">{movies.length}</span> titles
            </div>

            {/* Grid / Table View Switcher */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-700/80 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/5">
          {/* 1. Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="movie">Movies Only</option>
              <option value="series">Series Only</option>
            </select>
          </div>

          {/* 2. Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published (Live)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* 3. Badge Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Feature Badge</label>
            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Badges</option>
              <option value="original">MAYAD Originals</option>
              <option value="trending">Trending Titles</option>
              <option value="top5">Top 5 Picks</option>
            </select>
          </div>

          {/* 4. Category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Language Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Language</label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Sorting */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sort By</label>
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="newest">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="year">Release Year</option>
              </select>

              {(searchQuery ||
                typeFilter !== 'all' ||
                statusFilter !== 'all' ||
                badgeFilter !== 'all' ||
                categoryFilter !== 'all' ||
                languageFilter !== 'all' ||
                sortBy !== 'newest') && (
                <button
                  onClick={resetFilters}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTENT LISTING (GRID VS TABLE)
      ========================================================= */}
      {loading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-slate-900/60 border border-white/5 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="w-full h-44 bg-slate-800/60 rounded-xl" />
              <div className="space-y-2 mt-3">
                <div className="w-3/4 h-4 bg-slate-800/80 rounded" />
                <div className="w-1/2 h-3 bg-slate-800/60 rounded" />
              </div>
              <div className="w-full h-8 bg-slate-800/40 rounded-xl mt-3" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Error Loading Movies</h3>
          <p className="text-xs text-rose-200">{error}</p>
          <button
            onClick={loadMovies}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
          >
            Try Again
          </button>
        </div>
      ) : filteredMovies.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-slate-400">
            {movies.length === 0
              ? 'No movies are registered in your MongoDB database yet.'
              : 'No title matches your selected filters or search terms.'}
          </p>
          {movies.length > 0 ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-amber-400 font-bold text-xs hover:bg-slate-800"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
            >
              + Create First Movie
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedMovies.map((movie) => {
            const id = movie._id || movie.id || movie.slug;
            return (
              <motion.div
                key={id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden shadow-lg hover:border-amber-500/40 hover:shadow-[0_4px_25px_rgba(245,197,24,0.15)] flex flex-col justify-between"
              >
                {/* Poster Container */}
                <div className="relative aspect-[16/10] sm:aspect-[3/4] bg-slate-900 overflow-hidden">
                  <img
                    src={movie.posterUrl || '/placeholder.jpg'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-black/60" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
                        movie.type === 'series'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {movie.type === 'series' ? 'TV Series' : 'Movie'}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
                        movie.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {movie.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Highlight Feature Badges */}
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                    {movie.isOriginal && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-amber-500 text-black shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-black" />
                        Original
                      </span>
                    )}
                    {movie.isTrending && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500 text-black shadow-md flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Trending
                      </span>
                    )}
                    {movie.isTop5 && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-cyan-400 text-black shadow-md flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        Top 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>

                    {movie.originalTitle && (
                      <p className="text-xs text-amber-400/90 font-semibold line-clamp-1 mt-0.5">
                        {movie.originalTitle}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-medium">
                      {movie.year && <span>{movie.year}</span>}
                      {movie.language && (
                        <>
                          <span>•</span>
                          <span>{movie.language}</span>
                        </>
                      )}
                      {movie.duration && (
                        <>
                          <span>•</span>
                          <span>{movie.duration}</span>
                        </>
                      )}
                    </div>

                    {movie.category && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-white/5 font-medium">
                        {movie.category}
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    {/* Toggle Status */}
                    <button
                      onClick={() => handleTogglePublish(movie)}
                      disabled={toggleLoadingId === id}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        movie.isPublished
                          ? 'bg-slate-800 text-emerald-400 hover:bg-rose-500/10 hover:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                      title={movie.isPublished ? 'Unpublish to Draft' : 'Publish to Live'}
                    >
                      {toggleLoadingId === id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : movie.isPublished ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className="text-[11px]">
                        {movie.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedMovieForCast(movie)}
                        className="px-2 py-1.5 rounded-lg bg-slate-800/80 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Manage Cast & Roles"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Cast</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(movie)}
                        className="p-1.5 rounded-lg bg-slate-800/80 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingMovie(movie)}
                        className="p-1.5 rounded-lg bg-slate-800/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Delete Title"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-4 px-4">Title & Poster</th>
                  <th className="py-4 px-4">Type & Year</th>
                  <th className="py-4 px-4">Category & Genres</th>
                  <th className="py-4 px-4">Highlights</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedMovies.map((movie) => {
                  const id = movie._id || movie.id || movie.slug;
                  return (
                    <tr key={id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Title & Poster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.posterUrl || '/placeholder.jpg'}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded-lg bg-slate-800 border border-white/10 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-white truncate text-sm">
                              {movie.title}
                            </span>
                            {movie.originalTitle && (
                              <span className="text-xs text-amber-400 font-semibold truncate">
                                {movie.originalTitle}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono truncate">
                              /{movie.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Year */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              movie.type === 'series'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {movie.type === 'series' ? 'TV Series' : 'Movie'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {movie.year || 'N/A'} • {movie.language || 'Rajasthani'}
                          </span>
                        </div>
                      </td>

                      {/* Category & Genres */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-200">
                            {movie.category || 'Cinema'}
                          </span>
                          <span className="text-xs text-slate-400 line-clamp-1">
                            {movie.genre || (movie.genres || []).join(', ') || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Highlights */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {movie.isOriginal && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Original
                            </span>
                          )}
                          {movie.isTrending && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Trending
                            </span>
                          )}
                          {movie.isTop5 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Top 5
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(movie)}
                          disabled={toggleLoadingId === id}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            movie.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {toggleLoadingId === id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : movie.isPublished ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{movie.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(movie)}
                            className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors"
                            title="Edit Movie"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingMovie(movie)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          PAGINATION CONTROLS
      ========================================================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#090d1f]/90 border border-white/10 rounded-2xl text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white disabled:opacity-40 flex items-center gap-1 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white disabled:opacity-40 flex items-center gap-1 hover:bg-slate-800 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT MOVIE
      ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-50 w-full max-w-3xl bg-[#0b1026] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.8)] my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {editingMovie ? 'Edit Movie Details' : 'Add New Title to MAYAD'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {editingMovie
                        ? `Updating metadata for "${editingMovie.title}"`
                        : 'Fill out details to register a new movie or web series'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Movie Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Vadlya Hindva"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Original Title (Hindi / Marwari)
                    </label>
                    <input
                      type="text"
                      value={formData.originalTitle}
                      onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
                      placeholder="e.g. वडल्या हिंडवा"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      URL Slug <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. vadlya-hindva"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* 2. Media Links & Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Poster Image URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.posterUrl}
                      onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                      placeholder="/vadliyahindva.jpg or https://..."
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Backdrop Banner URL
                    </label>
                    <input
                      type="text"
                      value={formData.backdropUrl}
                      onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                      placeholder="/vadliyahindva.jpg (Optional)"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Movie / Video Stream URL (Play Link)
                    </label>
                    <input
                      type="text"
                      value={formData.movieUrl}
                      onChange={(e) => setFormData({ ...formData, movieUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/embed/... or MP4 / HLS Stream Link"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Image Preview Box */}
                  {formData.posterUrl && (
                    <div className="sm:col-span-2 p-3 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center gap-4">
                      <img
                        src={formData.posterUrl}
                        alt="Poster Preview"
                        className="w-16 h-20 object-cover rounded-xl border border-amber-500/30"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-amber-300 block">Poster Preview Ready</span>
                        <span>Ensure the image URL is accessible via your public folder or HTTPS CDN.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Classification & Language */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="movie">Movie</option>
                      <option value="series">TV Series</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Cinema, Folk"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Language</label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      placeholder="e.g. Rajasthani"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Release Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: e.target.value ? parseInt(e.target.value) : '',
                        })
                      }
                      placeholder="2026"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* 4. Duration, Genres, Director */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 2h 15m or Season 1"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                      Genres (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.genresText}
                      onChange={(e) => setFormData({ ...formData, genresText: e.target.value })}
                      placeholder="historical, thriller, devotional"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Director</label>
                    <input
                      type="text"
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      placeholder="e.g. MAYAD Original Team"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* 5. Cast & Description */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                    Cast (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.castText}
                    onChange={(e) => setFormData({ ...formData, castText: e.target.value })}
                    placeholder="Tara Shree, Abhi Soni, Ramesh Nagda"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                    Synopsis / Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Write a brief story overview..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* 6. Publication & Feature Switches */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Published (Live)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOriginal}
                      onChange={(e) => setFormData({ ...formData, isOriginal: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="text-xs font-bold text-amber-300">MAYAD Original</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="w-4 h-4 accent-emerald-400 rounded"
                    />
                    <span className="text-xs font-bold text-emerald-300">Trending</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTop5}
                      onChange={(e) => setFormData({ ...formData, isTop5: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 rounded"
                    />
                    <span className="text-xs font-bold text-cyan-300">Top 5 Pick</span>
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-xs hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingMovie ? 'Save Changes' : 'Create Title'}</span>
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
        {deletingMovie && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMovie(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-50 w-full max-w-md bg-[#0c1126] border border-rose-500/40 rounded-3xl p-6 shadow-[0_10px_50px_rgba(225,29,72,0.3)] space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-white">Delete Movie Permanently?</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to remove <strong className="text-amber-300">"{deletingMovie.title}"</strong> from MAYAD platform? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingMovie(null)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-xs hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Delete Title</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* CAST & ROLE MANAGEMENT MODAL */}
      {selectedMovieForCast && (
        <AdminCastRoleModal
          movie={selectedMovieForCast}
          onClose={() => setSelectedMovieForCast(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
