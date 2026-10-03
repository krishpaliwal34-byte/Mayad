'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Upload,
  User,
  Phone,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Globe,
  Film,
  Camera,
  ArrowRight,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';
import { getApiBaseUrl } from '@/utils/config';

// ============================================================
// CONSTANTS
// ============================================================
const EXCLUDED_ROLES_FOR_SYNOPSIS = ['Actor', 'Actress', 'Cinematographer', 'Editor'];

const ALL_ROLES = [
  'Director',
  'Actor',
  'Actress',
  'Writer',
  'Cinematographer',
  'Editor',
  'Singer',
  'Dancer',
  'Anchor',
];

const MAX_PROJECT_LINKS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 15 * 1024 * 1024;

// Order in which errors are checked / scrolled to
const FIELD_ORDER = [
  'interestedRoles',
  'fullName',
  'age',
  'email',
  'profilePhoto',
  'introductoryVideoUrl',
  'projectVideoUrls',
  'synopsisPdf',
  'whatsAppNumber',
  'callingNumber',
  'fullAddress',
  'city',
  'state',
  'country',
  'socialLink1',
  'socialLink2',
];

// ============================================================
// HELPERS
// ============================================================
const inputCls = (error?: string) =>
  `w-full rounded-xl bg-black/60 border ${
    error ? 'border-red-500' : 'border-white/15 focus:border-[#D4AF37]'
  } px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all`;

const isValidUrl = (value: string) => {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidPhone = (value: string) => {
  if (!/^[0-9+\-\s()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

// ============================================================
// SMALL COMPONENTS (outside the page so inputs never lose focus)
// ============================================================
function Field({
  id,
  label,
  required,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={`field-${id}`} className={`space-y-2 scroll-mt-28 ${className}`}>
      <label htmlFor={id} className="block text-xs font-bold text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#090d1f]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F5D77A]">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Collapsible({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function RegisterPage() {
  // Personal
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [email, setEmail] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

  // Professional
  const [preferredLanguage, setPreferredLanguage] = useState('Both');
  const [experienceLevel, setExperienceLevel] = useState('Newcomer');
  const [interestedRoles, setInterestedRoles] = useState<string[]>([]);

  // Experience
  const [yearsOfExperience, setYearsOfExperience] = useState('0');
  const [previousProjects, setPreviousProjects] = useState('');
  const [projectVideoUrls, setProjectVideoUrls] = useState<string[]>(['']);
  const [introductoryVideoUrl, setIntroductoryVideoUrl] = useState('');

  // About
  const [aboutYourself, setAboutYourself] = useState('');
  const [synopsisPdfFile, setSynopsisPdfFile] = useState<File | null>(null);

  // Contact
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [callingNumber, setCallingNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [country, setCountry] = useState('India');

  // Social
  const [socialLink1, setSocialLink1] = useState('');
  const [socialLink2, setSocialLink2] = useState('');

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const photoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const isExperienced = experienceLevel === 'Experienced';

  // Hide About section when ONLY Actor / Actress / Cinematographer / Editor are selected
  const showAboutSection = useMemo(() => {
    if (interestedRoles.length === 0) return true;
    return !interestedRoles.every((role) => EXCLUDED_ROLES_FOR_SYNOPSIS.includes(role));
  }, [interestedRoles]);

  // Section numbers follow what is actually visible
  const aboutNo = isExperienced ? 4 : 3;
  const contactNo = 3 + (isExperienced ? 1 : 0) + (showAboutSection ? 1 : 0);
  const socialNo = contactNo + 1;

  const clearError = (key: string) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const bind =
    (setter: (v: string) => void, key?: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setter(e.target.value);
      if (key) clearError(key);
    };

  // ------------------------------------------------------------
  // ROLES
  // ------------------------------------------------------------
  const toggleRole = (role: string) => {
    setInterestedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    clearError('interestedRoles');
  };

  // ------------------------------------------------------------
  // FILES
  // ------------------------------------------------------------
  const removePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, profilePhoto: 'Only JPG, PNG and WEBP images are supported' }));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({ ...prev, profilePhoto: 'Image size must be under 5MB' }));
      e.target.value = '';
      return;
    }

    clearError('profilePhoto');
    setProfilePhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setProfilePhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, synopsisPdf: 'Please upload a valid PDF document' }));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      setErrors((prev) => ({ ...prev, synopsisPdf: 'PDF size must be under 15MB' }));
      e.target.value = '';
      return;
    }

    clearError('synopsisPdf');
    setSynopsisPdfFile(file);
  };

  // ------------------------------------------------------------
  // PROJECT VIDEO LINKS
  // ------------------------------------------------------------
  const handleAddVideoUrl = () => {
    if (projectVideoUrls.length < MAX_PROJECT_LINKS) {
      setProjectVideoUrls([...projectVideoUrls, '']);
    }
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    setProjectVideoUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
    clearError('projectVideoUrls');
  };

  const handleRemoveVideoUrl = (index: number) => {
    if (projectVideoUrls.length > 1) {
      setProjectVideoUrls(projectVideoUrls.filter((_, i) => i !== index));
    }
  };

  // ------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------
  const validateForm = () => {
    const e: Record<string, string> = {};

    if (!fullName.trim()) e.fullName = 'Full name is required';

    const numAge = parseInt(age, 10);
    if (!age || isNaN(numAge) || numAge < 1 || numAge > 120) {
      e.age = 'Please enter a valid age (1-120)';
    }

    if (!profilePhotoFile) e.profilePhoto = 'Profile photo is required';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'A valid email address is required';
    }

    if (interestedRoles.length === 0) {
      e.interestedRoles = 'Select at least one role you are interested in';
    }

    if (isExperienced) {
      if (!isValidUrl(introductoryVideoUrl)) {
        e.introductoryVideoUrl = 'Enter a valid link starting with http:// or https://';
      }
      if (projectVideoUrls.some((u) => !isValidUrl(u))) {
        e.projectVideoUrls = 'One or more project links are not valid (use http:// or https://)';
      }
    }

    if (!isValidPhone(whatsAppNumber.trim())) {
      e.whatsAppNumber = 'Enter a valid WhatsApp number (10-15 digits)';
    }
    if (!isValidPhone(callingNumber.trim())) {
      e.callingNumber = 'Enter a valid calling number (10-15 digits)';
    }

    if (!fullAddress.trim()) e.fullAddress = 'Full address is required';
    if (!city.trim()) e.city = 'City is required';
    if (!state.trim()) e.state = 'State is required';
    if (!country.trim()) e.country = 'Country is required';

    if (!isValidUrl(socialLink1)) e.socialLink1 = 'Enter a valid link starting with http:// or https://';
    if (!isValidUrl(socialLink2)) e.socialLink2 = 'Enter a valid link starting with http:// or https://';

    setErrors(e);
    return e;
  };

  // ------------------------------------------------------------
  // RESET
  // ------------------------------------------------------------
  const resetForm = () => {
    setSubmitSuccess(false);
    setSubmittedData(null);
    setFormError(null);
    setErrors({});
    setFullName('');
    setAge('');
    setGender('Prefer not to say');
    setEmail('');
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setPreferredLanguage('Both');
    setExperienceLevel('Newcomer');
    setInterestedRoles([]);
    setYearsOfExperience('0');
    setPreviousProjects('');
    setProjectVideoUrls(['']);
    setIntroductoryVideoUrl('');
    setAboutYourself('');
    setSynopsisPdfFile(null);
    setWhatsAppNumber('');
    setCallingNumber('');
    setFullAddress('');
    setCity('');
    setState('Rajasthan');
    setCountry('India');
    setSocialLink1('');
    setSocialLink2('');
  };

  // ------------------------------------------------------------
  // SUBMIT
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const found = validateForm();
    const firstKey = FIELD_ORDER.find((key) => found[key]);

    if (firstKey) {
      setFormError('Please fix the highlighted fields before submitting.');
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('age', age.trim());
      formData.append('gender', gender);
      formData.append('email', email.trim().toLowerCase());
      formData.append('preferredLanguage', preferredLanguage);
      formData.append('experienceLevel', experienceLevel);

      interestedRoles.forEach((role) => formData.append('interestedRoles', role));

      // Experience fields are sent only for experienced applicants
      formData.append('yearsOfExperience', isExperienced ? yearsOfExperience : '0');
      formData.append('previousProjects', isExperienced ? previousProjects.trim() : '');
      formData.append('introductoryVideoUrl', isExperienced ? introductoryVideoUrl.trim() : '');
      if (isExperienced) {
        projectVideoUrls
          .map((u) => u.trim())
          .filter(Boolean)
          .forEach((url) => formData.append('projectVideoUrls', url));
      }

      formData.append('aboutYourself', showAboutSection ? aboutYourself.trim() : '');

      formData.append('whatsAppNumber', whatsAppNumber.trim());
      formData.append('callingNumber', callingNumber.trim());
      formData.append('fullAddress', fullAddress.trim());
      formData.append('city', city.trim());
      formData.append('state', state.trim());
      formData.append('country', country.trim());

      formData.append('socialLink1', socialLink1.trim());
      formData.append('socialLink2', socialLink2.trim());

      if (profilePhotoFile) formData.append('profilePhoto', profilePhotoFile);
      if (synopsisPdfFile && showAboutSection) formData.append('synopsisPdf', synopsisPdfFile);

      const response = await fetch(`${getApiBaseUrl()}/talent/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || 'Registration failed. Please try again.');
      }

      setSubmittedData(data.application);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Talent Registration Error:', err);
      setFormError(err?.message || 'Failed to submit registration. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-[#D4AF37] selection:text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* BACKGROUND LIGHTING */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#D4AF37]/15 via-[#F5D77A]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-500/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* HERO */}
       {/* HERO */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center mb-12"
>
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D77A] text-xs font-bold mb-6">
    <Sparkles className="w-3.5 h-3.5" />
    <span>MAYAD Production House · Talent Network</span>
  </div>
<div className="flex flex-col items-center justify-center px-4">
  <div className="flex justify-center">
    <Image
      src="/mayad22.png"
      alt="MAYAD Logo"
      width={840}
      height={360}
      priority
      className="h-auto w-full max-w-[240px] object-contain sm:max-w-[280px]"
    />
  </div>
  <p className="mt-1 max-w-2xl text-center text-base leading-relaxed text-slate-300 sm:text-lg">
    थांरो हुनर, मायड़ रो मान। आओ, म्हारे संग आपणी पहचान बनावो।
  </p>
</div>
</motion.div>

        {/* SUCCESS */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl border border-[#D4AF37]/40 bg-[#090d1f]/95 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#F5D77A] text-[#F5D77A] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Registration submitted successfully!
              </h2>

              <p className="relative text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Thank you,{' '}
                <strong className="text-[#F5D77A]">{submittedData?.fullName || fullName}</strong>! Your
                talent registration has been received by our casting and production team.
              </p>

              <div className="relative max-w-md mx-auto rounded-2xl bg-black/60 border border-white/10 p-5 mb-8 text-left space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-slate-400">Application ID</span>
                  <span className="font-mono text-[#F5D77A] font-bold break-all text-right">
                    {submittedData?.id || 'SUBMITTED'}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-slate-400">Interested roles</span>
                  <span className="text-white font-semibold text-right">
                    {submittedData?.interestedRoles?.join(', ') || interestedRoles.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-slate-400">Experience level</span>
                  <span className="text-white font-semibold">
                    {submittedData?.experienceLevel || experienceLevel}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    Pending admin review
                  </span>
                </div>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/movies"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold text-sm shadow-lg hover:scale-105 transition-all text-center"
                >
                  Explore MAYAD movies
                </Link>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 bg-white/5 text-slate-200 font-bold text-sm hover:bg-white/10 transition-all text-center"
                >
                  Submit another profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        {!submitSuccess && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8"
          >
            {/* GLOBAL ERROR */}
            {formError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm flex items-start gap-3 shadow-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-red-300 mb-0.5">Submission error</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            {/* 1. PROFESSIONAL INFORMATION */}
            <SectionCard
              icon={Film}
              title="1. Professional Information"
              subtitle="Select your creative discipline and experience level."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="preferredLanguage" label="Preferred language">
                  <select
                    id="preferredLanguage"
                    value={preferredLanguage}
                    onChange={bind(setPreferredLanguage)}
                    className={inputCls()}
                  >
                    <option value="Both" className="bg-[#090d1f]">Both (English & Hindi)</option>
                    <option value="Hindi" className="bg-[#090d1f]">Hindi</option>
                    <option value="English" className="bg-[#090d1f]">English</option>
                  </select>
                </Field>

                <Field id="experienceLevel" label="Experience level">
                  <div className="grid grid-cols-2 gap-3">
                    {['Newcomer', 'Experienced'].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setExperienceLevel(lvl)}
                        aria-pressed={experienceLevel === lvl}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                          experienceLevel === lvl
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                            : 'bg-black/60 text-slate-300 border-white/15 hover:border-white/30'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <Field
                id="interestedRoles"
                label="Interested in (select one or more roles)"
                required
                error={errors.interestedRoles}
              >
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {ALL_ROLES.map((role) => {
                    const selected = interestedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRole(role)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                          selected
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black border-[#F5D77A] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                            : 'bg-black/60 text-slate-300 border-white/15 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {selected && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </SectionCard>

            {/* 2. PERSONAL INFORMATION */}
            <SectionCard
              icon={User}
              title="2. Personal Information"
              subtitle="Enter your details and upload your profile photo."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="fullName" label="Full name" required error={errors.fullName}>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={bind(setFullName, 'fullName')}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={inputCls(errors.fullName)}
                  />
                </Field>

                <Field id="age" label="Age (years)" required error={errors.age}>
                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={bind(setAge, 'age')}
                    placeholder="e.g. 24"
                    className={inputCls(errors.age)}
                  />
                </Field>

                <Field id="gender" label="Gender">
                  <select id="gender" value={gender} onChange={bind(setGender)} className={inputCls()}>
                    <option value="Male" className="bg-[#090d1f]">Male</option>
                    <option value="Female" className="bg-[#090d1f]">Female</option>
                    <option value="Non-Binary" className="bg-[#090d1f]">Non-Binary</option>
                    <option value="Prefer not to say" className="bg-[#090d1f]">Prefer not to say</option>
                    <option value="Other" className="bg-[#090d1f]">Other</option>
                  </select>
                </Field>

                <Field id="email" label="Email address" required error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={bind(setEmail, 'email')}
                    placeholder="yourname@example.com"
                    autoComplete="email"
                    className={inputCls(errors.email)}
                  />
                </Field>
              </div>

              {/* PROFILE PHOTO */}
              <Field
                id="profilePhotoInput"
                label="Profile photo (JPG, PNG, WEBP)"
                required
                error={errors.profilePhoto}
              >
                <div
                  id="field-profilePhoto"
                  className="scroll-mt-28 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/10"
                >
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-black/80 shrink-0 flex items-center justify-center group shadow-md">
                    {profilePhotoPreview ? (
                      <>
                        <img
                          src={profilePhotoPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-500 transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Remove photo"
                          aria-label="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400 font-semibold">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <label
                      htmlFor="profilePhotoInput"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{profilePhotoPreview ? 'Change photo' : 'Upload profile photo'}</span>
                    </label>
                    <input
                      ref={photoInputRef}
                      id="profilePhotoInput"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                    <p className="text-xs text-slate-400">High-resolution portrait photo (max 5MB).</p>
                  </div>
                </div>
              </Field>
            </SectionCard>

            {/* 3. EXPERIENCE (Experienced only) */}
            <AnimatePresence>
              {isExperienced && (
                <Collapsible key="experience">
                  <SectionCard
                    icon={Video}
                    title="3. Experience & Project Links"
                    subtitle="Share your portfolio, showreels and previous work."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field id="yearsOfExperience" label="Years of experience">
                        <select
                          id="yearsOfExperience"
                          value={yearsOfExperience}
                          onChange={bind(setYearsOfExperience)}
                          className={inputCls()}
                        >
                          <option value="0" className="bg-[#090d1f]">Fresher / 0 years</option>
                          <option value="1" className="bg-[#090d1f]">1 year</option>
                          <option value="2" className="bg-[#090d1f]">2 years</option>
                          <option value="3-5" className="bg-[#090d1f]">3 to 5 years</option>
                          <option value="5-10" className="bg-[#090d1f]">5 to 10 years</option>
                          <option value="10+" className="bg-[#090d1f]">10+ years</option>
                        </select>
                      </Field>

                      <Field
                        id="introductoryVideoUrl"
                        label="Introductory video link (YouTube / Vimeo / Drive)"
                        error={errors.introductoryVideoUrl}
                      >
                        <input
                          id="introductoryVideoUrl"
                          type="url"
                          value={introductoryVideoUrl}
                          onChange={bind(setIntroductoryVideoUrl, 'introductoryVideoUrl')}
                          placeholder="https://youtube.com/watch?v=..."
                          className={inputCls(errors.introductoryVideoUrl)}
                        />
                      </Field>
                    </div>

                    <Field id="previousProjects" label="Previous projects summary">
                      <textarea
                        id="previousProjects"
                        rows={3}
                        value={previousProjects}
                        onChange={bind(setPreviousProjects)}
                        placeholder="Mention short films, movies, series, ads or music videos you have worked on..."
                        className={`${inputCls()} resize-none`}
                      />
                    </Field>

                    <Field
                      id="projectVideoUrls"
                      label={`Project video links (up to ${MAX_PROJECT_LINKS})`}
                      error={errors.projectVideoUrls}
                    >
                      <div className="space-y-3">
                        {projectVideoUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              id={index === 0 ? 'projectVideoUrls' : undefined}
                              type="url"
                              value={url}
                              onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                              placeholder={`Project video link #${index + 1}`}
                              aria-label={`Project video link ${index + 1}`}
                              className={`flex-1 ${inputCls(errors.projectVideoUrls)}`}
                            />
                            {projectVideoUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVideoUrl(index)}
                                className="p-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30 transition-all shrink-0"
                                title="Remove link"
                                aria-label={`Remove link ${index + 1}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        {projectVideoUrls.length < MAX_PROJECT_LINKS && (
                          <button
                            type="button"
                            onClick={handleAddVideoUrl}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#F5D77A] hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add another link</span>
                          </button>
                        )}
                      </div>
                    </Field>
                  </SectionCard>
                </Collapsible>
              )}
            </AnimatePresence>

            {/* ABOUT / SYNOPSIS (hidden for acting / camera / editing only) */}
            <AnimatePresence>
              {showAboutSection && (
                <Collapsible key="about">
                  <SectionCard
                    icon={FileText}
                    title={`${aboutNo}. Cinematic Profile & Synopsis`}
                    subtitle="Share your background and skills, or upload a PDF synopsis."
                  >
                    <Field id="aboutYourself" label="About yourself / professional synopsis">
                      <textarea
                        id="aboutYourself"
                        rows={4}
                        value={aboutYourself}
                        onChange={bind(setAboutYourself)}
                        placeholder="Describe your creative vision, directing or writing style, technical expertise, or background..."
                        className={`${inputCls()} resize-none`}
                      />
                    </Field>

                    <Field
                      id="synopsisPdfInput"
                      label="PDF synopsis / cinematic portfolio (optional)"
                      error={errors.synopsisPdf}
                    >
                      <div
                        id="field-synopsisPdf"
                        className="scroll-mt-28 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F5D77A] shrink-0">
                            <FileCheck className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-white truncate">
                              {synopsisPdfFile ? synopsisPdfFile.name : 'No PDF selected'}
                            </span>
                            <span className="text-xs text-slate-400">PDF documents up to 15MB.</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label
                            htmlFor="synopsisPdfInput"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-slate-200 font-bold text-xs cursor-pointer hover:bg-white/10 transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#F5D77A]" />
                            <span>{synopsisPdfFile ? 'Change PDF' : 'Select PDF'}</span>
                          </label>
                          {synopsisPdfFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setSynopsisPdfFile(null);
                                if (pdfInputRef.current) pdfInputRef.current.value = '';
                              }}
                              className="p-2.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30 transition-all"
                              title="Remove PDF"
                              aria-label="Remove PDF"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input
                          ref={pdfInputRef}
                          id="synopsisPdfInput"
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdfChange}
                          className="sr-only"
                        />
                      </div>
                    </Field>
                  </SectionCard>
                </Collapsible>
              )}
            </AnimatePresence>

            {/* CONTACT */}
            <SectionCard
              icon={Phone}
              title={`${contactNo}. Contact Information & Address`}
              subtitle="Direct contact details for production communication."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="whatsAppNumber" label="WhatsApp number" required error={errors.whatsAppNumber}>
                  <input
                    id="whatsAppNumber"
                    type="tel"
                    inputMode="tel"
                    value={whatsAppNumber}
                    onChange={bind(setWhatsAppNumber, 'whatsAppNumber')}
                    placeholder="+91 9876543210"
                    autoComplete="tel"
                    className={inputCls(errors.whatsAppNumber)}
                  />
                </Field>

                <Field id="callingNumber" label="Calling number" required error={errors.callingNumber}>
                  <input
                    id="callingNumber"
                    type="tel"
                    inputMode="tel"
                    value={callingNumber}
                    onChange={bind(setCallingNumber, 'callingNumber')}
                    placeholder="+91 9876543210"
                    className={inputCls(errors.callingNumber)}
                  />
                </Field>
              </div>

              <Field id="fullAddress" label="Full address" required error={errors.fullAddress}>
                <textarea
                  id="fullAddress"
                  rows={2}
                  value={fullAddress}
                  onChange={bind(setFullAddress, 'fullAddress')}
                  placeholder="Street address, house no., locality..."
                  autoComplete="street-address"
                  className={`${inputCls(errors.fullAddress)} resize-none`}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field id="city" label="City" required error={errors.city}>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={bind(setCity, 'city')}
                    placeholder="e.g. Jaipur"
                    className={inputCls(errors.city)}
                  />
                </Field>

                <Field id="state" label="State" required error={errors.state}>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={bind(setState, 'state')}
                    placeholder="e.g. Rajasthan"
                    className={inputCls(errors.state)}
                  />
                </Field>

                <Field id="country" label="Country" required error={errors.country}>
                  <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={bind(setCountry, 'country')}
                    placeholder="India"
                    className={inputCls(errors.country)}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* SOCIAL */}
            <SectionCard
              icon={Globe}
              title={`${socialNo}. Social Media Profiles`}
              subtitle="Add up to two links (Instagram, YouTube, Facebook, LinkedIn, etc.)."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="socialLink1" label="Social media link 1" error={errors.socialLink1}>
                  <input
                    id="socialLink1"
                    type="url"
                    value={socialLink1}
                    onChange={bind(setSocialLink1, 'socialLink1')}
                    placeholder="https://instagram.com/username"
                    className={inputCls(errors.socialLink1)}
                  />
                </Field>

                <Field id="socialLink2" label="Social media link 2" error={errors.socialLink2}>
                  <input
                    id="socialLink2"
                    type="url"
                    value={socialLink2}
                    onChange={bind(setSocialLink2, 'socialLink2')}
                    placeholder="https://youtube.com/@channel"
                    className={inputCls(errors.socialLink2)}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* SUBMIT */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] text-black font-extrabold text-base shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit registration</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}