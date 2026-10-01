'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Film,
  FolderKanban,
  MessageSquare,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Eye,
  Filter,
  AlertTriangle,
  Award,
  Calendar,
  Building,
  Info,
  Camera,
  Briefcase,
  Trash2,
  BookOpen,
  Plus,
  UserPlus,
} from 'lucide-react';
import {
  adminService,
  AdminUser,
  AdminDashboardStats,
  AdminAnalyticsData,
  AdminRecentActivity,
  AdminArtistRecord,
} from '@/services/adminService';
import { MOVIES_LIST } from '@/data/movie';
import AdminMoviesManagement from '@/components/AdminMoviesManagement';
import AdminProjectsRoles from '@/components/AdminProjectsRoles';
import AdminMediaModeration from '@/components/AdminMediaModeration';
import AdminInquiriesManagement from '@/components/AdminInquiriesManagement';
import AdminCareerManagement from '@/components/AdminCareerManagement';
import AdminBlogsManagement from '@/components/AdminBlogsManagement';
import AdminAddArtistManagement from '@/components/AdminAddArtistManagement';
export default function AdminDashboardPage() {
  const router = useRouter();
  // Admin Profile & Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Layout State
  const [activeTab, setActiveTab] = useState<
   'overview' | 'movies' | 'media' | 'artists' | 'add-artist' | 'projects-roles' | 'career' | 'blogs' | 'inquiries' | 'profile' | 'settings'
  >('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Data & Stats State
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<AdminRecentActivity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  // Artists Management State
  const [artists, setArtists] = useState<AdminArtistRecord[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState<AdminArtistRecord | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Artist Deletion Confirmation State
  const [artistToDelete, setArtistToDelete] = useState<AdminArtistRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add Artist Modal State
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [addArtistSubmitting, setAddArtistSubmitting] = useState(false);
  const [newArtistData, setNewArtistData] = useState({
    fullName: '',
    stageName: '',
    category: 'Actor',
    secondaryCategory: '',
    email: '',
    phone: '',
    location: 'Rajasthan',
    experience: '5+ Years',
    profilePhoto: '',
    bio: '',
    languages: 'Rajasthani, Hindi',
    showreel: '',
    imdb: '',
    instagram: '',
  });

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistData.fullName.trim()) {
      showToast('Artist Full Name is required', 'error');
      return;
    }

    try {
      setAddArtistSubmitting(true);
      const languagesArr = newArtistData.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const res = await adminService.createArtist({
        fullName: newArtistData.fullName,
        stageName: newArtistData.stageName,
        category: newArtistData.category,
        secondaryCategory: newArtistData.secondaryCategory,
        email: newArtistData.email,
        phone: newArtistData.phone,
        location: newArtistData.location,
        experience: newArtistData.experience,
        profilePhoto: newArtistData.profilePhoto,
        bio: newArtistData.bio,
        languages: languagesArr,
        showreel: newArtistData.showreel,
        imdb: newArtistData.imdb,
        instagram: newArtistData.instagram,
      });

      if (res.success) {
        showToast('Artist added successfully and published to /artists directory!');
        setIsAddArtistModalOpen(false);
        setNewArtistData({
          fullName: '',
          stageName: '',
          category: 'Actor',
          secondaryCategory: '',
          email: '',
          phone: '',
          location: 'Rajasthan',
          experience: '5+ Years',
          profilePhoto: '',
          bio: '',
          languages: 'Rajasthani, Hindi',
          showreel: '',
          imdb: '',
          instagram: '',
        });
        loadArtistsData();
        loadDashboardStats();
      } else {
        showToast(res.message || 'Failed to add artist', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to add artist', 'error');
    } finally {
      setAddArtistSubmitting(false);
    }
  };
  // Toasts / Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };
  // 1. Authenticate & Load Admin Profile
  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const res = await adminService.getMe();
        if (res.success && (res.admin || res.user)) {
          setAdminUser((res.admin || res.user) as AdminUser);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAdminSession();
  }, [router]);
  // 2. Fetch Dashboard Statistics
  const loadDashboardStats = async () => {
    setDataLoading(true);
    try {
      const res = await adminService.getStats();
      if (res.success) {
        setStats(res.stats);
        setAnalytics(res.analytics);
        setRecentActivity(res.recentActivity || []);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setDataLoading(false);
    }
  };
  // 3. Fetch Artists Table Data
  const loadArtistsData = async () => {
    setArtistsLoading(true);
    try {
     const res = await adminService.getArtists({
  page: currentPage,
  limit: 10,
  search: searchQuery,
  ...(statusFilter !== "all" && {
    status: statusFilter,
  }),
});
      if (res.success) {
        setArtists(res.artists);
        setTotalPages(res.pagination.pages);
      }
    } catch (err: any) {
      console.error('Error loading artists:', err);
      showToast('Failed to load artists data', 'error');
    } finally {
      setArtistsLoading(false);
    }
  };
  useEffect(() => {
    if (!authLoading && adminUser) {
      loadDashboardStats();
    }
  }, [authLoading, adminUser]);
  useEffect(() => {
    if (!authLoading && adminUser && activeTab === 'artists') {
      loadArtistsData();
    }
  }, [activeTab, currentPage, statusFilter, authLoading, adminUser]);
  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadArtistsData();
  };

  // Handle Artist Account Deletion
  const handleDeleteArtist = async () => {
    if (!artistToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await adminService.deleteArtist(artistToDelete.id);
      if (res.success) {
        showToast(res.message || 'Artist account removed successfully.');
        if (selectedArtist && selectedArtist.id === artistToDelete.id) {
          setSelectedArtist(null);
        }
        setArtistToDelete(null);
        loadArtistsData();
        loadDashboardStats();
      } else {
        showToast(res.message || 'Failed to remove artist account.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove artist account.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };
  // Handle Artist Status Approval / Rejection
  const handleUpdateStatus = async (
    id: string,
    accountStatus: 'Approved' | 'Rejected' | 'Pending Approval'
  ) => {
    setActionLoadingId(id);
    try {
      const res = await adminService.updateArtistStatus(
        id,
        accountStatus,
        accountStatus === 'Approved'
      );
      if (res.success) {
        showToast(`Artist application updated to ${accountStatus}`);
        loadArtistsData();
        loadDashboardStats();
        if (selectedArtist && selectedArtist.id === id) {
          setSelectedArtist({
            ...selectedArtist,
            accountStatus,
            isVerified: accountStatus === 'Approved',
          });
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update artist status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };
  // Handle Logout
  const handleLogout = async () => {
    await adminService.logout();
    router.push('/admin/login');
  };
  // Render Full Screen Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#03050c] flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
          <ShieldCheck className="w-6 h-6 text-amber-400 absolute" />
        </div>
        <h2 className="text-xl font-bold tracking-wide text-amber-300">Verifying Admin Credentials...</h2>
        <p className="text-slate-500 text-xs mt-1">Establishing encrypted session with MAYAD servers</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#03050c] text-slate-100 flex flex-col md:flex-row font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl text-sm font-medium ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#070b19] transition-all duration-300 relative z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(245,197,24,0.3)]">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-white">MAYAD <span className="text-amber-400">ADMIN</span></span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">Executive Panel</span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-extrabold text-base shadow-[0_0_15px_rgba(245,197,24,0.3)]">
              M
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'movies', label: 'Movies Management', icon: Film },
            { id: 'media', label: 'Media Moderation', icon: Camera },
            { id: 'artists', label: 'Artists Accounts', icon: Users, badge: stats?.pendingApprovals },
            { id: 'add-artist', label: 'Add Artist', icon: UserPlus },
            { id: 'projects-roles', label: 'Projects & Roles', icon: FolderKanban },
            { id: 'career', label: 'Career Management', icon: Briefcase },
            { id: 'blogs', label: 'Blogs Management', icon: BookOpen },
            { id: 'inquiries', label: 'Contacts / Inquiries', icon: MessageSquare },
            { id: 'profile', label: 'Admin Profile', icon: ShieldCheck },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30 font-semibold shadow-[0_0_20px_rgba(245,197,24,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'group-hover:text-amber-300'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {/* Badge if pending */}
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-sm">
                    {item.badge}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        {/* Logout Option */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      {/* =========================================================
          MOBILE DRAWER SIDEBAR
      ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#070b19] border-r border-white/10 z-50 p-4 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-extrabold text-sm">
                    M
                  </div>
                  <span className="font-extrabold text-sm text-white">MAYAD <span className="text-amber-400">ADMIN</span></span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'movies', label: 'Movies Management', icon: Film },
                  { id: 'media', label: 'Media Moderation', icon: Camera },
                  { id: 'artists', label: 'Artists Accounts', icon: Users, badge: stats?.pendingApprovals },
                  { id: 'add-artist', label: 'Add Artist', icon: UserPlus },
                  { id: 'projects-roles', label: 'Projects & Roles', icon: FolderKanban },
                  { id: 'career', label: 'Career Management', icon: Briefcase },
                  { id: 'blogs', label: 'Blogs Management', icon: BookOpen },
                  { id: 'inquiries', label: 'Contacts / Inquiries', icon: MessageSquare },
                  { id: 'profile', label: 'Admin Profile', icon: ShieldCheck },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-amber-400" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* =========================================================
          MAIN CONTENT AREA
      ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-[#070b19]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-white capitalize">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'movies' && 'Movies & Series Management'}
                {activeTab === 'media' && 'Artist Media Moderation'}
                {activeTab === 'artists' && 'Artist Directory & Approvals'}
                {activeTab === 'add-artist' && 'Add Artist & Directory Management'}
                {activeTab === 'projects-roles' && 'Projects & Roles'}
                {activeTab === 'career' && 'Career Management'}
                {activeTab === 'blogs' && 'Blogs & Articles Management'}
                {activeTab === 'inquiries' && 'Contacts & Inquiries'}
                {activeTab === 'profile' && 'Administrator Profile'}
                {activeTab === 'settings' && 'System Settings'}
              </h2>
              <span className="text-[11px] text-slate-400 hidden sm:block">MAYAD OTT Administrative Console</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardStats}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-amber-400 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            {/* Admin Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black font-extrabold flex items-center justify-center text-xs shadow-md">
                {adminUser?.firstName?.[0] || 'A'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white">{adminUser?.firstName} {adminUser?.lastName}</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Super Admin</span>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content Body */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* =====================================================
              TAB 1: OVERVIEW
          ===================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* 1. Total Artists */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl bg-[#090d1f]/90 border border-amber-500/20 p-5 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Artists</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      {dataLoading ? '...' : stats?.totalArtists ?? 0}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Registered on MAYAD platform</span>
                    </p>
                  </div>
                </motion.div>
                {/* 2. Verified Artists */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl bg-[#090d1f]/90 border border-emerald-500/20 p-5 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Artists</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300">
                      {dataLoading ? '...' : stats?.verifiedArtists ?? 0}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified credentials badge</span>
                    </p>
                  </div>
                </motion.div>
                {/* Total Movies */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl bg-[#090d1f]/90 border border-blue-500/20 p-5 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Movies</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Film className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-300">
                      {dataLoading ? '...' : (stats?.totalMovies ?? MOVIES_LIST.length)}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Available on MAYAD platform</span>
                    </p>
                  </div>
                </motion.div>
                {/* 3. Pending Approvals */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl bg-[#090d1f]/90 border border-amber-400/30 p-5 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Pending Approvals</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 animate-pulse">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                      {dataLoading ? '...' : stats?.pendingApprovals ?? 0}
                    </span>
                    <p className="text-xs text-amber-300/80 mt-1">
                      Requires administrator review
                    </p>
                  </div>
                </motion.div>
                {/* 6. New Inquiries */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-5 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)] opacity-90"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">New Inquiries</span>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-300">0</span>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>No inquiries DB connected</span>
                    </p>
                  </div>
                </motion.div>
              </div>
              {/* Charts & Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart (2 Cols) */}
                <div className="lg:col-span-2 rounded-2xl bg-[#090d1f]/90 border border-white/10 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span>Artist Registration Trends</span>
                      </h3>
                      <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-white/10">Real-Time Data</span>
                    </div>
                    {/* SVG Line Chart */}
                    <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-white/10">
                      {analytics?.artistTrend && analytics.artistTrend.length > 0 ? (
                        analytics.artistTrend.map((item, idx) => {
                          const maxCount = Math.max(...analytics.artistTrend.map((t) => t.count), 5);
                          const heightPercent = Math.max((item.count / maxCount) * 100, 15);
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                              <span className="text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.count}
                              </span>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="w-full max-w-[40px] bg-gradient-to-t from-amber-500/20 via-amber-500/60 to-yellow-400 rounded-t-lg group-hover:from-amber-400 group-hover:to-yellow-300 transition-all shadow-[0_0_15px_rgba(245,197,24,0.2)]"
                              />
                              <span className="text-[10px] text-slate-400 truncate w-full text-center">{item.month}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                          <span>No historical trends recorded yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Source: MAYAD MongoDB Artist Aggregations</span>
                    <button
                      onClick={() => setActiveTab('artists')}
                      className="text-amber-400 hover:underline font-semibold text-xs"
                    >
                      Manage Artists →
                    </button>
                  </div>
                </div>
                {/* Status Breakdown Donut/Bar Chart (1 Col) */}
                <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-4">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Account Status Ratio</span>
                    </h3>
                    <div className="space-y-4 my-6">
                      {/* Approved */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Approved</span>
                          <span>{stats?.approvedArtists ?? 0}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-500"
                            style={{
                              width: `${
                                stats?.totalArtists ? ((stats.approvedArtists / stats.totalArtists) * 100) : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      {/* Pending */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Pending Approval</span>
                          <span>{stats?.pendingApprovals ?? 0}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 transition-all duration-500"
                            style={{
                              width: `${
                                stats?.totalArtists ? ((stats.pendingApprovals / stats.totalArtists) * 100) : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      {/* Rejected */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Rejected</span>
                          <span>{stats?.rejectedArtists ?? 0}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-400 transition-all duration-500"
                            style={{
                              width: `${
                                stats?.totalArtists ? ((stats.rejectedArtists / stats.totalArtists) * 100) : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] text-slate-400">
                    <span>Pending applications require administrative verification before artists appear in public listings.</span>
                  </div>
                </div>
              </div>
              {/* Recent Activity Table */}
              <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Recent Artist Registrations & Updates</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('artists')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View All Artists
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Artist</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Registered Date</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((act) => (
                          <tr key={act.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-semibold text-white">{act.title}</td>
                            <td className="py-3 px-4 text-slate-400">{act.subtitle}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  act.status === 'Approved'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : act.status === 'Rejected'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {act.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {new Date(act.timestamp).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setActiveTab('artists')}
                                className="text-amber-400 hover:text-amber-300 text-xs font-semibold"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                            No recent activity found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* =====================================================
              TAB: MOVIES & SERIES MANAGEMENT
          ===================================================== */}
          {activeTab === 'movies' && (
            <AdminMoviesManagement showToast={showToast} onStatsUpdate={loadDashboardStats} />
          )}
          {activeTab === 'media' && (
            <AdminMediaModeration />
          )}
          {/* =====================================================
              TAB 2: ARTISTS MANAGEMENT DIRECTORY
          ===================================================== */}
          {activeTab === 'artists' && (
            <div className="space-y-6">

              {/* Header Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-[#090d1f]/90 border border-white/10 p-4">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by artist name, email, category, location..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </form>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-2 rounded-xl">
                    <Filter className="w-4 h-4 text-amber-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-transparent text-xs sm:text-sm font-medium text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-900 text-slate-200">All Statuses</option>
                      <option value="Pending Approval" className="bg-slate-900 text-amber-300">Pending Approval</option>
                      <option value="Approved" className="bg-slate-900 text-emerald-300">Approved</option>
                      <option value="Rejected" className="bg-slate-900 text-rose-300">Rejected</option>
                    </select>
                  </div>
                  <button
                    onClick={loadArtistsData}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Reload"
                  >
                    <RefreshCw className={`w-4 h-4 ${artistsLoading ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
              {/* Data Table */}
              <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-4 px-4">Artist Profile</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Contact</th>
                        <th className="py-4 px-4">Location</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {artistsLoading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              <span>Fetching artist records...</span>
                            </div>
                          </td>
                        </tr>
                      ) : artists.length > 0 ? (
                        artists.map((artist) => (
                          <tr key={artist.id} className="hover:bg-slate-800/30 transition-colors">
                            {/* Profile Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/30 overflow-hidden shrink-0 flex items-center justify-center font-bold text-amber-400">
                                  {artist.fullName?.[0] || 'A'}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-white truncate flex items-center gap-1.5">
                                    {artist.fullName}
                                    {artist.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />}
                                  </span>
                                  {artist.stageName && (
                                    <span className="text-[11px] text-amber-300/80">Stage: {artist.stageName}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            {/* Category */}
                            <td className="py-3 px-4 font-medium text-slate-200">
                              {artist.category}
                              {artist.secondaryCategory && (
                                <span className="block text-[10px] text-slate-500">{artist.secondaryCategory}</span>
                              )}
                            </td>
                            {/* Contact */}
                            <td className="py-3 px-4 text-xs">
                              <div className="text-slate-300 truncate max-w-[180px]">{artist.email}</div>
                              <div className="text-slate-500">{artist.phone}</div>
                            </td>
                            {/* Location */}
                            <td className="py-3 px-4 text-slate-400 text-xs">{artist.location || 'Rajasthan'}</td>
                            {/* Status */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  artist.accountStatus === 'Approved'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : artist.accountStatus === 'Rejected'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {artist.accountStatus}
                              </span>
                            </td>
                            {/* Actions */}
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedArtist(artist)}
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                  title="View Full Profile"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {artist.accountStatus !== 'Approved' && (
                                  <button
                                    onClick={() => handleUpdateStatus(artist.id, 'Approved')}
                                    disabled={actionLoadingId === artist.id}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold transition-colors disabled:opacity-50"
                                    title="Approve Artist"
                                  >
                                    Approve
                                  </button>
                                )}
                                {artist.accountStatus !== 'Rejected' && (
                                  <button
                                    onClick={() => handleUpdateStatus(artist.id, 'Rejected')}
                                    disabled={actionLoadingId === artist.id}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold transition-colors disabled:opacity-50"
                                    title="Reject Artist"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => setArtistToDelete(artist)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                                  title="Remove Artist Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                            No artists matching filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-t border-white/10 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-white disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-white disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* =====================================================
              TAB: ADD ARTIST & DIRECTORY MANAGEMENT
          ===================================================== */}
          {activeTab === 'add-artist' && (
            <AdminAddArtistManagement showToast={showToast} onStatsUpdate={loadDashboardStats} />
          )}
          {/* =====================================================
              TAB: PROJECTS & ROLES
          ===================================================== */}
          {activeTab === 'projects-roles' && (
            <AdminProjectsRoles showToast={showToast} onStatsUpdate={loadDashboardStats} />
          )}
          {/* =====================================================
              TAB: CAREER MANAGEMENT
          ===================================================== */}
          {activeTab === 'career' && (
            <AdminCareerManagement />
          )}
          {/* =====================================================
              TAB: BLOGS MANAGEMENT
          ===================================================== */}
          {activeTab === 'blogs' && (
            <AdminBlogsManagement showToast={showToast} onStatsUpdate={loadDashboardStats} />
          )}
          {/* =====================================================
              TAB: INQUIRIES & CONTACTS MANAGEMENT
          ===================================================== */}
          {activeTab === 'inquiries' && (
            <AdminInquiriesManagement />
          )}
          {/* =====================================================
              TAB: ADMIN PROFILE
          ===================================================== */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl bg-[#090d1f]/90 border border-amber-500/20 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black font-extrabold flex items-center justify-center text-2xl shadow-xl">
                  {adminUser?.firstName?.[0] || 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{adminUser?.firstName} {adminUser?.lastName}</h3>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">MAYAD Platform Super Administrator</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-slate-200">{adminUser?.email}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Role Privilege</span>
                  <span className="font-semibold text-amber-300">{adminUser?.role?.toUpperCase()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Session Security</span>
                  <span className="font-semibold text-emerald-400">JWT HTTP-Only Secured</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Account ID</span>
                  <span className="font-mono text-xs text-slate-400">{adminUser?.id}</span>
                </div>
              </div>
            </div>
          )}
          {/* =====================================================
              TAB: SETTINGS
          ===================================================== */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl bg-[#090d1f]/90 border border-white/10 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>Governance & Security Configuration</span>
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-white/5">
                  <div>
                    <div className="font-bold text-white">Require Admin Secret Key</div>
                    <div className="text-slate-500 text-xs">Prevent public signups by requiring server secret authorization</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-white/5">
                  <div>
                    <div className="font-bold text-white">HTTP-Only Cookie Authentication</div>
                    <div className="text-slate-500 text-xs">Protect authentication tokens against XSS attacks</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* =========================================================
          ARTIST PROFILE DETAIL MODAL
      ========================================================= */}
      <AnimatePresence>
        {selectedArtist && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtist(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-[#090d1f] border border-amber-500/30 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-amber-400 flex items-center justify-center font-bold text-amber-400 text-xl">
                    {selectedArtist.fullName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedArtist.fullName}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{selectedArtist.category}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedArtist(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
                  <div><strong className="text-slate-500 block">Email:</strong> {selectedArtist.email}</div>
                  <div><strong className="text-slate-500 block">Phone:</strong> {selectedArtist.phone}</div>
                  <div><strong className="text-slate-500 block">Location:</strong> {selectedArtist.location}</div>
                  <div><strong className="text-slate-500 block">Experience:</strong> {selectedArtist.experience || 'N/A'}</div>
                </div>
                <div>
                  <strong className="text-slate-400 block mb-1">Biography:</strong>
                  <p className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-slate-300 leading-relaxed">
                    {selectedArtist.bio || 'No biography provided.'}
                  </p>
                </div>
                {selectedArtist.languages && selectedArtist.languages.length > 0 && (
                  <div>
                    <strong className="text-slate-400 block mb-1">Languages:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedArtist.languages.map((lang, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
                {selectedArtist.accountStatus !== 'Approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedArtist.id, 'Approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                  >
                    Approve Application
                  </button>
                )}
                {selectedArtist.accountStatus !== 'Rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedArtist.id, 'Rejected')}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
                  >
                    Reject Application
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Artist Modal */}
      <AnimatePresence>
        {isAddArtistModalOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090d1f] border border-amber-500/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">Add New Artist</h3>
                </div>
                <button
                  onClick={() => setIsAddArtistModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateArtist} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newArtistData.fullName}
                      onChange={(e) => setNewArtistData({ ...newArtistData, fullName: e.target.value })}
                      placeholder="e.g. Ravindra Mewadi"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stage Name / Screen Name</label>
                    <input
                      type="text"
                      value={newArtistData.stageName}
                      onChange={(e) => setNewArtistData({ ...newArtistData, stageName: e.target.value })}
                      placeholder="e.g. Ravindra Singh"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category / Role *</label>
                    <select
                      value={newArtistData.category}
                      onChange={(e) => setNewArtistData({ ...newArtistData, category: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Actor">Actor / Actress</option>
                      <option value="Singer">Singer / Vocalist</option>
                      <option value="Director">Director</option>
                      <option value="Model">Model</option>
                      <option value="Producer">Producer</option>
                      <option value="Dancer">Dancer / Choreographer</option>
                      <option value="Music Composer">Music Composer</option>
                      <option value="Writer">Writer / Scriptwriter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Secondary Category</label>
                    <input
                      type="text"
                      value={newArtistData.secondaryCategory}
                      onChange={(e) => setNewArtistData({ ...newArtistData, secondaryCategory: e.target.value })}
                      placeholder="e.g. Action Director, Singer"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Profile Photo URL</label>
                    <input
                      type="text"
                      value={newArtistData.profilePhoto}
                      onChange={(e) => setNewArtistData({ ...newArtistData, profilePhoto: e.target.value })}
                      placeholder="/historical.jpg or https://..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location / City</label>
                    <input
                      type="text"
                      value={newArtistData.location}
                      onChange={(e) => setNewArtistData({ ...newArtistData, location: e.target.value })}
                      placeholder="Jaipur, Rajasthan"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Experience</label>
                    <input
                      type="text"
                      value={newArtistData.experience}
                      onChange={(e) => setNewArtistData({ ...newArtistData, experience: e.target.value })}
                      placeholder="5+ Years"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Languages (Comma Separated)</label>
                    <input
                      type="text"
                      value={newArtistData.languages}
                      onChange={(e) => setNewArtistData({ ...newArtistData, languages: e.target.value })}
                      placeholder="Rajasthani, Hindi, English"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Biography / About</label>
                  <textarea
                    rows={3}
                    value={newArtistData.bio}
                    onChange={(e) => setNewArtistData({ ...newArtistData, bio: e.target.value })}
                    placeholder="Brief description of artist's background and notable works..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">Showreel URL</label>
                    <input
                      type="text"
                      value={newArtistData.showreel}
                      onChange={(e) => setNewArtistData({ ...newArtistData, showreel: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">IMDb Profile</label>
                    <input
                      type="text"
                      value={newArtistData.imdb}
                      onChange={(e) => setNewArtistData({ ...newArtistData, imdb: e.target.value })}
                      placeholder="https://imdb.com/..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">Instagram Handle</label>
                    <input
                      type="text"
                      value={newArtistData.instagram}
                      onChange={(e) => setNewArtistData({ ...newArtistData, instagram: e.target.value })}
                      placeholder="@artist_name"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddArtistModalOpen(false)}
                    disabled={addArtistSubmitting}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addArtistSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {addArtistSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Save & Publish Artist</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Account Confirmation Modal */}
      <AnimatePresence>
        {artistToDelete && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090d1f] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 relative z-10"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Remove Artist Account?</h3>
                  <p className="text-xs text-rose-300/80 font-medium">{artistToDelete.fullName} ({artistToDelete.email})</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This action will permanently remove this artist account and its associated artist data. This cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setArtistToDelete(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteArtist}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {deleteLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
