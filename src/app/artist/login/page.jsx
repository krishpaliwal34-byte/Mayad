'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Film,
  UserRound,
  Star,
  ChevronRight,
} from 'lucide-react';

import '@/components/artist/artist-system.css';

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

export default function ArtistLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`${BACKEND_URL}/api/artist/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('mayad_artist_jwt', data.token);

          if (data.artist?.email) {
            localStorage.setItem(
              'mayad_artist_portal_logged_email',
              data.artist.email
            );
          }
          if (data.artist?.profilePhoto) {
            localStorage.setItem(
              'mayad_artist_profile_photo',
              data.artist.profilePhoto
            );
            window.dispatchEvent(new Event('artistProfileUpdated'));
          }
        }

        router.push('/artist/dashboard');
      } else {
        setErrorMsg(
          data.message || 'Invalid email address or password.'
        );
      }
    } catch (err) {
      console.error('Artist Login Error:', err);

      setErrorMsg(
        'Network error connecting to MAYAD backend server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (errorMsg) setErrorMsg('');
  };

  return (
    <div className="mayad-login-page">
      {/* BACKGROUND EFFECTS */}
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-grid" />

      {/* NAVBAR */}
      <header className="mayad-login-nav">
        <div className="mayad-login-nav-inner">
          <Link href="/" className="mayad-brand">
            <span className="mayad-brand-mark">M</span>

            <span className="mayad-brand-copy">
              <span className="mayad-brand-name">MAYAD</span>
              <span className="mayad-brand-sub">
                ARTIST PORTAL
              </span>
            </span>
          </Link>

          <Link href="/" className="back-home">
            Back to MAYAD
            <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="mayad-login-main">
        <div className="mayad-login-layout">

          {/* LEFT SHOWCASE */}
          <section className="login-showcase">

            <div className="showcase-badge">
              <Sparkles size={14} />
              MAYAD TALENT NETWORK
            </div>

            <h1>
              Your Talent.
              <br />
              <span>Your Stage.</span>
            </h1>

            <p className="showcase-description">
              Welcome back to MAYAD. Sign in to manage your
              artist profile, explore opportunities and stay
              connected with the entertainment ecosystem.
            </p>

            {/* FEATURE CARDS */}
            <div className="showcase-features">

              <div className="showcase-feature">
                <div className="feature-icon">
                  <Film size={18} />
                </div>

                <div>
                  <strong>Entertainment Opportunities</strong>
                  <span>
                    Discover film, music and production opportunities.
                  </span>
                </div>
              </div>

              <div className="showcase-feature">
                <div className="feature-icon">
                  <UserRound size={18} />
                </div>

                <div>
                  <strong>Professional Artist Profile</strong>
                  <span>
                    Keep your artist identity and information updated.
                  </span>
                </div>
              </div>

              <div className="showcase-feature">
                <div className="feature-icon">
                  <Star size={18} />
                </div>

                <div>
                  <strong>Build Your Presence</strong>
                  <span>
                    Grow your professional presence with MAYAD.
                  </span>
                </div>
              </div>

            </div>

            {/* QUOTE */}
            <div className="showcase-quote">
              <div className="quote-line" />

              <div>
                <p>
                  “Every great performance begins with an
                  opportunity.”
                </p>

                <span>— MAYAD Artist Network</span>
              </div>
            </div>

          </section>

          {/* LOGIN CARD */}
          <section className="login-card">

            {/* CARD HEADER */}
            <div className="login-card-header">

              <div className="login-card-icon">
                <Lock size={21} />
              </div>

              <div>
                <span className="login-mini-label">
                  ARTIST ACCOUNT
                </span>

                <h2>Welcome Back</h2>

                <p>
                  Sign in to continue to your artist dashboard.
                </p>
              </div>

            </div>

            {/* ERROR */}
            {errorMsg && (
              <div className="login-error">
                <div className="error-icon">
                  <AlertCircle size={17} />
                </div>

                <div>
                  <strong>Unable to sign in</strong>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleLoginSubmit}
              className="login-form"
            >

              {/* EMAIL */}
              <div className="login-field">

                <label>
                  Email Address
                  <span>*</span>
                </label>

                <div className="login-input-wrap">

                  <Mail
                    className="login-input-icon"
                    size={18}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    placeholder="artist@mayad.in"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="login-field">

                <div className="password-label-row">

                  <label>
                    Password
                    <span>*</span>
                  </label>

                  <Link
                    href="/artist/forgot-password"
                    className="forgot-link"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="login-input-wrap">

                  <Lock
                    className="login-input-icon"
                    size={18}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* REMEMBER / SECURITY */}
              <div className="login-security-row">

                <div className="secure-badge">
                  <ShieldCheck size={14} />
                  Secure login
                </div>

                <span>
                  Your account is protected
                </span>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >

                {loading ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="spin"
                    />

                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard

                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* REGISTER */}
            <div className="register-section">

              <div className="register-divider">
                <span />
                <small>NEW TO MAYAD?</small>
                <span />
              </div>

              <p>
                Don't have an artist account?
              </p>

              <Link
                href="/artist/register"
                className="register-link"
              >
                Create Artist Account
                <ArrowRight size={15} />
              </Link>

            </div>

          </section>

        </div>

        {/* FOOTER */}
        <div className="login-footer">

          <span>© {new Date().getFullYear()} MAYAD</span>

          <div>
            <span>ARTIST NETWORK</span>
            <span className="footer-dot">•</span>
            <span>ENTERTAINMENT</span>
          </div>

        </div>

      </main>

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #05070d;
        }

        body {
          min-height: 100vh;
        }

        .mayad-login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              circle at 12% 15%,
              rgba(245, 180, 40, .085),
              transparent 28%
            ),
            radial-gradient(
              circle at 87% 78%,
              rgba(91, 72, 180, .08),
              transparent 30%
            ),
            #05070d;
        }

        /* --------------------------------
           BACKGROUND
        -------------------------------- */

        .login-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .16;
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
        }

        .login-orb {
          position: fixed;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
        }

        .login-orb-one {
          top: -240px;
          left: -180px;
          background: rgba(245, 180, 40, .09);
        }

        .login-orb-two {
          right: -220px;
          bottom: -230px;
          background: rgba(92, 72, 190, .09);
        }

        /* --------------------------------
           NAVBAR
        -------------------------------- */

        .mayad-login-nav {
          height: 76px;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,.065);
          background: rgba(5,7,13,.72);
          backdrop-filter: blur(20px);
        }

        .mayad-login-nav-inner {
          height: 100%;
          max-width: 1240px;
          margin: auto;
          padding: 0 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mayad-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: white;
          text-decoration: none;
        }

        .mayad-brand-mark {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #080a0f;
          font-size: 18px;
          font-weight: 950;
          background:
            linear-gradient(
              135deg,
              #f9d36a,
              #dfa426 55%,
              #9b6600
            );
          box-shadow:
            0 10px 30px rgba(245,180,40,.15);
        }

        .mayad-brand-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
          line-height: 1;
        }

        .mayad-brand-name {
          font-size: 17px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .mayad-brand-sub {
          color: #737c8d;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .23em;
        }

        .back-home {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #858e9f;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: color .2s ease;
        }

        .back-home:hover {
          color: #f5c34e;
        }

        /* --------------------------------
           MAIN
        -------------------------------- */

        .mayad-login-main {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: auto;
          padding: 70px 24px 35px;
        }

        .mayad-login-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(400px, .86fr);
          align-items: center;
          gap: 80px;
        }

        /* --------------------------------
           SHOWCASE
        -------------------------------- */

        .login-showcase {
          padding: 15px 0;
        }

        .showcase-badge {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 999px;
          color: #f7c948;
          border: 1px solid rgba(245,180,40,.2);
          background: rgba(245,180,40,.065);
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .13em;
        }

        .login-showcase h1 {
          margin: 22px 0 0;
          max-width: 580px;
          font-size: clamp(46px, 5.2vw, 72px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 950;
          color: #f7f8fa;
        }

        .login-showcase h1 span {
          background:
            linear-gradient(
              100deg,
              #fff,
              #f7ce64 48%,
              #c98a15
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .showcase-description {
          max-width: 535px;
          margin: 25px 0 0;
          color: #7d8799;
          font-size: 14px;
          line-height: 1.85;
        }

        .showcase-features {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 31px;
          max-width: 530px;
        }

        .showcase-feature {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 13px;
          background: rgba(255,255,255,.018);
          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .showcase-feature:hover {
          transform: translateX(4px);
          border-color: rgba(245,180,40,.15);
          background: rgba(245,180,40,.025);
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f5c348;
          border-radius: 10px;
          border: 1px solid rgba(245,180,40,.12);
          background: rgba(245,180,40,.07);
        }

        .showcase-feature strong {
          display: block;
          margin-bottom: 3px;
          color: #dfe3e9;
          font-size: 12px;
          font-weight: 800;
        }

        .showcase-feature span {
          display: block;
          color: #667083;
          font-size: 10px;
          line-height: 1.5;
        }

        .showcase-quote {
          display: flex;
          gap: 14px;
          align-items: stretch;
          margin-top: 32px;
        }

        .quote-line {
          width: 2px;
          border-radius: 999px;
          background:
            linear-gradient(
              to bottom,
              #f5bd3d,
              rgba(245,189,61,0)
            );
        }

        .showcase-quote p {
          margin: 0 0 6px;
          color: #a8afbd;
          font-size: 12px;
          font-style: italic;
        }

        .showcase-quote span {
          color: #555f71;
          font-size: 9px;
          letter-spacing: .05em;
        }

        /* --------------------------------
           LOGIN CARD
        -------------------------------- */

        .login-card {
          width: 100%;
          max-width: 470px;
          justify-self: end;
          padding: 31px;
          border-radius: 25px;
          border: 1px solid rgba(255,255,255,.085);
          background:
            linear-gradient(
              145deg,
              rgba(17,21,33,.97),
              rgba(7,10,17,.98)
            );
          box-shadow:
            0 35px 100px rgba(0,0,0,.42),
            inset 0 1px 0 rgba(255,255,255,.025);
        }

        .login-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 24px;
          margin-bottom: 23px;
          border-bottom: 1px solid rgba(255,255,255,.065);
        }

        .login-card-icon {
          width: 47px;
          height: 47px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #f6c44d;
          background:
            linear-gradient(
              135deg,
              rgba(245,180,40,.15),
              rgba(245,180,40,.045)
            );
          border: 1px solid rgba(245,180,40,.15);
        }

        .login-mini-label {
          display: block;
          color: #687284;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .17em;
          margin-bottom: 4px;
        }

        .login-card-header h2 {
          margin: 0;
          color: #f5f6f8;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -.025em;
        }

        .login-card-header p {
          margin: 5px 0 0;
          color: #6f788a;
          font-size: 11px;
          line-height: 1.5;
        }

        /* --------------------------------
           ERROR
        -------------------------------- */

        .login-error {
          display: flex;
          gap: 10px;
          padding: 12px;
          margin-bottom: 19px;
          border-radius: 12px;
          border: 1px solid rgba(239,68,68,.22);
          background: rgba(239,68,68,.07);
        }

        .error-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #ff8585;
          background: rgba(239,68,68,.09);
        }

        .login-error strong {
          display: block;
          color: #ff9999;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .login-error span {
          display: block;
          color: #c27878;
          font-size: 10px;
          line-height: 1.5;
        }

        /* --------------------------------
           FORM
        -------------------------------- */

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-field label {
          color: #b6bdc9;
          font-size: 11px;
          font-weight: 750;
        }

        .login-field label span {
          color: #f4bd3d;
          margin-left: 3px;
        }

        .password-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .forgot-link {
          color: #d8a52f;
          font-size: 10px;
          font-weight: 750;
          text-decoration: none;
          transition: color .2s ease;
        }

        .forgot-link:hover {
          color: #f6ce66;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          z-index: 2;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #596376;
          pointer-events: none;
        }

        .login-input-wrap input {
          width: 100%;
          height: 50px;
          padding:
            0 44px
            0 43px;
          border-radius: 12px;
          outline: none;
          border: 1px solid rgba(255,255,255,.085);
          color: #f7f8fa;
          background: rgba(255,255,255,.032);
          font-size: 12px;
          transition:
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .login-input-wrap input::placeholder {
          color: #4e586a;
        }

        .login-input-wrap input:focus {
          border-color: rgba(245,180,40,.48);
          background: rgba(245,180,40,.025);
          box-shadow:
            0 0 0 3px rgba(245,180,40,.055);
        }

        .password-toggle {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #626c7d;
          cursor: pointer;
          transition:
            color .2s ease,
            background .2s ease;
        }

        .password-toggle:hover {
          color: #f5c44e;
          background: rgba(245,180,40,.06);
        }

        /* --------------------------------
           SECURITY
        -------------------------------- */

        .login-security-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: -3px;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #788294;
          font-size: 9px;
        }

        .secure-badge svg {
          color: #6f9f7f;
        }

        .login-security-row > span {
          color: #4f5868;
          font-size: 9px;
        }

        /* --------------------------------
           SUBMIT
        -------------------------------- */

        .login-submit {
          width: 100%;
          height: 53px;
          margin-top: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: none;
          border-radius: 12px;
          color: #090a0d;
          background:
            linear-gradient(
              135deg,
              #f8d46c,
              #e7ad2c 52%,
              #b87508
            );
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .01em;
          cursor: pointer;
          box-shadow:
            0 13px 30px rgba(211,149,22,.14);
          transition:
            transform .2s ease,
            filter .2s ease,
            box-shadow .2s ease;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow:
            0 17px 38px rgba(211,149,22,.2);
        }

        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-submit:disabled {
          opacity: .62;
          cursor: not-allowed;
        }

        .spin {
          animation: loginSpin 1s linear infinite;
        }

        @keyframes loginSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* --------------------------------
           REGISTER
        -------------------------------- */

        .register-section {
          margin-top: 25px;
          text-align: center;
        }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 16px;
        }

        .register-divider span {
          height: 1px;
          flex: 1;
          background: rgba(255,255,255,.06);
        }

        .register-divider small {
          color: #4e5869;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .register-section p {
          margin: 0 0 9px;
          color: #697284;
          font-size: 10px;
        }

        .register-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #f4c24b;
          font-size: 11px;
          font-weight: 850;
          text-decoration: none;
          transition: gap .2s ease;
        }

        .register-link:hover {
          gap: 10px;
        }

        /* --------------------------------
           FOOTER
        -------------------------------- */

        .login-footer {
          max-width: 470px;
          margin: 34px 0 0 auto;
          display: flex;
          justify-content: space-between;
          color: #414a5a;
          font-size: 8px;
          letter-spacing: .09em;
        }

        .login-footer > div {
          display: flex;
          gap: 8px;
        }

        .footer-dot {
          color: #876a25;
        }

        /* --------------------------------
           RESPONSIVE
        -------------------------------- */

        @media (max-width: 980px) {

          .mayad-login-main {
            padding-top: 45px;
          }

          .mayad-login-layout {
            grid-template-columns: 1fr;
            gap: 45px;
            max-width: 650px;
            margin: auto;
          }

          .login-showcase {
            text-align: center;
          }

          .showcase-badge {
            margin: auto;
          }

          .login-showcase h1 {
            margin-left: auto;
            margin-right: auto;
          }

          .showcase-description {
            margin-left: auto;
            margin-right: auto;
          }

          .showcase-features {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }

          .showcase-quote {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }

          .login-card {
            justify-self: center;
          }

          .login-footer {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 600px) {

          .mayad-login-nav {
            height: 68px;
          }

          .mayad-login-nav-inner {
            padding: 0 16px;
          }

          .mayad-brand-mark {
            width: 37px;
            height: 37px;
            border-radius: 10px;
          }

          .mayad-brand-name {
            font-size: 15px;
          }

          .back-home {
            font-size: 10px;
          }

          .mayad-login-main {
            padding:
              38px 14px
              28px;
          }

          .login-showcase h1 {
            font-size: 45px;
          }

          .showcase-description {
            font-size: 12px;
            line-height: 1.7;
          }

          .showcase-features {
            margin-top: 25px;
          }

          .showcase-feature {
            padding: 11px;
          }

          .login-card {
            padding: 22px 18px;
            border-radius: 20px;
          }

          .login-card-header {
            padding-bottom: 20px;
          }

          .login-card-header h2 {
            font-size: 20px;
          }

          .login-security-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .login-footer {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
        }

        @media (max-width: 390px) {

          .login-showcase h1 {
            font-size: 39px;
          }

          .mayad-brand-sub {
            display: none;
          }

          .back-home {
            display: none;
          }
        }

      `}</style>
    </div>
  );
}