
export interface MovieItem {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;

  posterUrl: string;
  backdropUrl?: string;

  type?: 'movie' | 'series';
  category?: string;
  language?: string;

  year?: number;
  duration?: string;
  genre?: string;

  // Multiple genres for automatic filtering
  genres?: ('thriller' | 'devotional' | 'historical')[];

  description?: string;

  cast?: string[];
  director?: string;

  isOriginal?: boolean;
  isTrending?: boolean;
}


// ============================================================
// ALL MOVIES
// EXACT MOVIE DATA FROM content.ts
// ============================================================

export const MOVIES_LIST: MovieItem[] = [
  {
    id: 'movie-1',
    slug: 'vadlya-hindva',
    title: 'Vadlya Hindva',
    originalTitle: 'वडल्या हिंडवा',
    posterUrl: '/vadliyahindva.jpg',
    backdropUrl: '/vadliyahindva.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '2h 15m',
    genre: 'historical | thriller | devotional',
    genres: ['historical', 'thriller', 'devotional'],
    description:
      'An epic tale of duty, honor, and ancestral heritage rooted deep within the golden sands of Rajasthan.',
    cast: [
      'Tara Shree',
    ],
    director: 'MAYAD Original Team',
    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'movie-2',
    slug: 'seth-maharo-sanwariya',
    title: 'Seth Maharo Sanwariya',
    originalTitle: 'सेठ म्हारो सांवरिया',
    posterUrl: '/sawariyaseth1.jpg',
    backdropUrl: '/sawariyaseth1.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '1h 50m',
    genre: 'devotional',
    genres: ['devotional'],
    description:
      'A soulful Rajasthani cinematic experience filled with devotion, emotion, music and timeless storytelling.',

    cast: [
      'Abhi Soni',
      'Garvakarnika Rathore',
      'Kailash Mewadi',
      'Ramesh Nagda',
    ],

    director: 'DP Singh Basni',

    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'movie-3',
    slug: 'maa-padmavati',
    title: 'Maa Padmavati',
    originalTitle: 'माँ पद्मावती',
    posterUrl: '/Padmavati.jpg',
    backdropUrl: '/Padmavati.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '1h 40m',
    genre: 'Historical',
    genres: ['historical'],

    description:
      'A historic saga inspired by the courage, honor and glorious heritage of Rajasthan.',

    cast: [
      'Tara Shree',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'movie-4',
    slug: 'sawariya',
    title: 'Sawariya Seth',
    originalTitle: 'सांवरिया',
    posterUrl: '/sawariyaseth2.jpg',
    backdropUrl: '/sawariyaseth2.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '2h',
    genre: 'devotional',
    genres: ['devotional'],
    description:
      'A soulful Rajasthani story filled with love, devotion, emotion and beautiful music.',
    cast: [
      'Abhi Soni',
      'Anjli',
      'Garvakarnika Rathore',
      'Kailash Mewadi',
      'Ramesh Nagda',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'movie-5',
    slug: 'dadalaadladaya',
    title: 'Dada Laad Ladaya',
    originalTitle: '',
    posterUrl: '/DadaLaad.jpg',
    backdropUrl: '/DadaLaad.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '2h',
    genre: 'devotional',
    genres: ['devotional'],

    description:
      'A soulful Rajasthani story filled with love, devotion, emotion and beautiful music.',

    cast: [
      'Abhi Soni',
      'Ramesh Nagda',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'movie-6',
    slug: 'SethMaharoSanwariya',
    title: 'Seth Maharo Sanwariya',
    originalTitle: 'सेठ म्हारो सांवरिया',
    posterUrl: '/sawariya.jpg',
    backdropUrl: '/sawariya.jpg',
    type: 'movie',
    language: 'Rajasthani',
    year: 2026,
    duration: '2h',
    genre: 'devotional',
    genres: ['devotional'],
    description:
      'A soulful Rajasthani story filled with love, devotion, emotion and beautiful music.',
    cast: [
      'Abhi Soni',
      'Kailash Mewadi',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: true,
  },
];

// ============================================================
// TODAY'S TOP 5
// ============================================================

export const TOP_5_MOVIES: MovieItem[] = [
  MOVIES_LIST[0],
  MOVIES_LIST[1],
  MOVIES_LIST[2],
  MOVIES_LIST[3],
  MOVIES_LIST[4],
];


// ============================================================
// TRENDING ON MAYAD
// Different order
// ============================================================

export const TRENDING_MOVIES: MovieItem[] = [
  MOVIES_LIST[1],
  MOVIES_LIST[2],
  MOVIES_LIST[3],
  MOVIES_LIST[4],
  MOVIES_LIST[5],
  MOVIES_LIST[0],
];


// ============================================================
// MOST LIKED MOVIES
// Different order
// ============================================================

export const MOST_LIKED_MOVIES: MovieItem[] = [
  MOVIES_LIST[2],
  MOVIES_LIST[3],
  MOVIES_LIST[4],
  MOVIES_LIST[5],
  MOVIES_LIST[0],
  MOVIES_LIST[1],
];


// ============================================================
// MAYAD ORIGINALS
// ============================================================

export const MAYAD_ORIGINALS: MovieItem[] = [
  ...MOVIES_LIST.filter((movie) => movie.isOriginal),
];


// ============================================================
// TV SHOWS
// EXACT SERIES DATA FROM content.ts
// ============================================================

export const TV_SHOWS: MovieItem[] = [
  {
    id: 'series-1',
    slug: 'rajasthan-diaries',
    title: 'Rajasthan Diaries',
    originalTitle: 'राजस्थान डायरीज़',

    posterUrl: '/Hero/vadliyahindva.jpg',
    backdropUrl: '/Hero/vadliyahindva.jpg',

    type: 'series',
    language: 'Rajasthani',

    year: 2026,
    duration: 'Season 1',
    genre: 'Drama',

    description:
      'Stories, people and traditions from the heart of Rajasthan.',

    cast: [
      'MAYAD Artists',
      'Rajasthani Performers',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'series-2',
    slug: 'rangilo-rajasthan',
    title: 'Rangilo Rajasthan',
    originalTitle: 'रंगीला राजस्थान',

    posterUrl: '/Hero/sawariyaseth1.jpg',
    backdropUrl: '/Hero/sawariyaseth1.jpg',

    type: 'series',
    language: 'Rajasthani',

    year: 2026,
    duration: 'Season 1',
    genre: 'Culture',

    description:
      'Discover the colours, music, traditions and stories of Rajasthan.',

    cast: [
      'MAYAD Artists',
      'Rajasthani Artists',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: false,
  },

  {
    id: 'series-3',
    slug: 'dharti-rajasthan-ki',
    title: 'Dharti Rajasthan Ki',
    originalTitle: 'धरती राजस्थान की',

    posterUrl: '/Hero/Padmavati.jpg',
    backdropUrl: '/Hero/Padmavati.jpg',

    type: 'series',
    language: 'Rajasthani',

    year: 2026,
    duration: 'Season 1',
    genre: 'Documentary',

    description:
      'A journey through the heritage, history and cultural identity of Rajasthan.',

    cast: [
      'MAYAD Original Artists',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: false,
  },

  {
    id: 'series-4',
    slug: 'mayad-folk',
    title: 'MAYAD Folk',
    originalTitle: 'मायड़ लोक',

    posterUrl: '/Hero/sawariyaseth2.jpg',
    backdropUrl: '/Hero/sawariyaseth2.jpg',

    type: 'series',
    language: 'Rajasthani',

    year: 2026,
    duration: 'Season 1',
    genre: 'Music',

    description:
      'Traditional Rajasthani folk music, artists and unforgettable performances.',

    cast: [
      'Rajasthani Folk Artists',
    ],

    director: 'MAYAD Original Team',

    isOriginal: true,
    isTrending: false,
  },
];