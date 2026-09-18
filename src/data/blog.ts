// ============================================================
// MAYAD - BLOG DATA
// ============================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleRaj: string;
  category: string;
  categoryRaj: string;
  date: string;
  readTime: string;
  readTimeRaj: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  excerpt: string;
  excerptRaj: string;
  content: {
    heading?: string;
    headingRaj?: string;
    paragraphs: string[];
    paragraphsRaj: string[];
  }[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'revival-of-rajasthani-cinema-mayad-ott',
    title: 'The Revival of Rajasthani Regional Cinema: How MAYAD OTT is Leading the Change',
    titleRaj: 'राजस्थानी प्रादेशिक सिनेमा रो पुनर्जागरण: मायड़ OTT कियां लावे है बदलाव',
    category: 'Cinema & Tech',
    categoryRaj: 'सिनेमा और तकनीक',
    date: 'September 5, 2026',
    readTime: '4 min read',
    readTimeRaj: '4 मिनट री पढ़ाई',
    author: 'MAYAD Editorial',
    authorRole: 'Entertainment Team',
    imageUrl: '/historical.jpg',
    excerpt: 'Regional cinema in Rajasthan is experiencing a digital revolution. Discover how MAYAD is empowering local storytellers and taking Marwari & Mewari cinema global.',
    excerptRaj: 'राजस्थान रो क्षेत्रीय सिनेमा अब डिजिटल क्रांति रो गवाह बण रहियो है। जानो कियां मायड़ राजस्थान रा सर्जकां और मारवाड़ी-मेवाड़ी सिनेमा ने पूरी दुनिया तांई पहुँचावे है।',
    content: [
      {
        heading: 'A New Era for Regional Storytelling',
        headingRaj: 'क्षेत्रीय कहानियों रो नया युग',
        paragraphs: [
          'For decades, traditional regional cinema in Rajasthan faced challenges in distribution, marketing, and high-definition streaming accessibility. While rich in folklore and cultural heritage, authentic stories often struggled to find standard theatrical releases.',
          'With the launch of MAYAD OTT, Rajasthan’s first dedicated streaming ecosystem, independent directors, local vocalists, and regional actors now have a high-definition 4K platform to showcase their craft directly to millions of viewers worldwide.'
        ],
        paragraphsRaj: [
          'दशकां सूँ राजस्थान रो पारंपरिक क्षेत्रीय सिनेमा वितरण और तकनीक री समस्यावां रो सामना कर रहियो थो। समृद्ध संस्कृति और लोक गाथावां होवा रे बावजूद अस्ली कहानियों ने बड़े परदे पर उचित जगह नी मिलती थी।',
          'मायड़ OTT रे आगमण सूँ अब राजस्थान रा स्वतंत्र निर्देशकां, गायकां और अभिनेताओं ने 4K उच्च गुणवत्ता रो समर्पित मंच मिलियो है जिको दुनिया भर में लाखां दर्शकां तांई सीधा पहुँचवे है।'
        ]
      },
      {
        heading: 'Preserving Dialects & Cultural Pride',
        headingRaj: 'बोलियां री रक्षा और सांस्कृतिक स्वाभिमान',
        paragraphs: [
          'Language is the heart of culture. MAYAD places special emphasis on Marwari, Mewari, Shekhawati, and Harauti dialects, ensuring that native accents and folk traditions remain preserved for future generations.',
          'From blockbuster classics to original web series like "Sanwriya Seth" and "Vadlya Hindva", viewer response has been overwhelmingly positive across India and international diaspora.'
        ],
        paragraphsRaj: [
          'भाषा संस्कृति री आत्मा वे है। मायड़ मारवाड़ी, मेवाड़ी, शेखावाटी और हाड़ौती बोलियां पर ख़ास ध्यान देवे है तांई आपणी लोक परंपरावां आवे वाली पीढ़ियां तांई सुरक्षित रेवे।',
          'ब्लॉकबस्टर फ़िल्मां और ओरिजिनल शो जैसे "सांवरिया सेठ" और "वडल्या हिंदवा" ने भारत और विदेशां में बसिया राजस्थानियों रो भरपूर प्यार मिलियो है।'
        ]
      }
    ],
    tags: ['Rajasthani Cinema', 'MAYAD Originals', 'Culture', 'OTT']
  },
  {
    id: 'blog-2',
    slug: 'folk-legends-and-shekhawati-traditions-on-screen',
    title: 'Folk Legends & Shekhawati Traditions: Bringing Authentic Rajasthan to Screen',
    titleRaj: 'लोक गाथावां और शेखावाटी री परंपरावां: परदे पर उकेरित अस्ली राजस्थान',
    category: 'Culture & Heritage',
    categoryRaj: 'संस्कृति और धरोहर',
    date: 'August 28, 2026',
    readTime: '3 min read',
    readTimeRaj: '3 मिनट री पढ़ाई',
    author: 'Kailash Mewadi',
    authorRole: 'Cultural Curator',
    imageUrl: '/devotional.jpg',
    excerpt: 'Explore how ancient Rajasthani folk tales, traditional ballads, and vibrant music are being reimagined for modern streaming audiences.',
    excerptRaj: 'देखों कियां राजस्थान री प्राचीन लोक गाथावां, पारंपरिक गीत और समृद्ध संगीत आज रे नए दौर रे ओटीटी दर्शकां तांई पुनर्जीवित करीजी रिया है।',
    content: [
      {
        heading: 'Timeless Stories Passed Down Through Generations',
        headingRaj: 'पीढ़ियां सूँ चली आवै वाली अमर कहानियां',
        paragraphs: [
          'Rajasthan is a land of courage, devotion, and legendary music. Traditional bards and singers have preserved heroic tales for centuries through oral traditions.',
          'Modern cinema production on MAYAD merges these timeless stories with cinematic visuals, immersive background scores, and high-fidelity audio, making folk heritage accessible to today\'s youth.'
        ],
        paragraphsRaj: [
          'राजस्थान शौर्य, भक्ति और अद्भुत संगीत री जननी है। मरुधरा रा गवैया और भाट दशकां सूँ मुखज़बानी आपणी वीर गाथावां री रक्षा करता आया है।',
          'मायड़ पर आधुनिक सिनेमा निर्माण इण अमर गाथावां ने उच्च तकनीक, बेहतरीन बैकग्राउंड म्यूज़िक और 4K विजुअल्स रे साथ जोड़कर आज री युवा पीढ़ी तांई प्रस्तुत करे है।'
        ]
      }
    ],
    tags: ['Heritage', 'Folk Music', 'Culture', 'Devotional']
  },
  {
    id: 'blog-3',
    slug: 'must-watch-rajasthani-movies-on-mayad',
    title: 'Must-Watch Rajasthani Movies You Should Stream This Weekend',
    titleRaj: 'इण सप्ताहांत आपणे परिवार साथे ज़रूर देखो आ राजस्थानी फ़िल्मां',
    category: 'Movie List',
    categoryRaj: 'फ़िल्म सूची',
    date: 'August 18, 2026',
    readTime: '5 min read',
    readTimeRaj: '5 मिनट री पढ़ाई',
    author: 'MAYAD Critics',
    authorRole: 'Movie Reviewer',
    imageUrl: '/Thriller.jpg',
    excerpt: 'Looking for authentic Rajasthani cinema? Here is our curated list of top-rated movies and originals currently streaming on MAYAD OTT.',
    excerptRaj: 'अस्ली राजस्थानी सिनेमा री तलाश है? अठे देखो मायड़ ओटीटी री सबसूँ पसंदीदा और सरहणी फ़िल्मां री ख़ास सूची।',
    content: [
      {
        heading: 'Top Curated Cinema Picks',
        headingRaj: 'सबसूँ ख़ास और चुनिंदा फ़िल्मां',
        paragraphs: [
          'Whether you love thrilling suspense, historical epics, or heartfelt devotional dramas, MAYAD offers a diverse catalog for every cinema lover.',
          'Highlights include "Sanwriya Seth" for spiritual and dramatic storytelling, "Vadlya Hindva" for historical grandeur, and "Dada Laad Ladaya" for family entertainment.'
        ],
        paragraphsRaj: [
          'चाहे आप ने सस्पेंस-थ्रिलर पसंद होवे, ऐतिहासिक गाथावां या भक्ति-भाव सूँ भरी फ़िल्मां, मायड़ हर दर्शक तांई बेहतरीन विकल्प देवे है।',
          '"सांवरिया सेठ", "वडल्या हिंदवा" और "दादा लाड लड़ाया" इण हफ़्ते री सबसूँ घणी देखीजीवा वाली फ़िल्मां में शामिल है।'
        ]
      }
    ],
    tags: ['Blockbusters', 'Must Watch', 'Family', 'Movies']
  }
];
