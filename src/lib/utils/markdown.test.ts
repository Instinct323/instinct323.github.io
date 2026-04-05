import { describe, expect, it } from 'vitest';
import { parseMarkdownWithFrontmatter, renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders basic markdown', () => {
    const input = '# Hello\n\nThis is **bold** text.';
    const result = renderMarkdown(input);
    expect(result).toContain('<h1>Hello</h1>');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('resolves relative image paths with fileURL', () => {
    const input = '![alt text](assets/image.png)';
    const fileURL = 'file:///content/blog/post1/README.md';
    const result = renderMarkdown(input, { fileURL });
    expect(result).toContain('src="/blog/post1/assets/image.png"');
  });

  it('does not modify absolute URLs', () => {
    const input = '![alt](https://example.com/image.png)';
    const fileURL = 'file:///content/blog/post1/README.md';
    const result = renderMarkdown(input, { fileURL });
    expect(result).toContain('src="https://example.com/image.png"');
  });

  it('converts file:// URLs to web-accessible paths for content assets', () => {
    const input = '![alt text](assets/image.png)';
    const fileURL = 'file:///mnt/d/Workbench/Lab/opencode/github.io/content/blog/opencode-config/README.md';
    const result = renderMarkdown(input, { fileURL });
    expect(result).toContain('/blog/opencode-config/assets/image.png');
    expect(result).not.toContain('file://');
  });
});

describe('parseMarkdownWithFrontmatter', () => {
  it('extracts title from valid frontmatter', () => {
    const input = `---
title: Hello World
---

# Content here`;

    const result = parseMarkdownWithFrontmatter(input);
    expect(result.title).toBe('Hello World');
    expect(result.content).toBe('# Content here');
  });

  it('throws on missing frontmatter', () => {
    const input = `# Just content
No frontmatter here`;

    expect(typeof parseMarkdownWithFrontmatter).toBe('function');
    expect(() => parseMarkdownWithFrontmatter(input)).toThrow('frontmatter');
  });

  it('throws on malformed frontmatter', () => {
    const input = `---
invalid: yaml: content: here
---

# Content`;

    expect(typeof parseMarkdownWithFrontmatter).toBe('function');
    expect(() => parseMarkdownWithFrontmatter(input)).toThrow();
  });

  it('throws on empty title', () => {
    const input = `---
title: 
---

# Content`;

    expect(typeof parseMarkdownWithFrontmatter).toBe('function');
    expect(() => parseMarkdownWithFrontmatter(input)).toThrow('title');
  });
});