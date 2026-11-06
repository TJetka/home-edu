import './style.css';
import { answerFor, currentStep, reduce } from './state.ts';
import type { Action } from './state.ts';
import { loadProgress, resetProgress, saveProgress } from './storage.ts';
import type { Group } from './types.ts';
import { renderView, zoomContent } from './ui/views.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
const announcement = document.querySelector<HTMLDivElement>('#announcement')!;
const storage = () => window.localStorage;
let { state, persistent } = loadProgress(storage);
let returnFocus: HTMLElement | null = null;

function announce(message: string): void { announcement.textContent = message; }

function draw(navigate = false, focus?: { action?: string; value?: string }): void {
  const birdTab = state.discoveries['bird-tab']?.at(-1) ?? 'blackbird';
  app.innerHTML = renderView(state, persistent);
  document.querySelector<HTMLElement>('.bird-options')?.setAttribute('data-visible', birdTab);
  for (const tab of document.querySelectorAll<HTMLElement>('[data-action="bird-tab"]')) tab.setAttribute('aria-pressed', String(tab.dataset.value === birdTab));
  if (navigate) {
    document.querySelector<HTMLElement>('#page-title')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (focus?.action) {
    const target = [...app.querySelectorAll<HTMLButtonElement>('button')].find(b => b.dataset.action === focus.action && b.dataset.value === focus.value && !b.disabled);
    (target ?? app.querySelector<HTMLButtonElement>('[data-action="retry"], [data-action="next"], [data-action="check"]'))?.focus({ preventScroll: true });
  }
}

function dispatch(action: Action, element: HTMLElement): void {
  const before = state;
  state = reduce(state, action);
  persistent = saveProgress(state, storage) && persistent;
  const navigate = before.view !== state.view || before.stepId !== state.stepId;
  const openExtras = [...app.querySelectorAll<HTMLDetailsElement>('details[open]')].length > 0;
  draw(navigate, { action: element.dataset.action, value: element.dataset.value });
  if (openExtras && !navigate) app.querySelector('details')?.setAttribute('open', '');
  if (action.type === 'check' || action.type === 'explain') {
    const step = currentStep(state);
    const answer = answerFor(state);
    announce(answer.status === 'hint' ? `Wskazówka: ${step.hint}` : `Wyjaśnienie: ${step.explanation}`);
    app.querySelector('.feedback')?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  } else if (action.type === 'dot') announce(`Zaznaczone kropki: ${state.dots.length}`);
  else if (action.type === 'select' && currentStep(state).kind === 'order') announce(`Ułożone obserwacje: ${answerFor(state).selected.length} z 3.`);
  else if (action.type === 'explore') {
    const note = [...app.querySelectorAll('.feedback, .observation')].at(-1);
    if (note?.textContent) announce(note.textContent);
  } else if (navigate) announce(document.querySelector('#page-title')?.textContent ?? '');
}

const simpleActions = new Set(['start', 'next', 'back', 'pause', 'resume', 'home', 'retry', 'check', 'explain', 'undo', 'count-mode', 'close', 'sources', 'discoveries']);

app.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-action]') : null;
  if (!target || target instanceof HTMLButtonElement && target.disabled) return;
  const action = target.dataset.action!;
  const value = target.dataset.value ?? '';
  event.preventDefault();
  if (action === 'zoom') {
    returnFocus = target;
    const [asset, alt] = value.split('|');
    document.querySelector('#zoom-content')!.innerHTML = zoomContent(asset!, alt ?? '');
    document.querySelector<HTMLDialogElement>('#zoom-dialog')!.showModal();
    return;
  }
  if (action === 'restart') {
    returnFocus = target;
    document.querySelector<HTMLDialogElement>('#restart-dialog')!.showModal();
    return;
  }
  if (action === 'close-dialog') {
    target.closest('dialog')?.close(); returnFocus?.focus(); return;
  }
  if (action === 'confirm-restart') {
    ({ state, persistent } = resetProgress(storage)); draw(true); announce('Możesz zacząć od nowa.'); return;
  }
  if (action === 'bird-tab') {
    // Keep the current comparison panel across reloads and pauses, including repeated switches.
    state = { ...state, discoveries: { ...state.discoveries, 'bird-tab': [value] } };
    persistent = saveProgress(state, storage) && persistent;
    draw(false, { action, value }); return;
  }
  if (simpleActions.has(action)) dispatch({ type: action } as Action, target);
  else if (['select', 'hypothesis', 'detail', 'dot', 'discovery'].includes(action)) dispatch({ type: action, id: value } as Action, target);
  else if (action === 'explore') { const [key, id] = value.split('|'); dispatch({ type: 'explore', key: key!, id: id! }, target); }
  else if (action === 'atlas' || action === 'atlas-pair') dispatch({ type: 'atlas', pair: action === 'atlas-pair' ? value.split(',') : [] }, target);
  else if (action === 'group') dispatch({ type: 'group', group: value as Group }, target);
});

// Capturing image failures keeps the visual description available even when photos are disabled.
app.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) {
    const description = document.createElement('p');
    description.className = 'image-fallback'; description.textContent = event.target.alt;
    event.target.replaceWith(description);
  }
}, true);

app.addEventListener('close', event => { if (event.target instanceof HTMLDialogElement) returnFocus?.focus(); }, true);
draw();
