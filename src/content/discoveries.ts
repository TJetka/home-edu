export const discoveries = [
  {
    id: 'song', title: 'Czy szpak może zabrzmieć jak inny ptak?', asset: 'starling',
    prompt: 'Jak myślisz: czy szpak mógłby naśladować kaczkę?',
    explanation: 'Tak. Szpak potrafi wplatać do swojej piosenki zasłyszane głosy. Sam dźwięk bywa więc mylącą wskazówką! W nagraniach porównaj gwizdy i zmiany melodii. Opis możesz czytać także bez dźwięku.',
    links: [
      { title: 'Szpak — Ptasie trele, GDOŚ', url: 'https://www.gov.pl/web/gdos/szpak' },
      { title: 'Kos — Ptasie trele, GDOŚ', url: 'https://www.gov.pl/web/gdos/kos' },
    ],
  },
  {
    id: 'wings', title: 'Co pod pancerzykiem chowa biedronka?', asset: 'ladybird',
    prompt: 'Otwórz obie czerwone pokrywy i zobacz, co jest pod spodem.',
    explanation: 'Kropki widzisz na twardych pokrywach. Pod spodem biedronka chowa delikatne skrzydła, które rozkłada do lotu.',
    links: [{ title: 'Ile lat ma biedronka? — Bory Tucholskie', url: 'https://archiwum.pnbt.com.pl/ile_lat_ma_biedronka-198,283,612' }],
  },
  {
    id: 'layers', title: 'Co tulipan schował pod ziemią?', asset: 'bulb-up',
    prompt: 'Odkrywaj kolejno warstwy cebuli. Którą część narysujesz grubszą, żeby pokazać zapasy?',
    explanation: 'Mięsiste łuski to zmienione liście. Gromadzą zapasy dla młodego pędu. To je warto narysować grubszymi.',
    links: [{ title: 'Liść — budowa i funkcje, ZPE', url: 'https://zpe.gov.pl/a/lisc---budowa-i-funkcje/D13pzCpyz' }],
  },
] as const;
