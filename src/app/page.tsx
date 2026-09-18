import Hero from '@/components/Hero';
import PopularPersonalities from '@/components/PopularPersonalities';
import TrendingSection from '@/components/TrendingSection';
import MoviesSection from '@/components/MoviesSection';
import OriginalsSection from '@/components/OriginalsSection';
import FavoriteGenres from '@/components/FavoriteGenres/FavoriteGenres';
import Top5 from '@/components/Top5';
import AppDownload from '@/components/AppDownload';
import SocialSection from '@/components/SocialSection';
import NewsletterSection from '@/components/NewsletterSection';

export default function Home() {
  return (
    <div className="w-full bg-mayad-bg">
      <Hero />
      <Top5 />
      <PopularPersonalities />
      <TrendingSection />
      <MoviesSection />
      <OriginalsSection />
      <FavoriteGenres />
      <AppDownload />
      <SocialSection />
      <NewsletterSection />
    </div>
  );
}
