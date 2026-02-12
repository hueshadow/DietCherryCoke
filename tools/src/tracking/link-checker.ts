import { loadTracking, saveTracking, syncToMarkdown, type BacklinkRecord } from './tracker.js';

const CONCURRENCY = 5;
const TIMEOUT_MS = 10_000;

async function checkUrl(url: string): Promise<{ alive: boolean; statusCode?: number }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { alive: res.ok, statusCode: res.status };
  } catch {
    return { alive: false };
  }
}

async function checkBatch(records: BacklinkRecord[]): Promise<void> {
  const results = await Promise.all(
    records.map(async (r) => {
      if (!r.url) return { ...r, status: 'pending' as const };
      const { alive, statusCode } = await checkUrl(r.url);
      return {
        ...r,
        status: alive ? ('live' as const) : ('dead' as const),
        lastCheckedAt: new Date().toISOString().split('T')[0],
      };
    })
  );

  const all = loadTracking();
  for (const updated of results) {
    const idx = all.findIndex((r) => r.id === updated.id);
    if (idx !== -1) all[idx] = updated;
  }
  saveTracking(all);
}

export async function checkLinks() {
  const records = loadTracking();
  if (records.length === 0) {
    console.log('No backlinks to check. Publish some content first.');
    return;
  }

  console.log(`Checking ${records.length} backlinks...\n`);

  // Process in batches for concurrency control
  for (let i = 0; i < records.length; i += CONCURRENCY) {
    const batch = records.slice(i, i + CONCURRENCY);
    await checkBatch(batch);

    for (const r of batch) {
      const icon = !r.url ? '⬜' : r.status === 'live' ? '✅' : '❌';
      console.log(`  ${icon} ${r.platform.padEnd(14)} ${r.url || '(no URL)'}`);
    }
  }

  // Reload after all updates
  const updated = loadTracking();
  const live = updated.filter((r) => r.status === 'live').length;
  const dead = updated.filter((r) => r.status === 'dead').length;
  const pending = updated.filter((r) => r.status === 'pending').length;

  console.log(`\nResults: ${live} live, ${dead} dead, ${pending} pending`);

  // Sync to markdown
  syncToMarkdown();
}
