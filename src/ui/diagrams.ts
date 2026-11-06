/** Original, simplified teaching diagrams. Coordinates stay fixed so keyboard hotspots match visible anatomy. */
const wrap = (content: string, label: string): string =>
  `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><rect width="600" height="400" rx="20" fill="#eef1e5"/>${content}</svg>`;
const soil =
  '<path d="M0 260 Q150 248 300 260T600 260V400H0Z" fill="#79563c"/><path d="M0 260h600" stroke="#b39365" stroke-width="12"/>';

export function bulbDiagram(layer = 'inside', planted = false): string {
  const outer =
    '<path d="M300 95C280 140 215 166 220 226Q225 290 300 292Q375 290 380 226C385 166 320 140 300 95Z" fill="#b67b49" stroke="#70482d" stroke-width="4"/>';
  const inner =
    '<path d="M300 115C290 161 240 185 242 231Q246 270 300 277Q354 270 358 231C360 185 310 161 300 115Z" fill="#f3ddb0" stroke="#cbab76" stroke-width="4"/><path d="M300 147C288 184 264 211 266 240Q272 260 300 269Q328 260 334 240C336 211 312 184 300 147Z" fill="#fff0cd" stroke="#cbab76" stroke-width="4"/>';
  const bud =
    '<path d="M300 267C275 225 282 190 300 170C320 199 323 233 300 267Z" fill="#83a565" stroke="#406842" stroke-width="3"/>';
  const roots =
    '<path d="M280 287q-22 20-20 42m30-42q-10 35-3 58m13-58v55m10-55q18 25 12 51m0-51q24 18 25 40" stroke="#dfc7a5" stroke-width="5" fill="none"/>';
  const labels =
    layer === 'inside'
      ? '<g font-family="system-ui" font-size="23" fill="#244437"><path d="M305 208h117M343 245h79" stroke="#244437" stroke-width="2"/><text x="431" y="212">pąk</text><text x="431" y="253">łuski</text><text x="431" y="281">z zapasami</text></g>'
      : '';
  return wrap(
    `${planted ? soil : ''}${roots}${outer}${layer !== 'outer' ? inner : ''}${layer === 'inside' || layer === 'bud' ? bud : ''}${labels}`,
    'Przekrój cebuli: mięsiste łuski otaczają młody pąk, korzenie wyrastają z płaskiego spodu.',
  );
}

export function tulipDiagram(stage: string): string {
  const leaves =
    '<path d="M298 291Q220 260 215 175Q290 211 298 291M303 291Q375 247 386 154Q319 194 303 291" fill="#60865d"/><path d="M295 292q-8-100 0-150" fill="none" stroke="#385c40" stroke-width="7"/>';
  let flower = '';
  if (stage !== 'leaves')
    flower = `<path d="M300 275V117" stroke="#476d44" stroke-width="9"/>${stage === 'bud' ? '<ellipse cx="300" cy="108" rx="21" ry="36" fill="#bb614c"/><path d="M297 75v66" stroke="#8b4539" stroke-width="3"/>' : '<path d="M245 79Q261 158 300 152Q339 158 355 79L327 94L300 62L276 94Z" fill="#be604c"/><path d="M277 95q5 30 23 55m27-56q-8 36-27 56" stroke="#944434" stroke-width="3" fill="none"/>'}`;
  return wrap(
    `${soil}${leaves}${flower}`,
    stage === 'leaves'
      ? 'Młode liście wyrastające z ziemi.'
      : stage === 'bud'
        ? 'Pęd tulipana z zamkniętym pąkiem.'
        : 'Tulipan z otwartym czerwonym kwiatem.',
  );
}

export const spotPositions = [
  [50, 34],
  [35, 45],
  [65, 45],
  [32, 65],
  [68, 65],
  [40, 82],
  [60, 82],
] as const;

export function ladybirdDiagram(leftOpen = false, rightOpen = false): string {
  const legs =
    '<g stroke="#28352e" stroke-width="7" fill="none" stroke-linecap="round"><path d="M236 160l-44-31-20-15m64 97-55-5-20 8m80 40-37 36-15 22M364 160l44-31 20-15m-64 97 55-5 20 8m-80 40 37 36 15 22"/></g>';
  const wing =
    '<path d="M300 125Q172 92 203 301Q264 325 300 150Q336 325 397 301Q428 92 300 125Z" fill="#e3e5dc" stroke="#949e91" stroke-width="3"/><path d="M300 130 220 285m80-155 80 155" stroke="#9aa294" stroke-width="2"/>';
  const left = `<g transform="rotate(${leftOpen ? 55 : 0} 300 130)"><path d="M300 122C153 118 169 359 300 365Z" fill="#bd4f3d" stroke="#343f34" stroke-width="4"/><circle cx="210" cy="180" r="21"/><circle cx="192" cy="260" r="23"/><circle cx="240" cy="328" r="21"/></g>`;
  const right = `<g transform="rotate(${rightOpen ? -55 : 0} 300 130)"><path d="M300 122C447 118 431 359 300 365Z" fill="#cd5a43" stroke="#343f34" stroke-width="4"/><circle cx="390" cy="180" r="21"/><circle cx="408" cy="260" r="23"/><circle cx="360" cy="328" r="21"/></g>`;
  return wrap(
    `${legs}<ellipse cx="300" cy="96" rx="60" ry="48" fill="#28352e"/><path d="m273 61-15-23m69 23 15-23" stroke="#28352e" stroke-width="5"/><ellipse cx="260" cy="110" rx="14" ry="22" fill="#f7f0df"/><ellipse cx="340" cy="110" rx="14" ry="22" fill="#f7f0df"/>${leftOpen || rightOpen ? wing : ''}<g fill="#28352e">${left}${right}${!leftOpen && !rightOpen ? '<circle cx="300" cy="136" r="23"/>' : ''}</g>`,
    leftOpen || rightOpen
      ? 'Otwarte czerwone pokrywy, pod nimi cienkie błoniaste skrzydła.'
      : 'Schemat biedronki z góry: po trzy czarne kropki na bokach i jedna wspólna przy styku pokryw.',
  );
}

export function nightDiagram(): string {
  return wrap(
    '<rect width="600" height="400" rx="20" fill="#243d43"/><circle cx="460" cy="64" r="28" fill="#f1dfae"/><path d="M0 100h110v180H0m140-140h95v140h-95m130-170h100v170H265" fill="#334e53"/><g fill="#e8c680"><path d="M28 125h25v30H28m30 40h25v30H58m100-30h25v30h-25m25 50h25v30h-25m100-130h25v30h-25"/></g><path d="M0 300q300-45 600 0v100H0" fill="#697864"/><path d="M98 280V112h48" stroke="#b9c5b4" stroke-width="7" fill="none"/><path d="M120 112h50l-8-20h-32Z" fill="#e9ce93"/><path d="M468 223h65l-6 96h-52Z" fill="#9caf9b"/><path d="m466 215 53-22" stroke="#bdcab0" stroke-width="10"/><path d="m458 323 18 8-20 10-9-8m83-5 20 4-8 10-15-6" fill="#d19a6a"/><ellipse cx="339" cy="286" rx="63" ry="39" fill="#705d4d"/><path d="m385 264 31-12 19 34-44 18m-85 1-5 42m55-42 5 42m-25-91 8-18 16 19" fill="#705d4d" stroke="#705d4d" stroke-width="10"/><circle cx="411" cy="276" r="4" fill="#1b2a2a"/>',
    'Osiedle o zmierzchu: latarnia po lewej, dzik i otwarty kosz z resztkami jedzenia po prawej.',
  );
}

export function careDiagram(): string {
  return wrap(
    '<g font-family="system-ui" text-anchor="middle" fill="#254d3f"><path d="M42 165h120l-20 65H62Z" fill="#87aab3"/><ellipse cx="102" cy="165" rx="60" ry="12" fill="#c3dbe0"/><text x="102" y="277" font-size="24">woda</text><path d="M220 165h120l-20 65H240Z" fill="#c98b63"/><g fill="#76523b"><circle cx="245" cy="163" r="12"/><circle cx="272" cy="161" r="12"/><circle cx="300" cy="162" r="12"/></g><text x="280" y="277" font-size="24">posiłek</text><rect x="395" y="152" width="155" height="75" rx="30" fill="#c5cda4"/><path d="M410 182h120" stroke="#91a17b" stroke-width="9"/><text x="472" y="277" font-size="24">posłanie</text><text x="300" y="85" font-size="27">Co jeszcze?</text></g>',
    'Plan opieki: świeża woda, posiłek i posłanie. Miejsce na jeszcze jedną potrzebę.',
  );
}

export function houseAnimalDiagram(id: string): string {
  if (id === 'spider')
    return wrap(
      '<g stroke="#596c5a" stroke-width="2" fill="none" opacity=".5"><path d="M390 20v340M250 80l260 220M250 300 510 80M240 190h280"/><ellipse cx="390" cy="190" rx="105" ry="92"/><ellipse cx="390" cy="190" rx="65" ry="58"/></g><g fill="none" stroke="#675443" stroke-width="9" stroke-linecap="round"><path d="m275 178-55-50-30-50m89 106-83-15-36-27m120 56-85 27-28 40m115-55-48 57-13 45m104-134 55-50 30-50m-89 106 83-15 36-27m-120 56 85 27 28 40m-115-55 48 57 13 45"/></g><ellipse cx="300" cy="227" rx="32" ry="51" fill="#826a50"/><ellipse cx="300" cy="175" rx="24" ry="27" fill="#65503e"/>',
      'Kątnik: osiem nóg, po cztery po każdej stronie, i sieć.',
    );
  if (id === 'silverfish')
    return wrap(
      '<g stroke="#718985" stroke-width="5" fill="none"><path d="m275 140-65-45m110 45 65-45m-107 80-70-10m105 10 70-10m-108 50-60 40m90-40 60 40m-55 35 25 75m-30-75v90m-5-90-25 75M285 96l-30-50m60 50 30-50"/></g><path d="M300 80C225 125 267 233 300 294C333 233 375 125 300 80Z" fill="#9ea9a1"/><path d="M270 150h60m-57 25h54m-48 25h42m-34 25h26" stroke="#6d8580" stroke-width="4"/>',
      'Rybik: sześć nóg, dwa czułki, trzy długie nitki z tyłu.',
    );
  return wrap(
    '<g stroke="#9c835a" stroke-width="5" fill="none"><path d="m285 150-45-25m45 55-55 15m55 15-35 45m65-105 45-25m-45 55 55 15m-55 15 35 45m-20-150-20-30m30 30 20-30"/></g><ellipse cx="300" cy="180" rx="22" ry="95" fill="#b6a16d"/><path d="M295 100q-88 90-70 188l75-47 75 47q18-98-70-188" fill="#cbbb91" stroke="#a18f64" stroke-width="3"/>',
    'Mól: wąskie, jasnobrązowe skrzydła i sześć nóg.',
  );
}

export function diagramFor(asset: string): string | null {
  if (asset === 'bulb-up') return bulbDiagram('outer');
  if (asset === 'bulb-down') return `<div class="upside-down">${bulbDiagram('outer')}</div>`;
  if (asset.startsWith('tulip-')) return tulipDiagram(asset.slice(6));
  if (asset === 'dog-care') return careDiagram();
  if (asset === 'night') return nightDiagram();
  if (['spider', 'silverfish', 'moth'].includes(asset)) return houseAnimalDiagram(asset);
  return null;
}
