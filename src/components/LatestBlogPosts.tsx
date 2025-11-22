import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import styles from './LatestBlogPosts.module.css';

type DbPost = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published_date: string | null;
  content: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

function calculateReadTime(content: string | null, excerpt: string): number {
  const text = (content || '') + ' ' + excerpt;
  const wordCount = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function LatestBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      excerpt,
      slug,
      published_date,
      content,
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq('status', 'published')
    .order('published_date', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching latest blog posts:', error.message);
    return null;
  }

  const posts = data?.map((post) => {
    const publishedDate = post.published_date ? new Date(post.published_date) : null;
    
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      date: publishedDate
        ? publishedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : '',
      readTime: calculateReadTime(post.content, post.excerpt),
      category: post.category?.name ?? 'Uncategorized',
    };
  }) ?? [];

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Blog</h3>
          <Link href="/blog" className={styles.viewAll}>
            View All <FaArrowRight />
          </Link>
        </div>
        
        <div className={styles.scrollContainer}>
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  
                  <div className={styles.meta}>
                    <span className={styles.date}>{post.date}</span>
                    <span className={styles.separator}>·</span>
                    <span className={styles.readTime}>{post.readTime} min read</span>
                  </div>
                  
                  <span className={styles.readMore}>
                    Read More <FaArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

