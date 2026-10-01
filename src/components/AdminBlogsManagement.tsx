'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  User,
  Tag,
  Globe,
  Clock,
} from 'lucide-react';
import { getApiBaseUrl } from '@/utils/config';

export interface AdminBlogRecord {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  titleRaj?: string;
  category: string;
  categoryRaj?: string;
  date: string;
  readTime: string;
  readTimeRaj?: string;
  author: string;
  authorRole?: string;
  imageUrl: string;
  excerpt: string;
  excerptRaj?: string;
  content: {
    heading?: string;
    headingRaj?: string;
    paragraphs: string[];
    paragraphsRaj?: string[];
  }[];
  tags: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminBlogsManagementProps {
  showToast?: (text: string, type?: 'success' | 'error') => void;
  onStatsUpdate?: () => void;
}

export default function AdminBlogsManagement({
  showToast,
  onStatsUpdate,
}: AdminBlogsManagementProps) {
  const [blogs, setBlogs] = useState<AdminBlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlogRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    titleRaj: '',
    category: 'Cinema & Tech',
    categoryRaj: 'सिनेमा और तकनीक',
    date: '',
    readTime: '4 min read',
    readTimeRaj: '4 मिनट री पढ़ाई',
    author: 'MAYAD Editorial',
    authorRole: 'Entertainment Team',
    imageUrl: '',
    excerpt: '',
    excerptRaj: '',
    heading1: '',
    heading1Raj: '',
    paragraphs1Text: '',
    paragraphs1RajText: '',
    tagsText: 'Rajasthani Cinema, MAYAD Originals, Culture',
    isPublished: true,
  });

  // Delete Modal
  const [blogToDelete, setBlogToDelete] = useState<AdminBlogRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Helper Toast
  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (showToast) showToast(msg, type);
    else alert(msg);
  };

  // Fetch Admin Blogs
  const loadBlogs = async () => {
    try {
      setLoading(true);
      const apiBase = getApiBaseUrl();
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('mayad_admin_jwt') || localStorage.getItem('token')
          : '';

      const res = await fetch(`${apiBase}/blogs/admin/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch admin blogs');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      }
    } catch (err: any) {
      console.error('Error loading blogs:', err);
      notify(err?.message || 'Failed to load blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = blog.title.toLowerCase().includes(q);
        const matchSlug = blog.slug.toLowerCase().includes(q);
        const matchAuthor = (blog.author || '').toLowerCase().includes(q);
        const matchCategory = (blog.category || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSlug && !matchAuthor && !matchCategory) {
          return false;
        }
      }

      if (statusFilter === 'published' && !blog.isPublished) return false;
      if (statusFilter === 'draft' && blog.isPublished) return false;

      return true;
    });
  }, [blogs, searchQuery, statusFilter]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingBlog(null);
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    setFormData({
      slug: '',
      title: '',
      titleRaj: '',
      category: 'Cinema & Tech',
      categoryRaj: 'सिनेमा और तकनीक',
      date: today,
      readTime: '4 min read',
      readTimeRaj: '4 मिनट री पढ़ाई',
      author: 'MAYAD Editorial',
      authorRole: 'Entertainment Team',
      imageUrl: '',
      excerpt: '',
      excerptRaj: '',
      heading1: 'A New Era for Regional Cinema',
      heading1Raj: 'क्षेत्रीय सिनेमा रो नया युग',
      paragraphs1Text: 'Write the main body text for this blog post here...',
      paragraphs1RajText: 'अठे ब्लॉग रो मुख्य विवरण लिखो...',
      tagsText: 'Rajasthani Cinema, MAYAD Originals, Culture',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (blog: AdminBlogRecord) => {
    setEditingBlog(blog);

    const firstSection = blog.content && blog.content.length > 0 ? blog.content[0] : null;

    setFormData({
      slug: blog.slug || '',
      title: blog.title || '',
      titleRaj: blog.titleRaj || '',
      category: blog.category || 'Cinema & Tech',
      categoryRaj: blog.categoryRaj || '',
      date: blog.date || '',
      readTime: blog.readTime || '4 min read',
      readTimeRaj: blog.readTimeRaj || '',
      author: blog.author || 'MAYAD Editorial',
      authorRole: blog.authorRole || 'Entertainment Team',
      imageUrl: blog.imageUrl || '',
      excerpt: blog.excerpt || '',
      excerptRaj: blog.excerptRaj || '',
      heading1: firstSection?.heading || '',
      heading1Raj: firstSection?.headingRaj || '',
      paragraphs1Text: (firstSection?.paragraphs || []).join('\n\n'),
      paragraphs1RajText: (firstSection?.paragraphsRaj || []).join('\n\n'),
      tagsText: (blog.tags || []).join(', '),
      isPublished: Boolean(blog.isPublished),
    });
    setIsModalOpen(true);
  };

  // Auto slug generator
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!editingBlog && !prev.slug) {
        updated.slug = val
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      return updated;
    });
  };

  // Submit Form (Create / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      notify('Title and Cover Image URL are required', 'error');
      return;
    }

    const finalSlug =
      formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const paragraphsArr = formData.paragraphs1Text
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const paragraphsRajArr = formData.paragraphs1RajText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const contentSection = [
      {
        heading: formData.heading1.trim(),
        headingRaj: formData.heading1Raj.trim(),
        paragraphs: paragraphsArr.length > 0 ? paragraphsArr : [formData.excerpt],
        paragraphsRaj: paragraphsRajArr.length > 0 ? paragraphsRajArr : [formData.excerptRaj],
      },
    ];

    const tagsArr = formData.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      slug: finalSlug,
      title: formData.title,
      titleRaj: formData.titleRaj,
      category: formData.category,
      categoryRaj: formData.categoryRaj,
      date: formData.date,
      readTime: formData.readTime,
      readTimeRaj: formData.readTimeRaj,
      author: formData.author,
      authorRole: formData.authorRole,
      imageUrl: formData.imageUrl,
      excerpt: formData.excerpt,
      excerptRaj: formData.excerptRaj,
      content: contentSection,
      tags: tagsArr,
      isPublished: formData.isPublished,
    };

    try {
      setSubmitting(true);
      const apiBase = getApiBaseUrl();
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('mayad_admin_jwt') || localStorage.getItem('token')
          : '';

      const url = editingBlog
        ? `${apiBase}/blogs/${editingBlog._id}`
        : `${apiBase}/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save blog post');
      }

      notify(
        editingBlog ? 'Blog post updated successfully' : 'Blog post published successfully',
        'success'
      );
      setIsModalOpen(false);
      loadBlogs();
      if (onStatsUpdate) onStatsUpdate();
    } catch (err: any) {
      console.error('Save blog error:', err);
      notify(err?.message || 'Error saving blog post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Blog
  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      setDeleteLoading(true);
      const apiBase = getApiBaseUrl();
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('mayad_admin_jwt') || localStorage.getItem('token')
          : '';

      const res = await fetch(`${apiBase}/blogs/${blogToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete blog post');
      }

      notify('Blog post deleted successfully', 'success');
      setBlogToDelete(null);
      loadBlogs();
      if (onStatsUpdate) onStatsUpdate();
    } catch (err: any) {
      console.error('Delete blog error:', err);
      notify(err?.message || 'Error deleting blog post', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER ACTIONS
      ========================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-[#090d1f]/90 border border-white/10 p-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs by title, author, category, slug..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Articles</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={loadBlogs}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Add Blog Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          BLOGS CARDS GRID
      ========================================================= */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
          <span>Loading blog articles...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Blog Articles Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Publish articles to reach MAYAD OTT readers and regional cinema fans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="group rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-lg"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                <img
                  src={blog.imageUrl || '/historical.jpg'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-transparent opacity-80" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-md ${
                      blog.isPublished
                        ? 'bg-emerald-500 text-black'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-white/10">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {blog.titleRaj && (
                    <p className="text-xs text-amber-400/90 font-semibold line-clamp-1 mt-1">
                      {blog.titleRaj}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-amber-400" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(blog)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setBlogToDelete(blog)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT BLOG
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
              className="relative z-10 w-full max-w-3xl bg-[#090d1f] border border-amber-500/30 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {editingBlog ? 'Edit Blog Article' : 'Create New Blog Article'}
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
                {/* Title & Rajasthani Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Article Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. The Revival of Rajasthani Regional Cinema"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Article Title (Rajasthani)</label>
                    <input
                      type="text"
                      value={formData.titleRaj}
                      onChange={(e) => setFormData({ ...formData, titleRaj: e.target.value })}
                      placeholder="e.g. राजस्थानी प्रादेशिक सिनेमा रो पुनर्जागरण"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Slug & Cover Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="revival-of-rajasthani-cinema"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Cover Image URL *</label>
                    <input
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/historical.jpg or https://..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category (English & Raj)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Cinema & Tech"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                      <input
                        type="text"
                        value={formData.categoryRaj}
                        onChange={(e) => setFormData({ ...formData, categoryRaj: e.target.value })}
                        placeholder="सिनेमा और तकनीक"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Author Name & Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="MAYAD Editorial"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                      <input
                        type="text"
                        value={formData.authorRole}
                        onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                        placeholder="Entertainment Team"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Publish Date String</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="September 5, 2026"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Read Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="4 min read"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                      <input
                        type="text"
                        value={formData.readTimeRaj}
                        onChange={(e) => setFormData({ ...formData, readTimeRaj: e.target.value })}
                        placeholder="4 मिनट री पढ़ाई"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Excerpt (English & Rajasthani) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Short Summary / Excerpt (English)</label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the article..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Short Summary / Excerpt (Rajasthani)</label>
                    <textarea
                      rows={2}
                      value={formData.excerptRaj}
                      onChange={(e) => setFormData({ ...formData, excerptRaj: e.target.value })}
                      placeholder="संक्षिप्त विवरण लिखो..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Section Heading & Content */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <span className="block text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                    Article Section Content
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Section Heading (ENG)</label>
                      <input
                        type="text"
                        value={formData.heading1}
                        onChange={(e) => setFormData({ ...formData, heading1: e.target.value })}
                        placeholder="e.g. A New Era for Regional Cinema"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Section Heading (RAJ)</label>
                      <input
                        type="text"
                        value={formData.heading1Raj}
                        onChange={(e) => setFormData({ ...formData, heading1Raj: e.target.value })}
                        placeholder="e.g. क्षेत्रीय सिनेमा रो नया युग"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Paragraphs (ENG) (Separate with double linebreaks)</label>
                      <textarea
                        rows={4}
                        value={formData.paragraphs1Text}
                        onChange={(e) => setFormData({ ...formData, paragraphs1Text: e.target.value })}
                        placeholder="Paragraph 1...\n\nParagraph 2..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Paragraphs (RAJ) (Separate with double linebreaks)</label>
                      <textarea
                        rows={4}
                        value={formData.paragraphs1RajText}
                        onChange={(e) => setFormData({ ...formData, paragraphs1RajText: e.target.value })}
                        placeholder="पैराग्राफ 1...\n\nपैराग्राफ 2..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags & Published Switch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.tagsText}
                      onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                      placeholder="Rajasthani Cinema, Culture, OTT"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 rounded"
                      />
                      <span className="text-xs font-bold text-white">Publish Immediately (Live on Site)</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingBlog ? 'Save Changes' : 'Publish Article'}</span>
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
        {blogToDelete && (
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
                  <h3 className="text-base font-extrabold text-white">Delete Blog Article?</h3>
                  <p className="text-xs text-rose-300/80 font-medium line-clamp-1">{blogToDelete.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete this blog post from MAYAD OTT? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBlogToDelete(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteBlog}
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
