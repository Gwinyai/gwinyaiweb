import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaVideo, FaArrowRight } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import styles from './FeaturedProjects.module.css';

export default async function FeaturedProjects() {
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      excerpt,
      main_image_url,
      main_image_alt,
      link,
      github_link,
      video_url,
      created_at,
      project_tags (
        tag_id,
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!projects || projects.length === 0) {
    return null;
  }

  // Transform the data to include tags
  const transformedProjects = projects.map((project: any) => ({
    ...project,
    tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
  }));

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Projects</h2>
          <Link href="/projects" className={styles.viewAll}>
            View All <FaArrowRight />
          </Link>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.cardsWrapper}>
            {transformedProjects.map((project: any) => (
              <article key={project.id} className={styles.card}>
                <Link href={`/projects/${project.slug}`} className={styles.imageLink}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.main_image_url}
                      alt={project.main_image_alt || project.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </Link>

                <div className={styles.content}>
                  <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                  </Link>

                  <p className={styles.excerpt}>{project.excerpt}</p>

                  {project.tags && project.tags.length > 0 && (
                    <div className={styles.tags}>
                      {project.tags.slice(0, 3).map((tag: any) => (
                        <span key={tag.id} className={styles.tag}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.links}>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        aria-label="View live project"
                      >
                        <FaExternalLinkAlt /> Live
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        aria-label="View GitHub repository"
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {project.video_url && (
                      <a
                        href={project.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        aria-label="Watch video demo"
                      >
                        <FaVideo /> Video
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

