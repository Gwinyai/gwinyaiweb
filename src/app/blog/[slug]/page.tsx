import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { FaCalendar, FaFolder, FaTags, FaArrowLeft } from 'react-icons/fa';
import styles from './blogDetail.module.css';
import type { Metadata } from 'next';
import ShareButton from '@/components/ShareButton';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const { data } = await supabase
    .from('blog_posts')
    .select(
      `
      title,
      excerpt,
      meta_title,
      meta_description,
      published_date,
      content
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!data) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Calculate reading time from content
  const wordCount = (data.content as string || '').split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Apply fallback logic
  const metaTitle = (data.meta_title as string) || data.title;
  const metaDescription = (data.meta_description as string) || (data.excerpt as string) || '';
  const publishedDate = data.published_date ? new Date(data.published_date as string).toISOString() : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: 'Gwinyai Nyatsoka' }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      authors: ['Gwinyai Nyatsoka'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@Pauththesage',
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id,
      title,
      content,
      excerpt,
      published_date,
      status,
      meta_title,
      meta_description,
      focus_keyword,
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
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    console.error('Error fetching blog post:', error?.message);
    return (
      <>
        <Navigation />
        <main className={styles.blogDetail}>
          <div className={styles.container}>
            <h1>Post Not Found</h1>
            <Link href="/blog" className={styles.backLink}>
              <FaArrowLeft /> Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  const formattedDate = data.published_date
    ? new Date(data.published_date as string).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const categoryName = (data as any).category?.name ?? 'Uncategorized';

  const tags =
    ((data as any).post_tags as any[] | null | undefined)
      ?.map((pt) => pt.tag?.name)
      .filter((t: string | undefined): t is string => Boolean(t)) ?? [];

  // Construct the full URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gwinyai.com';
  const fullUrl = `${baseUrl}/blog/${slug}`;

  return (
    <>
      <Navigation />
      <main className={styles.blogDetail}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            <FaArrowLeft /> Back to Blog
          </Link>
          
          <article className={styles.article}>
            <h1 className={styles.title}>{data.title}</h1>
            
            <div className={styles.meta}>
              {formattedDate && (
                <span className={styles.metaItem}>
                  <FaCalendar className={styles.metaIcon} />
                  {formattedDate}
                </span>
              )}
              {categoryName && (
                <span className={styles.metaItem}>
                  <FaFolder className={styles.metaIcon} />
                  {categoryName}
                </span>
              )}
              <ShareButton title={data.title} url={fullUrl} />
            </div>
            
            {tags.length > 0 && (
              <div className={styles.tags}>
                <FaTags className={styles.tagsIcon} />
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: (data.content as string) || '' }}
            />
          </article>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Error generating static params for blog posts:', error.message);
  }

  return (
    data?.map((post) => ({
      slug: post.slug,
    })) ?? []
  );
}

