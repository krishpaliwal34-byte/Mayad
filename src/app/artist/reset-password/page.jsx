'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import '@/components/artist/artist-system.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMsg('Missing password reset token in URL parameter.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill out both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`${BACKEND_URL}/api/artist/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
      } else {
        setErrorMsg(data.message || 'Failed to reset password. Link may be expired.');
      }
    } catch (err) {
      console.error('Reset Password Error:', err);
      setErrorMsg('Network error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Missing or invalid password reset token. Please request a new reset link.
        </div>
        <Link href="/artist/forgot-password" className="artist-btn-submit" style={{ textDecoration: 'none' }}>
          Request Reset Link
        </Link>
      </div>
    );
  }

  if (successMsg) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10B981', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Password Reset Complete!
        </h2>
        <p style={{ color: 'var(--artist-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {successMsg}
        </p>
        <Link href="/artist/login" className="artist-btn-submit" style={{ textDecoration: 'none' }}>
          Sign In Now <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '0.625rem', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <div className="artist-input-group">
        <label className="artist-input-label">New Password</label>
        <div className="artist-input-wrapper">
          <Lock className="artist-input-icon w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="artist-input-field"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: 'var(--artist-text-muted)', cursor: 'pointer' }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="artist-input-group">
        <label className="artist-input-label">Confirm New Password</label>
        <div className="artist-input-wrapper">
          <Lock className="artist-input-icon w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="artist-input-field"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="artist-btn-submit" style={{ marginTop: '0.75rem' }}>
        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
        {loading ? 'Updating Password...' : 'Reset & Save New Password'}
      </button>
    </form>
  );
}

export default function ArtistResetPasswordPage() {
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>Set New Password</h1>
            <p style={{ color: 'var(--artist-text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              Create a new secure password for your artist account.
            </p>
          </div>

          <Suspense fallback={
            <div style={{ textAlign: 'center', color: 'var(--artist-gold)', padding: '2rem' }}>
              <RefreshCw className="w-6 h-6 animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
              Loading token verification...
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>

        </div>
      </div>
    </div>
  );
}
