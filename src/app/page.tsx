import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import AsSeenOn from '@/components/AsSeenOn';
import GitHubContributions from '@/components/GitHubContributions';

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      <TechStack />
      <AsSeenOn />
      <GitHubContributions />
    </div>
  );
}
