import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AnchorType } from '../../config/anchors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const TRACKING_PATH = path.join(DATA_DIR, 'tracking.json');
const STRATEGY_DIR = path.resolve(__dirname, '..', '..', '..', 'strategy');
const TRACKER_MD = path.join(STRATEGY_DIR, 'backlink-tracker.md');

export interface BacklinkRecord {
  id: string;
  platform: string;
  url: string;
  targetUrl: string;
  anchorText: string;
  anchorType: AnchorType;
  linkAttribute: 'dofollow' | 'nofollow';
  publishedAt: string;
  lastCheckedAt: string;
  status: 'live' | 'dead' | 'pending';
  language: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadTracking(): BacklinkRecord[] {
  if (!fs.existsSync(TRACKING_PATH)) return [];
  return JSON.parse(fs.readFileSync(TRACKING_PATH, 'utf-8'));
}

export function saveTracking(records: BacklinkRecord[]) {
  ensureDataDir();
  fs.writeFileSync(TRACKING_PATH, JSON.stringify(records, null, 2));
}

export function addRecord(record: Omit<BacklinkRecord, 'id'>): BacklinkRecord {
  const records = loadTracking();
  const id = `bl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const full: BacklinkRecord = { id, ...record };
  records.push(full);
  saveTracking(records);
  return full;
}

export function updateRecord(id: string, updates: Partial<BacklinkRecord>) {
  const records = loadTracking();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Record not found: ${id}`);
  records[idx] = { ...records[idx], ...updates };
  saveTracking(records);
}

export function showStatus() {
  const records = loadTracking();
  if (records.length === 0) {
    console.log('\nNo backlinks tracked yet. Generate and publish some content first.\n');
    return;
  }

  const live = records.filter((r) => r.status === 'live').length;
  const dead = records.filter((r) => r.status === 'dead').length;
  const pending = records.filter((r) => r.status === 'pending').length;

  console.log(`\nBacklink Summary (${records.length} total)`);
  console.log(`  Live: ${live} | Dead: ${dead} | Pending: ${pending}\n`);

  // Group by platform
  const byPlatform = new Map<string, BacklinkRecord[]>();
  for (const r of records) {
    const list = byPlatform.get(r.platform) || [];
    list.push(r);
    byPlatform.set(r.platform, list);
  }

  for (const [platform, recs] of byPlatform) {
    const pLive = recs.filter((r) => r.status === 'live').length;
    console.log(`  ${platform.padEnd(16)} ${pLive}/${recs.length} live`);
  }

  // Anchor distribution
  console.log('\nAnchor Distribution:');
  const anchorCounts: Record<string, number> = {};
  for (const r of records) {
    anchorCounts[r.anchorType] = (anchorCounts[r.anchorType] || 0) + 1;
  }
  const total = records.length;
  for (const [type, count] of Object.entries(anchorCounts)) {
    console.log(`  ${type.padEnd(12)} ${count} (${Math.round((count / total) * 100)}%)`);
  }
  console.log('');
}

/** Sync tracking.json data into strategy/backlink-tracker.md */
export function syncToMarkdown() {
  const records = loadTracking();
  if (records.length === 0) return;

  // Build the automated section
  const lines = [
    '',
    '## Automated Tracking (synced from tools/data/tracking.json)',
    '',
    '| Platform | URL | Target | Anchor | Type | Status | Published | Last Checked |',
    '|----------|-----|--------|--------|------|--------|-----------|--------------|',
  ];

  for (const r of records) {
    const status = r.status === 'live' ? '✅' : r.status === 'dead' ? '❌' : '⬜';
    lines.push(
      `| ${r.platform} | ${r.url || '—'} | ${r.targetUrl} | ${r.anchorText} | ${r.anchorType} | ${status} | ${r.publishedAt} | ${r.lastCheckedAt || '—'} |`
    );
  }

  // Append or replace the automated section in the tracker markdown
  let existing = '';
  if (fs.existsSync(TRACKER_MD)) {
    existing = fs.readFileSync(TRACKER_MD, 'utf-8');
  }

  const marker = '## Automated Tracking';
  const markerIdx = existing.indexOf(marker);
  if (markerIdx !== -1) {
    existing = existing.slice(0, markerIdx).trimEnd();
  }

  fs.writeFileSync(TRACKER_MD, existing + '\n' + lines.join('\n') + '\n');
  console.log('Synced tracking data to strategy/backlink-tracker.md');
}
