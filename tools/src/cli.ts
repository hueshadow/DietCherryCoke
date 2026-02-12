#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { generate } from './content/generator.js';
import { listSources } from './content/content-loader.js';
import { platforms } from '../config/platforms.js';

const program = new Command();

program
  .name('backlink-tools')
  .description('Backlink distribution CLI for dietcherrycoke.net')
  .version('1.0.0');

// --- generate ---
program
  .command('generate <platform>')
  .description('Generate a draft for a platform from site content')
  .requiredOption('--source <path>', 'Source content path (e.g. articles/is-diet-cherry-coke-back)')
  .option('--lang <code>', 'Language code (en, ko, ja)')
  .option('--model <name>', 'AI model to use (default: gpt-4o-mini)')
  .action(async (platform: string, opts) => {
    try {
      await generate({ platform, source: opts.source, lang: opts.lang, model: opts.model });
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

// --- publish ---
program
  .command('publish <draft>')
  .description('Publish an approved draft to its platform')
  .action(async (draft: string) => {
    const { publishDraft } = await import('./platforms/publish.js');
    try {
      await publishDraft(draft);
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

// --- check ---
program
  .command('check')
  .description('Check all tracked backlinks for liveness')
  .action(async () => {
    const { checkLinks } = await import('./tracking/link-checker.js');
    try {
      await checkLinks();
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

// --- status ---
program
  .command('status')
  .description('Show backlink tracking summary')
  .action(async () => {
    const { showStatus } = await import('./tracking/tracker.js');
    try {
      showStatus();
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

// --- sources ---
program
  .command('sources')
  .description('List all available source content')
  .action(() => {
    const sources = listSources();
    console.log(`\nAvailable sources (${sources.length}):\n`);
    for (const s of sources) {
      console.log(`  ${s.collection}/${s.slug}`);
      console.log(`    "${s.frontmatter.title}"\n`);
    }
  });

// --- platforms ---
program
  .command('platforms')
  .description('List all supported platforms')
  .action(() => {
    console.log('\nSupported platforms:\n');
    for (const [key, p] of Object.entries(platforms)) {
      console.log(`  ${key.padEnd(16)} ${p.name} (${p.type}, ${p.linkAttribute}, tier ${p.tier})`);
    }
    console.log('');
  });

program.parse();
