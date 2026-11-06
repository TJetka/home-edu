import { atlas } from './content/atlas.ts';
import { details, firstStep, hypotheses, isGraded, stepById, steps } from './content/lesson.ts';
import type { Answer, BaseView, Group, LessonState, Step } from './types.ts';

export const STORAGE_KEY = 'home-edu:przyroda-okolica:v1';
export const emptyAnswer = (): Answer => ({ selected: [], attempts: 0, status: 'answering' });
export const initialState = (): LessonState => ({
  version: 1,
  status: 'new',
  view: 'home',
  returnView: 'home',
  stepId: firstStep.id,
  hypothesis: null,
  detail: null,
  answers: {},
  discoveries: {},
  dots: [],
  countMode: false,
  atlasGroup: 'plants',
  atlasPair: [],
  discoveryId: 'song',
});

export type Action =
  | {
      type:
        | 'start'
        | 'next'
        | 'back'
        | 'pause'
        | 'resume'
        | 'home'
        | 'retry'
        | 'check'
        | 'explain'
        | 'undo'
        | 'count-mode'
        | 'close'
        | 'sources'
        | 'discoveries';
    }
  | { type: 'select' | 'hypothesis' | 'detail' | 'dot' | 'discovery'; id: string }
  | { type: 'explore'; key: string; id: string }
  | { type: 'atlas'; pair?: string[] }
  | { type: 'group'; group: Group };

export function currentStep(state: LessonState): Step {
  return stepById.get(state.stepId) ?? firstStep;
}
export function answerFor(state: LessonState, step = currentStep(state)): Answer {
  return state.answers[step.id] ?? emptyAnswer();
}
export const solved = (answer: Answer): boolean => ['correct', 'revealed'].includes(answer.status);

export function canContinue(state: LessonState): boolean {
  const step = currentStep(state);
  if (isGraded(step)) return solved(answerFor(state));
  if (step.kind === 'hypothesis') return state.hypothesis !== null;
  if (step.kind === 'detail') return state.detail !== null;
  if (['explore', 'bulb', 'map', 'night'].includes(step.kind))
    return (state.discoveries[step.id]?.length ?? 0) > 0;
  if (step.kind === 'plant') return state.discoveries[step.id]?.includes('spring') ?? false;
  if (step.kind === 'reveal') return state.discoveries[step.id]?.includes('revealed') ?? false;
  return true;
}

export function canCheck(state: LessonState): boolean {
  const step = currentStep(state);
  const answer = answerFor(state);
  if (!isGraded(step) || answer.status !== 'answering') return false;
  if (step.kind === 'spots' && !state.countMode) return state.dots.length > 0;
  return answer.selected.length === (step.kind === 'order' ? step.options!.length : 1);
}

/** Pure state transition: answer IDs are independent of display order; grading never advances the screen. */
export function reduce(state: LessonState, action: Action): LessonState {
  const next = structuredClone(state);
  const step = currentStep(next);
  const answer = answerFor(next);
  const setAnswer = () => {
    next.answers[step.id] = answer;
  };
  switch (action.type) {
    case 'start':
      next.view = next.status === 'completed' ? 'complete' : 'lesson';
      if (next.status === 'new') next.status = 'active';
      break;
    case 'home':
      next.view = 'home';
      break;
    case 'pause':
      if (next.view === 'lesson') next.view = 'pause';
      break;
    case 'resume':
      next.view = 'lesson';
      break;
    case 'hypothesis':
      if (hypotheses.some((o) => o.id === action.id)) next.hypothesis = action.id;
      break;
    case 'detail':
      if (details.some((o) => o.id === action.id)) next.detail = action.id;
      break;
    case 'select':
      if (answer.status !== 'answering' || !step.options?.some((o) => o.id === action.id)) break;
      if (step.kind === 'order') {
        if (!answer.selected.includes(action.id)) answer.selected.push(action.id);
      } else answer.selected = [action.id];
      setAnswer();
      break;
    case 'undo':
      if (step.kind === 'order' && answer.status === 'answering') {
        answer.selected.pop();
        setAnswer();
      }
      break;
    case 'dot':
      if (step.kind !== 'spots' || answer.status !== 'answering' || !/^spot-[1-7]$/.test(action.id))
        break;
      next.dots = next.dots.includes(action.id)
        ? next.dots.filter((d) => d !== action.id)
        : [...next.dots, action.id];
      break;
    case 'count-mode':
      if (!solved(answer)) next.countMode = !next.countMode;
      break;
    case 'check': {
      if (!canCheck(next)) break;
      let correct: boolean;
      if (step.kind === 'order') correct = answer.selected.join('|') === step.accepted!.join('|');
      else if (step.kind === 'spots' && !next.countMode) correct = next.dots.length === 7;
      else correct = step.accepted!.includes(answer.selected[0]!);
      answer.attempts += 1;
      answer.status = correct ? 'correct' : answer.attempts >= 2 ? 'revealed' : 'hint';
      setAnswer();
      break;
    }
    case 'retry':
      if (answer.status === 'hint') {
        answer.status = 'answering';
        setAnswer();
      }
      break;
    case 'explain':
      if (isGraded(step)) {
        answer.status = 'revealed';
        setAnswer();
      }
      break;
    case 'explore': {
      const values = next.discoveries[action.key] ?? [];
      if (!values.includes(action.id)) next.discoveries[action.key] = [...values, action.id];
      break;
    }
    case 'next': {
      if (next.view !== 'lesson' || !canContinue(next)) break;
      const index = steps.findIndex((s) => s.id === next.stepId);
      if (index === steps.length - 1) {
        next.status = 'completed';
        next.view = 'complete';
      } else next.stepId = steps[index + 1]!.id;
      break;
    }
    case 'back': {
      const index = steps.findIndex((s) => s.id === next.stepId);
      if (index > 0) next.stepId = steps[index - 1]!.id;
      break;
    }
    case 'atlas':
      if (next.view !== 'atlas' && next.view !== 'sources') next.returnView = next.view;
      next.view = 'atlas';
      next.atlasPair = action.pair ?? [];
      next.atlasGroup =
        atlas.find((card) => card.id === next.atlasPair[0])?.group ?? next.atlasGroup;
      break;
    case 'group':
      next.atlasGroup = action.group;
      next.atlasPair = [];
      break;
    case 'sources':
      if (next.view !== 'atlas' && next.view !== 'sources') next.returnView = next.view;
      next.view = 'sources';
      break;
    case 'close':
      next.view = next.returnView;
      break;
    case 'discoveries':
      if (next.status === 'completed') next.view = 'discoveries';
      break;
    case 'discovery':
      if (next.status === 'completed' && ['song', 'wings', 'layers'].includes(action.id)) {
        next.discoveryId = action.id;
        next.view = 'discovery';
      }
      break;
  }
  return next;
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((v) => typeof v === 'string') &&
  new Set(value).size === value.length;
const baseViews: BaseView[] = ['home', 'lesson', 'pause', 'complete', 'discoveries', 'discovery'];

/** Reject malformed or incompatible persisted data as a whole; never copy unknown fields into the app. */
export function parseState(raw: string | null): LessonState {
  if (!raw || raw.length > 100_000) return initialState();
  try {
    const v: unknown = JSON.parse(raw);
    if (
      !record(v) ||
      !['status', 'view', 'returnView', 'stepId', 'atlasGroup', 'discoveryId'].every(
        (key) => typeof v[key] === 'string',
      ) ||
      v.version !== 1 ||
      !['new', 'active', 'completed'].includes(String(v.status)) ||
      ![...baseViews, 'atlas', 'sources'].includes(String(v.view)) ||
      !baseViews.includes(v.returnView as BaseView) ||
      !stepById.has(String(v.stepId)) ||
      !record(v.answers) ||
      !record(v.discoveries) ||
      !strings(v.dots) ||
      !v.dots.every((d) => /^spot-[1-7]$/.test(d)) ||
      typeof v.countMode !== 'boolean' ||
      !['plants', 'birds', 'insects'].includes(String(v.atlasGroup)) ||
      !strings(v.atlasPair) ||
      !v.atlasPair.every((id) => atlas.some((card) => card.id === id)) ||
      !['song', 'wings', 'layers'].includes(String(v.discoveryId)) ||
      !(v.hypothesis === null || hypotheses.some((o) => o.id === v.hypothesis)) ||
      !(v.detail === null || details.some((o) => o.id === v.detail))
    )
      return initialState();
    for (const [id, a] of Object.entries(v.answers)) {
      const step = stepById.get(id);
      if (
        !step ||
        !isGraded(step) ||
        !record(a) ||
        !strings(a.selected) ||
        !a.selected.every((x) => step.options?.some((o) => o.id === x)) ||
        a.selected.length > (step.kind === 'order' ? 3 : 1) ||
        !Number.isInteger(a.attempts) ||
        Number(a.attempts) < 0 ||
        Number(a.attempts) > 2 ||
        typeof a.status !== 'string' ||
        !['answering', 'hint', 'correct', 'revealed'].includes(String(a.status))
      )
        return initialState();
    }
    for (const [id, entries] of Object.entries(v.discoveries)) {
      if (
        !/^[a-z-]{1,40}$/.test(id) ||
        !strings(entries) ||
        entries.length > 20 ||
        !entries.every((x) => /^[a-z-]{1,40}$/.test(x))
      )
        return initialState();
    }
    if (
      v.status !== 'completed' &&
      (['complete', 'discoveries', 'discovery'].includes(String(v.view)) ||
        ['complete', 'discoveries', 'discovery'].includes(String(v.returnView)))
    )
      return initialState();
    return v as unknown as LessonState;
  } catch {
    return initialState();
  }
}
