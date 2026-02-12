import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'site', 'src', 'data');

export interface SourceContent {
  slug: string;
  collection: string;
  frontmatter: Record<string, unknown>;
  body: string;
  filePath: string;
}

/** List all available source content files */
export function listSources(): SourceContent[] {
  const sources: SourceContent[] = [];
  for (const collection of ['articles', 'comparisons', 'recipes', 'retailers']) {
    const dir = path.join(DATA_DIR, collection);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      sources.push({
        slug: file.replace('.md', ''),
        collection,
        frontmatter: data,
        body: content.trim(),
        filePath,
      });
    }
  }
  return sources;
}

/** Load a single source by collection/slug path (e.g. "articles/is-diet-cherry-coke-back") */
export function loadSource(sourcePath: string): SourceContent {
  const parts = sourcePath.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid source path "${sourcePath}". Use format: collection/slug`);
  }
  const [collection, slug] = parts;
  const filePath = path.join(DATA_DIR, collection, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, collection, frontmatter: data, body: content.trim(), filePath };
}
