'use client';

import React, { useEffect, useState, useRef } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

import {
   User, Mail, Phone, MapPin, Briefcase, Video, Globe, Instagram,
   CheckCircle, AlertCircle, Clock, Sparkles, Edit3, ExternalLink,
   LogOut, RefreshCw, X, Film, Check, Camera
} from 'lucide-react';
import ArtistMyMedia from '@/components/ArtistMyMedia';
import ArtistMyProjects from '@/components/ArtistMyProjects';

const BACKEND_URL =

   process.env.API_URL || 'http://localhost:5000';

const inputClass =

   'w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20';

const labelClass = 'mb-2 block text-sm font-medium text-slate-300';

const cardClass =

   'rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-8';

export default function ArtistDashboardPage() {

   const router = useRouter();

   const [artist, setArtist] = useState<any>(null);

   const [loading, setLoading] = useState(true);

   const [toastMsg, setToastMsg] = useState('');

   const [activeTab, setActiveTab] = useState('overview');

   const [editModalOpen, setEditModalOpen] = useState(false);

   const [editForm, setEditForm] = useState<Record<string, any>>({});

   const [savingEdit, setSavingEdit] = useState(false);

   const [editError, setEditError] = useState('');

   const [uploadingPhoto, setUploadingPhoto] = useState(false);

   const fileInputRef = useRef<HTMLInputElement>(null);

   const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
         setToastMsg('Please select a valid image file (PNG, JPG, WEBP, etc.)');
         setTimeout(() => setToastMsg(''), 4000);
         return;
      }

      if (file.size > 5 * 1024 * 1024) {
         setToastMsg('Image size must be less than 5MB');
         setTimeout(() => setToastMsg(''), 4000);
         return;
      }

      try {
         setUploadingPhoto(true);
         const token =
            localStorage.getItem('mayad_artist_jwt') ||
            localStorage.getItem('token');

         const formData = new FormData();
         formData.append('image', file);

         const res = await fetch(`${BACKEND_URL}/api/artist/upload-profile-photo`, {
            method: 'POST',
            headers: {
               ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: formData,
         });

         const data = await res.json().catch(() => ({}));

         if (res.ok && data.success && data.profilePhoto) {
            setArtist((prev: any) => ({ ...prev, profilePhoto: data.profilePhoto }));
            setEditForm((prev: any) => ({ ...prev, profilePhoto: data.profilePhoto }));
            if (typeof window !== 'undefined') {
               localStorage.setItem('mayad_artist_profile_photo', data.profilePhoto);
               window.dispatchEvent(new Event('artistProfileUpdated'));
            }
            setToastMsg('Profile photo updated successfully!');
            setTimeout(() => setToastMsg(''), 4000);
         } else {
            setToastMsg(data.message || 'Failed to upload profile photo');
            setTimeout(() => setToastMsg(''), 4000);
         }
      } catch (error: any) {
         console.error('Profile photo upload error:', error);
         setToastMsg('Network error uploading profile photo');
         setTimeout(() => setToastMsg(''), 4000);
      } finally {
         setUploadingPhoto(false);
         if (e.target) e.target.value = '';
      }
   };

   useEffect(() => {

      fetchArtistProfile();

      // Fetch once when the page mounts.

      // eslint-disable-next-line react-hooks/exhaustive-deps

   }, []);

   async function fetchArtistProfile() {

      try {

         setLoading(true);

         const token =

            localStorage.getItem('mayad_artist_jwt') ||

            localStorage.getItem('token');

         const res = await fetch(`${BACKEND_URL}/api/artist/me`, {

            method: 'GET',

            headers: {

               'Content-Type': 'application/json',

               ...(token ? { Authorization: `Bearer ${token}` } : {}),

            },

            credentials: 'include',

         });

         const data = await res.json().catch(() => ({}));

         if (res.ok && data.success && data.artist) {

            setArtist(data.artist);

            setEditForm(toEditableForm(data.artist));

            if (typeof window !== 'undefined' && data.artist.profilePhoto) {
               localStorage.setItem('mayad_artist_profile_photo', data.artist.profilePhoto);
               window.dispatchEvent(new Event('artistProfileUpdated'));
            }

         } else {

            localStorage.removeItem('mayad_artist_jwt');

            localStorage.removeItem('token');

            router.replace('/artist/login');

         }

      } catch (error: any) {

         console.error('Fetch Artist Profile Error:', error);

         router.replace('/artist/login');

      } finally {

         setLoading(false);

      }

   }

   function toEditableForm(source: any = {}) {

      return {

         fullName: source.fullName || '',

         stageName: source.stageName || '',

         phone: source.phone || '',

         category: source.category || '',

         secondaryCategory: source.secondaryCategory || '',

         experience: source.experience || '1-3 years',

         location: source.location || '',

         bio: source.bio || '',

         profilePhoto: source.profilePhoto || '/mayad.jpg',

         showreel: source.showreel || '',

         imdb: source.imdb || '',

         instagram: source.instagram || '',

      };

   }

   async function handleLogout() {

      try {

         await fetch(`${BACKEND_URL}/api/artist/logout`, {

            method: 'POST',

            credentials: 'include',

         });

      } catch (error: any) {

         console.error('Logout error:', error);

      } finally {

         localStorage.removeItem('mayad_artist_jwt');

         localStorage.removeItem('token');

         localStorage.removeItem('mayad_artist_portal_logged_email');

         localStorage.removeItem('mayad_artist_profile_photo');

         if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('artistProfileUpdated'));
         }

         router.replace('/artist/login');

      }

   }

   async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {

      event.preventDefault();

      try {

         setSavingEdit(true);

         setEditError('');

         const token =

            localStorage.getItem('mayad_artist_jwt') ||

            localStorage.getItem('token');

         const res = await fetch(`https://mayad-backend.vercel.app/api/artist/me`, {

            method: 'PUT',

            headers: {

               'Content-Type': 'application/json',

               ...(token ? { Authorization: `Bearer ${token}` } : {}),

            },

            credentials: 'include',

            body: JSON.stringify({

               fullName: editForm.fullName,

               stageName: editForm.stageName,

               phone: editForm.phone,

               category: editForm.category,

               secondaryCategory: editForm.secondaryCategory,

               experience: editForm.experience,

               location: editForm.location,

               bio: editForm.bio,

               profilePhoto: editForm.profilePhoto,

               showreel: editForm.showreel,

               imdb: editForm.imdb,

               instagram: editForm.instagram,

            }),

         });

         const data = await res.json().catch(() => ({}));

         if (res.ok && data.success && data.artist) {

            setArtist(data.artist);

            setEditForm(toEditableForm(data.artist));

            if (typeof window !== 'undefined' && data.artist.profilePhoto) {
               localStorage.setItem('mayad_artist_profile_photo', data.artist.profilePhoto);
               window.dispatchEvent(new Event('artistProfileUpdated'));
            }

            setEditModalOpen(false);

            showToast('Artist profile updated successfully!');

         } else if (res.status === 401 || res.status === 403) {

            setEditError('Your session expired. Please sign in again.');

            localStorage.removeItem('mayad_artist_jwt');

            localStorage.removeItem('token');

         } else {

            setEditError(data.message || 'Failed to update profile.');

         }

      } catch (error: any) {

         console.error('Save Profile Error:', error);

         setEditError('Network error saving profile changes.');

      } finally {

         setSavingEdit(false);

      }

   }

function showToast(message: string) {

   setToastMsg(message);

   window.setTimeout(() => {

      setToastMsg('');

   }, 3500);

}

   function updateField(field: string, value: any) {

      setEditForm((current) => ({ ...current, [field]: value }));

   }

   if (loading) {

      return (

         <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center">

            <div className="text-amber-400">

               <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin" />

               <h2 className="text-xl font-bold text-white">Loading Artist Dashboard...</h2>

               <p className="mt-2 text-sm text-slate-400">Fetching your profile</p>

            </div>

         </main>

      );

   }

   if (!artist) return null;

   const status = artist.accountStatus || 'Pending Approval';

   const statusStyle =

      status === 'Approved'

         ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'

         : status === 'Rejected'

            ? 'border-red-500/30 bg-red-500/10 text-red-400'

            : 'border-amber-500/30 bg-amber-500/10 text-amber-400';

   return (

      <main className="min-h-screen bg-slate-950 text-white">

         {toastMsg && (

            <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-amber-400/40 bg-slate-900 px-5 py-4 text-sm text-white shadow-2xl">

               <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />

               <span>{toastMsg}</span>

            </div>

         )}

         <header className="border-b border-white/10 bg-slate-950/95">

            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">

               <Link href="/" className="flex items-center gap-4">

                  <Image

                     src="/mayadlogo.jpg"

                     alt="MAYAD Logo"

                     width={180}

                     height={72}

                     priority

                     className="h-14 w-auto object-contain sm:h-16"

                  />

                  <span className="hidden text-lg font-extrabold tracking-wide sm:inline">

                     ARTIST DASHBOARD

                  </span>

               </Link>

               <button

                  onClick={handleLogout}

                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-amber-400/50 hover:bg-white/10"

               >

                  <LogOut className="h-4 w-4" /> Sign Out

               </button>

            </div>

         </header>

         <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 shadow-2xl sm:p-8 lg:p-10">

               <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

               <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">

                     <div className="relative group h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400 bg-slate-800 shadow-lg sm:h-28 sm:w-28">

                        <Image

                           src={artist.profilePhoto || '/user.png'}

                           alt={artist.fullName || 'Artist profile'}

                           fill

                           sizes="112px"

                           className="object-cover"

                           unoptimized

                        />

                        {uploadingPhoto ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
                              <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
                              <span className="mt-1 text-[9px] font-bold text-amber-300 uppercase">Uploading...</span>
                           </div>
                        ) : (
                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]"
                              title="Upload Photo from Gallery"
                           >
                              <Camera className="h-6 w-6 text-amber-400" />
                              <span className="mt-1 text-[10px] font-bold text-white uppercase">Upload</span>
                           </button>
                        )}

                     </div>

                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoFileChange}
                        accept="image/*"
                        className="hidden"
                     />

                     <div className="min-w-0">

                        <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl">

                           {artist.stageName || artist.fullName}

                        </h1>

                        <div className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${statusStyle}`}>

                           {status === 'Approved' ? (

                              <CheckCircle className="h-4 w-4" />

                           ) : status === 'Rejected' ? (

                              <AlertCircle className="h-4 w-4" />

                           ) : (

                              <Clock className="h-4 w-4" />

                           )}

                           {status === 'Approved' ? 'Verified Artist' : status}

                        </div>

                        <p className="mt-4 font-semibold text-amber-400">

                           {artist.category || 'Artist'}

                           {artist.secondaryCategory ? ` • ${artist.secondaryCategory}` : ''}

                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">

                           <span className="inline-flex items-center gap-2">

                              <MapPin className="h-4 w-4 text-slate-400" />

                              {artist.location || 'Location not added'}

                           </span>

                           <span className="inline-flex items-center gap-2 break-all">

                              <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                              {artist.email}

                           </span>

                           <span className="inline-flex items-center gap-2">

                              <Briefcase className="h-4 w-4 text-slate-400" />

                              {artist.experience || '1-3 years'}

                           </span>

                        </div>

                     </div>

                  </div>

                  <button

                     onClick={() => {

                        setEditForm(toEditableForm(artist));

                        setEditError('');

                        setEditModalOpen(true);

                     }}

                     className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-300"

                  >

                     <Edit3 className="h-4 w-4" /> Edit Profile

                  </button>

               </div>

            </section>

            {status === 'Pending Approval' && (

               <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">

                  <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />

                  <div>

                     <h2 className="font-bold text-amber-300">Profile Under Review by MAYAD Production Team</h2>

                     <p className="mt-1 text-sm leading-6 text-slate-300">

                        Your registered profile is undergoing evaluation by MAYAD casting directors.

                        Profile verification may take 24–48 hours.

                     </p>

                  </div>

               </div>

            )}

            {status === 'Approved' && (

               <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">

                  <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />

                  <div>

                     <h2 className="font-bold text-emerald-300">Verified MAYAD Artist Account</h2>

                     <p className="mt-1 text-sm leading-6 text-slate-300">

                        Your artist credentials have been verified. Your profile is eligible for MAYAD casting calls and production auditions.

                     </p>

                  </div>

               </div>

            )}

            <nav className="mt-8 flex gap-2 border-b border-white/10">

               {[
                  { id: 'overview', label: 'Overview & Bio' },
                  { id: 'projects', label: 'My Projects & Roles' },
                  { id: 'media', label: 'My Photos & Reels' },
                  { id: 'movies', label: 'My Movies' },
               ].map((tab) => (

                  <button

                     key={tab.id}

                     onClick={() => setActiveTab(tab.id)}

                     className={`border-b-2 px-4 py-3 text-sm font-bold transition ${

                        activeTab === tab.id

                           ? 'border-amber-400 text-amber-400'

                           : 'border-transparent text-slate-400 hover:text-white'

                     }`}

                  >

                     {tab.label}

                  </button>

               ))}

            </nav>

            {activeTab === 'projects' && (
               <div className="mt-6">
                  <ArtistMyProjects />
               </div>
            )}

            {activeTab === 'media' && (
               <div className="mt-6">
                  <ArtistMyMedia />
               </div>
            )}

            {activeTab === 'overview' && (

               <div className="mt-6 grid gap-6 lg:grid-cols-2">

                  <section className={cardClass}>

                     <h2 className="text-xl font-bold">Artist Biography</h2>

                     <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">

                        {artist.bio || 'No bio specified.'}

                     </p>

                     <div className="mt-8 border-t border-white/10 pt-6">

                        <h3 className="font-bold">Languages Spoken</h3>

                        <div className="mt-3 flex flex-wrap gap-2">

                           {Array.isArray(artist.languages) && artist.languages.length > 0 ? (

                              artist.languages.map((language: any, index: number) => (

                                 <span

                                    key={`${language}-${index}`}

                                    className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-sm font-semibold text-amber-300"

                                 >

                                    {String(language)}

                                 </span>

                              ))

                           ) : (

                              <span className="text-sm text-slate-400">Rajasthani, Hindi</span>

                           )}

                        </div>

                     </div>

                  </section>

                  <section className={cardClass}>

                     <h2 className="text-xl font-bold">Information</h2>

                     <div className="mt-6 space-y-5 text-sm">

                        <InfoRow label="Legal Name" value={artist.fullName} />

                        <InfoRow label="Phone / WhatsApp" value={artist.phone} />

                        <InfoRow label="Registered Email (Immutable)" value={artist.email} highlight />

                        <InfoRow

                           label="Registration Date"

                           value={

                              artist.createdAt && !Number.isNaN(new Date(artist.createdAt).getTime())

                                 ? new Date(artist.createdAt).toLocaleDateString()

                                 : 'Not available'

                           }

                        />

                     </div>

                  </section>

               </div>

            )}

            {activeTab === 'movies' && (

               <section className="mt-6">

                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                     <div>

                        <div className="flex items-center gap-3">

                           <Film className="h-7 w-7 text-amber-400" />

                           <h2 className="text-2xl font-black text-white">My Movies</h2>

                        </div>

                        <p className="mt-2 text-sm text-slate-400">

                           Movies and projects associated with your MAYAD artist profile.

                        </p>

                     </div>

                     <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">

                        {Array.isArray(artist.movies) ? artist.movies.length : 0} Movies

                     </span>

                  </div>

                  {Array.isArray(artist.movies) && artist.movies.length > 0 ? (

                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {artist.movies.map((movie: any, index: number) => {

                           if (!movie || typeof movie !== 'object') return null;

                           const title = typeof movie.title === 'string' ? movie.title : 'Untitled Movie';

                           const poster = typeof movie.poster === 'string' ? movie.poster : '';

                           const releaseYear = movie.releaseYear == null ? '' : String(movie.releaseYear);

                           const role = typeof movie.role === 'string' ? movie.role : '';

                           const language = typeof movie.language === 'string' ? movie.language : '';

                           const description = typeof movie.description === 'string' ? movie.description : '';

                           const imdb = typeof movie.imdb === 'string' ? movie.imdb : '';

                           return (

                              <article

                                 key={movie._id || `${title}-${index}`}

                                 className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/40"

                              >

                                 <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">

                                    {poster ? (

                                       <img

                                          src={poster}

                                          alt={`${title} poster`}

                                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"

                                          loading="lazy"

                                          onError={(event: React.SyntheticEvent<HTMLImageElement>) => { event.currentTarget.style.display = 'none'; }}

                                       />

                                    ) : (

                                       <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">

                                          <Film className="h-14 w-14 text-amber-400/60" />

                                          <span className="text-sm font-medium">Poster unavailable</span>

                                       </div>

                                    )}

                                    {releaseYear && (

                                       <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">

                                          {releaseYear}

                                       </span>

                                    )}

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-16">

                                       <h3 className="text-xl font-black text-white">{title}</h3>

                                       {role && <p className="mt-2 text-sm font-semibold text-amber-300">{role}</p>}

                                    </div>

                                 </div>

                                 <div className="p-5">

                                    <div className="flex flex-wrap gap-2">

                                       {language && (

                                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">

                                             {language}

                                          </span>

                                       )}

                                       {role && (

                                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300">

                                             {role}

                                          </span>

                                       )}

                                    </div>

                                    {description && (

                                       <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-400">{description}</p>

                                    )}

                                   {imdb && /^https?:\/\/\//i.test(imdb) && (

   <a

      href={imdb}

      target="_blank"

      rel="noopener noreferrer"

      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-400 hover:text-slate-950"

   >

      View on IMDb <ExternalLink className="h-4 w-4" />

   </a>

)}

                                 </div>

                              </article>

                           );

                        })}

                     </div>

                  ) : (

                     <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/50 px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">

                           <Film className="h-8 w-8 text-amber-400" />

                        </div>

                        <h3 className="mt-5 text-xl font-bold text-white">No Movies Added Yet</h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">

                           Your movies and film credits will appear here once they are added to your MAYAD artist profile by the production team.

                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">

                           <Clock className="h-4 w-4 text-amber-400" /> Waiting for movie credits

                        </div>

                     </div>

                  )}

               </section>

            )}

         </div>

         {editModalOpen && (

            <div

               className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"

               onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {

                  if (event.target === event.currentTarget) setEditModalOpen(false);

               }}

            >

               <div className="relative my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-8">

                  <button

                     type="button"

                     onClick={() => setEditModalOpen(false)}

                     aria-label="Close edit profile"

                     className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"

                  >

                     <X className="h-5 w-5" />

                  </button>

                  <h2 className="pr-10 text-2xl font-black">Edit Artist Profile</h2>

                  <p className="mt-2 text-sm text-slate-400">Update your profile details below.</p>

                  {editError && (

                     <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                        {editError}

                     </div>

                  )}

                  <form onSubmit={handleSaveProfile} className="mt-6">

                     <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                           <label className={labelClass}>Email (Immutable)</label>

                           <input

                              type="email"

                              value={artist.email || ''}

                              disabled

                              className={`${inputClass} cursor-not-allowed bg-white/5 text-amber-300`}

                           />

                        </div>

                        <FormField label="Full Name" required>

                           <input required value={editForm.fullName || ''} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Stage Name">

                           <input value={editForm.stageName || ''} onChange={(e) => updateField('stageName', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Phone Number" required>

                           <input required value={editForm.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Category" required>

                           <input required value={editForm.category || ''} onChange={(e) => updateField('category', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Secondary Category">

                           <input value={editForm.secondaryCategory || ''} onChange={(e) => updateField('secondaryCategory', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Experience">

                           <input value={editForm.experience || ''} onChange={(e) => updateField('experience', e.target.value)} className={inputClass} />

                        </FormField>

                        <FormField label="Location / City" required>

                           <input required value={editForm.location || ''} onChange={(e) => updateField('location', e.target.value)} className={inputClass} />

                        </FormField>

                        <div className="sm:col-span-2">

                           <label className={labelClass}>Profile Picture</label>

                           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                              <input value={editForm.profilePhoto || ''} onChange={(e) => updateField('profilePhoto', e.target.value)} className={`${inputClass} flex-1`} placeholder="/mayad.jpg or Cloudinary URL" />

                              <button
                                 type="button"
                                 onClick={() => fileInputRef.current?.click()}
                                 disabled={uploadingPhoto}
                                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-3 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition shrink-0"
                              >
                                 {uploadingPhoto ? (
                                    <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                                 ) : (
                                    <Camera className="h-4 w-4 text-amber-400" />
                                 )}
                                 <span>Upload Photo from Gallery</span>
                              </button>

                           </div>

                        </div>

                        <div className="sm:col-span-2">

                           <label className={labelClass}>Showreel Video Link</label>

                           <input type="url" value={editForm.showreel || ''} onChange={(e) => updateField('showreel', e.target.value)} className={inputClass} placeholder="https://www\.youtube.com/watch?v=..." />

                        </div>

                        <div>

                           <label className={labelClass}>IMDb Profile URL</label>

                           <input type="url" value={editForm.imdb || ''} onChange={(e) => updateField('imdb', e.target.value)} className={inputClass} placeholder="https://www\.imdb.com/..." />

                        </div>

                        <div>

                           <label className={labelClass}>Instagram URL</label>

                           <input type="url" value={editForm.instagram || ''} onChange={(e) => updateField('instagram', e.target.value)} className={inputClass} placeholder="https://www\.instagram.com/..." />

                        </div>

                        <div className="sm:col-span-2">

                           <label className={labelClass}>Artist Bio</label>

                           <textarea required rows={5} value={editForm.bio || ''} onChange={(e) => updateField('bio', e.target.value)} className={`${inputClass} resize-y`} />

                        </div>

                     </div>

                     <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">

                        <button

                           type="button"

                           onClick={() => setEditModalOpen(false)}

                           className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"

                        >

                           Cancel

                        </button>

                        <button

                           type="submit"

                           disabled={savingEdit}

                           className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"

                        >

                           {savingEdit ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}

                           {savingEdit ? 'Saving...' : 'Save Profile'}

                        </button>

                     </div>

                  </form>

               </div>

            </div>

         )}

      </main>

   );

}

function InfoRow({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) {

   return (

      <div>

         <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>

         <p className={`mt-1 break-words font-semibold ${highlight ? 'text-amber-300' : 'text-white'}`}>

            {value || 'Not specified'}

         </p>

      </div>

   );

}

function ExternalProfile({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {

   return (

      <a

         href={href}

         target="_blank"

         rel="noopener noreferrer"

         className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400/40 hover:bg-white/5"

      >

         <span className="flex items-center gap-3">{icon}{label}</span>

         <ExternalLink className="h-4 w-4 text-slate-400" />

      </a>

   );

}

function FormField({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {

   return (

      <div>

         <label className={labelClass}>

            {label}{required ? <span className="ml-1 text-amber-400">\*</span> : null}

         </label>

         {children}

      </div>

   );

}
