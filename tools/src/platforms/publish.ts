import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { Draft } from './base.js';
import { MediumPlatform } from './medium.js';
import { RedditPlatform } from './reddit.js';
import { PatreonPlatform } from './patreon.js';
import { VelogPlatform } from './velog.js';
import { NoteComPlatform } from './note-com.js';
import { PinterestPlatform } from './pinterest.js';
import { ListlyPlatform } from './listly.js';
import { addRecord } from '../tracking/tracker.js';
import { platforms } from '../../config/platforms.js';
import type { Platform } from './base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFTS_DIR = path.resolve(__dirname, '..', '..', 'drafts');

function getPlatformInstance(name: string): Platform {
  switch (name) {
    case 'medium': return new MediumPlatform();
    case 'reddit_post':
    case 'reddit_comment': return new RedditPlatform();
    case 'patreon': return new PatreonPlatform();
    case 'velog': return new VelogPlatform();
    case 'note-com': return new NoteComPlatform();
    case 'pinterest': return new PinterestPlatform();
    case 'listly': return new ListlyPlatform();
    // Future platforms added here
    default: throw new Error(`Platform "${name}" not yet implemented for publishing`);
  }
}

function parseDraft(filePath: string): Draft {
  const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(DRAFTS_DIR, filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Draft not found: ${absPath}`);
  }

  const raw = fs.readFileSync(absPath, 'utf-8');
  const { data, content } = matter(raw);

  if (data.status !== 'approved') {
    throw new Error(`Draft status is "${data.status}" — must be "approved" to publish. Edit the file and set status: approved`);
  }

  // Extract title from first markdown heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : (data.source as string) || 'Untitled';

  return {
    status: data.status,
    platform: data.platform,
    source: data.source,
    targetUrl: data.targetUrl,
    language: data.language || 'en',
    anchors: data.anchors || [],
    title,
    body: content.trim(),
    filePath: absPath,
  };
}

export async function publishDraft(draftPath: string) {
  const draft = parseDraft(draftPath);
  const platformConfig = platforms[draft.platform];
  if (!platformConfig) {
    throw new Error(`Unknown platform "${draft.platform}" in draft frontmatter`);
  }

  console.log(`Publishing to ${platformConfig.name}...`);
  console.log(`  Title: ${draft.title}`);
  console.log(`  Target: ${draft.targetUrl}`);
  console.log(`  Language: ${draft.language}\n`);

  const instance = getPlatformInstance(draft.platform);
  const result = await instance.publish(draft);

  if (!result.success) {
    console.error(`Publish failed: ${result.error}`);
    process.exit(1);
  }

  console.log(`Published successfully: ${result.url}`);

  // Track each anchor as a separate backlink record
  for (const anchor of draft.anchors) {
    addRecord({
      platform: draft.platform,
      url: result.url || '',
      targetUrl: anchor.url,
      anchorText: anchor.text,
      anchorType: anchor.type as 'brand' | 'keyword' | 'longtail' | 'generic' | 'naked',
      linkAttribute: platformConfig.linkAttribute,
      publishedAt: new Date().toISOString().split('T')[0],
      lastCheckedAt: '',
      status: result.url ? 'live' : 'pending',
      language: draft.language,
    });
  }

  // Update draft status to published
  const raw = fs.readFileSync(draft.filePath, 'utf-8');
  fs.writeFileSync(draft.filePath, raw.replace('status: approved', 'status: published'));

  console.log('Tracking records added. Run `status` to see summary.');
}
