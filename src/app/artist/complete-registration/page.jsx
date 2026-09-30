"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  User,
  Loader2,
  Sparkles,
  Instagram,
  Film,
  BriefcaseBusiness,
  Languages,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";

export default function CompleteRegistration() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",

    phone: "",
    category: "",
    secondaryCategory: "",
    experience: "",
    location: "",
    languages: ["Hindi"],
    bio: "",

    stageName: "",
    showreel: "",
    imdb: "",
    instagram: "",
  });

  // =========================================================
  // VERIFY INVITATION TOKEN
  // =========================================================

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitationToken = params.get("token");

    if (!invitationToken) {
      setError("Invitation token is missing.");
      setLoading(false);
      return;
    }

    setToken(invitationToken);

    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/artist/verify-invitation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: invitationToken,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Invalid or expired invitation."
          );
        }

        setArtistName(data.invitation.artistName);
        setEmail(data.invitation.email);
      } catch (err) {
        setError(
          err.message || "Could not verify invitation."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // =========================================================
  // INPUT HANDLER
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // LANGUAGE HANDLER
  // =========================================================

  const handleLanguages = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({
      ...prev,
      languages: selected,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.languages.length) {
      setError("Please select at least one language.");
      return;
    }

    if (!formData.category) {
      setError("Please select your primary role.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/artist/complete-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: formData.password,
            phone: formData.phone,
            category: formData.category,
            secondaryCategory: formData.secondaryCategory,
            experience: formData.experience,
            location: formData.location,
            languages: formData.languages,
            bio: formData.bio,
            stageName: formData.stageName,
            showreel: formData.showreel,
            imdb: formData.imdb,
            instagram: formData.instagram,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setSuccess(
        "Your artist account has been created successfully! Your account is pending admin approval."
      );

      setTimeout(() => {
        router.push("/artist/login");
      }, 2500);
    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const inputClass =
    "w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#d4af37]/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#d4af37]/10";

  const labelClass =
    "mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050609] px-5 text-white">

        <div className="text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10">
            <Loader2 className="h-7 w-7 animate-spin text-[#d4af37]" />
          </div>

          <h2 className="text-xl font-bold">
            Verifying Invitation
          </h2>

          <p className="mt-2 text-sm text-white/35">
            Please wait while we verify your invitation.
          </p>

        </div>

      </main>
    );
  }

  // =========================================================
  // INVALID INVITATION
  // =========================================================

  if (error && !email) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050609] px-5 text-white">

        <div className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[130px]" />

        <div className="relative w-full max-w-md rounded-[30px] border border-white/[0.08] bg-[#0c0e14]/95 p-8 text-center shadow-2xl backdrop-blur-xl">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
            MAYAD Artist Portal
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Invitation Invalid
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-300/80">
            {error}
          </p>

          <button
            onClick={() =>
              router.push("/artist/login")
            }
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-5 py-4 font-bold text-black transition hover:bg-[#f0cf62]"
          >
            Go to Artist Login
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>

      </main>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050609] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute -left-52 -top-52 h-[600px] w-[600px] rounded-full bg-[#d4af37]/10 blur-[150px]" />

      <div className="pointer-events-none absolute -bottom-52 -right-52 h-[600px] w-[600px] rounded-full bg-[#8b650f]/10 blur-[150px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.025] blur-[120px]" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050609]/80 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/25 bg-gradient-to-br from-[#f3d56b] to-[#a87509] shadow-lg shadow-[#d4af37]/10">
              <span className="text-xl font-black text-black">
                M
              </span>
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.08em]">
                MAYAD
              </p>

              <p className="text-[8px] font-bold tracking-[0.3em] text-white/30">
                ARTIST PORTAL
              </p>
            </div>

          </div>

          {/* Login */}
          <button
            onClick={() =>
              router.push("/artist/login")
            }
            className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:border-[#d4af37]/40 hover:text-white"
          >
            Already registered?{" "}
            <span className="text-[#d4af37]">
              Sign In
            </span>
          </button>

        </div>

      </header>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">

        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <aside className="lg:sticky lg:top-28">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.06] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.28em] text-[#d4af37]">

              <Sparkles className="h-3.5 w-3.5" />

              MAYAD TALENT REGISTRATION

            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl">

              Your talent.

              <br />

              <span className="bg-gradient-to-r from-[#fff3c4] via-[#d4af37] to-[#8e6414] bg-clip-text text-transparent">
                Your story.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40 sm:text-base">
              Complete your professional MAYAD artist profile
              and become part of a growing entertainment
              community.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-3">

              <div className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-[#d4af37]/20">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                  <Film className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Professional Profile
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Build your professional identity on MAYAD.
                  </p>
                </div>

              </div>

              <div className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-[#d4af37]/20">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Industry Opportunities
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Showcase your skills for upcoming projects.
                  </p>
                </div>

              </div>

              <div className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-[#d4af37]/20">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Verified Talent
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Your profile can be reviewed by the MAYAD team.
                  </p>
                </div>

              </div>

            </div>

            {/* Quote */}
            <div className="mt-8 rounded-2xl border border-[#d4af37]/10 bg-gradient-to-br from-[#d4af37]/[0.07] to-transparent p-5">

              <p className="text-sm italic leading-6 text-white/45">
                "Every great performance starts with an
                opportunity."
              </p>

              <p className="mt-3 text-[9px] font-black uppercase tracking-[0.25em] text-[#d4af37]">
                MAYAD TALENT
              </p>

            </div>

          </aside>

          {/* =====================================================
              FORM
          ====================================================== */}

          <section>

            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0b0d13]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl">

              {/* FORM HEADER */}
              <div className="border-b border-white/[0.06] bg-gradient-to-r from-white/[0.035] to-transparent px-6 py-7 sm:px-9">

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#d4af37]">
                      Artist Profile
                    </p>

                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                      Complete Your Profile
                    </h2>

                    <p className="mt-2 text-sm text-white/30">
                      Add your professional information to
                      complete your MAYAD account.
                    </p>

                  </div>

                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 sm:flex">

                    <Sparkles className="h-6 w-6 text-[#d4af37]" />

                  </div>

                </div>

                {/* Profile Progress */}
                <div className="mt-7 flex items-center gap-3">

                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">

                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#a87509] via-[#d4af37] to-[#f3d56b]" />

                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                    2 / 3
                  </span>

                </div>

              </div>

              {/* FORM */}
              <div className="p-5 sm:p-9">

                {/* ERROR */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm leading-6 text-red-300">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>{error}</span>

                  </div>
                )}

                {/* SUCCESS */}
                {success && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/[0.07] p-4 text-sm leading-6 text-green-300">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>{success}</span>

                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-7"
                >

                  {/* =================================================
                      ACCOUNT
                  ================================================== */}

                  <section>

                    <div className="mb-5 flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                        <LockKeyhole className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">
                          Account Information
                        </h3>

                        <p className="mt-1 text-xs text-white/25">
                          Your MAYAD login credentials
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      {/* NAME */}
                      <div>

                        <label className={labelClass}>
                          Artist Name
                        </label>

                        <div className="relative">

                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                          <input
                            value={artistName}
                            disabled
                            className={`${inputClass} pl-11`}
                          />

                        </div>

                      </div>

                      {/* EMAIL */}
                      <div>

                        <label className={labelClass}>
                          Email Address
                        </label>

                        <div className="relative">

                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                          <input
                            type="email"
                            value={email}
                            disabled
                            className={`${inputClass} pl-11`}
                          />

                        </div>

                      </div>

                    </div>

                    {/* PASSWORD */}
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">

                      <div>

                        <label className={labelClass}>
                          Create Password *
                        </label>

                        <input
                          type="password"
                          name="password"
                          placeholder="Minimum 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={6}
                          required
                          autoComplete="new-password"
                          className={inputClass}
                        />

                      </div>

                      <div>

                        <label className={labelClass}>
                          Confirm Password *
                        </label>

                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          minLength={6}
                          required
                          autoComplete="new-password"
                          className={inputClass}
                        />

                      </div>

                    </div>

                  </section>

                  {/* =================================================
                      PERSONAL / ARTIST
                  ================================================== */}

                  <section className="border-t border-white/[0.06] pt-7">

                    <div className="mb-5 flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                        <User className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">
                          Artist Details
                        </h3>

                        <p className="mt-1 text-xs text-white/25">
                          Tell us about your professional identity
                        </p>
                      </div>

                    </div>

                    <div className="space-y-5">

                      {/* STAGE NAME */}
                      <div>

                        <label className={labelClass}>
                          Stage / Professional Name
                        </label>

                        <input
                          name="stageName"
                          placeholder="Enter your professional name"
                          value={formData.stageName}
                          onChange={handleChange}
                          className={inputClass}
                        />

                      </div>

                      {/* PHONE + ROLE */}
                      <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                          <label className={labelClass}>
                            Phone Number *
                          </label>

                          <div className="relative">

                            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                            <input
                              type="tel"
                              name="phone"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className={`${inputClass} pl-11`}
                            />

                          </div>

                        </div>

                        <div>

                          <label className={labelClass}>
                            Primary Role *
                          </label>

                          <div className="relative">

                            <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                              className={`${inputClass} pl-11`}
                            >

                              <option
                                value=""
                                className="bg-[#0b0d13]"
                              >
                                Select your role
                              </option>

                              <optgroup
                                label="Acting & Talent"
                                className="bg-[#0b0d13]"
                              >
                                <option>Actor</option>
                                <option>Actress</option>
                                <option>Supporting Artist</option>
                                <option>Voice Artist</option>
                                <option>Casting Coordinator</option>
                              </optgroup>

                              <optgroup
                                label="Film & Production"
                                className="bg-[#0b0d13]"
                              >
                                <option>Director</option>
                                <option>Assistant Director</option>
                                <option>Producer</option>
                                <option>Production Manager</option>
                                <option>Cinematographer / DOP</option>
                                <option>Assistant Cinematographer</option>
                                <option>Video Editor</option>
                                <option>Sound Designer</option>
                              </optgroup>

                              <optgroup
                                label="Music"
                                className="bg-[#0b0d13]"
                              >
                                <option>Singer</option>
                                <option>Music Director</option>
                                <option>Composer</option>
                                <option>Lyricist</option>
                                <option>Music Producer</option>
                              </optgroup>

                              <optgroup
                                label="Creative"
                                className="bg-[#0b0d13]"
                              >
                                <option>Script Writer</option>
                                <option>Story Writer</option>
                                <option>Screenplay Writer</option>
                                <option>Dialogue Writer</option>
                                <option>Costume Designer</option>
                                <option>Makeup Artist</option>
                              </optgroup>

                            </select>

                          </div>

                        </div>

                      </div>

                      {/* SECONDARY + EXPERIENCE */}
                      <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                          <label className={labelClass}>
                            Secondary Role
                          </label>

                          <input
                            name="secondaryCategory"
                            placeholder="Optional"
                            value={
                              formData.secondaryCategory
                            }
                            onChange={handleChange}
                            className={inputClass}
                          />

                        </div>

                        <div>

                          <label className={labelClass}>
                            Experience
                          </label>

                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className={inputClass}
                          >

                            <option
                              value=""
                              className="bg-[#0b0d13]"
                            >
                              Select experience
                            </option>

                            <option>Fresher</option>
                            <option>1-3 years</option>
                            <option>3-5 years</option>
                            <option>5-10 years</option>
                            <option>10+ years</option>

                          </select>

                        </div>

                      </div>

                      {/* LOCATION */}
                      <div>

                        <label className={labelClass}>
                          Location *
                        </label>

                        <div className="relative">

                          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                          <input
                            name="location"
                            placeholder="City, State"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className={`${inputClass} pl-11`}
                          />

                        </div>

                      </div>

                      {/* LANGUAGES */}
                      <div>

                        <div className="mb-2.5 flex items-center justify-between">

                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                            Languages *
                          </label>

                          <Languages className="h-4 w-4 text-[#d4af37]" />

                        </div>

                        <select
                          multiple
                          value={formData.languages}
                          onChange={handleLanguages}
                          className={`${inputClass} min-h-[145px]`}
                        >

                          {[
                            "Hindi",
                            "English",
                            "Rajasthani",
                            "Punjabi",
                            "Gujarati",
                            "Marathi",
                            "Tamil",
                            "Telugu",
                            "Bengali",
                            "Other",
                          ].map((item) => (
                            <option
                              key={item}
                              value={item}
                              className="bg-[#0b0d13] py-2"
                            >
                              {item}
                            </option>
                          ))}

                        </select>

                        <p className="mt-2 text-[11px] text-white/20">
                          Hold Ctrl on Windows or Command on Mac
                          to select multiple languages.
                        </p>

                      </div>

                      {/* BIO */}
                      <div>

                        <div className="mb-2.5 flex items-center justify-between">

                          <label className={labelClass}>
                            Artist Bio *
                          </label>

                          <span className="text-[10px] text-white/20">
                            Tell your story
                          </span>

                        </div>

                        <textarea
                          name="bio"
                          placeholder="Tell us about your experience, talent, previous work and artistic journey..."
                          value={formData.bio}
                          onChange={handleChange}
                          rows={6}
                          required
                          className={`${inputClass} resize-none`}
                        />

                      </div>

                    </div>

                  </section>

                  {/* =================================================
                      PROFESSIONAL LINKS
                  ================================================== */}

                  <section className="border-t border-white/[0.06] pt-7">

                    <div className="mb-5 flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                        <Instagram className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">
                          Professional Links
                        </h3>

                        <p className="mt-1 text-xs text-white/25">
                          Add your portfolio and social profiles
                        </p>
                      </div>

                    </div>

                    <div className="space-y-5">

                      {/* SHOWREEL */}
                      <div>

                        <label className={labelClass}>
                          Showreel URL
                        </label>

                        <div className="relative">

                          <Film className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                          <input
                            type="url"
                            name="showreel"
                            placeholder="https://youtube.com/..."
                            value={formData.showreel}
                            onChange={handleChange}
                            className={`${inputClass} pl-11`}
                          />

                        </div>

                      </div>

                      {/* IMDb */}
                      <div>

                        <label className={labelClass}>
                          IMDb Profile
                        </label>

                        <input
                          type="url"
                          name="imdb"
                          placeholder="https://www.imdb.com/..."
                          value={formData.imdb}
                          onChange={handleChange}
                          className={inputClass}
                        />

                      </div>

                      {/* INSTAGRAM */}
                      <div>

                        <label className={labelClass}>
                          Instagram Profile
                        </label>

                        <div className="relative">

                          <Instagram className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />

                          <input
                            type="url"
                            name="instagram"
                            placeholder="https://www.instagram.com/..."
                            value={formData.instagram}
                            onChange={handleChange}
                            className={`${inputClass} pl-11`}
                          />

                        </div>

                      </div>

                    </div>

                  </section>

                  {/* =================================================
                      SUBMIT
                  ================================================== */}

                  <div className="border-t border-white/[0.06] pt-7">

                    <button
                      type="submit"
                      disabled={
                        submitting || !!success
                      }
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#b8871d] via-[#f0cf62] to-[#b8871d] px-6 py-4 text-sm font-black text-black shadow-xl shadow-[#d4af37]/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#d4af37]/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative flex items-center gap-3">

                        {submitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating Your Account...
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}

                      </span>

                    </button>

                    {/* Security */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-white/20">

                      <ShieldCheck className="h-3.5 w-3.5" />

                      Your information is securely handled by MAYAD.

                    </div>

                    <p className="mt-4 text-center text-sm text-white/30">

                      Already registered?{" "}

                      <button
                        type="button"
                        onClick={() =>
                          router.push("/artist/login")
                        }
                        className="font-bold text-[#d4af37] transition hover:text-[#f5d875]"
                      >
                        Sign in
                      </button>

                    </p>

                  </div>

                </form>

              </div>

            </div>

            {/* FOOTER */}
            <p className="mt-7 text-center text-[9px] font-semibold uppercase tracking-[0.25em] text-white/15">
              © {new Date().getFullYear()} MAYAD • ARTIST PORTAL
            </p>

          </section>

        </div>

      </div>

    </main>
  );
}