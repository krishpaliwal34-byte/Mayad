import Hero from '@/components/Hero';
import PopularPersonalities from '@/components/PopularPersonalities';
import GallerySection from '@/components/GallerySection';
import TrendingSection from '@/components/TrendingSection';
import FavoriteGenres from '@/components/FavoriteGenres/FavoriteGenres';
import AppDownload from '@/components/AppDownload';
import SocialSection from '@/components/SocialSection';

export default function Home() {
  return (
    <div className="w-full bg-mayad-bg">
      <Hero />
      <PopularPersonalities />
      <GallerySection />
      <TrendingSection />
      <FavoriteGenres />
      <AppDownload />
      <SocialSection />
    </div>
  );
}


