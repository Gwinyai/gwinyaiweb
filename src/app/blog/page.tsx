import Navigation from '@/components/Navigation';
import BlogList from '@/components/blog/BlogList';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { supabase } from '@/lib/supabaseClient';
import styles from './blog.module.css';

export const metadata = {
  title: 'Blog - Gwinyai Nyatsoka',
  description: 'Articles and insights on web development, mobile apps, and AI systems.',
};

export const revalidate = 60; // ISR: revalidate blog data every 60 seconds

export default async function BlogPage() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id,
      title,
      excerpt,
      slug,
      published_date,
      status,
      category:categories (
        id,
        name,
        slug
      ),
      post_tags (
        tag:tags (
          id,
          name,
          slug
        )
      )
    `
    )
    .eq('status', 'published')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts from Supabase:', error.message);
  }

  const typedData = (data as any[]) ?? [];

  const blogPosts =
    typedData.map((post) => {
      const categoryName = post.category?.name ?? 'Uncategorized';

      const tags =
        post.post_tags
          ?.map((pt: any) => pt.tag?.name)
          .filter((t: string | undefined): t is string => Boolean(t)) ?? [];

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        date: post.published_date
          ? new Date(post.published_date as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
        category: categoryName,
        tags,
        slug: post.slug,
      };
    }) ?? [];

  // Derive categories and counts from posts
  const categoryMap = new Map<string, number>();
  blogPosts.forEach((post) => {
    const current = categoryMap.get(post.category) ?? 0;
    categoryMap.set(post.category, current + 1);
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // Recent posts: top 3 by published_date
  const recentPosts = blogPosts.slice(0, 3).map((post) => ({
    title: post.title,
    slug: post.slug,
  }));

  // Most recently used tags, limited to about 15
  const recentTags: string[] = [];
  const recentTagSet = new Set<string>();

  for (const post of blogPosts) {
    for (const tag of post.tags) {
      if (!recentTagSet.has(tag)) {
        recentTagSet.add(tag);
        recentTags.push(tag);
        if (recentTags.length >= 15) break;
      }
    }
    if (recentTags.length >= 15) break;
  }

  const allTags = recentTags;

  return (
    <>
      <Navigation />
      <main className={styles.blogPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Blog</h1>
          <div className={styles.blogLayout}>
            <BlogList posts={blogPosts} />
            <BlogSidebar
              categories={categories}
              recentPosts={recentPosts}
              tags={allTags}
            />
          </div>
        </div>
      </main>
    </>
  );
}

