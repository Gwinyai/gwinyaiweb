# Supabase Setup Guide for Blog (Updated for Current Dashboard)

## Step 1: Create Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** and sign up (GitHub login is easiest)
3. Once logged in, click **New Project**
4. Fill in the details:
   - **Name**: e.g. `gwinyaiweb-blog`
   - **Database Password**: Choose a strong password **and keep it private**
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: The **Free** tier is fine to start
5. Click **Create new project** and wait for setup to complete (1–2 minutes)

> Important: Never commit your database password or keys to git.

## Step 2: Get Your API Credentials (New Dashboard Layout)

1. In your Supabase project, open the left sidebar
2. Click **Project Settings** (gear icon at the bottom)
3. Under Project Settings, click **API**
4. On this page you’ll see:
   - **Project URL** – looks like `https://your-project-ref.supabase.co`
   - **Project API keys**:
     - **anon (public) key** – safe for client-side use, relies on RLS for security
     - **service_role key** – full access and bypasses RLS, **server-side only**
5. For this frontend blog app you only need:
   - `NEXT_PUBLIC_SUPABASE_URL` = **Project URL**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = **anon public key**

You’ll add these to a `.env.local` file later when we integrate Supabase.

## Step 3: Create the `blog_posts` Table

1. In the left sidebar, click **Table Editor**
2. Click **Create a new table**
3. Configure the table:
   - **Name**: `blog_posts`
   - **Description**: `Blog articles and posts`
   - **Enable Row Level Security (RLS)**: ✅ **Enabled**

4. Add the following columns (click **+ Add column** for each):

| Column Name     | Type       | Default Value       | Primary | Required | Other          |
|-----------------|------------|---------------------|---------|----------|----------------|
| id              | uuid       | `gen_random_uuid()` | ✅ Yes  | ✅ Yes   |                |
| created_at      | timestamptz| `now()`             | ❌ No   | ✅ Yes   |                |
| title           | text       | -                   | ❌ No   | ✅ Yes   |                |
| slug            | text       | -                   | ❌ No   | ✅ Yes   | **Unique ✅**  |
| excerpt         | text       | -                   | ❌ No   | ✅ Yes   |                |
| content         | text       | -                   | ❌ No   | ✅ Yes   |                |
| category        | text       | -                   | ❌ No   | ✅ Yes   |                |
| tags            | text[]     | -                   | ❌ No   | ❌ No    | Array type     |
| published_date  | timestamptz| `now()`             | ❌ No   | ✅ Yes   |                |
| status          | text       | `'draft'`           | ❌ No   | ✅ Yes   | e.g. draft/published |

5. Click **Save** to create the table

## Step 4: Set Up RLS (Row Level Security) Policies

We want the public site to only read posts where `status = 'published'`.

1. In **Table Editor**, open the `blog_posts` table
2. Click the **RLS** tab at the top
3. Make sure RLS is **enabled**
4. Click **New Policy**
5. Configure the policy:
   - **Policy name**: `Public can read published posts`
   - **Policy type**: `SELECT`
   - **Target roles**: `public`
   - **Using expression**:
     ```sql
     status = 'published'
     ```
6. Click **Review** then **Save policy**

This allows anonymous users (using the anon key) to read only published posts.

## Step 5: Add Sample Data (Optional)

You can manually add a couple of posts to match your current mock data:

1. Go to **Table Editor** → `blog_posts`
2. Click **Insert** → **Insert row**
3. Fill in fields like:
   - `title`: e.g. `Getting Started with Modern Web Development`
   - `slug`: `getting-started-modern-web-development`
   - `excerpt`: Short summary
   - `content`: Full HTML/Markdown body (plain text for now)
   - `category`: e.g. `Web Development`
   - `tags`: e.g. `{JavaScript,React,Tutorial}`
   - `status`: `published` (for posts that should appear on the site)
4. Repeat for additional posts

## Step 6: Next.js Environment Variables (Preview)

In your Next.js project (this repo), you will create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Do **not** commit `.env.local` to git.

## Next Steps

Once you’ve completed these steps:

1. Confirm you have:
   - **Project URL**
   - **anon public key**
2. Let me know, and I’ll:
   - Add Supabase client setup to your Next.js app
   - Update the blog list and detail pages to read from `blog_posts`
   - Filter to only show posts where `status = 'published'`

This guide is now aligned with the current Supabase dashboard and API settings.


