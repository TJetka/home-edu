import { initialState, parseState, STORAGE_KEY } from './state.ts';
import type { LessonState } from './types.ts';

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Catch both access-denied and quota failures; the live lesson remains usable in memory. */
export function loadProgress(storage: () => StoragePort): {
  state: LessonState;
  persistent: boolean;
} {
  let state = initialState();
  try {
    const port = storage();
    state = parseState(port.getItem(STORAGE_KEY));
    port.setItem(STORAGE_KEY, JSON.stringify(state));
    return { state, persistent: true };
  } catch {
    return { state, persistent: false };
  }
}

export function saveProgress(state: LessonState, storage: () => StoragePort): boolean {
  try {
    storage().setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function resetProgress(storage: () => StoragePort): {
  state: LessonState;
  persistent: boolean;
} {
  const state = initialState();
  try {
    storage().removeItem(STORAGE_KEY);
    return { state, persistent: true };
  } catch {
    return { state, persistent: false };
  }
}
