import assert from 'node:assert/strict';
import { test } from 'node:test';
import { steps } from '../../src/content/lesson.ts';
import { answerFor, canContinue, initialState, parseState, reduce } from '../../src/state.ts';
import type { LessonState } from '../../src/types.ts';

function at(id: string): LessonState {
  return { ...initialState(), status: 'active', view: 'lesson', stepId: id };
}

test('wrong answer → hint → retry → second wrong answer explains without blocking', () => {
  let s = reduce(at('basil-use'), { type: 'select', id: 'fern' });
  assert.equal(canContinue(s), false);
  s = reduce(s, { type: 'check' });
  assert.deepEqual(answerFor(s), { selected: ['fern'], attempts: 1, status: 'hint' });
  assert.deepEqual(reduce(s, { type: 'check' }), s, 'repeated check must not count');
  assert.equal(reduce(s, { type: 'next' }).stepId, 'basil-use');
  s = reduce(s, { type: 'retry' });
  s = reduce(s, { type: 'check' });
  assert.equal(answerFor(s).status, 'revealed');
  assert.equal(canContinue(s), true);
  assert.equal(reduce(s, { type: 'next' }).stepId, 'fern-observation');
});

test('correct retry and explanation-first are both valid learning paths', () => {
  let s = reduce(at('basil-use'), { type: 'select', id: 'fern' });
  for (const action of [
    { type: 'check' },
    { type: 'retry' },
    { type: 'select', id: 'basil' },
    { type: 'check' },
  ] as const)
    s = reduce(s, action);
  assert.equal(answerFor(s).status, 'correct');
  const revealed = reduce(at('basil-use'), { type: 'explain' });
  assert.equal(answerFor(revealed).attempts, 0);
  assert.equal(canContinue(revealed), true);
  const previous = reduce(reduce(s, { type: 'next' }), { type: 'back' });
  assert.deepEqual(answerFor(previous), answerFor(s));
});

test('incomplete order, three dots, hints and atlas view survive a serialized roundtrip', () => {
  let s = at('tulip-order');
  s = reduce(s, { type: 'select', id: 'leaves' });
  s = reduce(s, { type: 'select', id: 'bud' });
  s = reduce(s, { type: 'pause' });
  assert.deepEqual(parseState(JSON.stringify(s)), s);
  s = reduce(s, { type: 'resume' });
  assert.deepEqual(answerFor(s).selected, ['leaves', 'bud']);
  s = { ...s, stepId: 'ladybird-count' };
  for (const id of ['spot-1', 'spot-2', 'spot-3']) s = reduce(s, { type: 'dot', id });
  s = reduce(s, { type: 'check' });
  s = reduce(s, { type: 'atlas', pair: ['ladybird'] });
  s = parseState(JSON.stringify(s));
  assert.equal(s.view, 'atlas');
  s = reduce(s, { type: 'close' });
  assert.equal(s.view, 'lesson');
  assert.equal(s.stepId, 'ladybird-count');
  assert.equal(answerFor(s).status, 'hint');
  assert.equal(answerFor(s).attempts, 1);
  assert.deepEqual(s.dots, ['spot-1', 'spot-2', 'spot-3']);
});

test('ordering uses option IDs, supports undo and rejects duplicate selections', () => {
  let s = at('tulip-order');
  s = reduce(s, { type: 'select', id: 'leaves' });
  s = reduce(s, { type: 'select', id: 'leaves' });
  assert.deepEqual(answerFor(s).selected, ['leaves']);
  s = reduce(s, { type: 'undo' });
  assert.deepEqual(answerFor(s).selected, []);
  for (const id of ['leaves', 'bud', 'flower']) s = reduce(s, { type: 'select', id });
  s = reduce(s, { type: 'check' });
  assert.equal(answerFor(s).status, 'correct');
});

test('dot toggle and count-only alternative both grade seven', () => {
  let s = at('ladybird-count');
  for (let i = 1; i <= 7; i++) s = reduce(s, { type: 'dot', id: `spot-${i}` });
  s = reduce(s, { type: 'dot', id: 'spot-7' });
  assert.equal(s.dots.length, 6);
  s = reduce(s, { type: 'dot', id: 'spot-7' });
  assert.equal(answerFor(reduce(s, { type: 'check' })).status, 'correct');
  s = reduce(at('ladybird-count'), { type: 'count-mode' });
  s = reduce(s, { type: 'select', id: 'seven' });
  assert.equal(answerFor(reduce(s, { type: 'check' })).status, 'correct');
});

test('each initial hypothesis and both accepted final clues remain valid', () => {
  for (const id of ['blackbird', 'jackdaw', 'magpie', 'unknown']) {
    let s = reduce(initialState(), { type: 'hypothesis', id });
    s = reduce(s, { type: 'detail', id: 'tail' });
    assert.equal(parseState(JSON.stringify(s)).hypothesis, id);
    assert.equal(parseState(JSON.stringify(s)).detail, 'tail');
  }
  for (const id of ['tail', 'colors']) {
    const selected = reduce(at('magpie-evidence'), { type: 'select', id });
    assert.equal(answerFor(reduce(selected, { type: 'check' })).status, 'correct');
  }
});

test('corrupted, incompatible and malicious saves return a fresh usable state', () => {
  const bad = [
    null,
    '{',
    'null',
    '[]',
    '{}',
    JSON.stringify({ ...initialState(), version: 2 }),
    JSON.stringify({ ...initialState(), stepId: 'missing' }),
    JSON.stringify({ ...initialState(), dots: ['spot-1', 'spot-1'] }),
    JSON.stringify({ ...initialState(), discoveries: { windowsill: ['<script>'] } }),
    JSON.stringify({
      ...initialState(),
      answers: { 'basil-use': { selected: ['invalid'], attempts: 0, status: 'answering' } },
    }),
    JSON.stringify({ ...initialState(), view: 'discoveries' }),
  ];
  for (const raw of bad) assert.deepEqual(parseState(raw), initialState());
});

test('tiny end-to-end state pipeline visits eight stations and completes before extras', () => {
  let s = reduce(initialState(), { type: 'start' });
  const visited = new Set<number>();
  for (const step of steps) {
    assert.equal(s.stepId, step.id);
    visited.add(step.station);
    if (step.kind === 'hypothesis') s = reduce(s, { type: 'hypothesis', id: 'unknown' });
    else if (step.kind === 'detail') s = reduce(s, { type: 'detail', id: 'body' });
    else if (step.accepted) s = reduce(s, { type: 'explain' });
    else
      s = reduce(s, {
        type: 'explore',
        key: step.id,
        id: step.kind === 'plant' ? 'spring' : step.kind === 'reveal' ? 'revealed' : 'example',
      });
    s = reduce(s, { type: 'next' });
  }
  assert.equal(visited.size, 8);
  assert.equal(s.status, 'completed');
  assert.equal(s.view, 'complete');
  assert.equal(reduce(s, { type: 'discoveries' }).view, 'discoveries');
  assert.deepEqual(parseState(JSON.stringify(s)), s);
});
