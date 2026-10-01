import Hero from '@/components/Hero';
import PopularPersonalities from '@/components/PopularPersonalities';
import TrendingSection from '@/components/TrendingSection';
import FavoriteGenres from '@/components/FavoriteGenres/FavoriteGenres';
import AppDownload from '@/components/AppDownload';
import SocialSection from '@/components/SocialSection';
import NewsletterSection from '@/components/NewsletterSection';

export default function Home() {
  return (
    <div className="w-full bg-mayad-bg">
      <Hero />
      <PopularPersonalities />
      <TrendingSection />
      <FavoriteGenres />
      <AppDownload />
      <SocialSection />
      <NewsletterSection />
    </div>
  );
}

