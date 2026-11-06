import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { steps } from '../../src/content/lesson.ts';
import { initialState, STORAGE_KEY } from '../../src/state.ts';
import type { LessonState } from '../../src/types.ts';

const press = (page: Page, action: string, value?: string) => {
  const control = page
    .locator(
      `button[data-action="${action}"]${value === undefined ? '' : `[data-value="${value}"]`}`,
    )
    .first();
  // The desktop journey activates every control with the keyboard; phone uses touch-compatible clicks.
  return page.viewportSize()?.width === 1280 ? control.press('Enter') : control.click();
};

async function seed(page: Page, state: LessonState): Promise<void> {
  await page.goto('./');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: STORAGE_KEY,
    value: state,
  });
  await page.reload();
}

function active(id: string): LessonState {
  return {
    ...initialState(),
    status: 'active',
    view: 'lesson',
    stepId: id,
    hypothesis: 'unknown',
    detail: 'tail',
  };
}

async function noOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
}

test('complete lesson with local assets, every interaction, atlas and optional discoveries', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const external: string[] = [];
  const missing: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) missing.push(response.url());
  });
  await page.route('**/*', (route) => {
    if (!route.request().url().startsWith('http://127.0.0.1:4173/')) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('./');
  await page.screenshot({ path: testInfo.outputPath('start.png'), fullPage: true });
  await press(page, 'start');
  for (const step of steps) {
    await expect(page.locator('.lesson')).toHaveAttribute('data-step', step.id);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(step.title);
    await noOverflow(page);
    if (step.kind === 'hypothesis') await press(page, 'hypothesis', 'unknown');
    else if (step.kind === 'detail') await press(page, 'detail', 'tail');
    else if (step.kind === 'explore') await press(page, 'explore', `${step.id}|basil`);
    else if (step.kind === 'bulb') await press(page, 'explore', `${step.id}|above`);
    else if (step.kind === 'plant') {
      await press(page, 'explore', `${step.id}|covered`);
      await press(page, 'explore', `${step.id}|spring`);
    } else if (step.kind === 'map') await press(page, 'explore', `${step.id}|trees`);
    else if (step.kind === 'night') {
      await press(page, 'explore', `${step.id}|lamp`);
      await expect(
        page.locator('#main').getByText('Przyjrzyj się temu, co leży na ziemi obok kosza.'),
      ).toBeVisible();
      await press(page, 'explore', `${step.id}|bin`);
    } else if (step.kind === 'reveal') {
      await expect(page.locator('.remember')).toContainText('Jeszcze za mało widać');
      await expect(page.locator('.mystery-crop')).toBeVisible();
      await press(page, 'explore', `${step.id}|revealed`);
      await expect(page.locator('.observation')).toContainText('Ogon');
    } else if (step.kind === 'reflection') await press(page, 'explore', `${step.id}|example`);
    else if (step.kind === 'spots') {
      for (let i = 1; i <= 7; i++) await press(page, 'dot', `spot-${i}`);
      await press(page, 'check');
    } else if (step.kind === 'order') {
      for (const id of ['leaves', 'bud', 'flower']) await press(page, 'select', id);
      await press(page, 'check');
    } else if (step.kind === 'quiz') {
      if (step.id === 'bird-spots' && testInfo.project.name === 'phone')
        await press(page, 'bird-tab', 'starling');
      await press(page, 'select', step.accepted![0]);
      await press(page, 'check');
      await expect(page.locator('.feedback')).toContainText('Właśnie ten trop!');
    }
    if (step.id === 'jackdaw-id') {
      await press(page, 'atlas-pair');
      await expect(page.locator('.atlas-card')).toHaveCount(3);
      await page.reload();
      await press(page, 'close');
      await expect(page.locator('.lesson')).toHaveAttribute('data-step', 'jackdaw-id');
    }
    if (step.id === 'ladybird-count')
      await page.screenshot({ path: testInfo.outputPath('dots.png'), fullPage: true });
    await press(page, 'next');
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Teraz widzisz więcej.');
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).status, STORAGE_KEY),
  ).toBe('completed');
  await page.reload();
  await press(page, 'discoveries');
  await expect(page.locator('.discovery-grid article')).toHaveCount(3);
  for (const id of ['song', 'wings', 'layers']) {
    await press(page, 'discovery', id);
    if (id === 'song') await press(page, 'explore', 'extra-song|yes');
    if (id === 'wings') {
      await press(page, 'explore', 'extra-wings|left');
      await press(page, 'explore', 'extra-wings|right');
    }
    if (id === 'layers') {
      await press(page, 'explore', 'extra-layers|scales');
      await press(page, 'explore', 'extra-layers|bud');
      await page.getByRole('button', { name: 'Pogrubię łuski' }).click();
    }
    await expect(page.locator('.feedback')).toBeVisible();
    await expect(page.locator('.external-links a').first()).toHaveAttribute('target', '_blank');
    await noOverflow(page);
    await press(page, 'discoveries');
  }
  await press(page, 'home');
  await expect(page.getByText('Lekcja ukończona', { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
  expect(external).toEqual([]);
});

test('hint, retry and second error; returning to solved steps does not add attempts', async ({
  page,
}) => {
  await seed(page, active('basil-use'));
  await expect(page.locator('[data-action=check]')).toBeDisabled();
  await press(page, 'select', 'fern');
  await press(page, 'check');
  await expect(page.locator('.feedback')).toContainText('Ozdobne rośliny zostaw');
  await press(page, 'pause');
  await page.reload();
  await press(page, 'resume');
  await expect(page.locator('.feedback')).toContainText('Ozdobne rośliny zostaw');
  await press(page, 'retry');
  await press(page, 'check');
  await expect(page.locator('.feedback')).toContainText('Bazylia to zioło przyprawowe');
  await press(page, 'next');
  await press(page, 'back');
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).answers['basil-use'].attempts,
      STORAGE_KEY,
    ),
  ).toBe(2);
});

test('partial ordering and three dots survive pause, reload and atlas', async ({ page }) => {
  await seed(page, active('tulip-order'));
  await press(page, 'select', 'leaves');
  await press(page, 'select', 'bud');
  await press(page, 'pause');
  await page.reload();
  await press(page, 'resume');
  await expect(page.locator('.order-slots li').nth(0)).toContainText('Pierwsze liście');
  await expect(page.locator('.order-slots li').nth(1)).toContainText('Zamknięty pąk');
  await press(page, 'undo');
  await expect(page.locator('.order-slots li').nth(1)).toContainText('Wybierz kartę');
  await seed(page, active('ladybird-count'));
  for (let i = 1; i <= 3; i++) await press(page, 'dot', `spot-${i}`);
  await page.reload();
  await expect(page.locator('.spot[aria-pressed=true]')).toHaveCount(3);
  await press(page, 'atlas');
  await page.reload();
  await press(page, 'close');
  await expect(page.locator('.spot[aria-pressed=true]')).toHaveCount(3);
});

test('atlas has 15 cards, zoom closes via keyboard, sources include local photographs', async ({
  page,
}) => {
  await page.goto('./');
  await press(page, 'atlas');
  for (const [group, count] of [
    ['plants', 6],
    ['birds', 6],
    ['insects', 3],
  ] as const) {
    await press(page, 'group', group);
    await expect(page.locator('.atlas-card')).toHaveCount(count);
    for (const img of await page.locator('.atlas-card img').all())
      await expect
        .poll(() =>
          img.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
        )
        .toBe(true);
    await page.locator('[data-action=zoom]').first().click();
    await expect(page.locator('#zoom-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#zoom-dialog')).not.toBeVisible();
    await noOverflow(page);
  }
  await press(page, 'sources');
  expect(await page.locator('.credits article').count()).toBeGreaterThanOrEqual(26);
  await expect(page.locator('.credits')).toContainText('CC BY');
});

test('blocked storage, corrupt save and scoped restart all remain usable', async ({
  page,
  context,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    }),
  );
  await page.goto('./');
  await expect(
    page.getByText('W tej przeglądarce postęp zachowasz do zamknięcia karty.'),
  ).toBeVisible();
  await press(page, 'start');
  await press(page, 'hypothesis', 'blackbird');
  await press(page, 'next');
  await expect(page.locator('.lesson')).toHaveAttribute('data-step', 'first-detail');
  const clean = await context.newPage();
  await clean.goto('./');
  await clean.evaluate((key) => {
    localStorage.setItem(key, '{bad');
    localStorage.setItem('unrelated', 'keep');
  }, STORAGE_KEY);
  await clean.reload();
  await expect(clean.getByRole('button', { name: 'Zaczynam' })).toBeVisible();
  await press(clean, 'start');
  await clean.locator('.brand').click();
  await press(clean, 'restart');
  await expect(clean.locator('#restart-dialog')).toBeVisible();
  await clean.getByRole('button', { name: 'Zostaw mój postęp' }).click();
  await expect(clean.getByRole('button', { name: /Wróć do lekcji/ })).toBeVisible();
  await press(clean, 'restart');
  await press(clean, 'confirm-restart');
  expect(await clean.evaluate(() => localStorage.getItem('unrelated'))).toBe('keep');
  await clean.close();
});

test('keyboard controls and 200% text remain usable without pictures', async ({ page }) => {
  await seed(page, active('ladybird-count'));
  await page.locator('[data-action=dot]').first().focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.locator('.spot[aria-pressed=true]')).toHaveCount(2);
  await press(page, 'count-mode');
  await press(page, 'select', 'seven');
  await press(page, 'check');
  await expect(page.locator('.feedback')).toContainText('3 + 3 + 1');
  await seed(page, active('jackdaw-id'));
  await page.route('**/images/**', (route) => route.abort());
  await page.reload();
  await expect(page.locator('.image-fallback')).toContainText('szare pióra');
  await page.addStyleTag({ content: 'html { font-size: 36px !important; }' });
  await noOverflow(page);
  await press(page, 'select', 'jackdaw');
  await press(page, 'check');
  await press(page, 'next');
  await noOverflow(page);
});
