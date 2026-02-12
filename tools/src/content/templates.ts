import type { PlatformConfig } from '../../config/platforms.js';
import type { SourceContent } from './content-loader.js';

const SITE_URL = process.env.SITE_URL || 'https://dietcherrycoke.net';

interface TemplateInput {
  source: SourceContent;
  platform: PlatformConfig;
  anchors: { text: string; type: string; url: string }[];
  language: string;
}

function sourceUrl(source: SourceContent): string {
  return `${SITE_URL}/${source.collection}/${source.slug}`;
}

function anchorLinks(anchors: TemplateInput['anchors']): string {
  return anchors.map((a) => `- Anchor: "${a.text}" → ${a.url}`).join('\n');
}

export function buildPrompt(input: TemplateInput): string {
  const { source, platform, anchors, language } = input;
  const url = sourceUrl(source);

  const langInstruction = language !== 'en'
    ? `\nIMPORTANT: Write the ENTIRE article in ${language === 'ko' ? 'Korean (한국어)' : 'Japanese (日本語)'}. The anchor text for links should also feel natural in that language.`
    : '';

  const platformSpecific = getPlatformInstructions(platform.name, source);

  return `You are a content writer creating a ${platform.style} for ${platform.name}.
${langInstruction}

## Source Material
Title: ${source.frontmatter.title}
Description: ${source.frontmatter.description}
URL: ${url}

## Source Content (use as reference, do NOT copy verbatim)
${source.body.slice(0, 3000)}

## Links to Embed
${anchorLinks(anchors)}

## Requirements
- Word count: ${platform.contentLength.min}–${platform.contentLength.max} words
- Maximum ${platform.maxLinks} links to dietcherrycoke.net
- Links must feel natural and add value — never forced
- Do NOT mention that this is AI-generated or promotional
- Write as a genuine enthusiast sharing useful information
${platform.tags ? `- Include these tags at the end: ${platform.tags.join(', ')}` : ''}

${platformSpecific}

Output ONLY the article content (title + body). No meta-commentary.`;
}

function getPlatformInstructions(name: string, source: SourceContent): string {
  switch (name) {
    case 'Medium':
      return `## Medium-Specific
- Start with a compelling hook in the first 100 words
- Use subheadings (##) to break up sections
- End with a clear CTA directing readers to the source
- Tone: informative, slightly opinionated, accessible`;

    case 'Reddit Post':
      return `## Reddit-Specific
- Write like a real person sharing a discovery, NOT a marketer
- Use casual language, contractions, personal anecdotes
- Only place the link at the very end as a "resource" or "more info"
- No hashtags, no formal structure — just natural paragraphs`;

    case 'Reddit Comment':
      return `## Reddit Comment-Specific
- Keep it short and directly helpful
- The comment should stand on its own without the link
- Link is optional supplementary info, not the point
- Match the tone of r/soda or r/CocaCola communities`;

    case 'Patreon':
      return `## Patreon-Specific
- Write a comprehensive, in-depth guide with clear sections
- Include personal insights and expert analysis
- Links should be woven naturally into relevant sections
- Tone: authoritative but approachable, like a knowledgeable friend`;

    case 'Velog':
      return `## Velog-Specific
- Write in Korean tech blog style (정보성 블로그)
- Use markdown formatting with headers and code-style highlights
- Include a brief intro about why this topic matters to Korean readers
- Links placed naturally within informational context`;

    case 'Note.com':
      return `## Note.com-Specific
- Write in Japanese essay/journal style (エッセイ風)
- Personal and reflective tone, sharing a discovery
- Shorter paragraphs, conversational flow
- Links as "参考" (reference) at natural points`;

    case 'Pinterest':
      return `## Pinterest-Specific
- Write a short, enticing description
- Include relevant hashtags at the end
- Focus on visual appeal and actionability
- Format: 2-3 sentences + hashtags`;

    case 'List.ly':
      return `## List.ly-Specific
- Create a ranked/curated list format
- Each item gets a brief 1-2 sentence description
- Links embedded in item descriptions naturally
- Include a compelling list title and intro`;

    default:
      return '';
  }
}
