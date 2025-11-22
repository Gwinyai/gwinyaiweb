import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabaseClient';
import ProjectCard from '@/components/ProjectCard';
import styles from './projects.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Gwinyai Nyatsoka',
  description: 'Browse my portfolio of web and mobile development projects, including AI applications, full-stack solutions, and more.',
  openGraph: {
    title: 'Projects | Gwinyai Nyatsoka',
    description: 'Browse my portfolio of web and mobile development projects, including AI applications, full-stack solutions, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Gwinyai Nyatsoka',
    description: 'Browse my portfolio of web and mobile development projects, including AI applications, full-stack solutions, and more.',
    creator: '@Pauththesage',
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*),
      project_tags (
        tag_id,
        tags (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error.message);
  }

  // Transform the data to match our types
  const transformedProjects = projects?.map((project: any) => ({
    ...project,
    tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
  })) || [];

  return (
    <>
      <Navigation />
      <main className={styles.projectsPage}>
        <div className={styles.container}>
          {transformedProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No projects to display yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {transformedProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

