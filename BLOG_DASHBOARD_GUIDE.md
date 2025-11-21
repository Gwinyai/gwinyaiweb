# Blog Admin Dashboard Guide (for Frontend Engineers)

This document explains how to build an **admin dashboard** for managing blog posts that are displayed on the existing site. It focuses on:

- The **Supabase schema** (tables and relations)
- The **expected data shape** for each table
- How that data is used by the **current blog layout** (list page, sidebar, detail page)

It intentionally avoids UI/UX details – you are free to design the dashboard however you like.

---

## 1. Supabase Schema Overview

The blog feature is backed by four main tables:

1. `blog_posts`
2. `categories`
3. `tags`
4. `post_tags` (junction table between posts and tags)

Row Level Security (RLS) is enabled so that the **public website** (using the `anon` key) can only read **published** content.  
Your **admin dashboard** should use a **secure backend** (or Supabase server-side client with the `service_role` key) to create and update data.

### 1.1 `blog_posts`

Stores the core article content.

| Column          | Type        | Notes                                                                 |
|-----------------|-------------|-----------------------------------------------------------------------|
| `id`            | `uuid`      | Primary key, `gen_random_uuid()`                                     |
| `created_at`    | `timestamptz` | Defaults to `now()`                                                |
| `title`         | `text`      | Required                                                             |
| `slug`          | `text`      | Required, **unique**, used in URL: `/blog/[slug]`                    |
| `excerpt`       | `text`      | Required, short summary shown in list view                           |
| `content`       | `text`      | Required, full HTML/markdown-ish body rendered on detail page        |
| `category_id`   | `uuid`      | FK → `categories.id`, required                                       |
| `published_date`| `timestamptz` | When the post is (or will be) published                            |
| `status`        | `text`      | Required, values like `'draft'` or `'published'`                     |

**RLS policy for public site:**

```sql
status = 'published'
```

So only posts with `status = 'published'` are visible on the public blog.

#### Expected values (for dashboard)

When creating/editing a post from the admin dashboard:

- `title`: Human-readable title
- `slug`: URL-safe identifier, e.g. `"getting-started-modern-web-development"`
- `excerpt`: 1–3 sentence summary
- `content`: HTML string (or markdown rendered to HTML) used by `dangerouslySetInnerHTML`
- `category_id`: Chosen from existing `categories` table
- `status`:
  - `'draft'` – not visible on public site
  - `'published'` – visible on public site (assuming RLS condition is met)
- `published_date`:
  - Often set to `now()` when moving to `'published'`
  - Used for ordering (newest first) and display

---

### 1.2 `categories`

Represents distinct blog categories (mapped 1:many to posts).

| Column       | Type        | Notes                                   |
|--------------|-------------|-----------------------------------------|
| `id`         | `uuid`      | Primary key                             |
| `name`       | `text`      | Required, human-readable label          |
| `slug`       | `text`      | Required, unique, URL-safe identifier   |
| `created_at` | `timestamptz` | Defaults to `now()`                   |

**Examples:**

- `name`: `"Web Development"`, `slug`: `"web-development"`
- `name`: `"Software Architecture"`, `slug`: `"software-architecture"`

The blog list page joins `blog_posts.category_id` → `categories.id` to display the category name.

#### Dashboard operations

- Create new categories
- Edit `name` / `slug`
- Optionally prevent deletion if there are posts referencing a category

---

### 1.3 `tags`

Represents distinct tags (many:many with posts).

| Column       | Type        | Notes                                   |
|--------------|-------------|-----------------------------------------|
| `id`         | `uuid`      | Primary key                             |
| `name`       | `text`      | Required, human-readable label          |
| `slug`       | `text`      | Required, unique, URL-safe identifier   |
| `created_at` | `timestamptz` | Defaults to `now()`                   |

**Examples:**

- `name`: `"React"`, `slug`: `"react"`
- `name`: `"TypeScript"`, `slug`: `"typescript"`
- `name`: `"Scalability"`, `slug`: `"scalability"`

Tags are not directly on `blog_posts`; they are connected via `post_tags`.

---

### 1.4 `post_tags` (junction table)

Many-to-many relationship between posts and tags.

| Column       | Type        | Notes                                         |
|--------------|-------------|-----------------------------------------------|
| `post_id`    | `uuid`      | FK → `blog_posts.id`, part of primary key     |
| `tag_id`     | `uuid`      | FK → `tags.id`, part of primary key           |
| `created_at` | `timestamptz` | Defaults to `now()`                         |

Primary key: `(post_id, tag_id)` to avoid duplicates.

#### Dashboard operations

When you edit a post’s tags:

- Look up or create each tag in `tags` by `name`/`slug`
- Upsert entries in `post_tags` for the chosen `tag_id`s
- Remove `post_tags` rows that are no longer selected for that post

---

## 2. How the Frontend Uses the Data

This section explains what the **public blog** expects from the database so you can align the dashboard fields and workflows.

### 2.1 Blog list page (`/blog`)

The list page:

- Fetches **published posts** from `blog_posts`
- Joins `categories` and the `post_tags → tags` relation
- Displays:
  - **Title** – from `blog_posts.title`
  - **Date** – formatted from `published_date`
  - **Category** – from `categories.name`
  - **Excerpt** – from `blog_posts.excerpt`
  - **Tags** – a list of `tags.name`
  - **Read More** link – uses `slug` → `/blog/[slug]`

The sidebar uses the same fetched data to build:

- **Categories list with counts**
  - Derived from grouping posts by `category.name`
- **Recent posts**
  - Top 3 posts by `published_date`
- **Recent tags (max ~15)**
  - Iterates posts from newest to oldest and collects unique tags in order of use

#### Implications for dashboard

- Every **published** post should have:
  - A valid `category_id`
  - At least a `title`, `excerpt`, `content`, `slug`, `status`, `published_date`
  - Zero or more associated tags via `post_tags`
- Draft posts (`status = 'draft'`) are fine without complete metadata, since they are not shown publicly.

---

### 2.2 Blog detail page (`/blog/[slug]`)

For a given `slug`, the detail page:

1. Fetches a single **published** post (matching `slug` and `status = 'published'`)
2. Joins:
   - `categories` → displays category name
   - `post_tags → tags` → displays tag names
3. Renders:

- **Post title**
- **Published date**
- **Category**
- **Tag chips**
- **Content** (HTML) via `dangerouslySetInnerHTML`

#### Implications for dashboard

- `slug` must be **unique** and stable – changing it changes the URL.
- `content` should be stored as HTML (or markdown rendered to HTML by the admin project) so the existing page can render it directly.
- Toggling a post from `draft` → `published` controls when it becomes visible.
- You can schedule posts by:
  - Setting `status = 'published'` and `published_date` in the future (then adjusting frontend logic later), or
  - Only flipping `status` when actually ready (current frontend only checks `status`).

---

## 3. Admin Dashboard Responsibilities

From a frontend engineer’s perspective, the admin dashboard needs to support:

### 3.1 Authentication & API usage

- Use **Supabase client with the `service_role` key** only on a **secure server** (not in the browser), or expose admin APIs from a separate backend.
- The dashboard frontend should talk to that backend, not directly use `service_role` in the browser.

### 3.2 CRUD for categories

Operations:

- **List categories** (id, name, slug, created_at)
- **Create** new category
  - Generate `slug` from `name` (e.g. lowercased, spaces → hyphens)
- **Edit** category name/slug
- **Delete** category (only if not used by any `blog_posts.category_id`, or handle reassignment)

### 3.3 CRUD for tags

Operations:

- **List tags** (id, name, slug, created_at)
- **Create** tag
- **Edit** tag name/slug
- **Delete** tag (optionally prevent if used in `post_tags`)

Tags will be attached to posts via the post editor (next section).

### 3.4 CRUD for blog posts

Core operations:

- **List posts**:
  - Show title, status, category name, published_date, created_at
- **Create / edit post**:
  - Fields:
    - `title`
    - `slug` (auto-generate from title with option to override)
    - `excerpt`
    - `content` (HTML or markdown editor that you convert to HTML before saving)
    - `category_id` (select from categories)
    - `status` (`draft` or `published`)
    - `published_date` (auto `now()` when first publishing, editable)
  - Tag selection:
    - Multi-select existing tags
    - Ability to create a new tag on the fly (then attach via `post_tags`)
- **Delete post**:
  - Remove row from `blog_posts` (and rely on `on delete cascade` in `post_tags`).

### 3.5 Desired dashboard flows

**Create a new post:**

1. Choose or create a category.
2. Fill out title, slug, excerpt, content.
3. Pick tags from existing tag list or add new tags.
4. Save as `draft`.
5. When ready, change `status` to `published` and set `published_date` (usually `now()`).

**Edit an existing post:**

1. Change content, title, or excerpt as needed.
2. Optionally change category or tags.
3. Update `status`:
   - Keep as `draft` if not ready.
   - Set to `published` to make it live.

**Unpublish a post:**

- Change `status` from `published` to `draft`.  
  The public blog will stop showing it because it only queries `status = 'published'`.

---

## 4. How the Dashboard and Public Site Fit Together

### Public site responsibilities

- Read-only access using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Only queries **published** content:
  - Blog list uses joins to derive category + tags.
  - Detail page uses slug + status filter.
  - Sidebar derives categories + recent tags from fetched posts.

### Dashboard responsibilities

- Write access (create/update/delete rows) via a secure backend:
  - Ensures consistent use of:
    - `categories` + `category_id`
    - `tags` + `post_tags`
    - `status` and `published_date`
- Keeps the data model clean so the public site stays simple and fast.

With this guide, a frontend engineer can implement the admin dashboard knowing exactly:

- Which tables exist and how they relate
- What fields need to be edited
- How the public blog consumes that data today



