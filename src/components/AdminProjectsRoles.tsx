'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Search,
  RefreshCw,
  Eye,
  UserPlus,
  Edit2,
  Trash2,
  Users,
  Film,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { adminService, AdminMovieRecord } from '@/services/adminService';

interface PopulatedArtist {
  _id: string;
  fullName: string;
  stageName?: string;
  email: string;
  category?: string;
  profilePhoto?: string;
  location?: string;
  isVerified?: boolean;
}

interface AssignedRole {
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

interface AdminProjectsRolesProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
  onStatsUpdate?: () => void;
}

const BACKEND_URL = process.env.API_URL || 'http://localhost:5000';

export default function AdminProjectsRoles({ showToast, onStatsUpdate }: AdminProjectsRolesProps) {
  const [movies, setMovies] = useState<AdminMovieRecord[]>([]);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Project Details View State
  const [selectedProject, setSelectedProject] = useState<AdminMovieRecord | null>(null);
  const [projectRoles, setProjectRoles] = useState<AssignedRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Assign Artist Modal State
  const [assigningToProject, setAssigningToProject] = useState<AdminMovieRecord | null>(null);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [searchArtists, setSearchArtists] = useState<PopulatedArtist[]>([]);
  const [searchingArtists, setSearchingArtists] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<PopulatedArtist | null>(null);

  // Role Form Fields (Assign)
  const [roleName, setRoleName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [roleType, setRoleType] = useState<'Lead' | 'Supporting' | 'Cameo' | 'Background' | 'Other'>('Supporting');
  const [shootingStartDate, setShootingStartDate] = useState('');
  const [shootingEndDate, setShootingEndDate] = useState('');
  const [shootingLocation, setShootingLocation] = useState('');
  const [productionInstructions, setProductionInstructions] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  // Edit Role Modal State
  const [editingRole, setEditingRole] = useState<AssignedRole | null>(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editCharacterName, setEditCharacterName] = useState('');
  const [editRoleType, setEditRoleType] = useState<'Lead' | 'Supporting' | 'Cameo' | 'Background' | 'Other'>('Supporting');
  const [editShootingStartDate, setEditShootingStartDate] = useState('');
  const [editShootingEndDate, setEditShootingEndDate] = useState('');
  const [editShootingLocation, setEditShootingLocation] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Remove Assignment Confirmation Modal State
  const [roleToRemove, setRoleToRemove] = useState<AssignedRole | null>(null);
  const [removingRole, setRemovingRole] = useState(false);

  const getAdminToken = () => {
    return (
      localStorage.getItem('mayad_admin_token') ||
      localStorage.getItem('mayad_admin_jwt') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('token') ||
      ''
    );
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminMovies();
      if (res.success && res.movies) {
        setMovies(res.movies);
        fetchRoleCounts(res.movies);
        if (onStatsUpdate) onStatsUpdate();
      }
    } catch (err: any) {
      console.error('Error fetching project records:', err);
      showToast(err?.message || 'Failed to load projects database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleCounts = async (projectList: AdminMovieRecord[]) => {
    const token = getAdminToken();
    const counts: Record<string, number> = {};
    await Promise.all(
      projectList.map(async (m) => {
        const id = m._id || m.id;
        if (!id) return;
        try {
          const res = await fetch(`${BACKEND_URL}/api/movies/admin/${id}/roles`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok && data.success) {
            counts[id] = (data.roles || []).length;
          }
        } catch (e) {
          counts[id] = 0;
        }
      })
    );
    setRoleCounts(counts);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const fetchProjectRoles = async (projectId: string) => {
    setRolesLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/${projectId}/roles`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjectRoles(data.roles || []);
        const id = projectId;
        setRoleCounts((prev) => ({ ...prev, [id]: (data.roles || []).length }));
      }
    } catch (err) {
      console.error('Fetch project roles error:', err);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleOpenViewProject = (project: AdminMovieRecord) => {
    setSelectedProject(project);
    const id = project._id || project.id;
    if (id) fetchProjectRoles(id);
  };

  const handleOpenAssignModal = (project: AdminMovieRecord) => {
    setAssigningToProject(project);
    setSelectedArtist(null);
    setArtistSearchQuery('');
    setSearchArtists([]);
    setRoleName('');
    setCharacterName('');
    setRoleType('Supporting');
    setShootingStartDate('');
    setShootingEndDate('');
    setShootingLocation('');
    setProductionInstructions('');
  };

  const handleSearchArtists = async (query: string) => {
    setArtistSearchQuery(query);
    if (!query.trim()) {
      setSearchArtists([]);
      return;
    }

    try {
      setSearchingArtists(true);
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
      setSearchingArtists(false);
    }
  };

  const handleAssignArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningToProject) return;

    if (!selectedArtist) {
      showToast('Please select a registered artist account from the database', 'error');
      return;
    }
    if (!roleName.trim()) {
      showToast('Role Designation is required', 'error');
      return;
    }

    const projectId = assigningToProject._id || assigningToProject.id;
    if (!projectId) return;

    try {
      setSubmittingAssignment(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/${projectId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          artistId: selectedArtist._id,
          roleName: roleName.trim(),
          characterName: (characterName.trim() || roleName.trim()),
          roleType,
          shootingStartDate: shootingStartDate || undefined,
          shootingEndDate: shootingEndDate || undefined,
          shootingLocation: shootingLocation.trim(),
          productionInstructions: productionInstructions.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Artist ${selectedArtist.stageName || selectedArtist.fullName} assigned successfully!`);
        setAssigningToProject(null);
        if (selectedProject && (selectedProject._id === projectId || selectedProject.id === projectId)) {
          fetchProjectRoles(projectId);
        }
        loadProjects();
      } else {
        showToast(data.message || 'Failed to assign artist to project', 'error');
      }
    } catch (err: any) {
      console.error('Assign artist error:', err);
      showToast('Error assigning artist to project', 'error');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleOpenEditRoleModal = (role: AssignedRole) => {
    setEditingRole(role);
    setEditRoleName(role.roleName || '');
    setEditCharacterName(role.characterName || '');
    setEditRoleType(role.roleType || 'Supporting');
    setEditShootingStartDate(role.shootingStartDate ? role.shootingStartDate.split('T')[0] : '');
    setEditShootingEndDate(role.shootingEndDate ? role.shootingEndDate.split('T')[0] : '');
    setEditShootingLocation(role.shootingLocation || '');
    setEditInstructions(role.productionInstructions || '');
  };

  const handleEditRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    if (!editRoleName.trim()) {
      showToast('Role Designation is required', 'error');
      return;
    }

    try {
      setSubmittingEdit(true);
      const token = getAdminToken();
      const res = await fetch(`${BACKEND_URL}/api/movies/admin/roles/${editingRole._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          roleName: editRoleName.trim(),
          characterName: (editCharacterName.trim() || editRoleName.trim()),
          roleType: editRoleType,
          shootingStartDate: editShootingStartDate || undefined,
          shootingEndDate: editShootingEndDate || undefined,
          shootingLocation: editShootingLocation.trim(),
          productionInstructions: editInstructions.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Artist role updated successfully!');
        setEditingRole(null);
        if (selectedProject) {
          const id = selectedProject._id || selectedProject.id;
          if (id) fetchProjectRoles(id);
        }
      } else {
        showToast(data.message || 'Failed to update role', 'error');
      }
    } catch (err: any) {
      console.error('Edit role error:', err);
      showToast('Error updating role assignment', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleConfirmRemoveAssignment = async () => {
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
        if (selectedProject) {
          const id = selectedProject._id || selectedProject.id;
          if (id) fetchProjectRoles(id);
        }
        loadProjects();
      } else {
        showToast(data.message || 'Failed to remove role assignment', 'error');
      }
    } catch (err: any) {
      console.error('Remove role assignment error:', err);
      showToast('Error removing role assignment', 'error');
    } finally {
      setRemovingRole(false);
    }
  };

  const filteredProjects = movies.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.language || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER BAR
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#090d1f]/90 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                Projects & Roles
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Production Assignments
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Assign registered MAYAD artists to production projects and manage their roles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          <button
            onClick={loadProjects}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SEARCH TOOLBAR
      ========================================================= */}
      <div className="bg-[#090d1f]/90 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search production projects by title, language, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-400 font-medium px-3 py-2 rounded-xl bg-slate-900 border border-white/5 shrink-0">
          Total Projects: <span className="font-bold text-amber-400">{filteredProjects.length}</span>
        </div>
      </div>

      {/* =========================================================
          PROJECT CARDS GRID
      ========================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-slate-900/60 border border-white/5 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="w-full h-44 bg-slate-800/60 rounded-xl" />
              <div className="space-y-2 mt-3">
                <div className="w-3/4 h-4 bg-slate-800/80 rounded" />
                <div className="w-1/2 h-3 bg-slate-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-12 text-center max-w-md mx-auto space-y-4">
          <FolderKanban className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Production Projects Found</h3>
          <p className="text-xs text-slate-400">
            {movies.length === 0
              ? 'No projects available in database.'
              : 'No title matches your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProjects.map((project) => {
            const pId = project._id || project.id || project.slug;
            const count = roleCounts[pId] || 0;

            return (
              <motion.div
                key={pId}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-[0_4px_25px_rgba(245,197,24,0.15)] flex flex-col justify-between"
              >
                {/* Poster Box */}
                <div className="relative aspect-[16/10] sm:aspect-[3/4] bg-slate-950 overflow-hidden">
                  <img
                    src={project.posterUrl || '/placeholder.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-black/60" />

                  {/* Top Status */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                      {project.type === 'series' ? 'TV Series' : 'Movie'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
                        project.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {project.year || 2026} • {project.language || 'Hindi'}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-max">
                      <Users className="w-3.5 h-3.5" />
                      <span>Assigned Artists: {count}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenViewProject(project)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(project)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Artist</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          VIEW PROJECT DETAILS MODAL / DRAWER
      ========================================================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 p-5 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-amber-400/40">
                  <Image
                    src={selectedProject.posterUrl || '/placeholder.jpg'}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedProject.title}</h2>
                  <p className="text-xs text-amber-400 font-semibold">
                    {selectedProject.year || 2026} • {selectedProject.language || 'Hindi'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Metadata */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  Project Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 font-semibold block">Production House:</span>
                    <span>{selectedProject.director || 'MAYAD Original Team'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Language:</span>
                    <span>{selectedProject.language || 'Hindi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Release Year:</span>
                    <span>{selectedProject.year || 2026}</span>
                  </div>
                </div>
                {selectedProject.description && (
                  <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-white/5 leading-relaxed">
                    {selectedProject.description}
                  </p>
                )}
              </div>

              {/* Assigned Artists Header & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    ASSIGNED ARTISTS ({projectRoles.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Registered MAYAD artists working on this project.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAssignModal(selectedProject)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
                >
                  <Plus className="h-4 w-4" /> + Assign Artist
                </button>
              </div>

              {/* Assigned Artists List */}
              {rolesLoading ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-950">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : projectRoles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center text-slate-400 text-xs space-y-3">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No artists assigned to this project yet.</p>
                  <button
                    type="button"
                    onClick={() => handleOpenAssignModal(selectedProject)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30"
                  >
                    + Assign Artist Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectRoles.map((r) => {
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
                                src={artistObj?.profilePhoto || '/placeholder.jpg'}
                                alt={artistName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{artistName}</h4>
                              <p className="text-xs font-semibold text-amber-400">
                                Role: <span className="text-white">{r.roleName}</span>
                                {r.characterName && r.characterName !== r.roleName && (
                                  <span className="text-slate-400"> ({r.characterName})</span>
                                )}
                              </p>
                              <span className="inline-block mt-1 text-[10px] font-bold uppercase text-slate-400 border border-white/10 rounded-md px-2 py-0.5">
                                {r.roleType} Role
                              </span>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-950/80 px-2 py-1 text-[10px] font-bold text-amber-400">
                            <Clock className="h-3 w-3" /> {r.roleStatus}
                          </span>
                        </div>

                        {r.productionInstructions && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2 rounded-lg">
                            "{r.productionInstructions}"
                          </p>
                        )}

                        {(r.shootingStartDate || r.shootingEndDate || r.shootingLocation) && (
                          <div className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                            {(r.shootingStartDate || r.shootingEndDate) && (
                              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>
                                  {r.shootingStartDate ? new Date(r.shootingStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                                  {' - '}
                                  {r.shootingEndDate ? new Date(r.shootingEndDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                                </span>
                              </div>
                            )}
                            {r.shootingLocation && (
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{r.shootingLocation}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRoleModal(r)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit Role
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
      )}

      {/* =========================================================
          ASSIGN ARTIST TO PROJECT MODAL
      ========================================================= */}
      {assigningToProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white">Assign Artist to Project</h3>
                <p className="text-xs text-amber-400 font-semibold">{assigningToProject.title}</p>
              </div>
              <button
                onClick={() => setAssigningToProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignArtistSubmit} className="space-y-4">
              {/* Artist Search & Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Artist *
                </label>

                {selectedArtist ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800 border border-amber-400/40">
                        <Image
                          src={selectedArtist.profilePhoto || '/placeholder.jpg'}
                          alt={selectedArtist.fullName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {selectedArtist.stageName || selectedArtist.fullName}
                          {selectedArtist.isVerified && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              Verified
                            </span>
                          )}
                        </h5>
                        <p className="text-[10px] text-emerald-400">
                          {selectedArtist.email} • {selectedArtist.category || 'Artist'}
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
                      value={artistSearchQuery}
                      onChange={(e) => handleSearchArtists(e.target.value)}
                      placeholder="Type registered artist name, email, category..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />

                    {searchArtists.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-slate-950 p-2 shadow-2xl space-y-1">
                        {searchArtists.map((artist) => (
                          <div
                            key={artist._id}
                            onClick={() => {
                              setSelectedArtist(artist);
                              setSearchArtists([]);
                              setArtistSearchQuery('');
                            }}
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10 cursor-pointer transition"
                          >
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-800">
                              <Image
                                src={artist.profilePhoto || '/placeholder.jpg'}
                                alt={artist.fullName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <h6 className="text-xs font-bold text-white flex items-center gap-1">
                                {artist.stageName || artist.fullName}
                                {artist.isVerified && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">
                                    Verified
                                  </span>
                                )}
                              </h6>
                              <p className="text-[10px] text-slate-400">
                                {artist.email} • {artist.category || 'Artist'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Categorized Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                <select
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs font-bold text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">-- Select Role --</option>
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

              {/* Shooting Schedule (Start & End Dates) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shooting Start Date
                  </label>
                  <input
                    type="date"
                    value={shootingStartDate}
                    onChange={(e) => setShootingStartDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shooting End Date
                  </label>
                  <input
                    type="date"
                    value={shootingEndDate}
                    onChange={(e) => setShootingEndDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shooting Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Shooting Location
                </label>
                <input
                  type="text"
                  value={shootingLocation}
                  onChange={(e) => setShootingLocation(e.target.value)}
                  placeholder="e.g. Rajasthan Sets, Film City Mumbai, Studio 3"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Character Name / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role / Character Notes (Optional)
                </label>
                <textarea
                  value={productionInstructions}
                  onChange={(e) => setProductionInstructions(e.target.value)}
                  placeholder="e.g. Lead Antagonist character, shooting scheduled in Jaipur Fort"
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAssigningToProject(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssignment}
                  className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                >
                  {submittingAssignment ? 'Assigning...' : 'Assign Artist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          EDIT ROLE MODAL
      ========================================================= */}
      {editingRole && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Edit Artist Role</h3>
              <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                <select
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                  required
                >
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

              {/* Shooting Schedule (Start & End Dates) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shooting Start Date
                  </label>
                  <input
                    type="date"
                    value={editShootingStartDate}
                    onChange={(e) => setEditShootingStartDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shooting End Date
                  </label>
                  <input
                    type="date"
                    value={editShootingEndDate}
                    onChange={(e) => setEditShootingEndDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shooting Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Shooting Location
                </label>
                <input
                  type="text"
                  value={editShootingLocation}
                  onChange={(e) => setEditShootingLocation(e.target.value)}
                  placeholder="e.g. Rajasthan Sets, Film City Mumbai, Studio 3"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Notes / Instructions</label>
                <textarea
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                >
                  {submittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          REMOVE ASSIGNMENT CONFIRMATION MODAL
      ========================================================= */}
      {roleToRemove && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Remove Artist Assignment?</h3>
                <p className="text-xs text-slate-400">
                  This will remove the artist from this project. The artist account will NOT be deleted.
                </p>
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
              <p>Role: {roleToRemove.roleName}</p>
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
                onClick={handleConfirmRemoveAssignment}
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
