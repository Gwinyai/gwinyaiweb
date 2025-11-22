// Base Project type - matches the projects table
export interface Project {
  id: string;                    // UUID primary key
  created_at: string;            // ISO timestamp (auto-generated)
  updated_at: string;            // ISO timestamp (auto-updated)
  title: string;                 // Project title
  slug: string;                  // URL-friendly unique identifier
  excerpt: string;               // Brief summary
  description: string;           // Full HTML content from rich text editor
  main_image_url: string;        // Public URL to main image
  main_image_alt: string | null; // Alt text for accessibility (optional)
  link: string | null;           // Link to live project/demo (optional)
  github_link: string | null;    // Link to GitHub repo (optional)
  video_url: string | null;      // Link to video demo (optional)
  tags?: Tag[];                  // Associated tags (joined)
}

// Project Image type - matches the project_images table
export interface ProjectImage {
  id: string;                // UUID primary key
  created_at: string;        // ISO timestamp
  project_id: string;        // Foreign key to projects.id
  image_url: string;         // Public URL to image
  image_alt: string | null;  // Alt text for accessibility (optional)
  display_order: number;     // Order for displaying (0, 1, 2...)
}

// Tag type - shared with blog posts
export interface Tag {
  id: string;        // UUID primary key
  name: string;      // Tag name (e.g., "React")
  slug: string;      // URL-friendly version (e.g., "react")
  created_at: string; // ISO timestamp
}

// Extended Project type with relations (for fetching with joins)
export interface ProjectWithRelations extends Project {
  project_images: ProjectImage[];
  tags: Tag[];
}

