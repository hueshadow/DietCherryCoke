import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type BrowserContext } from 'playwright';
import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.resolve(__dirname, '..', '..', 'data', 'browser-state');
const LISTLY_STATE = path.join(STATE_DIR, 'listly.json');

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
}

async function getContext(): Promise<BrowserContext> {
  ensureStateDir();
  const browser = await chromium.launch({ headless: false });

  if (fs.existsSync(LISTLY_STATE)) {
    return browser.newContext({ storageState: LISTLY_STATE });
  }

  console.log('\nNo saved List.ly session found. Opening browser for login...');
  console.log('Please log in to List.ly, then press Enter.\n');

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://list.ly/login');

  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
  });

  await context.storageState({ path: LISTLY_STATE });
  console.log('Session saved.\n');
  return context;
}

export class ListlyPlatform extends Platform {
  name = 'List.ly';
  type = 'playwright' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    let context: BrowserContext | null = null;
    try {
      context = await getContext();
      const page = await context.newPage();

      await page.goto('https://list.ly/list/create');
      await page.waitForLoadState('networkidle');

      // List title
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first();
      await titleInput.waitFor({ timeout: 15_000 });
      await titleInput.fill(draft.title);

      // Description
      const descInput = page.locator('textarea[name="description"], textarea[placeholder*="description"]').first();
      if (await descInput.isVisible()) {
        await descInput.fill(draft.body.slice(0, 500));
      }

      // Add list items — parse from draft body (lines starting with "- ")
      const items = draft.body.split('\n').filter((l) => l.startsWith('- '));
      for (const item of items) {
        const addBtn = page.locator('button:has-text("Add Item"), a:has-text("Add")').first();
        if (await addBtn.isVisible()) {
          await addBtn.click();
          await page.waitForTimeout(1000);
          const itemInput = page.locator('input[name="item"], input[placeholder*="item"]').last();
          if (await itemInput.isVisible()) {
            await itemInput.fill(item.replace(/^-\s*/, ''));
            await page.keyboard.press('Enter');
          }
        }
      }

      // Save/publish
      const saveBtn = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Publish")').first();
      await saveBtn.waitFor({ timeout: 10_000 });
      await saveBtn.click();

      await page.waitForURL(/list\.ly\/list\//, { timeout: 30_000 });
      const url = page.url();

      await context.storageState({ path: LISTLY_STATE });
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
