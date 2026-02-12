import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { loadSource, type SourceContent } from './content-loader.js';
import { buildPrompt } from './templates.js';
import { platforms, type PlatformConfig } from '../../config/platforms.js';
import { pickAnchor } from '../../config/anchors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFTS_DIR = path.resolve(__dirname, '..', '..', 'drafts');
const SITE_URL = process.env.SITE_URL || 'https://dietcherrycoke.net';

export interface GenerateOptions {
  platform: string;
  source: string;
  lang?: string;
  model?: string;
}

function ensureDraftsDir() {
  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

function sourceUrl(source: SourceContent): string {
  return `${SITE_URL}/${source.collection}/${source.slug}`;
}

export async function generate(opts: GenerateOptions): Promise<string> {
  const platformConfig = platforms[opts.platform];
  if (!platformConfig) {
    throw new Error(`Unknown platform "${opts.platform}". Available: ${Object.keys(platforms).join(', ')}`);
  }

  const lang = opts.lang || platformConfig.languages[0] || 'en';
  const source = loadSource(opts.source);
  const targetUrl = sourceUrl(source);

  // Pick anchors for this draft
  const anchors = Array.from({ length: platformConfig.maxLinks }, () => pickAnchor(targetUrl));

  const prompt = buildPrompt({ source, platform: platformConfig, anchors, language: lang });

  const openai = new OpenAI();
  const model = opts.model || 'gpt-4o-mini';

  console.log(`Generating ${platformConfig.name} draft (${lang}) from "${source.frontmatter.title}"...`);
  console.log(`Model: ${model} | Target: ${platformConfig.contentLength.min}–${platformConfig.contentLength.max} words`);

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from AI');

  // Write draft file
  ensureDraftsDir();
  const date = new Date().toISOString().split('T')[0];
  const filename = `${opts.platform}-${source.slug}-${date}.md`;
  const filePath = path.join(DRAFTS_DIR, filename);

  const frontmatter = buildFrontmatter({
    platform: opts.platform,
    source: opts.source,
    targetUrl,
    anchors,
    lang,
    model,
    date,
  });

  fs.writeFileSync(filePath, `${frontmatter}\n${content}\n`);
  console.log(`\nDraft saved: drafts/${filename}`);
  console.log('Status: draft — edit the file and change status to "approved" when ready to publish.');

  return filePath;
}

interface FrontmatterData {
  platform: string;
  source: string;
  targetUrl: string;
  anchors: { text: string; type: string; url: string }[];
  lang: string;
  model: string;
  date: string;
}

function buildFrontmatter(data: FrontmatterData): string {
  const anchorYaml = data.anchors
    .map((a) => `  - text: "${a.text}"\n    type: ${a.type}\n    url: ${a.url}`)
    .join('\n');

  return `---
status: draft
platform: ${data.platform}
source: ${data.source}
targetUrl: ${data.targetUrl}
language: ${data.lang}
generatedAt: ${data.date}
model: ${data.model}
anchors:
${anchorYaml}
---`;
}
