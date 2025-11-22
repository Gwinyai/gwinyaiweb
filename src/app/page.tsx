import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      <LatestBlogPosts />
      <FeaturedProjects />
    </div>
  );
}
