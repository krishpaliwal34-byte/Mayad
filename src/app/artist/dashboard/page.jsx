'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Video,
  Globe,
  Instagram,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
  ExternalLink,
  LogOut,
  RefreshCw,
  X,
  Film,
  Award,
  Check,
  Camera,
  Save,
  Loader2,
  ShieldCheck,
  CalendarDays,
  Link as LinkIcon,
} from 'lucide-react';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const getToken = () => {
  if (typeof window === 'undefined') return '';

  return (
    localStorage.getItem('mayad_artist_jwt') ||
    localStorage.getItem('token') ||
    ''
  );
};

// MongoDB Extended JSON date objects ko safely handle karega.
const safeDate = (value) => {
  if (!value) return null;

  const dateValue =
    typeof value === 'object' && value.$date
      ? value.$date
      : value;

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = safeDate(value);

  if (!date) return 'Not available';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Only editable profile fields.
// MongoDB timestamps and internal fields are excluded.
const getEditableProfile = (artist) => ({
  fullName: artist?.fullName || '',
  stageName: artist?.stageName || '',
  phone: artist?.phone || '',
  category: artist?.category || '',
  secondaryCategory: artist?.secondaryCategory || '',
  experience: artist?.experience || '1-3 years',
  location: artist?.location || '',
  languages: Array.isArray(artist?.languages)
    ? artist.languages.join(', ')
    : '',
  bio: artist?.bio || '',
  profilePhoto: artist?.profilePhoto || '',
  showreel: artist?.showreel || '',
  imdb: artist?.imdb || '',
  instagram: artist?.instagram || '',
});

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function ArtistDashboardPage() {
  const router = useRouter();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [activeTab, setActiveTab] = useState('overview');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // ------------------------------------------------
  // TOAST
  // ------------------------------------------------

  function showToast(message) {
    setToastMsg(message);

    setTimeout(() => {
      setToastMsg('');
    }, 3500);
  }

  // ------------------------------------------------
  // FETCH ARTIST PROFILE
  // ------------------------------------------------

  useEffect(() => {
    fetchArtistProfile();
  }, []);

  async function fetchArtistProfile() {
    try {
      setLoading(true);
      setErrorMsg('');

      const token = getToken();

      const res = await fetch(
        `${BACKEND_URL}/api/artist/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('mayad_artist_jwt');
        localStorage.removeItem('token');

        router.replace('/artist/login');
        return;
      }

      const data = await res.json();

      if (res.ok && data.success && data.artist) {
        setArtist(data.artist);
        setEditForm(getEditableProfile(data.artist));
      } else {
        setErrorMsg(
          data.message || 'Unable to load artist profile.'
        );
      }
    } catch (error) {
      console.error('Fetch Artist Profile Error:', error);

      setErrorMsg(
        'Unable to connect to MAYAD server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  async function handleLogout() {
    try {
      await fetch(`${BACKEND_URL}/api/artist/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('mayad_artist_jwt');
      localStorage.removeItem('token');
      localStorage.removeItem(
        'mayad_artist_portal_logged_email'
      );

      router.replace('/artist/login');
    }
  }

  // ------------------------------------------------
  // OPEN EDIT MODAL
  // ------------------------------------------------

  function openEditModal() {
    setEditForm(getEditableProfile(artist));
    setEditError('');
    setEditModalOpen(true);
  }

  // ------------------------------------------------
  // HANDLE INPUT CHANGE
  // ------------------------------------------------

  function handleInputChange(e) {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ------------------------------------------------
  // SAVE ARTIST PROFILE
  // ------------------------------------------------

  async function handleSaveProfile(e) {
    e.preventDefault();

    try {
      setSavingEdit(true);
      setEditError('');

      const token = getToken();

      if (!token) {
        setEditError(
          'Your session has expired. Please login again.'
        );

        return;
      }

      // IMPORTANT:
      // Do not send the full artist object.
      // Never send createdAt, updatedAt, _id,
      // role, password or MongoDB $date objects.

      const payload = {
        fullName: editForm.fullName.trim(),
        stageName: editForm.stageName.trim(),
        phone: editForm.phone.trim(),
        category: editForm.category.trim(),
        secondaryCategory:
          editForm.secondaryCategory.trim(),
        experience: editForm.experience,
        location: editForm.location.trim(),

        languages: editForm.languages
          .split(',')
          .map((lang) => lang.trim())
          .filter(Boolean),

        bio: editForm.bio.trim(),
        profilePhoto: editForm.profilePhoto.trim(),
        showreel: editForm.showreel.trim(),
        imdb: editForm.imdb.trim(),
        instagram: editForm.instagram.trim(),
      };

      const res = await fetch(
        `${BACKEND_URL}/api/artist/me`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('mayad_artist_jwt');
        localStorage.removeItem('token');

        router.replace('/artist/login');
        return;
      }

      const data = await res.json();

      if (res.ok && data.success && data.artist) {
        setArtist(data.artist);
        setEditForm(getEditableProfile(data.artist));

        setEditModalOpen(false);

        showToast('Artist profile updated successfully!');
      } else {
        setEditError(
          data.message || 'Failed to update artist profile.'
        );
      }
    } catch (error) {
      console.error('Save Profile Error:', error);

      setEditError(
        'Unable to connect to server. Please try again.'
      );
    } finally {
      setSavingEdit(false);
    }
  }

  // ------------------------------------------------
  // LOADING SCREEN
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-black shadow-lg shadow-amber-400/20">
            M
          </div>

          <Loader2 className="h-7 w-7 animate-spin text-amber-400" />

          <p className="text-sm font-medium tracking-widest text-slate-400">
            LOADING ARTIST PROFILE
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // ERROR SCREEN
  // ------------------------------------------------

  if (errorMsg && !artist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1428] p-8 text-center shadow-2xl">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />

          <h2 className="mb-3 text-2xl font-bold">
            Unable to Load Profile
          </h2>

          <p className="mb-6 text-sm leading-6 text-slate-400">
            {errorMsg}
          </p>

          <button
            onClick={fetchArtistProfile}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/artist/login')}
            className="mt-3 block w-full rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!artist) return null;

  const isApproved = artist.accountStatus === 'Approved';
  const isRejected = artist.accountStatus === 'Rejected';

  // ------------------------------------------------
  // DASHBOARD UI
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      {/* ------------------------------------------ */}
      {/* TOAST */}
      {/* ------------------------------------------ */}

      {toastMsg && (
        <div className="fixed right-4 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-500/30 bg-[#0b1c1a] px-5 py-4 shadow-2xl">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />

          <p className="text-sm font-semibold text-emerald-300">
            {toastMsg}
          </p>
        </div>
      )}

      {/* ------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------ */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b18]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-black shadow-lg shadow-amber-400/20">
              M
            </div>

            <div>
              <h1 className="text-lg font-black tracking-wide sm:text-xl">
                MAYAD
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Artist Portal
              </p>
            </div>
          </div>

          <div className="hidden text-center sm:block">
            <p className="text-sm font-bold tracking-widest text-slate-300">
              ARTIST DASHBOARD
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------ */}
      {/* MAIN */}
      {/* ------------------------------------------ */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">

        {/* ---------------------------------------- */}
        {/* PROFILE HERO */}
        {/* ---------------------------------------- */}

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a3c] via-[#0c1430] to-[#080d20] p-6 shadow-2xl sm:p-10">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">

              {/* PROFILE PHOTO */}

              <div className="relative shrink-0">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-blue-700 via-indigo-800 to-red-800 shadow-xl shadow-amber-400/10 sm:h-36 sm:w-36">

                  {artist.profilePhoto ? (
                    <img
                      src={artist.profilePhoto}
                      alt={artist.fullName || 'Artist'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-5xl font-black text-white">
                      {(artist.fullName || 'A')
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                {isApproved && (
                  <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#111a3c] bg-emerald-500">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* PROFILE DETAILS */}

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-black tracking-wider text-black">
                    MAYAD ARTIST
                  </span>

                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verified Artist
                    </span>
                  )}

                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}

                  {!isApproved && !isRejected && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      Pending Approval
                    </span>
                  )}
                </div>

                <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {artist.stageName || artist.fullName}
                </h2>

                {artist.stageName && (
                  <p className="mt-1 text-sm text-slate-400">
                    {artist.fullName}
                  </p>
                )}

                <p className="mt-3 font-semibold text-amber-400">
                  {artist.category || 'Artist'}
                  {artist.secondaryCategory
                    ? ` • ${artist.secondaryCategory}`
                    : ''}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">

                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-400" />
                    {artist.location || 'Location not added'}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-400" />
                    <span className="break-all">
                      {artist.email}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-400" />
                    {artist.experience || '1-3 years'}
                  </span>
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}

            <button
              onClick={openEditModal}
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-7 py-4 font-bold text-black shadow-lg shadow-amber-400/10 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </button>
          </div>
        </section>

        {/* ---------------------------------------- */}
        {/* STATUS BANNER */}
        {/* ---------------------------------------- */}

        {artist.accountStatus === 'Pending Approval' && (
          <div className="mb-8 flex gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-5 sm:p-6">
            <Clock className="h-7 w-7 shrink-0 text-amber-400" />

            <div>
              <h3 className="font-bold text-amber-300">
                Profile Under Review
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your registered profile is being reviewed by the
                MAYAD Production Team. You can update your profile
                details while your account is under review.
              </p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="mb-8 flex gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5 sm:p-6">
            <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-400" />

            <div>
              <h3 className="font-bold text-emerald-300">
                Verified MAYAD Artist Account
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your artist credentials have been verified.
                Your profile is available to the MAYAD Production
                Team for casting and production opportunities.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-8 flex gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5 sm:p-6">
            <AlertCircle className="h-7 w-7 shrink-0 text-red-400" />

            <div>
              <h3 className="font-bold text-red-300">
                Profile Not Approved
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your profile has not been approved. Please contact
                the MAYAD Production Team for further information.
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* TABS */}
        {/* ---------------------------------------- */}

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-white/10">

          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 border-b-2 px-5 py-4 text-sm font-bold transition ${activeTab === 'overview'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
              }`}
          >
            Overview & Bio
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`shrink-0 border-b-2 px-5 py-4 text-sm font-bold transition ${activeTab === 'portfolio'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
              }`}
          >
            Media & Showreel
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* OVERVIEW TAB */}
        {/* ---------------------------------------- */}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* BIO CARD */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6 sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                  <User className="h-5 w-5 text-amber-400" />
                </div>

                <h3 className="text-xl font-bold">
                  Artist Biography
                </h3>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
                {artist.bio || 'No biography added yet.'}
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="mb-4 text-sm font-bold text-white">
                  Languages Spoken
                </h4>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(artist.languages) &&
                    artist.languages.length > 0 ? (
                    artist.languages.map((lang, index) => (
                      <span
                        key={`${lang}-${index}`}
                        className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No languages added.
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={openEditModal}
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
              >
                <Edit3 className="h-4 w-4" />
                Update Biography
              </button>
            </div>

            {/* DATABASE CARD */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6 sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Award className="h-5 w-5 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold">
                  Artist Information
                </h3>
              </div>

              <div className="space-y-5">

                <InfoRow
                  label="Legal Name"
                  value={artist.fullName}
                  icon={User}
                />

                <InfoRow
                  label="Phone / WhatsApp"
                  value={artist.phone}
                  icon={Phone}
                />

                <InfoRow
                  label="Registered Email"
                  value={artist.email}
                  icon={Mail}
                />

                <InfoRow
                  label="Experience"
                  value={artist.experience}
                  icon={Briefcase}
                />

                <InfoRow
                  label="Location"
                  value={artist.location}
                  icon={MapPin}
                />

                <InfoRow
                  label="Registration Date"
                  value={formatDate(artist.createdAt)}
                  icon={CalendarDays}
                />

                <InfoRow
                  label="Account Status"
                  value={artist.accountStatus}
                  icon={ShieldCheck}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* PORTFOLIO TAB */}
        {/* ---------------------------------------- */}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* SHOWREEL */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6 sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                  <Video className="h-5 w-5 text-amber-400" />
                </div>

                <h3 className="text-xl font-bold">
                  Showreel & Videos
                </h3>
              </div>

              {artist.showreel ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">

                  <Film className="mx-auto mb-4 h-12 w-12 text-amber-400" />

                  <p className="mb-5 text-sm font-semibold text-slate-300">
                    Your Artist Showreel
                  </p>

                  <a
                    href={artist.showreel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
                  >
                    Watch Showreel
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

                  <Video className="mx-auto mb-4 h-10 w-10 text-slate-600" />

                  <p className="text-sm text-slate-400">
                    No showreel added yet.
                  </p>

                  <button
                    onClick={openEditModal}
                    className="mt-4 text-sm font-bold text-amber-400 hover:text-amber-300"
                  >
                    Add Showreel
                  </button>
                </div>
              )}
            </div>

            {/* EXTERNAL PROFILES */}

            <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6 sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold">
                  External Profiles
                </h3>
              </div>

              <div className="space-y-4">

                {artist.imdb ? (
                  <a
                    href={artist.imdb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-amber-400/30 hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold">
                      <Globe className="h-5 w-5 text-amber-400" />
                      IMDb Profile
                    </span>

                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                ) : (
                  <div className="rounded-2xl border border-white/10 p-5 text-sm text-slate-500">
                    IMDb profile not added.
                  </div>
                )}

                {artist.instagram ? (
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-pink-500/30 hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold">
                      <Instagram className="h-5 w-5 text-pink-400" />
                      Instagram Profile
                    </span>

                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                ) : (
                  <div className="rounded-2xl border border-white/10 p-5 text-sm text-slate-500">
                    Instagram profile not added.
                  </div>
                )}

                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-2 pt-2 text-sm font-bold text-amber-400 hover:text-amber-300"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit External Links
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------ */}
      {/* EDIT PROFILE MODAL */}
      {/* ------------------------------------------ */}

      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget && !savingEdit) {
              setEditModalOpen(false);
            }
          }}
        >
          <div className="relative my-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0d1428] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1428]/95 px-6 py-5 backdrop-blur-xl sm:px-8">

              <div>
                <h3 className="text-xl font-black sm:text-2xl">
                  Edit Artist Profile
                </h3>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Update your MAYAD artist information.
                </p>
              </div>

              <button
                type="button"
                disabled={savingEdit}
                onClick={() => setEditModalOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleSaveProfile}
              className="space-y-6 p-6 sm:p-8"
            >

              {editError && (
                <div className="flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <span>{editError}</span>
                </div>
              )}

              {/* EMAIL */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <FormField label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    value={artist.email || ''}
                    disabled
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-500 outline-none"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Email address cannot be changed.
                  </p>
                </FormField>

                {/* FULL NAME */}

                <FormField label="Full Name *" icon={User}>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </FormField>

                {/* STAGE NAME */}

                <FormField label="Stage Name" icon={User}>
                  <input
                    type="text"
                    name="stageName"
                    value={editForm.stageName || ''}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={inputClass}
                    placeholder="Enter stage name"
                  />
                </FormField>

                {/* PHONE */}

                <FormField label="Phone Number *" icon={Phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </FormField>

                {/* CATEGORY */}

                <FormField label="Category *" icon={Award}>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={inputClass}
                    placeholder="Actor, Singer, etc."
                  />
                </FormField>

                {/* SECONDARY CATEGORY */}

                <FormField label="Secondary Category" icon={Award}>
                  <input
                    type="text"
                    name="secondaryCategory"
                    value={editForm.secondaryCategory || ''}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </FormField>

                {/* EXPERIENCE */}

                <FormField label="Experience" icon={Briefcase}>
                  <select
                    name="experience"
                    value={editForm.experience || '1-3 years'}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </FormField>

                {/* LOCATION */}

                <FormField label="Location / City *" icon={MapPin}>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location || ''}
                    onChange={handleInputChange}
                    required
                    maxLength={150}
                    className={inputClass}
                    placeholder="City, State"
                  />
                </FormField>

                {/* LANGUAGES */}

                <FormField label="Languages" icon={Globe}>
                  <input
                    type="text"
                    name="languages"
                    value={editForm.languages || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Hindi, Rajasthani, English"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Separate languages with commas.
                  </p>
                </FormField>

                {/* PROFILE PHOTO */}

                <FormField label="Profile Picture URL" icon={Camera}>
                  <input
                    type="url"
                    name="profilePhoto"
                    value={editForm.profilePhoto || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://example.com/photo.jpg"
                  />
                </FormField>

                {/* SHOWREEL */}

                <FormField label="Showreel Video Link" icon={Video}>
                  <input
                    type="url"
                    name="showreel"
                    value={editForm.showreel || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://youtube.com/..."
                  />
                </FormField>

                {/* IMDB */}

                <FormField label="IMDb Profile URL" icon={Globe}>
                  <input
                    type="url"
                    name="imdb"
                    value={editForm.imdb || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://imdb.com/name/..."
                  />
                </FormField>

                {/* INSTAGRAM */}

                <FormField label="Instagram Profile URL" icon={Instagram}>
                  <input
                    type="url"
                    name="instagram"
                    value={editForm.instagram || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://instagram.com/..."
                  />
                </FormField>
              </div>

              {/* BIO */}

              <FormField label="Artist Biography *" icon={User}>
                <textarea
                  name="bio"
                  value={editForm.bio || ''}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  maxLength={3000}
                  className={`${inputClass} resize-y`}
                  placeholder="Write about your acting experience, skills, achievements, and background..."
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {(editForm.bio || '').length}/3000
                </p>
              </FormField>

              {/* MODAL FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl border border-white/10 px-6 py-3.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------ */}

      <footer className="border-t border-white/10 px-5 py-8 text-center">
        <p className="text-xs font-medium tracking-wider text-slate-500">
          © {new Date().getFullYear()} MAYAD — Artist Portal
        </p>
      </footer>
    </div>
  );
}

// --------------------------------------------------
// REUSABLE COMPONENTS
// --------------------------------------------------

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#050a19] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10';

function FormField({ label, icon: Icon, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
        {Icon && (
          <Icon className="h-4 w-4 text-amber-400" />
        )}

        {label}
      </label>

      {children}
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
        <Icon className="h-4 w-4 text-amber-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="break-words text-sm font-semibold text-slate-200">
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );
}