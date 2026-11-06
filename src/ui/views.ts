import credits from '../content/assets.json';
import { atlas } from '../content/atlas.ts';
import { discoveries } from '../content/discoveries.ts';
import { stations } from '../content/lesson.ts';
import { currentStep } from '../state.ts';
import type { AssetCredit, LessonState } from '../types.ts';
import { bulbDiagram, ladybirdDiagram } from './diagrams.ts';
import { assetUrl, button, escape, leafIcon, mysteryCrop, photo } from './html.ts';
import { lessonView } from './lesson-view.ts';

function home(state: LessonState): string {
  const completed = state.status === 'completed';
  return `<section class="home-hero"><div class="hero-copy"><p class="eyebrow">PRZYRODA · KLASA 4</p><h1 id="page-title" tabindex="-1">Wielkie odkrycia.<br><em>Tuż za oknem.</em></h1><p class="lead">Kto usiadł na płocie? Poszukaj tropów wśród roślin, ptaków i małych sąsiadów.</p><p class="duration">Około 30 minut · możesz robić przerwy</p>${completed ? '<p class="completion-badge">✓ Lekcja ukończona</p>' : ''}<div class="actions">${button(completed ? 'Wróć do odkryć' : state.status === 'active' ? 'Wróć do lekcji →' : 'Zaczynam →', completed ? 'discoveries' : 'start', '', 'primary')}${completed ? button('Otwórz atlas', 'atlas', '', 'secondary') : ''}</div><p class="small-note">Wystarczy ekran i twoja ciekawość.</p>${state.status !== 'new' ? button('Zacznij od nowa', 'restart', '', 'text-button') : ''}</div><div class="hero-picture">${completed ? photo({ asset: 'mystery', alt: 'Sroka na płocie z długim ogonem i czarno-białymi piórami.', caption: 'Zagadka rozwiązana · sroka' }, false) : mysteryCrop()}<span class="photo-note">${completed ? 'Zauważasz już więcej.' : 'Pierwszy trop czeka na ciebie'}</span></div></section><section class="journey-intro"><div><p class="eyebrow">TWOJA MAŁA WYPRAWA</p><h2>Osiem przystanków. Jedna zagadka.</h2></div><div class="journey-path"><span><b>01</b> Postaw hipotezę</span><span><b>02–07</b> Szukaj szczegółów</span><span><b>08</b> Zobacz drugi kadr</span></div></section>`;
}

function atlasView(state: LessonState): string {
  const cards = atlas.filter(card => state.atlasPair.length ? state.atlasPair.includes(card.id) : card.group === state.atlasGroup);
  return `<section><div class="section-top">${button('← Wróć', 'close', '', 'secondary')}<p class="eyebrow">ATLAS POD RĘKĄ</p></div><h1 id="page-title" tabindex="-1">Przyjrzyj się z bliska</h1><p class="lead">Szukaj szczegółu, który pomaga rozpoznać roślinę lub zwierzę.</p><div class="tabs" role="group" aria-label="Grupa w atlasie">${[['plants', 'Rośliny · 6'], ['birds', 'Ptaki · 6'], ['insects', 'Owady · 3']].map(([id, label]) => `<button type="button" data-action="group" data-value="${id}" aria-pressed="${state.atlasGroup === id && !state.atlasPair.length}">${label}</button>`).join('')}</div>${state.atlasPair.length ? '<p class="small-note">Porównanie do bieżącego zadania. Wybierz grupę, aby zobaczyć cały atlas.</p>' : ''}<div class="atlas-grid">${cards.map(card => `<article class="atlas-card">${photo({ asset: card.asset, alt: card.description })}<div class="atlas-copy"><h2>${card.name}</h2><p>${card.description}</p></div></article>`).join('')}</div></section>`;
}

function sourcesView(): string {
  return `<section>${button('← Wróć', 'close', '', 'secondary')}<p class="eyebrow">AUTORZY I LICENCJE</p><h1 id="page-title" tabindex="-1">Źródła ilustracji</h1><p>Fotografie są zapisane razem z aplikacją. Kadrowanie CSS i miniatury nie zmieniają kolorów. Kadry i adaptacje pozostają na licencji zdjęcia źródłowego. Linki poniżej otworzą nową kartę.</p><p>Autorskie schematy edukacyjne (cebula, wzrost tulipana, biedronka, plan opieki, zwierzęta domowe i osiedle): projekt Home Edu, 2026, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Schematy pokazują cechy, nie skalę.</p><div class="credits">${(credits as AssetCredit[]).map(c => `<article><h2>${escape(c.name)}</h2><p>${escape(c.author)} · <a href="${escape(c.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(c.license)}</a></p><a href="${escape(c.source)}" target="_blank" rel="noopener noreferrer">Strona źródłowa ↗</a><p class="small-note">${escape(c.modifications)}</p></article>`).join('')}</div></section>`;
}

function completeView(): string {
  return `<section class="completion"><div><p class="eyebrow">ZAGADKA ROZWIĄZANA</p><h1 id="page-title" tabindex="-1">Teraz widzisz więcej.</h1><p class="lead">Mały fragment nie wystarczył. Przyglądając się szczegółom, można poznać znacznie więcej.</p><p class="completion-badge">✓ Lekcja ukończona</p><div class="completion-choices">${button('Na dziś wystarczy', 'home', '', 'secondary')}${button('Chcę odkryć coś jeszcze', 'discoveries', '', 'secondary')}</div><p class="small-note">Możesz też wrócić do atlasu w dowolnej chwili.</p></div>${photo({ asset: 'mystery', alt: 'Sroka na płocie z długim ogonem i kontrastowymi czarnymi oraz białymi piórami.', caption: 'Sroka na płocie' }, false)}</section>`;
}

function discoveriesView(): string {
  return `<section>${button('← Na stronę startową', 'home', '', 'secondary')}<p class="eyebrow">JESZCZE JEDNO ODKRYCIE?</p><h1 id="page-title" tabindex="-1">Za którym pytaniem pójdziesz?</h1><div class="discovery-grid">${discoveries.map(d => `<article>${photo({ asset: d.asset, alt: d.id === 'layers' ? 'Cebula tulipana.' : d.id === 'wings' ? 'Biedronka.' : 'Szpak.' }, false)}${button(d.title, 'discovery', d.id, 'discovery-button')}</article>`).join('')}</div></section>`;
}

function discoveryView(state: LessonState): string {
  const d = discoveries.find(item => item.id === state.discoveryId)!;
  const visited = state.discoveries[`extra-${d.id}`] ?? [];
  const act = (label: string, id: string) => button(label, 'explore', `extra-${d.id}|${id}`, 'secondary');
  let body = '';
  let revealed = false;
  if (d.id === 'song') {
    revealed = visited.length > 0;
    body = `${photo({ asset: 'starling', alt: 'Szpak z jasnymi plamkami.' }, false)}<div class="actions">${act('Myślę, że tak', 'yes')}${act('Myślę, że nie', 'no')}</div>`;
  } else if (d.id === 'wings') {
    revealed = visited.includes('left') && visited.includes('right');
    body = `<div class="illustration">${ladybirdDiagram(visited.includes('left'), visited.includes('right'))}</div><div class="actions">${act(visited.includes('left') ? 'Lewa pokrywa otwarta ✓' : 'Otwórz lewą pokrywę', 'left')}${act(visited.includes('right') ? 'Prawa pokrywa otwarta ✓' : 'Otwórz prawą pokrywę', 'right')}</div>`;
  } else {
    revealed = visited.includes('answer');
    const layer = visited.includes('bud') ? 'bud' : visited.includes('scales') ? 'scales' : 'outer';
    body = `<div class="illustration">${bulbDiagram(layer)}</div><p class="observation">${layer === 'outer' ? 'Zewnętrzna osłona chroni wnętrze cebuli.' : layer === 'scales' ? 'Mięsiste łuski: grube warstwy wewnątrz.' : 'Pąk: z niego rozwinie się młody pęd.'}</p><div class="actions">${!visited.includes('scales') ? act('Odsłoń mięsiste łuski', 'scales') : !visited.includes('bud') ? act('Odsłoń pąk', 'bud') : `${act('Pogrubię osłonę', 'answer')}${act('Pogrubię łuski', 'answer')}${act('Pogrubię pąk', 'answer')}`}</div>`;
  }
  return `<section class="discovery-detail">${button('← Wróć do odkryć', 'discoveries', '', 'secondary')}<p class="eyebrow">DLA CIEKAWYCH</p><h1 id="page-title" tabindex="-1">${d.title}</h1><p class="lead">${d.prompt}</p>${body}${revealed ? `<aside class="feedback"><p>${d.explanation}</p></aside><div class="external-links"><p>Możesz zajrzeć dalej. Otworzy się nowa karta.</p>${d.links.map(l => `<a class="external-link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.title} ↗</a>`).join('')}</div>` : ''}</section>`;
}

export function renderView(state: LessonState, persistent: boolean): string {
  const step = currentStep(state);
  const learning = state.view === 'lesson';
  const content = state.view === 'home' ? home(state)
    : state.view === 'lesson' ? lessonView(step, state)
    : state.view === 'atlas' ? atlasView(state)
    : state.view === 'sources' ? sourcesView()
    : state.view === 'complete' ? completeView()
    : state.view === 'discoveries' ? discoveriesView()
    : state.view === 'discovery' ? discoveryView(state)
    : `<section class="pause-view"><span class="pause-symbol" aria-hidden="true">Ⅱ</span><p class="eyebrow">CHWILA DLA CIEBIE</p><h1 id="page-title" tabindex="-1">Tu kończysz na teraz</h1><p>Wracasz do zadania: <strong>${step.title}</strong></p><p>Twoje wybory czekają. Nie musisz się spieszyć.</p>${button('Wracam →', 'resume', '', 'primary')}</section>`;
  return `<header class="site-header"><a href="#" class="brand" data-action="home">${leafIcon}<span>Przyroda<br><strong>za oknem</strong></span></a><nav aria-label="Narzędzia lekcji">${state.view !== 'atlas' && state.view !== 'sources' ? button('Atlas', 'atlas', '', 'nav-button') : ''}${learning ? button('Zrób przerwę', 'pause', '', 'nav-button') : ''}</nav></header>${learning ? `<div class="progress-wrap"><div class="progress-label"><span><strong>${step.station} z 8</strong> · ${stations[step.station - 1]}</span>${state.stepId !== 'first-guess' ? button('← Poprzedni krok', 'back', '', 'text-button') : ''}</div><div class="progress-dots" role="img" aria-label="Przystanek ${step.station} z 8">${stations.map((_, i) => `<span class="${i + 1 <= step.station ? 'filled' : ''}"></span>`).join('')}</div></div>` : ''}${!persistent ? '<aside class="storage-notice" role="status">W tej przeglądarce postęp zachowasz do zamknięcia karty.</aside>' : ''}<main id="main">${content}</main><footer class="site-footer"><span>Patrz uważnie. Pytaj śmiało.</span>${button('Źródła ilustracji', 'sources', '', 'text-button')}</footer><dialog id="zoom-dialog" aria-labelledby="zoom-title"><div class="dialog-top"><h2 id="zoom-title">Przyjrzyj się z bliska</h2>${button('Zamknij ×', 'close-dialog', '', 'secondary')}</div><div id="zoom-content"></div></dialog><dialog id="restart-dialog" aria-labelledby="restart-title"><h2 id="restart-title">Zacząć od nowa?</h2><p>Usuniesz wybory i ukończenie tylko tej lekcji w tej przeglądarce.</p><div class="actions">${button('Zostaw mój postęp', 'close-dialog', '', 'secondary')}${button('Tak, zacznij od nowa', 'confirm-restart', '', 'primary')}</div></dialog>`;
}

export function zoomContent(asset: string, alt: string): string {
  return `<img src="${assetUrl(asset)}" alt="${escape(alt)}" /><p>${escape(alt)}</p>`;
}
