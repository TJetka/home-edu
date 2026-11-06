import { details, houseplants, hypotheses, isGraded, traces } from '../content/lesson.ts';
import { answerFor, canCheck, canContinue, solved } from '../state.ts';
import type { LessonState, Step } from '../types.ts';
import {
  bulbDiagram,
  ladybirdDiagram,
  nightDiagram,
  spotPositions,
  tulipDiagram,
} from './diagrams.ts';
import { button, escape, mysteryCrop, photo } from './html.ts';

function selections(step: Step, state: LessonState, selected: string[]): string {
  const answer = answerFor(state, step);
  const locked = isGraded(step) && answer.status !== 'answering';
  const action =
    step.kind === 'hypothesis' ? 'hypothesis' : step.kind === 'detail' ? 'detail' : 'select';
  return `<div class="options ${step.options?.some((o) => o.picture) ? 'image-options' : ''} ${step.id === 'bird-spots' ? 'bird-options' : ''}" role="group" aria-label="Odpowiedzi">${step.options
    ?.map((o, i) => {
      const chosen = selected.includes(o.id);
      const right = solved(answer) && step.accepted?.includes(o.id);
      return `<div class="option-wrap">${o.picture ? photo(o.picture, true, Boolean(right)) : ''}<button type="button" class="option ${chosen ? 'selected' : ''} ${right ? 'right' : ''}" data-action="${action}" data-value="${o.id}" aria-pressed="${chosen}" ${locked || (step.kind === 'order' && chosen) ? 'disabled' : ''}><span class="option-marker" aria-hidden="true">${chosen ? '✓' : String.fromCharCode(65 + i)}</span><span>${escape(o.label)}${right ? '<small>Pasuje do wyjaśnienia</small>' : ''}</span></button></div>`;
    })
    .join('')}</div>`;
}

function extras(step: Step): string {
  if (step.extra === 'houseplants')
    return `<details class="extras"><summary>Inne rośliny w domu</summary><div class="mini-grid">${houseplants.map((p) => `<article>${photo({ asset: p.id, alt: `${p.name}: ${p.detail}`, caption: p.name }, false)}<p>${p.detail}</p></article>`).join('')}</div></details>`;
  if (step.extra === 'traces')
    return `<details class="extras"><summary>Inne ślady w domu</summary><div class="mini-grid">${traces.map(([name, text]) => `<article><h3>${name}</h3><p>${text}</p></article>`).join('')}</div><p>Wystarczą ilustracje na ekranie — nie trzeba szukać tych zwierząt w domu.</p></details>`;
  return '';
}

function feedback(step: Step, state: LessonState): string {
  const answer = answerFor(state, step);
  if (answer.status === 'answering')
    return answer.attempts > 0
      ? `<aside class="feedback hint"><strong>Wskazówka zostaje z tobą</strong><p>${step.hint}</p></aside>`
      : '';
  if (answer.status === 'hint')
    return `<aside class="feedback hint"><strong>Spójrz na jeden szczegół</strong><p>${step.hint}</p>${button('Spróbuj jeszcze raz', 'retry', '', 'secondary')}</aside>`;
  return `<aside class="feedback"><strong>${answer.status === 'correct' ? 'Właśnie ten trop!' : 'Zobacz, jak to rozpoznać'}</strong><p>${step.explanation}</p>${step.id === 'bulb-position' ? '<p class="direction-note">↑ pęd · cebula · korzenie ↓</p>' : ''}</aside>${extras(step)}`;
}

function exploration(step: Step, state: LessonState): string {
  const visited = state.discoveries[step.id] ?? [];
  const last = visited.at(-1);
  const exploreButton = (label: string, value: string, primary = false) =>
    button(label, 'explore', `${step.id}|${value}`, primary ? 'primary' : 'secondary');
  switch (step.kind) {
    case 'explore': {
      const plants = [
        {
          id: 'basil',
          name: 'Bazylia',
          detail: 'Jej miękkie, szerokie listki pachną. Używamy ich jako przyprawy.',
        },
        houseplants.find((p) => p.id === 'fern')!,
        houseplants.find((p) => p.id === 'spiderplant')!,
      ];
      return `<div class="windowsill">${plants.map((p) => `<article>${photo({ asset: p.id, alt: `${p.name}: ${p.detail}` }, false)}${exploreButton(p.name, p.id)}${visited.includes(p.id) ? `<p class="observation">${p.detail}</p>` : ''}</article>`).join('')}</div>`;
    }
    case 'bulb':
      return `<div class="illustration">${last ? bulbDiagram() : '<div class="empty-bed"><span>Jesień</span><div class="soil-line"></div><span>Co kryje się pod ziemią?</span></div>'}</div><div class="actions">${exploreButton('Pod ziemię', 'below')}${exploreButton('Nad ziemię', 'above')}</div>${last ? `<aside class="feedback">${last === 'above' ? '<p>Nad ziemią jest jeszcze pusta rabata. Zajrzyjmy więc pod spód.</p>' : ''}<p>W grubych łuskach cebuli są zapasy pokarmu. Młody pęd może z nich korzystać, zanim jego liście rozwiną się nad ziemią.</p></aside>` : ''}`;
    case 'plant':
      return `<div class="season-strip"><span class="${!visited.includes('spring') ? 'current' : ''}">Jesień</span><span aria-hidden="true">→</span><span class="${visited.includes('spring') ? 'current' : ''}">Wiosna</span></div><div class="illustration">${visited.includes('spring') ? tulipDiagram('leaves') : visited.includes('covered') ? '<div class="covered-bed"><p>Cebula jest pod ziemią.</p><div class="mulch">Cienka warstwa kory</div><p>Teraz czekamy do wiosny.</p></div>' : bulbDiagram('outer', true)}</div>${!visited.includes('covered') ? exploreButton('Przysyp ziemią', 'covered', true) : !visited.includes('spring') ? exploreButton('Zobacz wiosnę', 'spring', true) : '<p class="observation">Pierwsze liście! Teraz możesz zapisać kolejne obserwacje.</p>'}`;
    case 'map': {
      const places = [
        {
          id: 'trees',
          label: 'Drzewa',
          asset: 'birch',
          caption: 'Brzoza brodawkowata — biała kora z ciemnymi fragmentami.',
        },
        {
          id: 'shrubs',
          label: 'Krzewy',
          asset: 'snowberry',
          caption: 'Śnieguliczka biała — kuliste białe owoce. Zostawiamy je na krzewie.',
        },
        {
          id: 'lawn',
          label: 'Trawnik',
          asset: 'clover',
          caption: 'Koniczyna biała — niski pęd i liście z trzema listkami.',
        },
      ];
      const found = places.find((p) => p.id === last);
      return `<div class="yard-map" aria-label="Miejsca na podwórku">${places.map((p) => exploreButton(p.label, p.id)).join('')}</div>${found ? photo({ asset: found.asset, alt: found.caption, caption: found.caption }) : '<p class="small-note">Każde miejsce to inny trop. Wybór należy do ciebie.</p>'}`;
    }
    case 'night':
      return `<div class="illustration night-board">${nightDiagram()}<button type="button" class="scene-spot scene-bin" data-action="explore" data-value="${step.id}|bin" aria-label="Kos — szczegół na rysunku">+</button><button type="button" class="scene-spot scene-lamp" data-action="explore" data-value="${step.id}|lamp" aria-label="Latarnia — szczegół na rysunku">+</button></div><div class="actions">${exploreButton('Obejrzyj otwarty kosz', 'bin')}${exploreButton('Obejrzyj latarnię', 'lamp')}</div>${last ? `<aside class="feedback"><p>${last === 'bin' ? 'Resztki jedzenia przy koszu: łatwo dostępny pokarm.' : 'Przyjrzyj się temu, co leży na ziemi obok kosza.'}</p></aside>` : ''}`;
    case 'reveal':
      return `<div class="remember"><span>Twój pierwszy typ:</span> <strong>${escape(hypotheses.find((o) => o.id === state.hypothesis)?.label ?? 'Jeszcze za mało widać')}</strong></div>${visited.includes('revealed') ? `${photo({ asset: 'mystery', alt: 'Ptak o długim ogonie i kontrastowych białych i czarnych piórach.' })}<p class="observation">Wybrany szczegół: <strong>${escape(details.find((o) => o.id === state.detail)?.label ?? 'Cały ptak')}</strong>. Obejrzyj go w powiększeniu. Teraz masz więcej informacji niż na początku.</p>` : `${mysteryCrop()}${exploreButton('Odsłoń cały kadr', 'revealed', true)}`}`;
    case 'reflection':
      return `${step.pictures?.map((p) => photo(p, false)).join('')}${exploreButton('Porównaj z przykładem', 'example')}${visited.includes('example') ? `<aside class="feedback"><p>${step.explanation}</p><p>Twój przykład może być inny.</p></aside>` : '<p class="small-note">Nie musisz niczego wpisywać ani nagrywać.</p>'}`;
    default:
      return '';
  }
}

function spots(step: Step, state: LessonState): string {
  const locked = answerFor(state).status !== 'answering';
  return `<div class="spot-board">${ladybirdDiagram()}${!state.countMode ? spotPositions.map(([x, y], i) => `<button type="button" class="spot ${state.dots.includes(`spot-${i + 1}`) ? 'marked' : ''}" style="left:${x}%;top:${y}%" aria-label="Kropka ${i + 1}" aria-pressed="${state.dots.includes(`spot-${i + 1}`)}" data-action="dot" data-value="spot-${i + 1}" ${locked ? 'disabled' : ''}><span aria-hidden="true">${state.dots.includes(`spot-${i + 1}`) ? '✓' : ''}</span></button>`).join('') : ''}</div>${state.countMode ? selections(step, state, answerFor(state).selected) : `<p class="dot-counter">Zaznaczone kropki: <strong>${state.dots.length}</strong></p>`}${!solved(answerFor(state)) ? button(state.countMode ? 'Wolę zaznaczać kropki' : 'Wolę policzyć bez zaznaczania', 'count-mode', '', 'text-button') : ''}`;
}

export function lessonView(step: Step, state: LessonState): string {
  const answer = answerFor(state, step);
  const special = ['explore', 'bulb', 'plant', 'map', 'night', 'reveal', 'reflection'].includes(
    step.kind,
  );
  let body = '';
  if (step.kind === 'hypothesis' || step.kind === 'detail') {
    body = `<div class="question-split"><div>${mysteryCrop()}</div><div>${step.kind === 'detail' ? `<p class="observation">${state.hypothesis === 'unknown' ? 'To uczciwa odpowiedź. Ciemne pióra ma kilka różnych ptaków.' : 'Zapamiętamy twój typ. Wrócimy do niego na końcu.'}</p>` : '<p class="small-note">To twój pierwszy pomysł. Nie musisz mieć pewności.</p>'}${selections(step, state, [step.kind === 'hypothesis' ? (state.hypothesis ?? '') : (state.detail ?? '')])}</div></div>`;
  } else if (special) body = exploration(step, state);
  else if (step.kind === 'spots') body = spots(step, state);
  else {
    const pictures = step.pictures?.length
      ? `<div class="picture-grid ${step.id === 'ladybird-compare' ? 'specimens' : ''}">${step.pictures.map((p) => photo(p, true, solved(answer))).join('')}</div>`
      : '';
    const order =
      step.kind === 'order'
        ? `<ol class="order-slots" aria-label="Kolejność obserwacji">${[0, 1, 2].map((i) => `<li><span>${i + 1}</span>${escape(step.options?.find((o) => o.id === (solved(answer) ? step.accepted![i] : answer.selected[i]))?.label ?? 'Wybierz kartę')}${solved(answer) ? `<small>${['20 marca', '12 kwietnia', '20 kwietnia'][i]}</small>` : ''}</li>`).join('')}</ol>${button('Cofnij', 'undo', '', 'text-button', answer.selected.length === 0 || answer.status !== 'answering')}`
        : '';
    const tabs =
      step.id === 'bird-spots'
        ? `<div class="bird-tabs" role="group" aria-label="Oglądany ptak">${button('Ptak A', 'bird-tab', 'blackbird', 'secondary')}${button('Ptak B', 'bird-tab', 'starling', 'secondary')}</div>`
        : '';
    body = `${pictures}${order}${tabs}${selections(step, state, answer.selected)}`;
  }
  return `<article class="lesson" data-step="${step.id}"><header class="lesson-heading"><p class="eyebrow">${step.station === 8 ? 'Zamykamy zagadkę' : 'Małe odkrycie'}</p><h1 id="page-title" tabindex="-1">${step.title}</h1>${step.text ? `<p class="lead">${step.text}</p>` : ''}</header>${body}${isGraded(step) ? feedback(step, state) : ''}<div class="lesson-actions">${isGraded(step) && !solved(answer) ? `<div class="actions">${button('Sprawdź', 'check', '', 'primary', !canCheck(state))}${button('Pokaż wyjaśnienie', 'explain', '', 'text-button')}</div>` : ''}${canContinue(state) ? button(`${step.nextLabel ?? 'Dalej'} <span aria-hidden="true">→</span>`, 'next', '', 'primary') : ''}${step.atlas && solved(answer) ? button('Porównaj w atlasie', 'atlas-pair', step.atlas.join(','), 'secondary') : ''}</div></article>`;
}
