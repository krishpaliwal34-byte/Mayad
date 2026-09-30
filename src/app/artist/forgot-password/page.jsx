'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, KeyRound, Copy } from 'lucide-react';
import '@/components/artist/artist-system.css';

import { getBackendUrl } from '@/utils/config';

const BACKEND_URL = getBackendUrl();

export default function ArtistForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      setDevResetLink('');

      const res = await fetch(`${BACKEND_URL}/api/artist/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        if (data.resetLink) {
          setDevResetLink(data.resetLink);
        }
      } else {
        setErrorMsg(data.message || 'Failed to request password reset');
      }
    } catch (err) {
      console.error('Forgot Password Error:', err);
      setErrorMsg('Network error connecting to MAYAD backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!devResetLink) return;
    navigator.clipboard.writeText(devResetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="artist-system-wrapper">
      <header className="artist-nav-header">
        <div className="artist-nav-container">
          <Link href="/" className="artist-nav-logo">
            <span className="artist-nav-logo-badge">MAYAD</span>
            <span className="artist-nav-logo-title">ARTIST PORTAL</span>
          </Link>
        </div>
      </header>

      <div className="artist-auth-container">
        <div className="artist-auth-card">

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245, 180, 40, 0.15)', border: '2px solid var(--artist-gold)', color: 'var(--artist-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>Password Recovery</h1>
            <p style={{ color: 'var(--artist-text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              Enter your registered artist email to receive password reset instructions.
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '0.625rem', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          {successMsg ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34d399', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                <CheckCircle className="w-6 h-6" style={{ margin: '0 auto 0.5rem auto' }} />
                {successMsg}
              </div>

              {/* Dev Reset Link Preview Banner */}
              {devResetLink && (
                <div style={{ background: 'rgba(245, 180, 40, 0.08)', border: '1px solid rgba(245, 180, 40, 0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--artist-gold)' }}>
                      Dev Reset Link (SMTP Dev Mode):
                    </span>
                    <button onClick={handleCopyLink} style={{ background: 'none', border: 'none', color: 'var(--artist-gold)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <Link href={devResetLink} style={{ fontSize: '0.8125rem', color: '#fff', wordBreak: 'break-all', textDecoration: 'underline' }}>
                    {devResetLink}
                  </Link>
                </div>
              )}

              <Link href="/artist/login" className="artist-btn-submit" style={{ textDecoration: 'none' }}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="artist-input-group">
                <label className="artist-input-label">Email Address</label>
                <div className="artist-input-wrapper">
                  <Mail className="artist-input-icon w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@mayad.in"
                    className="artist-input-field"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="artist-btn-submit" style={{ marginTop: '0.75rem' }}>
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                {loading ? 'Sending Request...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/artist/login" style={{ color: 'var(--artist-text-muted)', fontSize: '0.8125rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Artist Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
