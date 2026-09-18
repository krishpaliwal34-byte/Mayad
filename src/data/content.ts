// ============================================================
// MAYAD - CONTENT DATA
// ============================================================

// ============================================================
// TYPES
// ============================================================

export interface HeroItem {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;

  type: 'movie' | 'series';
  category: string;
  language: string;

  year: number;
  duration?: string;
  genre?: string;

  description: string;

  bg?: string;
  posterUrl?: string;
  backdropUrl?: string;

  videoUrl?: string;
  trailerUrl?: string;

  cast?: string[];
  director?: string;

  isOriginal?: boolean;
  isTrending?: boolean;
}

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

  description?: string;

  cast?: string[];
  director?: string;

  isOriginal?: boolean;
  isTrending?: boolean;
}

export type ContentItem = MovieItem;

export interface Artist {
  id: string;
  slug?: string;
  name: string;
  originalName?: string;
  role: string;
  imageUrl: string;
  bio: string;
  dob?: string;
  birthPlace?: string;
  highlights: string[];
  tag?: string;
}

export type ArtistItem = Artist;

export interface FounderInfo {
  name: string;
  originalName?: string;
  role: string;

  imageUrl: string;

  bio: string;

  pillars: {
    title: string;
    description: string;
  }[];
}

// ============================================================
// MAYAD MUSIC
// ============================================================

// ============================================================
// MAYAD MUSIC
// ============================================================

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  posterUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: string;
  description?: string;
}

export const MUSIC_LIST: MusicItem[] = [
  {
    id: 'music-1',
    title: 'Sanwariya Seth',
    artist: 'MAYAD Artists',
    album: 'MAYAD Originals',
    posterUrl: '/Hero/sawariyaseth2.jpg',
    videoUrl: '/Hero/SanwariyaSeth.mp4',
    duration: '04:30',
    description:
      'A soulful Rajasthani musical experience inspired by devotion and culture.',
  },

  {
    id: 'music-2',
    title: 'Rajasthani Folk',
    artist: 'MAYAD Artists',
    album: 'MAYAD Folk',
    posterUrl: '/Hero/vadliyahindva.jpg',
    duration: '04:10',
    description:
      'Traditional Rajasthani folk music celebrating the culture and spirit of Rajasthan.',
  },

  {
    id: 'music-3',
    title: 'MAYAD Original',
    artist: 'Rajasthani Artists',
    album: 'MAYAD Music',
    posterUrl: '/Hero/Padmavati.jpg',
    duration: '03:55',
    description:
      'Original music from the world of MAYAD.',
  },
];
// ============================================================
// HERO ITEMS
// ============================================================

export const HERO_ITEMS: HeroItem[] = [
  {
    id: 'hero-1',
    slug: 'vadlya-hindwa',
    title: 'Vadlya Hindwa',
    originalTitle: 'वडल्या हिंडवा',
    type: 'movie',
    category: 'Drama / Heritage',
    language: 'Hindi',
    year: 2026,
    duration: '02h 15m',
    genre: 'Historical | Thriller | Devotional',
    bg: '/Hero/vadliyahindva.jpg',
    posterUrl: '/Hero/vadliyahindva.jpg',
    backdropUrl: '/Hero/vadliyahindva.jpg',
    videoUrl: '/Hero/Vadlya.mp4',
    trailerUrl: '/Hero/Vadlya.mp4',
    description:
      'मेवाड़ री मिट्टी , रहस्य री गूंज अर हिम्मत री कहानी वडल्या हिंदवा',
    cast: [
      'Abhi Soni',
      'Kailash Mewadi',
      'Ramesh Nagda',
    ],
    director: 'MAYAD Original Team',
    isOriginal: true,
    isTrending: true,
  },

  {
    id: 'hero-2',
    slug: 'seth-maharo-sanwariya',
    title: 'Sanwriya Seth',
    originalTitle: 'सांवरिया सेठ',
    type: 'movie',
    category: 'Musical / Drama',
    language: 'Rajasthani',
    year: 2026,
    duration: '1h 50m',
    genre: 'Devotional',
    bg: '/Hero/sawariyaseth1.jpg',
    posterUrl: '/Hero/sawariyaseth1.jpg',
    backdropUrl: '/Hero/sawariyaseth1.jpg',

    videoUrl: '/Hero/SethMahroSanwariya.mp4',
    trailerUrl: '/Hero/SethMahroSanwariya.mp4',

    description:
      'परिवार, रिश्तों और आस्था से जुड़ी एक खूबसूरत राजस्थानी कहानी। “सांवरिया सेठ” में देखिए अपनों के बीच के प्यार, रिश्तों की मिठास, जीवन के उतार-चढ़ाव और सांवरिया सेठ जी पर अटूट विश्वास की भावपूर्ण कहानी। हंसी, भावनाओं और पारिवारिक संस्कारों से सजी यह फिल्म हर उम्र के दर्शक के लिए एक खास अनुभव है।',

    cast: [
      'Abhi Soni',
      'Kailash Mewadi',
      'Ramesh Nagda',
    ],

    director: 'DP Singh Basni',

    isOriginal: true,
    isTrending: true,
  },

 
  {
    id: 'hero-4',
    slug: 'sawariya',
    title: 'Seth Maharo Sanwariya',
    originalTitle: 'सेठ म्हारो सांवरिया',
    type: 'movie',
    category: 'Devotional',
    language: 'Hindi',
    year: 2026,
    duration: '02h 00m',
    genre: 'Drama',
    bg: '/Hero/sawariya.jpg.png',
    posterUrl: '/Hero/sawariyaseth2.jpg',
    backdropUrl: '/Hero/sawariyaseth2.jpg',
    videoUrl: '/Hero/SanwariyaSeth.mp4',
    trailerUrl: '/Hero/SanwariyaSeth.mp4',
    description:
      'मेवाड़ की पावन धरा और श्री सांवरिया सेठ जी की असीम कृपा को समर्पित भक्तिमय गीत "सेठ म्हारो सांवरिया" श्रद्धा, प्रेम और भक्ति का सुंदर संगम है। यह गीत भक्त और सांवरिया सेठ के बीच के अटूट विश्वास, समर्पण और भावनात्मक जुड़ाव को दर्शाता है।',

    cast: [
      'MAYAD Artists',
      'Rajasthani Performers',
    ],
    director: 'MAYAD Original Team',
    isOriginal: true,
    isTrending: true,
  },
];


export const ARTISTS_LIST: Artist[] = [
  {
    id: 'pers-1',
    slug: 'abhi-soni',
    name: 'Abhi Soni',
    role: 'Actor',
    imageUrl: '/team/abhisoni.jpg',
    bio:
      'Abhi Soni is an actor and influencer associated with the growing Rajasthani entertainment space. With an interest in acting and digital entertainment, he is part of a new generation of artists contributing to regional storytelling and cinema.',
    dob: '1995-12-12',
    birthPlace: 'Rajasthan',
    highlights: [
      'Actor',
      'Rajasthani Cinema',
      'MAYAD Artist',
    ],
    tag: 'STAR',
  },

  {
    id: 'pers-2',
    slug: 'kailash-mewadi',
    name: 'Kailash Mewadi',
    role: 'Actor',
    imageUrl: '/kailash.jpg',
    bio:
      'Kailash Aachrcya is an Indian actor born in Rajasthan and have great interest in acting.',
    dob: '1998-02-18',
    birthPlace: 'Rajasthan',
    highlights: [
      'Actor',
      'Rajasthani Cinema',
      'Folk Culture',
    ],

    tag: 'STAR',
  },

  {
    id: 'pers-3',
    slug: 'ramesh-nagda',
    name: 'Ramesh Nagda',
    role: 'Actor',
    imageUrl: '/RameshNagda.jpg',
    bio:
      'रमेश नागदा Actor | Udaipur, Rajasthan उदयपुर, राजस्थान से ताल्लुक रखने वाले रमेश नागदा एक अनुभवी और बहुमुखी अभिनेता हैं। 65 वर्ष की आयु में भी वे अपने दमदार अभिनय, सहज अभिव्यक्ति और हर किरदार को जीवंत बनाने की क्षमता के लिए जाने जाते हैं। रंगमंच, फिल्मों और क्षेत्रीय सिनेमा में उनके वर्षों के अनुभव ने उन्हें एक सशक्त कलाकार के रूप में पहचान दिलाई है। रमेश नागदा का अभिनय हमेशा स्वाभाविक, भावनात्मक और प्रभावशाली रहा है। वे हर भूमिका में अपनी गहरी समझ और समर्पण के साथ दर्शकों के दिलों पर अमिट छाप छोड़ते हैं। उनका अनुभव, अनुशासन और कला के प्रति समर्पण नई पीढ़ी के कलाकारों के लिए भी प्रेरणास्रोत है। मयड़ OTT पर उनका स्वागत करते हुए हमें गर्व है, जहाँ दर्शक उनके बेहतरीन अभिनय का आनंद ले सकते हैं।',

    dob: '1971-04-13',
    birthPlace: 'Udaipur, Rajasthan',

    highlights: [
      'Actor',
      'Rajasthani Cinema',
      'Performer',
    ],

    tag: 'STAR',
  },

   {
    id: 'pers-5',
    slug: 'tarashree',
    name: 'Tara shree',
    role: 'Mayad Actor',
    imageUrl: '/tarashree.jpg',
    bio: '',
    dob: '1996-08-08',
    birthPlace: 'Rajasthan',
    highlights: [
      'Actor',
      'Rajasthani Cinema',
      'Performer',
    ],
    tag: 'STAR',
  },
   {
    id: 'pers-6',
    slug: 'garvakarnikarathore',
    name: 'Garvakarnika Rathore',
    role: 'Mayad Actor',
    imageUrl: '/Default.jpg',
    bio:
      'Garvakarnika Rathore is an Indian actor born in Rajasthan and have great interest in acting.',
    dob: '1996-05-14',
    birthPlace: 'Rajasthan',
    highlights: [
      'Actor',
      'Rajasthani Cinema',
      'Performer',
    ],
    tag: 'STAR',
  },
];

// ============================================================
// POPULAR PERSONALITIES
// ============================================================

export const POPULAR_PERSONALITIES: Artist[] = [
  ...ARTISTS_LIST,
];

// ============================================================
// FOUNDER
// ============================================================

export const FOUNDER_INFO: FounderInfo = {
  name: 'DP Singh Basni',

  role: 'FOUNDER & CEO',

  imageUrl: '/ceo.jpg',

  bio:
    'Founder & CEO of MAYAD, DP Singh Basni is a filmmaker, director, writer, actor and singer dedicated to bringing the stories, culture, music and identity of Rajasthan to a wider audience. Through MAYAD, he aims to build a strong platform for Rajasthani cinema, regional artists and authentic cultural storytelling. हेलो मायड़ भाषा रो....',

  pillars: [
    {
      title: 'Rajasthani Stories',
      description:
        'Bringing authentic stories, emotions and traditions of Rajasthan to audiences through meaningful regional cinema.',
    },

    {
      title: 'Regional Cinema',
      description:
        'Building a platform that discovers, supports and showcases Rajasthani filmmakers, actors, writers and creative artists.',
    },

    {
      title: 'Culture & Music',
      description:
        'Preserving and promoting Rajasthan’s folk traditions, music, language and artistic identity for audiences everywhere.',
    },
  ],
};

// ============================================================
// CATEGORIES
// ============================================================

export const CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Rajasthani Movies',
    slug: 'rajasthani-movies',
  },

  {
    id: 'cat-2',
    name: 'Drama',
    slug: 'drama',
  },

  {
    id: 'cat-3',
    name: 'Historical',
    slug: 'historical',
  },

  {
    id: 'cat-4',
    name: 'Musical',
    slug: 'musical',
  },

  {
    id: 'cat-5',
    name: 'Folk',
    slug: 'folk',
  },
];
// ============================================================
// SOCIAL LINKS
// ============================================================

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/mayad_ott/',
  facebook: 'https://www.facebook.com/mayadrajasthani',
  youtube: 'https://www.youtube.com/@mayad_film',
  twitter: 'https://x.com/Mayad_Ott',
};