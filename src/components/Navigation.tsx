import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Gwinyai
        </Link>
        <ul className={styles.menu}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/projects">Projects</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

