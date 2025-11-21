'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaFolder, FaClock, FaTags } from 'react-icons/fa';
import styles from './BlogSidebar.module.css';

interface Category {
  name: string;
  count: number;
}

interface RecentPost {
  title: string;
  slug: string;
}

interface BlogSidebarProps {
  categories: Category[];
  recentPosts: RecentPost[];
  tags: string[];
}

export default function BlogSidebar({ categories, recentPosts, tags }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log('Searching for:', searchQuery);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Search */}
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaSearch className={styles.titleIcon} />
          Search
        </h3>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaFolder className={styles.titleIcon} />
          Categories
        </h3>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.name} className={styles.categoryItem}>
              <Link href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {category.name}
                <span className={styles.count}>({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaClock className={styles.titleIcon} />
          Recent Posts
        </h3>
        <ul className={styles.recentPostsList}>
          {recentPosts.map((post) => (
            <li key={post.slug} className={styles.recentPostItem}>
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaTags className={styles.titleIcon} />
          Tags
        </h3>
        <div className={styles.tagCloud}>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className={styles.tagItem}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

