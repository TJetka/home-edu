import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { atlas } from '../../src/content/atlas.ts';
import { discoveries } from '../../src/content/discoveries.ts';
import { houseplants, steps } from '../../src/content/lesson.ts';
import type { AssetCredit } from '../../src/types.ts';

const credits: AssetCredit[] = JSON.parse(readFileSync('src/content/assets.json', 'utf8'));

test('every local photograph has an author, permitted license, source and matching checksum', () => {
  assert.equal(new Set(credits.map((a) => a.id)).size, credits.length);
  assert.deepEqual(readdirSync('public/images').sort(), credits.map((a) => `${a.id}.jpg`).sort());
  for (const a of credits) {
    assert.equal(a.file, `images/${a.id}.jpg`);
    assert.match(a.id, /^[a-z-]+$/);
    assert.ok(a.author.trim().length > 1, a.id);
    assert.match(a.source, /^https:\/\/commons.wikimedia.org\/wiki\/File:/);
    assert.match(a.licenseUrl, /^https:\/\/creativecommons.org\//);
    assert.match(a.license, /^(CC BY(?:-SA)? [\d.]+(?: [a-z]+)?|CC0|Public domain)$/);
    assert.ok(a.modifications.length > 10);
    const bytes = readFileSync(`public/${a.file}`);
    assert.ok(bytes.length > 1000 && bytes.length < 1_000_000, a.id);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), a.sha256, a.id);
  }
});

test('every lesson, atlas and discovery picture resolves to a local photo or authored diagram', () => {
  const photos = new Set(credits.map((a) => a.id));
  const diagrams = new Set([
    'bulb-up',
    'bulb-down',
    'tulip-leaves',
    'tulip-bud',
    'tulip-flower',
    'dog-care',
    'spider',
    'silverfish',
    'moth',
    'night',
  ]);
  const ids = [
    ...steps
      .flatMap((s) => [
        ...(s.pictures ?? []),
        ...(s.options ?? []).flatMap((o) => (o.picture ? [o.picture] : [])),
      ])
      .map((p) => p.asset),
    ...atlas.map((a) => a.asset),
    ...houseplants.map((p) => p.id),
    ...discoveries.map((d) => d.asset),
    'mystery',
    'linden-fruit',
  ];
  for (const id of ids) assert.ok(photos.has(id) || diagrams.has(id), id);
});
