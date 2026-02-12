import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

export class MediumPlatform extends Platform {
  name = 'Medium';
  type = 'api' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    const token = process.env.MEDIUM_TOKEN;
    if (!token) return { success: false, error: 'MEDIUM_TOKEN not set in .env' };

    try {
      // Get authenticated user
      const userRes = await fetch('https://api.medium.com/v1/me', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!userRes.ok) return { success: false, error: `Auth failed: ${userRes.status}` };
      const userData = (await userRes.json()) as { data: { id: string } };
      const userId = userData.data.id;

      // Create post
      const postRes = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          contentFormat: 'markdown',
          content: draft.body,
          publishStatus: 'draft', // publish as Medium draft first for safety
          tags: ['DietCherryCoke', 'DietSoda', 'CocaCola', 'FoodAndDrink', 'Soda'],
        }),
      });

      if (!postRes.ok) {
        const err = await postRes.text();
        return { success: false, error: `Publish failed (${postRes.status}): ${err}` };
      }

      const postData = (await postRes.json()) as { data: { url: string } };
      return { success: true, url: postData.data.url };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  async checkLink(url: string): Promise<LinkStatus> {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      return { url, alive: res.ok, statusCode: res.status, checkedAt: this.now() };
    } catch {
      return { url, alive: false, checkedAt: this.now() };
    }
  }
}
