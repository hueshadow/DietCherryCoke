import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

export class PinterestPlatform extends Platform {
  name = 'Pinterest';
  type = 'api' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    const token = process.env.PINTEREST_ACCESS_TOKEN;
    if (!token) return { success: false, error: 'PINTEREST_ACCESS_TOKEN not set in .env' };

    try {
      // Extract board ID from draft body or use default
      const boardMatch = draft.body.match(/board:\s*(\S+)/i);
      const boardId = boardMatch ? boardMatch[1] : '';
      if (!boardId) {
        return { success: false, error: 'Pinterest drafts must include "board: <board_id>" in the body' };
      }

      const cleanBody = draft.body.replace(/^board:.*$/gm, '').trim();

      const res = await fetch('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: boardId,
          title: draft.title,
          description: cleanBody,
          link: draft.targetUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: `Pinterest API error (${res.status}): ${err}` };
      }

      const data = (await res.json()) as { id: string };
      const pinUrl = `https://www.pinterest.com/pin/${data.id}/`;
      return { success: true, url: pinUrl };
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
