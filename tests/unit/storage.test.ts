import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialState, STORAGE_KEY } from '../../src/state.ts';
import { loadProgress, resetProgress, saveProgress } from '../../src/storage.ts';
import type { StoragePort } from '../../src/storage.ts';

function memory(): StoragePort & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return { values, getItem: k => values.get(k) ?? null, setItem: (k, v) => { values.set(k, v); }, removeItem: k => { values.delete(k); } };
}

test('save/load preserves schema and reset only deletes this lesson', () => {
  const port = memory();
  port.setItem('another-app', 'keep');
  const state = { ...initialState(), hypothesis: 'magpie' };
  assert.equal(saveProgress(state, () => port), true);
  assert.deepEqual(loadProgress(() => port), { state, persistent: true });
  assert.equal(resetProgress(() => port).state.status, 'new');
  assert.equal(port.getItem(STORAGE_KEY), null);
  assert.equal(port.getItem('another-app'), 'keep');
});

test('blocked storage and quota exceptions never stop the lesson', () => {
  const blocked = (): StoragePort => { throw new Error('denied'); };
  assert.deepEqual(loadProgress(blocked), { state: initialState(), persistent: false });
  assert.equal(saveProgress(initialState(), blocked), false);
  assert.equal(resetProgress(blocked).persistent, false);
  const quota = memory();
  quota.setItem = () => { throw new Error('quota'); };
  assert.equal(loadProgress(() => quota).persistent, false);
});

test('a readable save survives a quota failure when checking write access', () => {
  const port = memory();
  const state = { ...initialState(), hypothesis: 'unknown' };
  port.setItem(STORAGE_KEY, JSON.stringify(state));
  port.setItem = () => { throw new Error('quota'); };
  assert.deepEqual(loadProgress(() => port), { state, persistent: false });
});
