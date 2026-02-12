export type PlatformType = 'api' | 'playwright';
export type LinkAttribute = 'dofollow' | 'nofollow';

export interface PlatformConfig {
  name: string;
  type: PlatformType;
  linkAttribute: LinkAttribute;
  tier: 1 | 2 | 3 | 4;
  rateLimit: { maxPerDay: number; cooldownHours: number };
  contentLength: { min: number; max: number };
  maxLinks: number;
  style: string;
  tags?: string[];
  languages: string[];
}

export const platforms: Record<string, PlatformConfig> = {
  medium: {
    name: 'Medium',
    type: 'api',
    linkAttribute: 'nofollow',
    tier: 1,
    rateLimit: { maxPerDay: 1, cooldownHours: 48 },
    contentLength: { min: 1000, max: 1200 },
    maxLinks: 3,
    style: 'news/review article with engaging hook',
    tags: ['#DietCherryCoke', '#DietSoda', '#CocaCola', '#FoodAndDrink', '#Soda'],
    languages: ['en'],
  },
  reddit_post: {
    name: 'Reddit Post',
    type: 'api',
    linkAttribute: 'nofollow',
    tier: 3,
    rateLimit: { maxPerDay: 1, cooldownHours: 24 },
    contentLength: { min: 200, max: 400 },
    maxLinks: 1,
    style: 'casual, authentic, conversational — link at the end only',
    languages: ['en'],
  },
  reddit_comment: {
    name: 'Reddit Comment',
    type: 'api',
    linkAttribute: 'nofollow',
    tier: 3,
    rateLimit: { maxPerDay: 5, cooldownHours: 4 },
    contentLength: { min: 50, max: 150 },
    maxLinks: 1,
    style: 'conversational, helpful, link as supplementary resource',
    languages: ['en'],
  },
  patreon: {
    name: 'Patreon',
    type: 'playwright',
    linkAttribute: 'dofollow',
    tier: 1,
    rateLimit: { maxPerDay: 1, cooldownHours: 72 },
    contentLength: { min: 1000, max: 1500 },
    maxLinks: 4,
    style: 'in-depth guide with sections and expert tone',
    languages: ['en'],
  },
  velog: {
    name: 'Velog',
    type: 'playwright',
    linkAttribute: 'dofollow',
    tier: 1,
    rateLimit: { maxPerDay: 1, cooldownHours: 72 },
    contentLength: { min: 800, max: 1000 },
    maxLinks: 3,
    style: 'tech blog style, informative',
    languages: ['ko'],
  },
  'note-com': {
    name: 'Note.com',
    type: 'playwright',
    linkAttribute: 'dofollow',
    tier: 2,
    rateLimit: { maxPerDay: 1, cooldownHours: 72 },
    contentLength: { min: 600, max: 800 },
    maxLinks: 2,
    style: 'essay/journal style, personal and reflective',
    languages: ['ja'],
  },
  pinterest: {
    name: 'Pinterest',
    type: 'api',
    linkAttribute: 'nofollow',
    tier: 2,
    rateLimit: { maxPerDay: 5, cooldownHours: 4 },
    contentLength: { min: 100, max: 200 },
    maxLinks: 1,
    style: 'short description with hashtags',
    languages: ['en'],
  },
  listly: {
    name: 'List.ly',
    type: 'playwright',
    linkAttribute: 'dofollow',
    tier: 2,
    rateLimit: { maxPerDay: 1, cooldownHours: 72 },
    contentLength: { min: 200, max: 500 },
    maxLinks: 5,
    style: 'curated list with brief descriptions per item',
    languages: ['en'],
  },
};
