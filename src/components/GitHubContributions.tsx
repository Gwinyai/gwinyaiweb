'use client';

import { GitHubCalendar } from 'react-github-calendar';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import styles from './GitHubContributions.module.css';

export default function GitHubContributions() {
  const username = 'gwinyai';
  
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <FaGithub className={styles.titleIcon} />
          GitHub Activity
        </h2>
        
        <div className={styles.calendarWrapper}>
          <GitHubCalendar
            username={username}
            colorScheme="dark"
            theme={{
              light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
              dark: ['#161b22', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa'],
            }}
            blockSize={12}
            blockMargin={4}
            fontSize={14}
          />
        </div>
      </div>
    </section>
  );
}

