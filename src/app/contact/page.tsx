'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Building,
  Clock,
  Film,
  UserCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'General',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, Subject, Message).');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: 'General',
          message: '',
        });
      } else {
        setErrorMsg(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setErrorMsg('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* HERO SECTION */}
        <div className="text-center relative mb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Connect With MAYAD Team
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white"
          >
            Contact <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">& Inquiries</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300"
          >
            Have a question regarding movie productions, casting calls, brand partnerships, or general feedback? Send us an inquiry and our team will get back to you promptly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CONTACT CARDS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-amber-400" />
                MAYAD Production House
              </h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Registered Address</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      MAYAD Studios & Production House, Basni, Jodhpur, Rajasthan, India - 342005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Phone / WhatsApp</h3>
                    <p className="mt-1 text-xs text-slate-300">+91 (141) 298-MAYAD</p>
                    <p className="text-xs text-amber-400 font-semibold">+91 98290 00000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Email Address</h3>
                    <p className="mt-1 text-xs text-slate-300">contact@mayad.in</p>
                    <p className="text-xs text-slate-400">inquiries@mayad.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Office Hours</h3>
                    <p className="mt-1 text-xs text-slate-300">Monday – Saturday: 9:30 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 text-xs text-slate-300 space-y-2">
              <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <Film className="h-4 w-4 text-amber-400" />
                Casting & Artist Auditions
              </h4>
              <p className="leading-relaxed">
                Registered artists can access audition notices and project assignments directly in the Artist Dashboard.
              </p>
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-amber-400" />
                Send an Inquiry
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Fill out the form below and your message will be forwarded directly to the MAYAD CEO & Management Console.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-8 text-center space-y-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Inquiry Submitted!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out to MAYAD. Your message has been logged in our administrative system. We will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-block rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-xs text-red-300">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98290 00000"
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Production">Film / Video Production</option>
                        <option value="Casting">Casting & Auditions</option>
                        <option value="Business">Business Partnership</option>
                        <option value="Media">Media & Press</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Production Inquiry regarding upcoming Rajasthani film"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your inquiry message details here..."
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-amber-400 py-3.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? 'Submitting Inquiry...' : 'Submit Inquiry to MAYAD Admin'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
