import type { Option, Picture, Step } from '../types.ts';

const option = (id: string, label: string, picture?: Picture): Option => ({ id, label, picture });
const picture = (asset: string, alt: string, caption?: string): Picture => ({ asset, alt, caption });

export const stations = [
  'Zagadka z płotu', 'Na parapecie', 'Tulipan', 'Na podwórku',
  'Zwierzęta obok nas', 'Ptasie tropy', 'Świat owadów', 'Drugi kadr',
] as const;

export const hypotheses = [option('blackbird', 'Kos'), option('jackdaw', 'Kawka'), option('magpie', 'Sroka'), option('unknown', 'Jeszcze za mało widać')];
export const details = [option('beak', 'Dziób'), option('tail', 'Ogon'), option('body', 'Cały ptak')];

export const steps: Step[] = [
  {
    id: 'first-guess', station: 1, kind: 'hypothesis', title: 'Kto siedział na płocie?',
    text: 'Ktoś usiadł na płocie. Aparat złapał tylko kawałek skrzydła. Jak myślisz, kto to był?',
    options: hypotheses, nextLabel: 'Zapisz mój typ',
  },
  {
    id: 'first-detail', station: 1, kind: 'detail', title: 'Czego chcesz się dowiedzieć?',
    text: 'Jakiej części ptaka chcesz się przyjrzeć, gdy znów się pojawi?',
    options: details, nextLabel: 'Rozejrzyj się po okolicy',
  },
  {
    id: 'windowsill', station: 2, kind: 'explore', title: 'Co rośnie na parapecie?',
    text: 'Dotknij wybranej rośliny i przyjrzyj się jej liściom.', nextLabel: 'Co można z nich mieć?',
  },
  {
    id: 'basil-use', station: 2, kind: 'quiz', title: 'Które listki dodasz do sosu?',
    text: 'Bazylię uprawiamy dla zapachu i smaku, paprotkę dla jej liści. Rośliny zdobią dom. Przy świetle wytwarzają tlen, a przez liście oddają do powietrza trochę wody. Wybierz podpisaną roślinę przyprawową.',
    options: [option('basil', 'Bazylia', picture('basil', 'Zielone, szerokie listki bazylii.')), option('fern', 'Paprotka', picture('fern', 'Długie, pierzaste liście paprotki.')), option('spiderplant', 'Zielistka', picture('spiderplant', 'Długie, wąskie liście zielistki.'))],
    accepted: ['basil'], hint: 'Szukasz znanej rośliny przyprawowej. Ozdobne rośliny zostaw w doniczkach.',
    explanation: 'Bazylia to zioło przyprawowe. Już jeden listek ma wyraźny zapach.',
  },
  {
    id: 'fern-observation', station: 2, kind: 'quiz', title: 'Co sprawdzisz jutro na zdjęciu?',
    text: 'Gdy dbasz o roślinę, zauważasz zmiany: tu rozwija się listek, tam ziemia wysycha. Co możesz sprawdzić na dwóch zdjęciach tej samej paprotki?',
    pictures: [picture('fern', 'Pierzaste liście paprotki.')],
    options: [option('leaf', 'Czy rozwinął się liść'), option('smell', 'Czy roślina pachnie')], accepted: ['leaf'],
    hint: 'Zdjęcie pokazuje to, co można zobaczyć oczami.',
    explanation: 'Dwa zdjęcia pomogą porównać kształt. Zapach poznajesz w inny sposób. Obserwacja roślin daje przyjemność i uczy dostrzegać zmiany.', extra: 'houseplants',
  },
  {
    id: 'bulb-inside', station: 3, kind: 'bulb', title: 'Co jest w cebuli tulipana?',
    text: 'Jesienią w ziemi znika cebula. Wiosną wyrasta z niej pęd. Skąd ma siłę, zanim rozwiną się liście? Wybierz, gdzie zajrzeć.',
  },
  {
    id: 'bulb-position', station: 3, kind: 'quiz', title: 'Jak ustawisz cebulę?',
    text: 'Ziemia jest już spulchniona. Wybierz ustawienie cebuli w dołku.',
    options: [option('up', 'Czubek w górę', picture('bulb-up', 'Cebula ze szpiczastym wierzchołkiem u góry i płaskim spodem u dołu.')), option('down', 'Czubek w dół', picture('bulb-down', 'Cebula ze szpiczastym wierzchołkiem skierowanym w dół.'))],
    accepted: ['up'], hint: 'Znajdź płaski spód. Z niego wyrosną korzenie.',
    explanation: 'Czubek kierujemy w górę: stąd wyrośnie pęd. Z płaskiego spodu korzenie rosną w dół.',
  },
  {
    id: 'bulb-cover', station: 3, kind: 'plant', title: 'Posadź swój tulipan',
    text: 'Przykład z lekcji: dołek ma 15 cm głębokości, a odstęp między cebulami wynosi 15–20 cm. To przykład, nie liczby do zapamiętania.',
  },
  {
    id: 'tulip-order', station: 3, kind: 'order', title: 'Co pojawiło się najpierw?',
    text: 'Ułóż trzy obserwacje od najwcześniejszej. Dotykaj kart, żeby wpisać je do dziennika.',
    options: [option('flower', 'Otwarty kwiat', picture('tulip-flower', 'Rozwinięty czerwony kwiat ponad liśćmi.')), option('leaves', 'Pierwsze liście', picture('tulip-leaves', 'Z ziemi wyrastają młode zielone liście; nie widać kwiatu.')), option('bud', 'Zamknięty pąk', picture('tulip-bud', 'Liście i pęd zakończony zamkniętym pąkiem kwiatowym.'))],
    accepted: ['leaves', 'bud', 'flower'], hint: 'Najpierw wychodzą liście. Na którym zdjęciu pąk jeszcze się nie otworzył?',
    explanation: 'Najpierw liście, potem zamknięty pąk, na końcu otwarty kwiat. Przykładowe daty jednej rośliny: 20 marca → 12 kwietnia → 20 kwietnia. Termin zależy od odmiany i pogody.',
  },
  {
    id: 'yard-map', station: 4, kind: 'map', title: 'Liść, kora czy owoc?',
    text: 'W którym miejscu zaczniesz szukać? Odkryj jeden szczegół. Pozostałe rośliny czekają też w atlasie.',
  },
  {
    id: 'birch-bark', station: 4, kind: 'quiz', title: 'Które drzewo ma taką korę?',
    text: 'Roślinę można rozpoznać nawet wtedy, gdy nie kwitnie. Przyjrzyj się korze, liściom albo owocom.',
    pictures: [picture('birch-task', 'Jasny, niemal biały pień z ciemnymi poprzecznymi fragmentami kory.')],
    options: [option('linden', 'Lipa drobnolistna'), option('birch', 'Brzoza brodawkowata'), option('rose', 'Róża dzika')],
    accepted: ['birch'], hint: 'Poszukaj ciemnych znaków na jasnym pniu.',
    explanation: 'To brzoza. Biała kora z ciemnymi fragmentami jest tu najlepszym tropem.', atlas: ['birch', 'linden'],
  },
  {
    id: 'clover-find', station: 4, kind: 'quiz', title: 'Wskaż koniczynę białą',
    text: 'W gałęziach zwierzę może się schować, a na niskich roślinach znaleźć pokarm. Przyjrzyj się dwóm roślinom z trawnika.',
    options: [option('plantain', 'Roślina A', picture('plantain', 'Wąskie, długie liście przy ziemi i kłosy na bezlistnych pędach.')), option('clover', 'Roślina B', picture('clover-task', 'Liście złożone z trzech listków i białe kwiaty skupione w kuliste główki.'))],
    accepted: ['clover'], hint: 'Porównaj liście, a potem kwiaty.',
    explanation: 'Roślina B to koniczyna biała. Liść składa się z trzech listków. Drobne białe kwiaty tworzą główkę. Roślina A to babka lancetowata.', atlas: ['clover', 'plantain'],
  },
  {
    id: 'dog-care', station: 5, kind: 'quiz', title: 'Czego brakuje w planie psa?',
    text: 'Ludzie utrzymują kury dla jaj, a owce między innymi dla wełny. Zwierzę w domu może nam towarzyszyć. Pies ma wodę, posiłek i spokojne posłanie. Co dopiszesz do jego dnia?',
    pictures: [picture('dog-care', 'Plan opieki: miska świeżej wody, posiłek i posłanie; jedno pole pozostaje puste.')],
    options: [option('walk', 'Spacer z opiekunem'), option('blanket', 'Drugi koc zamiast spaceru')], accepted: ['walk'],
    hint: 'Której potrzeby brakuje w tym planie?',
    explanation: 'Spacer daje psu ruch i okazję do węszenia. Opiekun poznaje potrzeby gatunku i w razie potrzeby zapewnia pomoc weterynarza. Gekon lamparci potrzebuje urządzonego, ogrzewanego terrarium — jego plan jest inny.',
  },
  {
    id: 'house-web', station: 5, kind: 'quiz', title: 'Kto zostawił pajęczynę przy oknie?',
    text: 'W mieszkaniu są też mali, dzicy goście. Kątnik poluje na drobne owady. Rybik bywa w wilgotnych zakamarkach i zwykle jest nieszkodliwy dla ludzi.',
    options: [option('silverfish', 'Rybik cukrowy', picture('silverfish', 'Wydłużone ciało, sześć nóg i trzy nitki na końcu odwłoka.')), option('spider', 'Kątnik domowy', picture('spider', 'Pająk z ośmioma długimi nogami obok sieci.')), option('moth', 'Mól włosienniczek', picture('moth', 'Mały owad z wąskimi skrzydłami i sześcioma nogami.'))],
    accepted: ['spider'], hint: 'Szukasz pająka. Policz odnóża na rysunku.',
    explanation: 'Kątnik ma osiem nóg i łowi owady w sieć. Dorosłe owady mają sześć nóg.', extra: 'traces',
  },
  {
    id: 'night-yard', station: 5, kind: 'night', title: 'Co zwabiło dzika?',
    text: 'Między domami zwierzęta znajdują kryjówki i pokarm. Nocą można spotkać jeża, lisa, sarnę albo dzika. Obejrzyj osiedle o zmierzchu i wybierz szczegół.',
  },
  {
    id: 'boar-safe', station: 5, kind: 'quiz', title: 'Widzisz z daleka dzika. Co zrobisz?',
    pictures: [picture('night', 'Dzik stoi obok otwartego kosza; na ziemi leżą resztki jedzenia.')],
    options: [option('distance', 'Zostanę z daleka i powiem dorosłemu'), option('photo', 'Podejdę zrobić zdjęcie'), option('feed', 'Zostawię mu kanapkę')], accepted: ['distance'],
    hint: 'Co pozwoli dzikowi spokojnie odejść?',
    explanation: 'Zachowaj odstęp i zostaw zwierzę w spokoju. Zamknięte pojemniki ograniczają dostęp do resztek jedzenia.',
  },
  {
    id: 'bird-spots', station: 6, kind: 'quiz', title: 'Czy każdy ciemny ptak to kos?',
    text: 'Oba z daleka wyglądają na ciemne. Powiększ zdjęcia. U którego ptaka zobaczysz jasne plamki?',
    options: [option('blackbird', 'Ptak A', picture('blackbird', 'Gładko czarne upierzenie, żółtawy dziób i obwódka oka.')), option('starling', 'Ptak B', picture('starling', 'Ciemne, połyskujące pióra z licznymi jasnymi plamkami na piersi.'))],
    accepted: ['starling'], hint: 'Obejrzyj pierś ptaka B.',
    explanation: 'Ptak B to szpak. U tego osobnika widać plamki i połysk. Ptak A to dorosły samiec kosa: gładko czarny, z żółtawym dziobem. Samica kosa jest brązowa. Dziób i plamki szpaka zmieniają się z porą roku.', atlas: ['blackbird', 'starling'],
  },
  {
    id: 'jackdaw-id', station: 6, kind: 'quiz', title: 'Siwy kark i krótki dziób. Kto to?',
    text: 'Nowy ptak na poręczy. Który szczegół pasuje do opisu w atlasie?',
    pictures: [picture('jackdaw', 'Ciemny ptak na poręczy. Z tyłu głowy i na karku ma szare pióra, a jego dziób jest krótki i ciemny.')],
    options: [option('rook', 'Gawron'), option('jackdaw', 'Kawka'), option('hooded', 'Wrona siwa')], accepted: ['jackdaw'],
    hint: 'Porównaj, gdzie jest szare pole: na karku czy na całym tułowiu?',
    explanation: 'To kawka. Wrona siwa ma rozległe szare pole na tułowiu. U dorosłego gawrona uwagę zwraca jasna, nieopierzona skóra przy dziobie.', atlas: ['jackdaw', 'hooded', 'rook'],
  },
  {
    id: 'ladybird-count', station: 7, kind: 'spots', title: 'Co mówią kropki?',
    text: 'Ile kropek znajdziesz? Dotknij każdej, którą dostrzegasz. Ponowne dotknięcie usuwa zaznaczenie. Możesz też używać klawiszy Tab i Enter.',
    options: [option('six', '6'), option('seven', '7'), option('eight', '8')], accepted: ['seven'],
    hint: 'Przy miejscu, gdzie stykają się obie pokrywy, jest jedna wspólna kropka.',
    explanation: '3 + 3 + 1 = 7. To wzór siedmiokropki. Liczba kropek nie podaje wieku biedronki.',
  },
  {
    id: 'ladybird-compare', station: 7, kind: 'quiz', title: 'Którą różnicę naprawdę widzisz?',
    pictures: [picture('ladybird', 'Czerwona biedronka z siedmioma czarnymi kropkami.', 'Siedmiokropka'), picture('asian', 'Jasnopomarańczowa biedronka z większą niż siedem liczbą plam i ciemnym znakiem za głową.', 'Biedronka azjatycka — jeden okaz')],
    options: [option('more', 'Okaz po prawej ma więcej plam'), option('older', 'Okaz po prawej jest starszy')], accepted: ['more'],
    hint: 'Porównaj to, co da się policzyć na zdjęciach.',
    explanation: 'Porównałeś dwa konkretne okazy. Biedronki azjatyckie mogą wyglądać bardzo różnie. U tej widać też ciemny znak za głową. Kropki nie mówią nam, ile ma lat.',
  },
  {
    id: 'earwig-shape', station: 7, kind: 'quiz', title: 'Który owad ma szczypce?',
    text: 'Przyjrzyj się końcowi ciała. Kropki to tylko jeden z możliwych tropów.',
    options: [option('earwig', 'Owad A', picture('earwig', 'Wąskie brązowe ciało zakończone parą wygiętych szczypiec.')), option('butterfly', 'Owad B', picture('butterfly', 'Pomarańczowe skrzydła z ciemnymi i żółtymi plamami oraz niebieskimi plamkami przy brzegu.'))], accepted: ['earwig'],
    hint: 'Spójrz na koniec długiego, wąskiego ciała.',
    explanation: 'Owad A to skorek pospolity, zwany też szczypawką. Owad B to rusałka pokrzywnik — najlepiej widać wzór na jej skrzydłach.', atlas: ['earwig', 'butterfly'],
  },
  {
    id: 'second-frame', station: 8, kind: 'reveal', title: 'Wracamy do naszego gościa',
    text: 'Na początku mieliśmy tylko mały fragment. Zobacz, ile informacji przyniesie drugi kadr.', nextLabel: 'Rozwiąż zagadkę',
  },
  {
    id: 'magpie-id', station: 8, kind: 'quiz', title: 'Kto siedział na płocie?',
    pictures: [picture('mystery', 'Ptak o bardzo długim ogonie i kontrastowych białych oraz czarnych piórach.')],
    options: [option('jackdaw', 'Kawka'), option('blackbird', 'Kos'), option('magpie', 'Sroka')], accepted: ['magpie'],
    hint: 'Porównaj długość ogona i jasne pola na ciele.',
    explanation: 'To sroka. Ma bardzo długi ogon i wyraźne czarne oraz białe pola. Teraz masz więcej informacji niż na początku.',
  },
  {
    id: 'magpie-evidence', station: 8, kind: 'quiz', title: 'Która cecha najbardziej ci pomogła?',
    pictures: [picture('mystery', 'Ptak z długim ogonem oraz czarnymi i białymi piórami siedzi na płocie.', 'Sroka na płocie')],
    options: [option('tail', 'Długi ogon'), option('colors', 'Czarne i białe pióra'), option('fence', 'Siedzi na płocie')], accepted: ['tail', 'colors'],
    hint: 'Na tym samym płocie może usiąść wiele ptaków. Przyjrzyj się samemu zwierzęciu.',
    explanation: 'Długi ogon albo czarne i białe pióra — obie cechy pomagają rozpoznać srokę. Miejsce, w którym siedzi, to za mało.',
  },
  {
    id: 'reflect-plants', station: 8, kind: 'reflection', title: 'Powiedz własnymi słowami',
    text: 'Podaj dwie korzyści z uprawy roślin w domu. Możesz odpowiedzieć w myślach albo na głos.',
    pictures: [picture('basil', 'Zielone listki bazylii.', 'Twój własny przykład jest mile widziany')],
    explanation: 'Bazylia daje przyprawę. Obserwując nowe liście paprotki, uczę się zauważać zmiany.',
  },
  {
    id: 'reflect-animal', station: 8, kind: 'reflection', title: 'A czego potrzebuje zwierzę?',
    text: 'Wybierz zwierzę, które masz lub chcesz kiedyś poznać. Czego potrzebuje każdego dnia? Odpowiedz w myślach albo na głos.',
    pictures: [picture('dog-care', 'Miska wody, jedzenie i spokojne posłanie; pomyśl też o ruchu i poznawaniu otoczenia.')],
    explanation: 'Pies potrzebuje świeżej wody i spacerów, podczas których może się poruszać i węszyć. Potrzebuje też jedzenia, schronienia i opieki.', nextLabel: 'Zakończ lekcję',
  },
];

export const stepById = new Map(steps.map(step => [step.id, step]));
export const firstStep = steps[0]!;
export const isGraded = (step: Step): boolean => ['quiz', 'order', 'spots'].includes(step.kind);

export const houseplants = [
  { id: 'dracaena', name: 'Dracena', detail: 'Długie, wąskie liście tworzą pióropusze.' },
  { id: 'ficus', name: 'Fikus', detail: 'Ma liczne, gładkie, spiczasto zakończone liście.' },
  { id: 'violet', name: 'Sępolia (fiołek afrykański)', detail: 'Miękkie, zaokrąglone liście otaczają niewielkie kwiaty.' },
  { id: 'fern', name: 'Paprotka', detail: 'Duży liść składa się z wielu małych części.' },
  { id: 'orchid', name: 'Storczyk', detail: 'Kwiaty wyrastają na długim pędzie.' },
  { id: 'spiderplant', name: 'Zielistka', detail: 'Popatrz, jak długie i wąskie są jej liście.' },
];

export const traces = [
  ['Wołek zbożowy', 'Uszkodzone ziarna w zapasach.'],
  ['Larwy mola włosienniczka', 'Dziurki w wełnianym ubraniu.'],
  ['Pluskwa domowa', 'Może kąsać człowieka.'],
  ['Karaczan', 'Może zanieczyszczać żywność.'],
] as const;
