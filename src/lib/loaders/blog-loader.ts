import { parseMarkdownWithFrontmatter } from '../utils/markdown';
import { BLOG_POST_MODULES } from './astro-adapter';

export interface BlogPost {
  title: string;
  date: Date;
  content: string;
  slug: string;
  baseUrl: string;
}

function extractSlugFromPath(filePath: string): string {
  const match = filePath.match(/blog\/([^/]+)\/README\.md$/);
  if (!match) {
    throw new Error(`Cannot extract slug from path: ${filePath}`);
  }
  return match[1];
}

/**
 * Extracts a date from a slug string.
 * Supports patterns like "Report-2026-04-06-18-07-08" or "2026-04-06-some-title".
 * Returns null if no recognizable date pattern is found.
 */
export function extractDateFromSlug(slug: string): Date | null {
  // Match YYYY-MM-DD pattern anywhere in the slug
  const dateMatch = slug.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

export function loadBlogPosts(): BlogPost[] {
  const entries = Object.entries(BLOG_POST_MODULES);

  if (entries.length === 0) {
    throw new Error('No blog posts found in content/blog/*/README.md');
  }

  const posts: BlogPost[] = [];

  for (const [filePath, content] of entries) {
    const parsed = parseMarkdownWithFrontmatter(content);
    const slug = extractSlugFromPath(filePath);
    const fileURL = new URL(filePath, import.meta.url).href;

    // Resolve date: frontmatter → slug → fallback to epoch
    const date = parsed.date ?? extractDateFromSlug(slug) ?? new Date(0);

    const title = parsed.title ?? slug;

    posts.push({
      title,
      date,
      content: parsed.content,
      slug,
      baseUrl: fileURL,
    });
  }

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return posts;
}