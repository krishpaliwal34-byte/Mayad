'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Language, translations } from '@/data/translations';

// ============================================================
// TYPES
// ============================================================

interface VideoItem {
  id: string;
  title?: string;
  [key: string]: any;
}

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['ENG']) => string;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Video
  isVideoOpen: boolean;
  activeVideoItem: VideoItem | null;
  playVideo: (item: VideoItem) => void;
  closeVideo: () => void;

  // Login
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;

  // Subscribe
  isSubscribeOpen: boolean;
  openSubscribe: () => void;
  closeSubscribe: () => void;

  // My List
  myList: string[];
  toggleMyList: (id: string) => Promise<void>;
  isInMyList: (id: string) => boolean;
}

// ============================================================
// CONTEXT
// ============================================================

const AppContext = createContext<
  AppContextType | undefined
>(undefined);

// ============================================================
// API URL
// ============================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

// ============================================================
// PROVIDER
// ============================================================

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ==========================================================
  // LANGUAGE STATE
  // ==========================================================

  const [language, setLanguageState] =
    useState<Language>('ENG');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang =
        localStorage.getItem(
          'mayad_language'
        ) as Language;

      if (
        savedLang === 'ENG' ||
        savedLang === 'RAJ'
      ) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'mayad_language',
        lang
      );
    }
  };

  const toggleLanguage = () => {
    const nextLang =
      language === 'ENG'
        ? 'RAJ'
        : 'ENG';

    setLanguage(nextLang);
  };

  const t = (
    key: keyof typeof translations['ENG']
  ): string => {
    return (
      translations[language]?.[key] ||
      translations['ENG'][key] ||
      String(key)
    );
  };

  // ==========================================================
  // SEARCH STATE
  // ==========================================================

  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // ==========================================================
  // VIDEO STATE
  // ==========================================================

  const [isVideoOpen, setIsVideoOpen] =
    useState(false);

  const [activeVideoItem, setActiveVideoItem] =
    useState<VideoItem | null>(null);

  const playVideo = (
    item: VideoItem
  ) => {
    setActiveVideoItem(item);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setActiveVideoItem(null);
  };

  // ==========================================================
  // LOGIN STATE
  // ==========================================================

  const [isLoginOpen, setIsLoginOpen] =
    useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  // ==========================================================
  // SUBSCRIBE STATE
  // ==========================================================

  const [isSubscribeOpen, setIsSubscribeOpen] =
    useState(false);

  const openSubscribe = () => {
    setIsSubscribeOpen(true);
  };

  const closeSubscribe = () => {
    setIsSubscribeOpen(false);
  };

  // ==========================================================
  // MY LIST STATE
  // ==========================================================

  const [myList, setMyList] =
    useState<string[]>([]);

  // ==========================================================
  // GET TOKEN
  // ==========================================================

  const getToken = (): string | null => {
    if (
      typeof window === 'undefined'
    ) {
      return null;
    }

    return localStorage.getItem(
      'mayad_token'
    );
  };

  // ==========================================================
  // LOAD WATCHLIST FROM BACKEND
  // ==========================================================

  const loadMyList = async () => {
    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    const token = getToken();

    // User logged out
    if (!token) {
      setMyList([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/watchlist`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },
        }
      );

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          setMyList([]);
        }

        return;
      }

      const data =
        await response.json();

      if (
        data.success &&
        Array.isArray(data.watchlist)
      ) {
        setMyList(
          data.watchlist.map(
            (slug: unknown) =>
              String(slug)
          )
        );
      } else {
        setMyList([]);
      }
    } catch (error) {
      console.error(
        'Error loading MAYAD watchlist:',
        error
      );
    }
  };

  // ==========================================================
  // INITIAL LOAD + AUTH CHANGE
  // ==========================================================

  useEffect(() => {
    loadMyList();

    const handleAuthChange = () => {
      loadMyList();
    };

    window.addEventListener(
      'mayad-auth-change',
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        'mayad-auth-change',
        handleAuthChange
      );
    };
  }, []);

  // ==========================================================
  // ADD TO WATCHLIST
  // ==========================================================

  const addToWatchlist = async (
    slug: string
  ): Promise<string[] | null> => {
    const token = getToken();

    if (!token) {
      console.warn(
        'Please login to use My List.'
      );

      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/watchlist`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            slug,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          'Add Watchlist Error:',
          data.message
        );

        return null;
      }

      if (
        data.success &&
        Array.isArray(data.watchlist)
      ) {
        return data.watchlist.map(
          (item: unknown) =>
            String(item)
        );
      }

      return null;
    } catch (error) {
      console.error(
        'Add Watchlist API Error:',
        error
      );

      return null;
    }
  };

  // ==========================================================
  // REMOVE FROM WATCHLIST
  // ==========================================================

  const removeFromWatchlist = async (
    slug: string
  ): Promise<string[] | null> => {
    const token = getToken();

    if (!token) {
      console.warn(
        'Please login to use My List.'
      );

      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/watchlist/${encodeURIComponent(
          slug
        )}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          'Remove Watchlist Error:',
          data.message
        );

        return null;
      }

      if (
        data.success &&
        Array.isArray(data.watchlist)
      ) {
        return data.watchlist.map(
          (item: unknown) =>
            String(item)
        );
      }

      return null;
    } catch (error) {
      console.error(
        'Remove Watchlist API Error:',
        error
      );

      return null;
    }
  };

  // ==========================================================
  // TOGGLE MY LIST
  // ==========================================================

  const toggleMyList = async (
    id: string
  ): Promise<void> => {
    const movieSlug = String(id);

    const token = getToken();

    // Login required
    if (!token) {
      console.warn(
        'Please login to use My List.'
      );

      return;
    }

    const alreadyInList =
      myList.includes(movieSlug);

    // ========================================================
    // REMOVE
    // ========================================================

    if (alreadyInList) {
      const updatedList =
        await removeFromWatchlist(
          movieSlug
        );

      if (updatedList) {
        setMyList(updatedList);
      }

      return;
    }

    // ========================================================
    // ADD
    // ========================================================

    const updatedList =
      await addToWatchlist(
        movieSlug
      );

    if (updatedList) {
      setMyList(updatedList);
    }
  };

  // ==========================================================
  // CHECK MY LIST
  // ==========================================================

  const isInMyList = (
    id: string
  ) => {
    return myList.includes(
      String(id)
    );
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AppContext.Provider
      value={{
        // Language
        language,
        setLanguage,
        toggleLanguage,
        t,

        // Search
        isSearchOpen,
        openSearch,
        closeSearch,

        // Video
        isVideoOpen,
        activeVideoItem,
        playVideo,
        closeVideo,

        // Login
        isLoginOpen,
        openLogin,
        closeLogin,

        // Subscribe
        isSubscribeOpen,
        openSubscribe,
        closeSubscribe,

        // My List
        myList,
        toggleMyList,
        isInMyList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// USE APP
// ============================================================

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}