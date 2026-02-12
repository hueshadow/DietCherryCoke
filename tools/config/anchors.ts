import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type AnchorType = 'brand' | 'keyword' | 'longtail' | 'generic' | 'naked';

interface AnchorPool {
  type: AnchorType;
  weight: number; // target percentage (0-100)
  texts: string[];
}

const SITE_URL = process.env.SITE_URL || 'https://dietcherrycoke.net';

export const anchorPools: AnchorPool[] = [
  {
    type: 'brand',
    weight: 40,
    texts: ['Diet Cherry Coke Net', 'dietcherrycoke.net', 'DietCherryCoke.net'],
  },
  {
    type: 'keyword',
    weight: 20,
    texts: ['diet cherry coke', 'Diet Cherry Coke'],
  },
  {
    type: 'longtail',
    weight: 20,
    texts: [
      'is diet cherry coke discontinued',
      'where to buy diet cherry coke',
      'diet cherry coke recipe',
      'diet cherry coke vs coke zero cherry',
      'diet cherry coke comeback 2026',
    ],
  },
  {
    type: 'generic',
    weight: 10,
    texts: ['check this out', 'learn more', 'read more here', 'full guide here'],
  },
  {
    type: 'naked',
    weight: 10,
    texts: [SITE_URL, `${SITE_URL}/`],
  },
];

const TRACKING_PATH = path.resolve(__dirname, '..', 'data', 'tracking.json');

interface TrackingRecord {
  anchorText: string;
  anchorType: AnchorType;
}

/** Read existing anchor usage from tracking.json to correct distribution drift */
function getUsageCounts(): Record<AnchorType, number> {
  const counts: Record<AnchorType, number> = {
    brand: 0, keyword: 0, longtail: 0, generic: 0, naked: 0,
  };
  try {
    const data = JSON.parse(fs.readFileSync(TRACKING_PATH, 'utf-8')) as TrackingRecord[];
    for (const r of data) {
      if (r.anchorType in counts) counts[r.anchorType]++;
    }
  } catch {
    // no tracking file yet — all zeros
  }
  return counts;
}

/** Pick an anchor text using weighted random selection, correcting for drift */
export function pickAnchor(targetUrl?: string): { text: string; type: AnchorType; url: string } {
  const usage = getUsageCounts();
  const total = Object.values(usage).reduce((a, b) => a + b, 0) || 1;

  // Calculate how underrepresented each pool is vs its target
  const gaps = anchorPools.map((pool) => {
    const actual = (usage[pool.type] / total) * 100;
    const gap = pool.weight - actual; // positive = underrepresented
    return { pool, gap };
  });

  // Weight selection toward underrepresented types
  const weights = gaps.map(({ pool, gap }) => Math.max(pool.weight + gap * 2, 1));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * weightSum;

  let selected = gaps[0].pool;
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) { selected = gaps[i].pool; break; }
  }

  const text = selected.texts[Math.floor(Math.random() * selected.texts.length)];
  const url = targetUrl || SITE_URL;

  return { text, type: selected.type, url };
}
