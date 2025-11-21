import Navigation from '@/components/Navigation';
import TechStack from '@/components/TechStack';
import AsSeenOn from '@/components/AsSeenOn';
import GitHubContributions from '@/components/GitHubContributions';
import styles from './about.module.css';

export const metadata = {
  title: 'About - Gwinyai Nyatsoka',
  description: 'Learn more about my tech stack, freelance work, and GitHub activity.',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className={styles.aboutPage}>
        <TechStack />
        <AsSeenOn />
        <GitHubContributions />
      </main>
    </>
  );
}

