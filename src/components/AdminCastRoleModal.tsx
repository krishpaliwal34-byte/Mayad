'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Loader2,
  Film,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface PopulatedArtist {
  _id: string;
  fullName: string;
  stageName?: string;
  email: string;
  category?: string;
  profilePhoto?: string;
  location?: string;
}

interface MovieRoleItem {
  _id: string;
  artist: PopulatedArtist | string;
  movie: string;
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

interface MovieProject {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  director?: string;
  productionHouse?: string;
  releaseDate?: string;
  shootingStartDate?: string;
  shootingEndDate?: string;
  shootingLocations?: string[];
  projectStatus?: 'Draft' | 'Published' | 'Archived' | 'Cancelled';
}

interface AdminCastRoleModalProps {
  movie: MovieProject;
  onClose: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function AdminCastRoleModal({ movie, onClose, showToast }: AdminCastRoleModalProps) {
  const [roles, setRoles] = useState<MovieRoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Movie Details Edit State
  const [movieForm, setMovieForm] = useState({
    productionHouse: movie.productionHouse || '',
    releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
    shootingStartDate: movie.shootingStartDate ? movie.shootingStartDate.split('T')[0] : '',
    shootingEndDate: movie.shootingEndDate ? movie.shootingEndDate.split('T')[0] : '',
    shootingLocations: movie.shootingLocations ? movie.shootingLocations.join(', ') : '',
    projectStatus: movie.projectStatus || 'Published',
  });
  const [savingMovie, setSavingMovie] = useState(false);

  // Role Form State
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<MovieRoleItem | null>(null);

  // Artist Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchArtists, setSearchArtists] = useState<PopulatedArtist[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<PopulatedArtist | null>(null);

  // Role Form Fields
  const [roleName, setRoleName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [roleType, setRoleType] = useState<'Lead' | 'Supporting' | 'Cameo' | 'Background' | 'Other'>('Lead');
  const [shootingStartDate, setShootingStartDate] = useState('');
  const [shootingEndDate, setShootingEndDate] = useState('');
  const [shootingLocation, setShootingLocation] = useState('');
  const [productionInstructions, setProductionInstructions] = useState('');
  const [roleStatus, setRoleStatus] = useState<'Assigned' | 'Confirmed' | 'Declined' | 'Completed' | 'Cancelled'>('Assigned');
  const [submittingRole, setSubmittingRole] = useState(false);

  useEffect(() => {
    fetchMovieRoles();
  }, [movie._id]);

  const getAdminToken = () => {
    return (
      localStorage.getItem('mayad_admin_token') ||
      localStorage.getItem('mayad_admin_jwt') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('token') ||
      ''
    );
  };

  const fetchMovieRoles = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/${movie._id}/roles`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRoles(data.roles || []);
      }
    } catch (err) {
      console.error('Fetch movie roles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchArtists = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchArtists([]);
      return;
    }

    try {
      setSearching(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/artists/search?q=${encodeURIComponent(query)}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchArtists(data.artists || []);
      }
    } catch (err) {
      console.error('Artist search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSaveMovieDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingMovie(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/${movie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          productionHouse: movieForm.productionHouse,
          releaseDate: movieForm.releaseDate ? new Date(movieForm.releaseDate) : undefined,
          shootingStartDate: movieForm.shootingStartDate ? new Date(movieForm.shootingStartDate) : undefined,
          shootingEndDate: movieForm.shootingEndDate ? new Date(movieForm.shootingEndDate) : undefined,
          shootingLocations: movieForm.shootingLocations
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          projectStatus: movieForm.projectStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Movie project details updated successfully');
      } else {
        showToast(data.message || 'Failed to update movie details', 'error');
      }
    } catch (err) {
      console.error('Update movie error:', err);
      showToast('Error updating movie details', 'error');
    } finally {
      setSavingMovie(false);
    }
  };

  const resetRoleForm = () => {
    setSelectedArtist(null);
    setSearchQuery('');
    setSearchArtists([]);
    setRoleName('');
    setCharacterName('');
    setRoleType('Lead');
    setShootingStartDate('');
    setShootingEndDate('');
    setShootingLocation('');
    setProductionInstructions('');
    setRoleStatus('Assigned');
    setEditingRole(null);
    setIsAssignFormOpen(false);
  };

  const handleOpenEditRole = (roleItem: MovieRoleItem) => {
    setEditingRole(roleItem);
    const artistObj = typeof roleItem.artist === 'object' ? roleItem.artist : null;
    if (artistObj) setSelectedArtist(artistObj);

    setRoleName(roleItem.roleName || '');
    setCharacterName(roleItem.characterName || '');
    setRoleType(roleItem.roleType || 'Lead');
    setShootingStartDate(roleItem.shootingStartDate ? roleItem.shootingStartDate.split('T')[0] : '');
    setShootingEndDate(roleItem.shootingEndDate ? roleItem.shootingEndDate.split('T')[0] : '');
    setShootingLocation(roleItem.shootingLocation || '');
    setProductionInstructions(roleItem.productionInstructions || '');
    setRoleStatus(roleItem.roleStatus || 'Assigned');
    setIsAssignFormOpen(true);
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRole && !selectedArtist) {
      showToast('Please select an artist from the database', 'error');
      return;
    }
    if (!roleName.trim()) {
      showToast('Role Designation is required', 'error');
      return;
    }
    const finalCharName = characterName.trim() || roleName.trim();

    try {
      setSubmittingRole(true);
      const token = getAdminToken();

      if (editingRole) {
        // Edit existing role
        const res = await fetch(`${BACKEND_URL}/api/movies/admin/roles/${editingRole._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            roleName,
            characterName: finalCharName,
            roleType,
            shootingStartDate,
            shootingEndDate,
            shootingLocation,
            productionInstructions,
            roleStatus,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Artist role updated & artist notified!');
          resetRoleForm();
          fetchMovieRoles();
        } else {
          showToast(data.message || 'Failed to update role', 'error');
        }
      } else {
        // Assign new role
        const res = await fetch(`${BACKEND_URL}/api/movies/admin/${movie._id}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            artistId: selectedArtist!._id,
            roleName,
            characterName: finalCharName,
            roleType,
            shootingStartDate,
            shootingEndDate,
            shootingLocation,
            productionInstructions,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Role assigned to ${selectedArtist?.stageName || selectedArtist?.fullName}`);
          resetRoleForm();
          fetchMovieRoles();
        } else {
          showToast(data.message || 'Failed to assign role', 'error');
        }
      }
    } catch (err) {
      console.error('Role submit error:', err);
      showToast('Error saving role assignment', 'error');
    } finally {
      setSubmittingRole(false);
    }
  };

  // Role Deletion Confirmation State
  const [roleToRemove, setRoleToRemove] = useState<MovieRoleItem | null>(null);
  const [removingRole, setRemovingRole] = useState(false);

  const handleConfirmRemoveRole = async () => {
    if (!roleToRemove) return;

    try {
      setRemovingRole(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/roles/${roleToRemove._id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Role assignment removed');
        setRoleToRemove(null);
        fetchMovieRoles();
      } else {
        showToast(data.message || 'Failed to remove role', 'error');
      }
    } catch (err) {
      console.error('Remove role error:', err);
      showToast('Error removing role assignment', 'error');
    } finally {
      setRemovingRole(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 p-5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-amber-400/40">
              <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{movie.title}</h2>
              <p className="text-xs text-amber-400">Cast & Role Management Dashboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Project Metadata & Schedules */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Film className="h-5 w-5 text-amber-400" />
              Movie Project Details & Schedule Settings
            </h3>

            <form onSubmit={handleSaveMovieDetails} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Production House</label>
                <input
                  type="text"
                  value={movieForm.productionHouse}
                  onChange={(e) => setMovieForm({ ...movieForm, productionHouse: e.target.value })}
                  placeholder="e.g. MAYAD Productions & Studios"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Status</label>
                <select
                  value={movieForm.projectStatus}
                  onChange={(e: any) => setMovieForm({ ...movieForm, projectStatus: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Release Date</label>
                <input
                  type="date"
                  value={movieForm.releaseDate}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting Start Date</label>
                <input
                  type="date"
                  value={movieForm.shootingStartDate}
                  onChange={(e) => setMovieForm({ ...movieForm, shootingStartDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting End Date</label>
                <input
                  type="date"
                  value={movieForm.shootingEndDate}
                  onChange={(e) => setMovieForm({ ...movieForm, shootingEndDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting Locations (comma separated)</label>
                <input
                  type="text"
                  value={movieForm.shootingLocations}
                  onChange={(e) => setMovieForm({ ...movieForm, shootingLocations: e.target.value })}
                  placeholder="e.g. Jaipur, Jodhpur Fort, Udaipur Lake"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingMovie}
                  className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition"
                >
                  {savingMovie ? 'Saving...' : 'Save Project Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Manage Cast & Role Assignments */}
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  Assigned Artists & Roles ({roles.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Assign verified artist accounts to roles with shooting schedule and confidential instructions.
                </p>
              </div>

              {!isAssignFormOpen && (
                <button
                  type="button"
                  onClick={() => {
                    resetRoleForm();
                    setIsAssignFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
                >
                  <Plus className="h-4 w-4" /> Assign New Artist Role
                </button>
              )}
            </div>

            {/* Role Assignment Form Drawer */}
            {isAssignFormOpen && (
              <div className="mb-6 rounded-2xl border border-amber-400/30 bg-slate-950 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-amber-300">
                    {editingRole ? `Edit Role: ${editingRole.characterName}` : 'Assign Artist to New Movie Role'}
                  </h4>
                  <button onClick={resetRoleForm} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmitRole} className="space-y-4">
                  {/* Artist Search & Selection */}
                  {!editingRole && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Search Existing Artist Account *
                      </label>

                      {selectedArtist ? (
                        <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800 border border-amber-400/40">
                              <Image
                                src={selectedArtist.profilePhoto || '/mayad.jpg'}
                                alt={selectedArtist.fullName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">
                                {selectedArtist.stageName || selectedArtist.fullName}
                              </h5>
                              <p className="text-[10px] text-emerald-400">
                                {selectedArtist.category || 'Artist'} • {selectedArtist.email}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedArtist(null)}
                            className="text-slate-400 hover:text-red-400 text-xs font-bold"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchArtists(e.target.value)}
                            placeholder="Type artist name, email, or category to search database..."
                            className="w-full rounded-xl border border-white/10 bg-slate-900 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                          />

                          {/* Autocomplete Dropdown */}
                          {searchArtists.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl space-y-1">
                              {searchArtists.map((artist) => (
                                <div
                                  key={artist._id}
                                  onClick={() => {
                                    setSelectedArtist(artist);
                                    setSearchArtists([]);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10 cursor-pointer transition"
                                >
                                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-800">
                                    <Image
                                      src={artist.profilePhoto || '/mayad.jpg'}
                                      alt={artist.fullName}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-bold text-white">
                                      {artist.stageName || artist.fullName}
                                    </h6>
                                    <p className="text-[10px] text-slate-400">
                                      {artist.category} • {artist.email}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Role Designation *</label>
                      <select
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                        required
                      >
                        <option value="">-- Select Role Designation --</option>
                        <optgroup label="Acting & Talent">
                          <option value="Actor">Actor</option>
                          <option value="Actress">Actress</option>
                          <option value="Supporting Artist">Supporting Artist</option>
                          <option value="Voice Artist">Voice Artist</option>
                          <option value="Casting Coordinator">Casting Coordinator</option>
                        </optgroup>
                        <optgroup label="Film & Production">
                          <option value="Director">Director</option>
                          <option value="Assistant Director">Assistant Director</option>
                          <option value="Producer">Producer</option>
                          <option value="Production Manager">Production Manager</option>
                          <option value="Cinematographer / DOP">Cinematographer / DOP</option>
                          <option value="Assistant Cinematographer">Assistant Cinematographer</option>
                          <option value="Video Editor">Video Editor</option>
                          <option value="Sound Designer">Sound Designer</option>
                        </optgroup>
                        <optgroup label="Music">
                          <option value="Singer">Singer</option>
                          <option value="Music Director">Music Director</option>
                          <option value="Composer">Composer</option>
                          <option value="Lyricist">Lyricist</option>
                          <option value="Music Producer">Music Producer</option>
                        </optgroup>
                        <optgroup label="Creative & Technical">
                          <option value="Script Writer">Script Writer</option>
                          <option value="Story Writer">Story Writer</option>
                          <option value="Screenplay Writer">Screenplay Writer</option>
                          <option value="Dialogue Writer">Dialogue Writer</option>
                          <option value="Costume Designer">Costume Designer</option>
                          <option value="Makeup Artist">Makeup Artist</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Character Name *</label>
                      <input
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="e.g. Karan Singh"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Role Type</label>
                      <select
                        value={roleType}
                        onChange={(e: any) => setRoleType(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Lead">Lead</option>
                        <option value="Supporting">Supporting</option>
                        <option value="Cameo">Cameo</option>
                        <option value="Background">Background</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting Start Date</label>
                      <input
                        type="date"
                        value={shootingStartDate}
                        onChange={(e) => setShootingStartDate(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting End Date</label>
                      <input
                        type="date"
                        value={shootingEndDate}
                        onChange={(e) => setShootingEndDate(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Shooting Location</label>
                      <input
                        type="text"
                        value={shootingLocation}
                        onChange={(e) => setShootingLocation(e.target.value)}
                        placeholder="e.g. Jodhpur Fort Location"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {editingRole && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Role Status</label>
                        <select
                          value={roleStatus}
                          onChange={(e: any) => setRoleStatus(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Assigned">Assigned</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Declined">Declined</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Production & Makeup Instructions (Confidential - Visible only to Artist)
                    </label>
                    <textarea
                      value={productionInstructions}
                      onChange={(e) => setProductionInstructions(e.target.value)}
                      placeholder="e.g. Call time 6:00 AM. Wardrobe fittings on Monday. Costume provided by MAYAD."
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={resetRoleForm}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingRole}
                      className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                    >
                      {submittingRole ? 'Saving...' : editingRole ? 'Update Role' : 'Assign & Notify Artist'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Assigned Roles List */}
            {loading ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40">
                <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              </div>
            ) : roles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-slate-400 text-xs">
                No artists assigned to this movie yet. Click "Assign New Artist Role" above to assign roles!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {roles.map((r) => {
                  const artistObj = typeof r.artist === 'object' ? r.artist : null;
                  const artistName = artistObj?.stageName || artistObj?.fullName || 'Artist';

                  return (
                    <div
                      key={r._id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-800 border border-amber-400/40">
                            <Image
                              src={artistObj?.profilePhoto || '/mayad.jpg'}
                              alt={artistName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{artistName}</h4>
                            <p className="text-xs font-semibold text-amber-400">
                              as <span className="text-white">{r.characterName}</span> ({r.roleName})
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/10 rounded-md px-2 py-0.5">
                              {r.roleType} Role
                            </span>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <div>
                          {r.roleStatus === 'Confirmed' && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/80 px-2 py-1 text-[10px] font-bold text-emerald-400">
                              <CheckCircle className="h-3 w-3" /> Confirmed
                            </span>
                          )}
                          {r.roleStatus === 'Assigned' && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/80 px-2 py-1 text-[10px] font-bold text-amber-400">
                              <Clock className="h-3 w-3" /> Assigned
                            </span>
                          )}
                          {r.roleStatus === 'Declined' && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-950/80 px-2 py-1 text-[10px] font-bold text-red-400">
                              <XCircle className="h-3 w-3" /> Declined
                            </span>
                          )}
                          {r.roleStatus === 'Completed' && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-950/80 px-2 py-1 text-[10px] font-bold text-indigo-300">
                              <CheckCircle className="h-3 w-3" /> Completed
                            </span>
                          )}
                          {r.roleStatus === 'Cancelled' && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-400">
                              <XCircle className="h-3 w-3" /> Cancelled
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Schedule & Notes */}
                      <div className="space-y-1 text-xs text-slate-300 border-t border-white/5 pt-2">
                        {r.shootingStartDate && (
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            Schedule: {new Date(r.shootingStartDate).toLocaleDateString()}
                            {r.shootingEndDate ? ` to ${new Date(r.shootingEndDate).toLocaleDateString()}` : ''}
                          </p>
                        )}
                        {r.shootingLocation && (
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            Location: {r.shootingLocation}
                          </p>
                        )}
                        {r.productionInstructions && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2 rounded-lg mt-1">
                            "{r.productionInstructions}"
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditRole(r)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoleToRemove(r)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Assignment Confirmation Modal */}
      {roleToRemove && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Remove Artist Assignment?</h3>
                <p className="text-xs text-slate-400">This will remove this artist from the project.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-slate-300">
              <p className="font-semibold text-white">
                Artist:{' '}
                <span className="text-amber-400">
                  {typeof roleToRemove.artist === 'object'
                    ? roleToRemove.artist.stageName || roleToRemove.artist.fullName
                    : 'Selected Artist'}
                </span>
              </p>
              <p>Role: {roleToRemove.roleName} ({roleToRemove.characterName})</p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={removingRole}
                onClick={() => setRoleToRemove(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={removingRole}
                onClick={handleConfirmRemoveRole}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50 transition"
              >
                {removingRole ? 'Removing...' : 'Remove Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
