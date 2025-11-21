import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.name}>
            Hi, I'm <span className={styles.highlight}>Gwinyai</span> 👋
          </h1>
          <p className={styles.subtitle}>
            NextJS | React | NodeJS | iOS Swift
          </p>
          <p className={styles.description}>
            I craft AI, web and mobile app solutions. Use this page to learn more about my journey.  
          </p>
          <div className={styles.socialIcons}>
            <a href="https://github.com/Gwinyai" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="GitHub">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://stackoverflow.com/users/3008901/gwinyai" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Stack Overflow">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path fill="currentColor" d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.093-10.473-2.201zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154z"/>
              </svg>
            </a>
            <a href="https://udemy.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Udemy">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path fill="currentColor" d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.177 24 11.973 24s3.269-.482 4.448-1.474c1.179-.991 1.768-2.439 1.768-4.314v-8.064h-3.242v7.85c0 2.036-1.509 3.055-2.974 3.055-1.465 0-2.974-1.019-2.974-3.055v-7.85z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/paulthesage" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Fiverr">
              <Image
                src="/fiverrsmall.svg"
                alt="Fiverr"
                width={36}
                height={36}
                className={styles.fiverrIcon}
              />
            </a>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <Image
              src="/gwi.png"
              alt="Gwinyai Nyatsoka"
              width={400}
              height={400}
              className={styles.profileImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

