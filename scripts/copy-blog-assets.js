import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const contentBlogDir = join(rootDir, 'content', 'blog');
const publicBlogDir = join(rootDir, 'public', 'blog');

function copyBlogAssets() {
  if (!existsSync(contentBlogDir)) {
    console.log('No content/blog directory found');
    return;
  }

  if (!existsSync(publicBlogDir)) {
    mkdirSync(publicBlogDir, { recursive: true });
  }

  const blogPosts = readdirSync(contentBlogDir);

  for (const post of blogPosts) {
    const postDir = join(contentBlogDir, post);
    const assetsDir = join(postDir, 'assets');

    if (statSync(postDir).isDirectory() && existsSync(assetsDir)) {
      const targetDir = join(publicBlogDir, post, 'assets');
      
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      cpSync(assetsDir, targetDir, { recursive: true });
      console.log(`Copied assets for ${post}`);
    }
  }

  console.log('Blog assets copied successfully');
}

copyBlogAssets();
