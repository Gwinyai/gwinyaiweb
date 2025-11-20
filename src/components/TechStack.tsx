'use client';

import { useRef, useState, useEffect } from 'react';
import { SiNextdotjs, SiNodedotjs, SiReact, SiSwift, SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiFirebase, SiSupabase } from 'react-icons/si';
import { FaCode } from 'react-icons/fa';
import styles from './TechStack.module.css';

export default function TechStack() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const technologies = [
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'React', icon: SiReact },
    { name: 'Swift', icon: SiSwift },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'Supabase', icon: SiSupabase },
  ];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <FaCode className={styles.titleIcon} />
          Tech Stack
        </h2>
        <div className={styles.scrollWrapper}>
          {showLeftArrow && (
            <button 
              className={`${styles.arrow} ${styles.leftArrow}`}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          
          <div className={styles.scrollContainer} ref={scrollRef}>
            <div className={styles.techGrid}>
              {technologies.map((tech) => (
                <div key={tech.name} className={styles.card}>
                  <div className={styles.iconWrapper}>
                    <tech.icon className={styles.icon} />
                  </div>
                  <span className={styles.label}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {showRightArrow && (
            <button 
              className={`${styles.arrow} ${styles.rightArrow}`}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

