'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
  ChevronDown,
  Film,
  Star,
} from 'lucide-react';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const ROLE_CATEGORIES = [
  {
    category: 'Film & Production',
    roles: [
      'Director',
      'Assistant Director',
      'Producer',
      'Production Manager',
      'Cinematographer / DOP',
      'Assistant Cinematographer',
      'Video Editor',
      'Sound Designer',
    ],
  },
  {
    category: 'Acting & Talent',
    roles: [
      'Actor',
      'Actress',
      'Supporting Artist',
      'Voice Artist',
      'Casting Coordinator',
    ],
  },
  {
    category: 'Music',
    roles: [
      'Singer',
      'Music Director',
      'Composer',
      'Lyricist',
      'Music Producer',
    ],
  },
  {
    category: 'Creative',
    roles: [
      'Script Writer',
      'Story Writer',
      'Screenplay Writer',
      'Dialogue Writer',
      'Costume Designer',
      'Makeup Artist',
    ],
  },
];

export default function ArtistRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) {
      setErrorMsg('');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formData.email.trim() ||
      !emailRegex.test(formData.email.trim())
    ) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const phoneClean = formData.mobile.replace(/[\s-]/g, '');

    if (!phoneClean || phoneClean.length < 10) {
      setErrorMsg(
        'Please enter a valid mobile number (at least 10 digits).'
      );
      return;
    }

    if (!formData.dob) {
      setErrorMsg('Date of Birth is required.');
      return;
    }

    if (!formData.gender) {
      setErrorMsg('Gender selection is required.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg('City is required.');
      return;
    }

    if (!formData.state.trim()) {
      setErrorMsg('State is required.');
      return;
    }

    if (!formData.role) {
      setErrorMsg('Please select your primary role.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        dob: formData.dob,
        gender: formData.gender,
        city: formData.city.trim(),
        state: formData.state.trim(),
        role: formData.role,
        password: formData.password,
      };

      const res = await fetch(
        `${BACKEND_URL}/api/artist/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(
          'Artist account created successfully!'
        );

        if (data.token && data.artist) {
          localStorage.setItem(
            'mayad_artist_jwt',
            data.token
          );

          localStorage.setItem(
            'mayad_artist_portal_logged_email',
            data.artist.email
          );
        }

        setTimeout(() => {
          router.push('/artist/login');
        }, 1500);
      } else {
        setErrorMsg(
          data.message ||
            'Registration failed. Please try again.'
        );
      }
    } catch (err) {
      console.error(
        'Artist Registration Error:',
        err
      );

      setErrorMsg(
        'Network error connecting to MAYAD backend server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full h-12 rounded-xl border border-white/[0.09] bg-white/[0.035] text-white text-[13px] outline-none px-11 transition-all duration-200 placeholder:text-[#4f5869] focus:border-[#f5b428]/60 focus:bg-[#f5b428]/[0.035] focus:ring-4 focus:ring-[#f5b428]/[0.07]';

  const selectClass =
    'w-full h-12 rounded-xl border border-white/[0.09] bg-[#0b0f19] text-white text-[13px] outline-none pl-11 pr-10 appearance-none cursor-pointer color-scheme-dark focus:border-[#f5b428]/60 focus:ring-4 focus:ring-[#f5b428]/[0.07]';

  const labelClass =
    'text-[11px] font-bold tracking-[0.02em] text-[#b8bfcc]';

  const sectionTitleClass =
    'text-[13px] font-extrabold text-[#f0f2f6]';

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#05070d] text-white">
      {/* Background Glow */}

      <div className="pointer-events-none fixed -left-32 -top-44 z-0 h-[420px] w-[420px] rounded-full bg-[#f5b428]/[0.06] blur-[100px]" />

      <div className="pointer-events-none fixed -bottom-40 -right-40 z-0 h-[420px] w-[420px] rounded-full bg-violet-500/[0.06] blur-[110px]" />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 h-16 border-b border-white/[0.07] bg-[#05070d]/80 backdrop-blur-xl sm:h-[72px] md:h-[76px]">
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-3 sm:px-5 md:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 text-white no-underline"
          >
            {/* Logo */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#f7c948] via-[#d99a17] to-[#8e5d00] text-base font-black text-[#080a0f] shadow-[0_8px_28px_rgba(245,180,40,.18)] sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg">
              M
            </div>

            <div className="flex min-w-0 flex-col gap-1 leading-none">
              <span className="text-sm font-black tracking-[0.14em] sm:text-[17px] sm:tracking-[0.16em]">
                MAYAD
              </span>

              <span className="hidden text-[8px] font-bold tracking-[0.18em] text-gray-400 min-[400px]:block sm:text-[9px] sm:tracking-[0.22em]">
                ARTIST PORTAL
              </span>
            </div>
          </Link>

          <Link
            href="/artist/login"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[10px] font-bold text-gray-300 no-underline transition hover:border-[#f5b428]/30 hover:text-[#f7c948] sm:gap-2 sm:px-3.5 sm:text-xs md:px-4 md:py-2.5 md:text-[13px]"
          >
            <span className="hidden min-[360px]:inline">
              Already Registered
            </span>

            <span className="min-[360px]:hidden">
              Login
            </span>

            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 mx-auto w-full max-w-[1180px] px-3 pb-12 pt-8 sm:px-5 sm:pb-16 sm:pt-10 md:px-6 md:pb-[70px] md:pt-12">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="mx-auto mb-7 max-w-[760px] text-center sm:mb-9 md:mb-[42px]">
          {/* Badge */}

          <div className="mb-4 inline-flex max-w-full items-center justify-center gap-1.5 rounded-full border border-[#f5b428]/20 bg-[#f5b428]/[0.07] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#f7c948] sm:gap-2 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.12em]">
            <Sparkles size={12} />
            <span>Join the MAYAD Talent Network</span>
          </div>

          <h1 className="m-0 bg-gradient-to-b from-white via-[#f6d27a] to-[#c9911d] bg-clip-text px-2 text-[32px] font-black leading-[1.08] tracking-[-0.04em] text-transparent sm:text-[40px] md:text-[50px] lg:text-[58px]">
            Create Your Artist Profile
          </h1>

          <p className="mx-auto mt-3.5 max-w-[620px] px-2 text-xs leading-7 text-[#8f98aa] sm:mt-4 sm:text-[13px] md:mt-[18px] md:text-[15px]">
            Build your official MAYAD artist profile and
            connect with opportunities across film,
            production, acting, music and creative
            industries.
          </p>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid w-full grid-cols-1 items-start gap-4 sm:gap-5 md:gap-[22px] lg:grid-cols-[minmax(270px,.72fr)_minmax(0,1.55fr)]">
          {/* =================================================
              LEFT SIDE CARD
          ================================================= */}

          <aside className="rounded-[20px] border border-white/[0.08] bg-gradient-to-br from-[#121622]/95 to-[#090c14]/95 p-5 shadow-[0_25px_80px_rgba(0,0,0,.28)] sm:rounded-[22px] sm:p-6 md:sticky md:top-24 md:rounded-3xl md:p-[27px]">
            {/* Icon */}

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[13px] border border-[#f5b428]/15 bg-gradient-to-br from-[#f5b428]/15 to-[#f5b428]/[0.03] text-[#f7c948] sm:h-12 sm:w-12 sm:rounded-[14px]">
              <Film size={22} />
            </div>

            <h2 className="m-0 mb-2 text-[17px] font-extrabold text-white sm:text-lg md:text-[19px]">
              Your journey starts here.
            </h2>

            <p className="mb-5 text-xs leading-6 text-[#8992a5] sm:text-[13px] sm:leading-[1.65] md:mb-[22px]">
              Register once and create a professional
              identity inside the MAYAD entertainment
              ecosystem.
            </p>

            {/* Benefit 1 */}

            <div className="flex gap-3 border-t border-white/[0.06] py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#f5b428]/10 bg-[#f5b428]/[0.08] text-[#f7c948]">
                <Star size={15} />
              </div>

              <div>
                <h4 className="m-0 mb-1 text-xs font-extrabold text-white">
                  Professional Profile
                </h4>

                <p className="m-0 text-[10px] leading-4 text-[#737d90]">
                  Showcase your role and professional
                  information.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}

            <div className="flex gap-3 border-t border-white/[0.06] py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#f5b428]/10 bg-[#f5b428]/[0.08] text-[#f7c948]">
                <Briefcase size={15} />
              </div>

              <div>
                <h4 className="m-0 mb-1 text-xs font-extrabold text-white">
                  Entertainment Opportunities
                </h4>

                <p className="m-0 text-[10px] leading-4 text-[#737d90]">
                  Discover opportunities across film and
                  production.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}

            <div className="flex gap-3 border-t border-white/[0.06] py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#f5b428]/10 bg-[#f5b428]/[0.08] text-[#f7c948]">
                <ShieldCheck size={15} />
              </div>

              <div>
                <h4 className="m-0 mb-1 text-xs font-extrabold text-white">
                  Secure Account
                </h4>

                <p className="m-0 text-[10px] leading-4 text-[#737d90]">
                  Your account credentials are protected.
                </p>
              </div>
            </div>

            {/* Information */}

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 sm:mt-5 sm:px-3.5">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-[#f7c948]"
              />

              <span className="text-[10px] leading-[1.55] text-[#697386]">
                Please provide accurate information. Your
                profile information may be reviewed by the
                MAYAD team.
              </span>
            </div>
          </aside>

          {/* =================================================
              FORM CARD
          ================================================= */}

          <section className="min-w-0 overflow-hidden rounded-[20px] border border-white/[0.09] bg-gradient-to-br from-[#0f131e]/[0.98] to-[#070a11]/[0.99] shadow-[0_30px_100px_rgba(0,0,0,.38)] sm:rounded-[23px] md:rounded-[26px]">
            {/* Form Header */}

            <div className="flex flex-col items-start justify-between gap-2.5 border-b border-white/[0.07] px-4 py-5 sm:px-5 sm:py-6 md:flex-row md:items-center md:px-[30px] md:py-[27px]">
              <div>
                <h2 className="m-0 text-base font-extrabold text-white sm:text-lg">
                  Artist Registration
                </h2>

                <p className="m-0 mt-1 text-[10px] text-[#737d90] sm:text-xs">
                  Complete your basic professional details.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#8d96a7] sm:text-[11px]">
                <ShieldCheck
                  size={14}
                  className="text-[#f7c948]"
                />
                Secure Registration
              </div>
            </div>

            {/* Form Body */}

            <div className="px-4 py-5 sm:px-5 sm:py-6 md:px-[30px] md:py-7">
              {/* Error */}

              {errorMsg && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-3 text-xs leading-5 text-red-300">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success */}

              {successMsg && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-3 text-xs leading-5 text-emerald-300">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{successMsg}</span>
                </div>
              )}

              <form
                onSubmit={handleRegisterSubmit}
                className="w-full"
              >
                {/* =================================================
                    SECTION 01
                ================================================= */}

                <div className="mb-6 sm:mb-7">
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5b428]/10 text-[10px] font-black text-[#f7c948]">
                      01
                    </div>

                    <span
                      className={sectionTitleClass}
                    >
                      Personal Information
                    </span>
                  </div>

                  {/* Name + Email */}

                  <div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {/* Name */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Full Name{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <User
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Rahul Sharma"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Email Address{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <Mail
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="artist@example.com"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile + DOB */}

                  <div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {/* Mobile */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Mobile Number{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <Phone
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* DOB */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Date of Birth{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <Calendar
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`${inputClass} color-scheme-dark`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender */}

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label className={labelClass}>
                      Gender{' '}
                      <span className="text-[#f5b428]">
                        *
                      </span>
                    </label>

                    <div className="relative w-full">
                      <User
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                      />

                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={selectClass}
                        required
                      >
                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Non-Binary">
                          Non-Binary
                        </option>

                        <option value="Prefer Not to Say">
                          Prefer Not to Say
                        </option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SECTION 02
                ================================================= */}

                <div className="mb-6 sm:mb-7">
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5b428]/10 text-[10px] font-black text-[#f7c948]">
                      02
                    </div>

                    <span
                      className={sectionTitleClass}
                    >
                      Location
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {/* City */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        City{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <MapPin
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Mumbai / Jaipur"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* State */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        State{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <MapPin
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Rajasthan / Maharashtra"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SECTION 03
                ================================================= */}

                <div className="mb-6 sm:mb-7">
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5b428]/10 text-[10px] font-black text-[#f7c948]">
                      03
                    </div>

                    <span
                      className={sectionTitleClass}
                    >
                      Professional Information
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label className={labelClass}>
                      Primary Role / Designation{' '}
                      <span className="text-[#f5b428]">
                        *
                      </span>
                    </label>

                    <div className="relative w-full">
                      <Briefcase
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                      />

                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={selectClass}
                        required
                      >
                        <option value="">
                          Select Role / Position
                        </option>

                        {ROLE_CATEGORIES.map(
                          (catGroup) => (
                            <optgroup
                              key={catGroup.category}
                              label={catGroup.category}
                            >
                              {catGroup.roles.map(
                                (role) => (
                                  <option
                                    key={role}
                                    value={role}
                                  >
                                    {role}
                                  </option>
                                )
                              )}
                            </optgroup>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SECTION 04
                ================================================= */}

                <div className="mb-6 sm:mb-7">
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5b428]/10 text-[10px] font-black text-[#f7c948]">
                      04
                    </div>

                    <span
                      className={sectionTitleClass}
                    >
                      Account Security
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {/* Password */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Password{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <Lock
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Minimum 6 characters"
                          className={`${inputClass} pr-12`}
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          aria-label="Toggle password visibility"
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border-0 bg-transparent text-[#70798b] transition hover:bg-white/5 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label className={labelClass}>
                        Confirm Password{' '}
                        <span className="text-[#f5b428]">
                          *
                        </span>
                      </label>

                      <div className="relative w-full">
                        <Lock
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#646e81]"
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          name="confirmPassword"
                          value={
                            formData.confirmPassword
                          }
                          onChange={handleChange}
                          placeholder="Re-enter password"
                          className={`${inputClass} pr-12`}
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          aria-label="Toggle confirm password visibility"
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border-0 bg-transparent text-[#70798b] transition hover:bg-white/5 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-br from-[#f8cc59] via-[#e7aa28] to-[#bd7d0b] text-xs font-black tracking-[0.02em] text-[#0a0b0f] shadow-[0_14px_35px_rgba(221,157,27,.18)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[54px] sm:text-[13px]"
                >
                  {loading ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                      />

                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Artist Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}

              <div className="mt-5 border-t border-white/[0.06] pt-5 text-center text-[11px] leading-6 text-[#70798b] sm:text-xs">
                Already have a MAYAD artist account?{' '}

                <Link
                  href="/artist/login"
                  className="font-extrabold text-[#f7c948] no-underline hover:text-[#ffe18a]"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}

        <div className="mt-6 text-center text-[9px] tracking-[0.05em] text-[#4f5869] sm:mt-7 sm:text-[10px]">
          © {new Date().getFullYear()} MAYAD • ARTIST
          NETWORK
        </div>
      </main>

      {/* =====================================================
          GLOBAL DARK SELECT SUPPORT
      ===================================================== */}

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background: #05070d;
        }

        body {
          overflow-x: hidden;
        }

        input,
        select,
        button {
          font-family: inherit;
        }

        select,
        select:focus,
        select:active {
          color-scheme: dark;
        }

        select option,
        select optgroup {
          background: #0b0f19 !important;
          color: #ffffff !important;
        }

        select option:checked {
          background: #f5b428 !important;
          color: #0a0b0f !important;
        }

        input[type='date'] {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}