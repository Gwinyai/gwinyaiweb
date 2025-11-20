import Image from 'next/image';
import { FaBriefcase } from 'react-icons/fa';
import styles from './AsSeenOn.module.css';

export default function AsSeenOn() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <FaBriefcase className={styles.titleIcon} />
          Freelance & Course Creation
        </h2>
        <div className={styles.platforms}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Image
                src="/fiverrlogo.svg"
                alt="Fiverr"
                width={140}
                height={40}
                className={styles.logo}
              />
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>700+</span>
                <span className={styles.statLabel}>5-Star Reviews</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1</span>
                <span className={styles.statLabel}>Fiverr Recommend</span>
              </div>
            </div>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Image
                src="/udemylogo.svg"
                alt="Udemy"
                width={140}
                height={40}
                className={styles.logo}
              />
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>5-Star Reviews</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>2</span>
                <span className={styles.statLabel}>Best Selling Courses</span>
              </div>
            </div>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

