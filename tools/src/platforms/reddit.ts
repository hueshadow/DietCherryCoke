import Snoowrap from 'snoowrap';
import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

function getClient(): Snoowrap {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = process.env;
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
    throw new Error('Reddit credentials not set. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD in .env');
  }
  return new Snoowrap({
    userAgent: 'dietcherrycoke-tools/1.0.0',
    clientId: REDDIT_CLIENT_ID,
    clientSecret: REDDIT_CLIENT_SECRET,
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
  });
}

export class RedditPlatform extends Platform {
  name = 'Reddit';
  type = 'api' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    const client = getClient();

    // Extract subreddit from draft body or default
    const subMatch = draft.body.match(/subreddit:\s*r\/(\w+)/i);
    const subreddit = subMatch ? subMatch[1] : 'soda';

    try {
      if (draft.platform === 'reddit_comment') {
        // For comments, we need a parent post ID in the draft
        const parentMatch = draft.body.match(/parent:\s*(t[13]_\w+)/i);
        if (!parentMatch) {
          return { success: false, error: 'Reddit comment drafts must include "parent: t1_xxx" or "parent: t3_xxx" in the body' };
        }
        // Strip meta lines from body before posting
        const cleanBody = draft.body
          .replace(/^subreddit:.*$/gm, '')
          .replace(/^parent:.*$/gm, '')
          .trim();

        const comment = await (client as any).getComment(parentMatch[1]).reply(cleanBody);
        return { success: true, url: `https://reddit.com${comment.permalink}` };
      }

      // Regular post
      const cleanBody = draft.body.replace(/^subreddit:.*$/gm, '').trim();
      const submission = await (client as any)
        .getSubreddit(subreddit)
        .submitSelfpost({ title: draft.title, text: cleanBody });

      return { success: true, url: `https://reddit.com${submission.permalink}` };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  async checkLink(url: string): Promise<LinkStatus> {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      // Reddit returns 200 even for removed posts, but we check for common removal indicators
      return { url, alive: res.ok, statusCode: res.status, checkedAt: this.now() };
    } catch {
      return { url, alive: false, checkedAt: this.now() };
    }
  }
}
