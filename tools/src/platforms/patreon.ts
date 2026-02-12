import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type BrowserContext } from 'playwright';
import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.resolve(__dirname, '..', '..', 'data', 'browser-state');
const PATREON_STATE = path.join(STATE_DIR, 'patreon.json');

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
}

async function getContext(): Promise<BrowserContext> {
  ensureStateDir();
  const browser = await chromium.launch({ headless: false });

  if (fs.existsSync(PATREON_STATE)) {
    return browser.newContext({ storageState: PATREON_STATE });
  }

  // First run: manual login flow
  console.log('\nNo saved Patreon session found. Opening browser for manual login...');
  console.log('Please log in to Patreon, then press Enter in this terminal.\n');

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.patreon.com/login');

  // Wait for user to complete login
  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
  });

  await context.storageState({ path: PATREON_STATE });
  console.log('Session saved to data/browser-state/patreon.json\n');
  return context;
}

export class PatreonPlatform extends Platform {
  name = 'Patreon';
  type = 'playwright' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    let context: BrowserContext | null = null;
    try {
      context = await getContext();
      const page = await context.newPage();

      // Navigate to post creation
      await page.goto('https://www.patreon.com/posts/new');
      await page.waitForLoadState('networkidle');

      // Patreon's editor — fill title and body
      // Note: Patreon's UI changes frequently, selectors may need updating
      const titleInput = page.locator('[data-tag="post-title"] [contenteditable], [aria-label="Title"]').first();
      await titleInput.waitFor({ timeout: 15_000 });
      await titleInput.fill(draft.title);

      // Fill body content — Patreon uses a rich text editor
      const bodyEditor = page.locator('[data-tag="post-body"] [contenteditable], [aria-label*="content"]').first();
      await bodyEditor.waitFor({ timeout: 10_000 });

      // Type content line by line to handle markdown-like formatting
      for (const line of draft.body.split('\n')) {
        await bodyEditor.type(line);
        await page.keyboard.press('Enter');
      }

      // Set to public visibility
      const visibilityBtn = page.locator('button:has-text("Public"), [data-tag="visibility-selector"]').first();
      if (await visibilityBtn.isVisible()) {
        await visibilityBtn.click();
        const publicOption = page.locator('text=Public').first();
        if (await publicOption.isVisible()) await publicOption.click();
      }

      // Publish
      const publishBtn = page.locator('button:has-text("Publish"), button:has-text("Post")').first();
      await publishBtn.waitFor({ timeout: 10_000 });
      await publishBtn.click();

      // Wait for navigation to the published post
      await page.waitForURL(/patreon\.com\/posts\//, { timeout: 30_000 });
      const url = page.url();

      await context.storageState({ path: PATREON_STATE }); // refresh session
      return { success: true, url };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    } finally {
      if (context) await context.browser()?.close();
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
