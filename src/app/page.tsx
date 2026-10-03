import Hero from '@/components/Hero';
import PopularPersonalities from '@/components/PopularPersonalities';
import GallerySection from '@/components/GallerySection';
import TrendingSection from '@/components/TrendingSection';
import AppDownload from '@/components/AppDownload';
import Numbers from '@/components/Numbers';
import RajasthanConnect from "@/components/RajasthanConnect";
import SocialSection from '@/components/SocialSection';

export default function Home() {
  return (
    <div className="w-full bg-mayad-bg">
      <Hero />
      <Numbers />
      <PopularPersonalities />
      <GallerySection />
      <TrendingSection />
      <RajasthanConnect />
      <AppDownload />
      <SocialSection />
    </div>
  );
}


