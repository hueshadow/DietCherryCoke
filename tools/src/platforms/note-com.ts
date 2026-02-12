import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type BrowserContext } from 'playwright';
import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.resolve(__dirname, '..', '..', 'data', 'browser-state');
const NOTE_STATE = path.join(STATE_DIR, 'note-com.json');

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
}

async function getContext(): Promise<BrowserContext> {
  ensureStateDir();
  const browser = await chromium.launch({ headless: false });

  if (fs.existsSync(NOTE_STATE)) {
    return browser.newContext({ storageState: NOTE_STATE });
  }

  console.log('\nNo saved Note.com session found. Opening browser for login...');
  console.log('Please log in to Note.com, then press Enter.\n');

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://note.com/login');

  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
  });

  await context.storageState({ path: NOTE_STATE });
  console.log('Session saved.\n');
  return context;
}

export class NoteComPlatform extends Platform {
  name = 'Note.com';
  type = 'playwright' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    let context: BrowserContext | null = null;
    try {
      context = await getContext();
      const page = await context.newPage();

      // Note.com text post editor
      await page.goto('https://note.com/notes/new');
      await page.waitForLoadState('networkidle');

      // Title
      const titleInput = page.locator('textarea[placeholder*="タイトル"], input[name="title"]').first();
      await titleInput.waitFor({ timeout: 15_000 });
      await titleInput.fill(draft.title);

      // Body editor
      const bodyEditor = page.locator('[contenteditable="true"], textarea[name="body"]').first();
      await bodyEditor.waitFor({ timeout: 10_000 });

      for (const line of draft.body.split('\n')) {
        await bodyEditor.type(line);
        await page.keyboard.press('Enter');
      }

      // Publish flow: click 公開設定 then 投稿
      const settingsBtn = page.locator('button:has-text("公開設定"), button:has-text("投稿")').first();
      await settingsBtn.waitFor({ timeout: 10_000 });
      await settingsBtn.click();

      await page.waitForTimeout(2000);
      const publishBtn = page.locator('button:has-text("投稿する"), button:has-text("公開")').first();
      if (await publishBtn.isVisible()) await publishBtn.click();

      await page.waitForURL(/note\.com\/.*\/n\//, { timeout: 30_000 });
      const url = page.url();

      await context.storageState({ path: NOTE_STATE });
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
