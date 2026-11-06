import assert from 'node:assert/strict';
import { test } from 'node:test';
import { atlas } from '../../src/content/atlas.ts';
import { discoveries } from '../../src/content/discoveries.ts';
import { isGraded, stations, steps } from '../../src/content/lesson.ts';

test('content includes eight stops, a 6+6+3 atlas and three self-contained extras', () => {
  assert.equal(stations.length, 8);
  assert.deepEqual([...new Set(steps.map((s) => s.station))], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(
    ['plants', 'birds', 'insects'].map((group) => atlas.filter((c) => c.group === group).length),
    [6, 6, 3],
  );
  assert.equal(discoveries.length, 3);
  assert.equal(new Set(steps.map((s) => s.id)).size, steps.length);
  assert.equal(new Set(atlas.map((s) => s.id)).size, atlas.length);
  for (const d of discoveries) assert.ok(d.explanation.length > 50);
});

test('every assessed task has stable IDs, a valid key, a hint and an explanation', () => {
  for (const step of steps.filter(isGraded)) {
    assert.ok(step.options?.length, step.id);
    assert.equal(new Set(step.options!.map((o) => o.id)).size, step.options!.length, step.id);
    assert.ok(step.accepted?.length, step.id);
    for (const key of step.accepted!)
      assert.ok(
        step.options!.some((o) => o.id === key),
        `${step.id}/${key}`,
      );
    assert.ok(step.hint && step.explanation, step.id);
  }
});

test('question alternatives describe features without leaking the sought species name', () => {
  const ids = [
    'birch-bark',
    'clover-find',
    'bird-spots',
    'jackdaw-id',
    'magpie-id',
    'earwig-shape',
  ];
  const names = /brzoza|koniczyna|szpak|kawka|sroka|skorek/i;
  for (const step of steps.filter((s) => ids.includes(s.id))) {
    for (const picture of [
      ...(step.pictures ?? []),
      ...(step.options ?? []).flatMap((o) => (o.picture ? [o.picture] : [])),
    ]) {
      assert.doesNotMatch(picture.alt, names, step.id);
      assert.ok(picture.alt.length > 30);
    }
  }
});
