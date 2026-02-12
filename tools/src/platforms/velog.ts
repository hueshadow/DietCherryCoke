import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type BrowserContext } from 'playwright';
import { Platform, type Draft, type PublishResult, type LinkStatus } from './base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.resolve(__dirname, '..', '..', 'data', 'browser-state');
const VELOG_STATE = path.join(STATE_DIR, 'velog.json');

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
}

async function getContext(): Promise<BrowserContext> {
  ensureStateDir();
  const browser = await chromium.launch({ headless: false });

  if (fs.existsSync(VELOG_STATE)) {
    return browser.newContext({ storageState: VELOG_STATE });
  }

  console.log('\nNo saved Velog session found. Opening browser for GitHub OAuth login...');
  console.log('Please log in to Velog via GitHub, then press Enter.\n');

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://velog.io/');

  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
  });

  await context.storageState({ path: VELOG_STATE });
  console.log('Session saved.\n');
  return context;
}

export class VelogPlatform extends Platform {
  name = 'Velog';
  type = 'playwright' as const;

  async publish(draft: Draft): Promise<PublishResult> {
    let context: BrowserContext | null = null;
    try {
      context = await getContext();
      const page = await context.newPage();

      await page.goto('https://velog.io/write');
      await page.waitForLoadState('networkidle');

      // Velog uses a markdown editor
      const titleInput = page.locator('textarea[placeholder*="제목"], input[placeholder*="Title"]').first();
      await titleInput.waitFor({ timeout: 15_000 });
      await titleInput.fill(draft.title);

      // Body — Velog uses CodeMirror or a textarea for markdown
      const bodyEditor = page.locator('.CodeMirror textarea, textarea.codemirror-textarea, [class*="editor"] textarea').first();
      await bodyEditor.waitFor({ timeout: 10_000 });
      await bodyEditor.fill(draft.body);

      // Click publish button (출간하기)
      const publishBtn = page.locator('button:has-text("출간하기"), button:has-text("Publish")').first();
      await publishBtn.waitFor({ timeout: 10_000 });
      await publishBtn.click();

      // Confirm publish in the modal
      await page.waitForTimeout(2000);
      const confirmBtn = page.locator('button:has-text("출간하기")').last();
      if (await confirmBtn.isVisible()) await confirmBtn.click();

      await page.waitForURL(/velog\.io\/@/, { timeout: 30_000 });
      const url = page.url();

      await context.storageState({ path: VELOG_STATE });
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
