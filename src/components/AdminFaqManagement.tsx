'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { getStoredFaqs, saveStoredFaqs, FAQItem } from '@/data/faqData';

interface AdminFaqManagementProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function AdminFaqManagement({ showToast }: AdminFaqManagementProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  // Delete Confirmation state
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = () => {
    setFaqs(getStoredFaqs());
  };

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Please fill in both Question and Answer fields', 'error');
      return;
    }

    if (editingFaq) {
      // Update existing FAQ
      const updated = faqs.map((f) =>
        f.id === editingFaq.id
          ? {
              ...f,
              question: formData.question.trim(),
              answer: formData.answer.trim(),
              category: formData.category.trim(),
            }
          : f
      );
      saveStoredFaqs(updated);
      setFaqs(updated);
      showToast('FAQ updated successfully!');
    } else {
      // Add new FAQ
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim() || 'General',
      };
      const updated = [...faqs, newFaq];
      saveStoredFaqs(updated);
      setFaqs(updated);
      showToast('New FAQ added successfully!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    saveStoredFaqs(updated);
    setFaqs(updated);
    setDeletingFaqId(null);
    showToast('FAQ deleted successfully!');
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-[#0D1326]/80 p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-mayad-gold text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Content Management</span>
          </div>
          <h2 className="text-2xl font-black text-white">FAQ Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            Add, update, or remove Frequently Asked Questions shown on the website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mayad-gold to-amber-500 px-5 py-3 text-sm font-bold text-black shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0D1326]/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-mayad-gold/60"
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0D1326]/40 p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No FAQs found</h3>
            <p className="text-sm text-slate-400 mt-1">
              Click "Add New FAQ" to create your first question and answer item.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="rounded-2xl border border-white/10 bg-[#0D1326]/80 p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:border-white/20"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-mayad-gold/15 text-mayad-gold border border-mayad-gold/30">
                    {faq.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">ID: {faq.id}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                <button
                  onClick={() => handleOpenEditModal(faq)}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-mayad-gold hover:bg-mayad-gold/10 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeletingFaqId(faq.id)}
                  className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0D1326] p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. General, Services, Contact, Careers"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mayad-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  placeholder="Enter the question..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mayad-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter the detailed answer..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mayad-gold leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-mayad-gold font-bold text-black text-sm hover:bg-mayad-goldHover"
                >
                  {editingFaq ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFaqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0D1326] p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete FAQ?</h3>
            <p className="text-sm text-slate-400 mt-2">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletingFaqId(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingFaqId)}
                className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
