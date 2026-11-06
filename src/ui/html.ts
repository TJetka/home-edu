import type { Picture } from '../types.ts';
import { diagramFor } from './diagrams.ts';

export const escape = (value: string | number): string =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export const assetUrl = (asset: string): string => `${import.meta.env.BASE_URL}images/${asset}.jpg`;

export function button(
  label: string,
  action: string,
  value = '',
  className = '',
  disabled = false,
): string {
  return `<button type="button" class="${className}" data-action="${action}" data-value="${escape(value)}" ${disabled ? 'disabled' : ''}>${label}</button>`;
}

export function photo(picture: Picture, zoom = true, highlight = false): string {
  const diagram = diagramFor(picture.asset);
  const visual =
    diagram ??
    `<img src="${assetUrl(picture.asset)}" alt="${escape(picture.alt)}" width="960" height="720" decoding="async" />`;
  return `<figure class="photo ${highlight ? 'highlighted' : ''}" data-asset="${picture.asset}"><div class="photo-image">${visual}${highlight && ['birch-task', 'clover-task'].includes(picture.asset) ? '<span class="detail-outline" aria-hidden="true"></span>' : ''}</div>${picture.caption ? `<figcaption>${escape(picture.caption)}</figcaption>` : ''}${zoom && !diagram ? button('Powiększ ↗', 'zoom', `${picture.asset}|${picture.alt}`, 'zoom-button') : ''}</figure>`;
}

export function mysteryCrop(): string {
  return `<figure class="mystery-crop"><svg viewBox="670 450 35 70" role="img" aria-label="Fragment ciemnych piór; nie widać całego ptaka." preserveAspectRatio="xMidYMid slice"><image href="${assetUrl('mystery')}" width="1000" height="1000" /></svg><figcaption><span class="frame-mark">KADR 01</span> Tylko mały fragment…</figcaption><span class="crop-corner top-left" aria-hidden="true"></span><span class="crop-corner bottom-right" aria-hidden="true"></span></figure>`;
}

export const leafIcon =
  '<svg viewBox="0 0 40 40" width="32" height="32" aria-hidden="true"><path d="M10 30C3 10 22 6 34 7c1 17-7 28-24 23Z" fill="currentColor"/><path d="m10 32 18-19M16 25l-1-9m6 4 8-1" fill="none" stroke="#f8f7ef" stroke-width="2"/></svg>';
