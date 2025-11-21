import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import LatestBlogPosts from '@/components/LatestBlogPosts';

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      <LatestBlogPosts />
    </div>
  );
}
