import Link from 'next/link';
import { FaCalendar, FaFolder, FaTags } from 'react-icons/fa';
import styles from './BlogList.module.css';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
}

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className={styles.blogList}>
      {posts.map((post) => (
        <article key={post.id} className={styles.postCard}>
          <Link href={`/blog/${post.slug}`} className={styles.postLink}>
            <h2 className={styles.postTitle}>{post.title}</h2>
          </Link>
          
          <div className={styles.postMeta}>
            <span className={styles.metaItem}>
              <FaCalendar className={styles.metaIcon} />
              {post.date}
            </span>
            <span className={styles.metaItem}>
              <FaFolder className={styles.metaIcon} />
              {post.category}
            </span>
          </div>
          
          <p className={styles.postExcerpt}>{post.excerpt}</p>
          
          <div className={styles.postTags}>
            <FaTags className={styles.tagsIcon} />
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          
          <Link href={`/blog/${post.slug}`} className={styles.readMore}>
            Read More →
          </Link>
        </article>
      ))}
    </div>
  );
}

