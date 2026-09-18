// ============================================================
// MAYAD - GALLERY DATA
// ============================================================

export interface GalleryPhoto {
  id: string;
  title: string;
  titleRaj: string;
  category: 'moments' | 'artists' | 'highlights';
  categoryLabel: string;
  categoryLabelRaj: string;
  imageUrl: string;
  description: string;
  descriptionRaj: string;
  date?: string;
  location?: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // ==========================================================
  // OUR TEAM
  // ==========================================================

  {
    id: 'team-cofounder',
    title: '',
    titleRaj: '',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/team/cofounder.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'team-director',
    title: '',
    titleRaj: '',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/team/director.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'team-lokendra',
    title: '',
    titleRaj: '',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/team/lokendra.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'team-priyamishra',
    title: '',
    titleRaj: '',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/team/priyamishra.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'team-sachin',
    title: '',
    titleRaj: '',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/team/sachin.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'gal-4',
    title: 'Abhi Soni',
    titleRaj: 'अभि सोनी',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/abhisoni.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'gal-6',
    title: 'Ramesh Nagda',
    titleRaj: 'रमेश नागदा',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/RameshNagda.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'gal-7',
    title: 'Kailash Mewadi',
    titleRaj: 'कैलाश मेवाड़ी',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/kailash.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'gal-8',
    title: 'Tara Shree',
    titleRaj: 'तारा श्री',
    category: 'artists',
    categoryLabel: 'Our Team',
    categoryLabelRaj: 'म्हारी टीम',
    imageUrl: '/tarashree.jpg',
    description: '',
    descriptionRaj: '',
  },

  // ==========================================================
  // MAYAD MOMENTS
  // ==========================================================

  {
    id: 'moment-1',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad4.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'moment-2',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad5.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'moment-3',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad8.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'moment-4',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad9.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'moment-5',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad10.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'moment-6',
    title: '',
    titleRaj: '',
    category: 'moments',
    categoryLabel: 'Mayad Moments',
    categoryLabelRaj: 'मायड़ मोमेंट्स',
    imageUrl: '/gallery/mayad11.jpg',
    description: '',
    descriptionRaj: '',
  },

  // ==========================================================
  // MAYAD HIGHLIGHTS
  // ==========================================================

  {
    id: 'highlight-1',
    title: '',
    titleRaj: '',
    category: 'highlights',
    categoryLabel: 'Mayad Highlight',
    categoryLabelRaj: 'मायड़ हाईलाइट',
    imageUrl: '/gallery/mayad1.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'highlight-2',
    title: '',
    titleRaj: '',
    category: 'highlights',
    categoryLabel: 'Mayad Highlight',
    categoryLabelRaj: 'मायड़ हाईलाइट',
    imageUrl: '/gallery/mayad3.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'highlight-3',
    title: '',
    titleRaj: '',
    category: 'highlights',
    categoryLabel: 'Mayad Highlight',
    categoryLabelRaj: 'मायड़ हाईलाइट',
    imageUrl: '/gallery/mayad6.jpg',
    description: '',
    descriptionRaj: '',
  },

  {
    id: 'highlight-4',
    title: '',
    titleRaj: '',
    category: 'highlights',
    categoryLabel: 'Mayad Highlight',
    categoryLabelRaj: 'मायड़ हाईलाइट',
    imageUrl: '/gallery/mayad7.jpg',
    description: '',
    descriptionRaj: '',
  },
];