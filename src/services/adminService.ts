// ============================================================
// MAYAD ADMIN — FRONTEND SERVICE
// Client API layer for Admin Auth, Dashboard Stats & Artist Management
// ============================================================

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const ADMIN_API_URL = `${API_BASE_URL}/admin`;

// Token storage key
const TOKEN_KEY = 'mayad_admin_token';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin';
  createdAt?: string;
}

export interface AdminRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
  phone?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AdminUser;
  admin?: AdminUser;
}

export interface AdminArtistRecord {
  id: string;
  fullName: string;
  stageName?: string;
  email: string;
  phone: string;
  category: string;
  secondaryCategory?: string;
  experience?: string;
  location: string;
  languages?: string[];
  bio: string;
  profilePhoto?: string;
  showreel?: string;
  imdb?: string;
  instagram?: string;
  isVerified: boolean;
  accountStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface AdminMovieRecord {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  movieUrl?: string;
  videoUrl?: string;
  type: 'movie' | 'series';
  category?: string;
  language?: string;
  year?: number;
  duration?: string;
  genre?: string;
  genres: string[];
  description?: string;
  cast: string[];
  director?: string;
  isOriginal: boolean;
  isTrending: boolean;
  isTop5: boolean;
  isPublished: boolean;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDashboardStats {
  totalArtists: number;
  verifiedArtists: number;
  pendingApprovals: number;
  approvedArtists: number;
  rejectedArtists: number;
  totalUsers: number;
  totalMovies?: number;
  castingApplications: { count: number; connected: boolean; message: string };
  activeProjects: { count: number; connected: boolean; message: string };
  newInquiries: { count: number; connected: boolean; message: string };
}

export interface AdminAnalyticsData {
  artistTrend: { month: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export interface AdminRecentActivity {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  isVerified: boolean;
  timestamp: string;
  type: string;
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminDashboardStats;
  analytics: AdminAnalyticsData;
  recentActivity: AdminRecentActivity[];
}

export interface AdminArtistsResponse {
  success: boolean;
  artists: AdminArtistRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Token helper
export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAdminToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const adminService = {
  // 1. REGISTER ADMIN
  register: async (payload: AdminRegisterPayload): Promise<AdminAuthResponse> => {
    const response = await fetch(`${ADMIN_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Admin registration failed');
    }

    if (data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  // 2. LOGIN ADMIN
  login: async (payload: AdminLoginPayload): Promise<AdminAuthResponse> => {
    const response = await fetch(`${ADMIN_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Admin login failed');
    }

    if (data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  // 3. GET LOGGED IN ADMIN
  getMe: async (): Promise<AdminAuthResponse> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${ADMIN_API_URL}/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to authenticate admin session');
    }
    return data;
  },

  // 4. LOGOUT ADMIN
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      await fetch(`${ADMIN_API_URL}/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      removeAdminToken();
    }

    return { success: true, message: 'Logged out' };
  },

  // 5. GET DASHBOARD STATS & ANALYTICS
  getStats: async (): Promise<AdminStatsResponse> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${ADMIN_API_URL}/stats`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to load admin stats');
    }
    return data;
  },

  // 6. GET ARTISTS
  getArtists: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}): Promise<AdminArtistsResponse> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${ADMIN_API_URL}/artists?${queryParams.toString()}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch artist records');
    }
    return data;
  },

  // 7. UPDATE ARTIST STATUS
  updateArtistStatus: async (
    id: string,
    accountStatus: 'Pending Approval' | 'Approved' | 'Rejected',
    isVerified?: boolean
  ): Promise<{ success: boolean; message: string; artist: AdminArtistRecord }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${ADMIN_API_URL}/artists/${id}/status`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ accountStatus, isVerified }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update artist status');
    }
    return data;
  },

  // 8. DELETE ARTIST ACCOUNT
  deleteArtist: async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${ADMIN_API_URL}/artists/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to remove artist account');
    }
    return data;
  },

  // 8. GET ARTIST DETAIL
  getArtistDetail: async (id: string): Promise<{ success: boolean; artist: AdminArtistRecord }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${ADMIN_API_URL}/artists/${id}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch artist detail');
    }
    return data;
  },

  // 9. GET ALL MOVIES (ADMIN)
  getAdminMovies: async (): Promise<{ success: boolean; count: number; movies: AdminMovieRecord[] }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies/admin/all`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch movies list');
    }
    return data;
  },

  // 10. CREATE MOVIE / SERIES (ADMIN)
  createMovie: async (movieData: Partial<AdminMovieRecord>): Promise<{ success: boolean; message: string; movie: AdminMovieRecord }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies/admin`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(movieData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to add movie');
    }
    return data;
  },

  // 11. UPDATE MOVIE / SERIES (ADMIN)
  updateMovie: async (id: string, movieData: Partial<AdminMovieRecord>): Promise<{ success: boolean; message: string; movie: AdminMovieRecord }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies/admin/${id}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(movieData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update movie');
    }
    return data;
  },

  // 12. DELETE MOVIE / SERIES (ADMIN)
  deleteMovie: async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies/admin/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to delete movie');
    }
    return data;
  },
};
