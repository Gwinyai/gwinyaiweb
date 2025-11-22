import Navigation from '@/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaVideo } from 'react-icons/fa';
import styles from './projectDetail.module.css';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const { data } = await supabase
    .from('projects')
    .select('title, excerpt, main_image_url')
    .eq('slug', slug)
    .single();

  if (!data) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${data.title} | Gwinyai Nyatsoka`,
    description: data.excerpt,
    authors: [{ name: 'Gwinyai Nyatsoka' }],
    openGraph: {
      title: `${data.title} | Gwinyai Nyatsoka`,
      description: data.excerpt,
      images: [data.main_image_url],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.title} | Gwinyai Nyatsoka`,
      description: data.excerpt,
      creator: '@Pauththesage',
      images: [data.main_image_url],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*),
      project_tags (
        tag_id,
        tags (*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching project:', error?.message);
    return (
      <>
        <Navigation />
        <main className={styles.projectDetail}>
          <div className={styles.container}>
            <h1>Project Not Found</h1>
            <Link href="/projects" className={styles.backLink}>
              <FaArrowLeft /> Back to Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Sort images by display_order
  const sortedImages = (data.project_images || []).sort(
    (a: any, b: any) => a.display_order - b.display_order
  );

  // Extract tags
  const tags = (data.project_tags || [])
    .map((pt: any) => pt.tags)
    .filter(Boolean);

  return (
    <>
      <Navigation />
      <main className={styles.projectDetail}>
        <div className={styles.container}>
          <Link href="/projects" className={styles.backLink}>
            <FaArrowLeft /> Back to Projects
          </Link>
          
          <article className={styles.article}>
            {/* Main Image */}
            <div className={styles.mainImageWrapper}>
              <Image
                src={data.main_image_url}
                alt={data.main_image_alt || data.title}
                width={1200}
                height={600}
                className={styles.mainImage}
                priority
              />
            </div>

            {/* Title & Tags */}
            <h1 className={styles.title}>{data.title}</h1>
            
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag: any) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            <div className={styles.links}>
              {data.link && (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  <FaExternalLinkAlt /> Live
                </a>
              )}
              {data.github_link && (
                <a
                  href={data.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  <FaGithub /> View on GitHub
                </a>
              )}
              {data.video_url && (
                <a
                  href={data.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  <FaVideo /> Watch Video
                </a>
              )}
            </div>

            {/* Description */}
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: data.description || '' }}
            />

            {/* Additional Images */}
            {sortedImages.length > 0 && (
              <div className={styles.imagesSection}>
                <h2 className={styles.imagesTitle}>Project Gallery</h2>
                <div className={styles.imageGrid}>
                  {sortedImages.map((img: any) => (
                    <div key={img.id} className={styles.imageCard}>
                      <Image
                        src={img.image_url}
                        alt={img.image_alt || `${data.title} screenshot`}
                        width={600}
                        height={400}
                        className={styles.galleryImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('projects')
    .select('slug');

  if (error) {
    console.error('Error generating static params for projects:', error.message);
  }

  return (
    data?.map((project) => ({
      slug: project.slug,
    })) ?? []
  );
}

