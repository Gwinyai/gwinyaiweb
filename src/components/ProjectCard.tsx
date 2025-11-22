import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaVideo } from 'react-icons/fa';
import styles from './ProjectCard.module.css';
import type { ProjectWithRelations } from '@/types/project';

interface ProjectCardProps {
  project: ProjectWithRelations;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/projects/${project.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={project.main_image_url}
            alt={project.main_image_alt || project.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{project.title}</h3>
        </Link>

        <p className={styles.excerpt}>{project.excerpt}</p>

        {project.tags && project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map((tag) => (
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
  );
}

