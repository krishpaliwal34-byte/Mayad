'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Film,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Loader2,
  FileText,
  Bell,
  X,
  User,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';

interface PopulatedMovie {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  description?: string;
  director?: string;
  productionHouse?: string;
  language?: string;
  genre?: string;
  projectStatus?: string;
  shootingStartDate?: string;
  shootingEndDate?: string;
  shootingLocations?: string[];
  isPublished?: boolean;
}

interface AssignedRole {
  _id: string;
  movie: PopulatedMovie;
  roleName: string;
  characterName: string;
  roleType: 'Lead' | 'Supporting' | 'Cameo' | 'Background' | 'Other';
  shootingStartDate?: string;
  shootingEndDate?: string;
  shootingLocation?: string;
  productionInstructions?: string;
  roleStatus: 'Assigned' | 'Confirmed' | 'Declined' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

export default function ArtistMyProjects() {
  const [roles, setRoles] = useState<AssignedRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Response Processing State
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // Project Details Modal State
  const [selectedRole, setSelectedRole] = useState<AssignedRole | null>(null);

  useEffect(() => {
    fetchMyProjects();
    fetchNotifications();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const getArtistToken = () => {
    return (
      localStorage.getItem('mayad_artist_jwt') ||
      localStorage.getItem('token') ||
      ''
    );
  };

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const token = getArtistToken();
      const res = await fetch(`${BACKEND_URL}/api/artist/my-projects`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRoles(data.roles || []);
      } else {
        showToast(data.message || 'Failed to load assigned projects', 'error');
      }
    } catch (err) {
      console.error('Fetch my projects error:', err);
      showToast('Error connecting to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = getArtistToken();
      const res = await fetch(`${BACKEND_URL}/api/artist/notifications`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  };

  const handleRespondRole = async (roleId: string, responseStatus: 'Confirmed' | 'Declined') => {
    try {
      setRespondingId(roleId);
      const token = getArtistToken();
      const res = await fetch(`${BACKEND_URL}/api/artist/my-projects/${roleId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ response: responseStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Role ${responseStatus.toLowerCase()} successfully! Admin notified.`);
        fetchMyProjects();
        if (selectedRole && selectedRole._id === roleId) {
          setSelectedRole({ ...selectedRole, roleStatus: responseStatus });
        }
      } else {
        showToast(data.message || 'Failed to update response', 'error');
      }
    } catch (err) {
      console.error('Respond role error:', err);
      showToast('Error updating role response', 'error');
    } finally {
      setRespondingId(null);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      const token = getArtistToken();
      await fetch(`${BACKEND_URL}/api/artist/notifications/all/read`, {
        method: 'PATCH',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      setUnreadCount(0);
      fetchNotifications();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-md ${
            toastType === 'success'
              ? 'border-emerald-500/40 bg-slate-900/90 text-emerald-300'
              : 'border-red-500/40 bg-slate-900/90 text-red-300'
          }`}
        >
          <Sparkles className="h-5 w-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Film className="h-6 w-6 text-amber-400" />
              My Movies & Assigned Roles
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              View your casting assignments, production schedules, confidential instructions, and respond to role invitations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) handleMarkNotificationsRead();
            }}
            className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-amber-400/40 hover:text-white transition"
          >
            <Bell className="h-4 w-4 text-amber-400" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="rounded-2xl border border-amber-400/30 bg-slate-900 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              Production Notifications
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`rounded-xl border p-3 text-xs ${
                    n.isRead
                      ? 'border-white/5 bg-slate-950/60 text-slate-400'
                      : 'border-amber-500/30 bg-amber-500/10 text-slate-200'
                  }`}
                >
                  <h4 className="font-bold text-amber-300 mb-0.5">{n.title}</h4>
                  <p className="leading-snug">{n.message}</p>
                  <span className="block mt-1 text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assigned Projects Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="text-center text-amber-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Loading your project assignments...</p>
          </div>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-6 text-center">
          <Film className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No Projects Assigned Yet</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md">
            When MAYAD production directors assign you a role in upcoming movies or web series, your project details and schedules will appear right here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const movieObj = r.movie || {};
            const isPendingResponse = r.roleStatus === 'Assigned';

            return (
              <div
                key={r._id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl transition hover:border-amber-400/40"
              >
                {/* Poster & Header Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={movieObj.posterUrl || '/mayad.jpg'}
                    alt={movieObj.title || 'Movie Project'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                  {/* Role Status Badge Top Right */}
                  <div className="absolute top-3 right-3 z-10">
                    {r.roleStatus === 'Confirmed' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/90 px-2.5 py-1 text-[10px] font-extrabold text-emerald-400 backdrop-blur-md">
                        <CheckCircle className="h-3 w-3" /> Confirmed
                      </span>
                    )}
                    {r.roleStatus === 'Assigned' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/90 px-2.5 py-1 text-[10px] font-extrabold text-amber-400 backdrop-blur-md animate-pulse">
                        <Clock className="h-3 w-3" /> Action Required
                      </span>
                    )}
                    {r.roleStatus === 'Declined' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-950/90 px-2.5 py-1 text-[10px] font-extrabold text-red-400 backdrop-blur-md">
                        <XCircle className="h-3 w-3" /> Declined
                      </span>
                    )}
                    {r.roleStatus === 'Completed' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-950/90 px-2.5 py-1 text-[10px] font-extrabold text-indigo-300 backdrop-blur-md">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </div>

                  {/* Role Type Tag Top Left */}
                  <div className="absolute top-3 left-3 z-10 rounded-md bg-black/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 backdrop-blur-md border border-white/10">
                    {r.roleType} Role
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white line-clamp-1">{movieObj.title}</h3>
                    
                    <p className="mt-1 text-sm font-bold text-amber-400">
                      Character: <span className="text-white">{r.characterName}</span>
                    </p>
                    <p className="text-xs text-slate-400">Role Designation: {r.roleName}</p>

                    {/* Shooting Schedule & Location */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-3">
                      {(r.shootingStartDate || movieObj.shootingStartDate) && (
                        <p className="flex items-center gap-2 text-xs">
                          <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>
                            Shooting: {new Date(r.shootingStartDate || movieObj.shootingStartDate!).toLocaleDateString()}
                            {(r.shootingEndDate || movieObj.shootingEndDate) &&
                              ` to ${new Date(r.shootingEndDate || movieObj.shootingEndDate!).toLocaleDateString()}`}
                          </span>
                        </p>
                      )}

                      {(r.shootingLocation || (movieObj.shootingLocations && movieObj.shootingLocations[0])) && (
                        <p className="flex items-center gap-2 text-xs">
                          <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>Location: {r.shootingLocation || movieObj.shootingLocations?.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    {/* View Full Project Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-400/40 hover:text-white transition"
                    >
                      <Info className="h-4 w-4 text-amber-400" />
                      View Full Details & Production Instructions
                    </button>

                    {/* Accept / Decline Action Buttons for Assigned Status */}
                    {isPendingResponse && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          disabled={respondingId === r._id}
                          onClick={() => handleRespondRole(r._id, 'Confirmed')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-lg"
                        >
                          {respondingId === r._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Accept Role
                        </button>

                        <button
                          type="button"
                          disabled={respondingId === r._id}
                          onClick={() => handleRespondRole(r._id, 'Declined')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-950/60 py-2.5 text-xs font-bold text-red-300 hover:bg-red-900/80 disabled:opacity-50 transition"
                        >
                          {respondingId === r._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          Decline Role
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl my-8">
            <button
              onClick={() => setSelectedRole(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-amber-400/40">
                <Image
                  src={selectedRole.movie?.posterUrl || '/mayad.jpg'}
                  alt={selectedRole.movie?.title || 'Poster'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{selectedRole.movie?.title}</h3>
                <p className="text-xs font-bold text-amber-400">
                  Character: <span className="text-white">{selectedRole.characterName}</span> ({selectedRole.roleName})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Production House: {selectedRole.movie?.productionHouse || 'MAYAD Productions'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              {/* Confidential Production Instructions */}
              {selectedRole.productionInstructions && (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 space-y-1">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-amber-400" />
                    Confidential Production & Makeup Instructions
                  </h4>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                    {selectedRole.productionInstructions}
                  </p>
                </div>
              )}

              {/* Schedule Info */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 space-y-2">
                <h4 className="font-bold text-white mb-2">Production Schedule & Location</h4>
                
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    Shooting Schedule:{' '}
                    {selectedRole.shootingStartDate
                      ? new Date(selectedRole.shootingStartDate).toLocaleDateString()
                      : 'TBA'}
                    {selectedRole.shootingEndDate
                      ? ` to ${new Date(selectedRole.shootingEndDate).toLocaleDateString()}`
                      : ''}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    Location:{' '}
                    {selectedRole.shootingLocation ||
                      selectedRole.movie?.shootingLocations?.join(', ') ||
                      'Rajasthan Sets'}
                  </span>
                </p>
              </div>

              {/* Movie Description */}
              {selectedRole.movie?.description && (
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 space-y-1">
                  <h4 className="font-bold text-white">Movie Synopsis</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedRole.movie.description}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Status:{' '}
                <span className="font-bold text-amber-400">{selectedRole.roleStatus}</span>
              </span>

              {selectedRole.roleStatus === 'Assigned' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRespondRole(selectedRole._id, 'Confirmed')}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Accept Role
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespondRole(selectedRole._id, 'Declined')}
                    className="rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-900"
                  >
                    Decline Role
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
