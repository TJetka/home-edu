# Plan i odbiór

| Cykl         | Historia i kryterium                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| 1. Fundament | Klon uruchamia się przez `npm ci`; build działa pod `/home-edu/`; testy i publikacja używają tych samych komend.    |
| 2. Lekcja    | Uczeń przechodzi 8 przystanków; błąd daje wskazówkę, drugi błąd wyjaśnienie; nie ma blokady wynikiem.               |
| 3. Przerwy   | Odświeżenie zachowuje krok, hipotezę, częściową kolejność, kropki i wskazówkę; uszkodzony zapis nie blokuje lekcji. |
| 4. Materiały | 15 kart atlasu, legalne lokalne fotografie, poprawne schematy, 3 dobrowolne odkrycia po zapisaniu ukończenia.       |
| 5. Odbiór    | Pełna ścieżka w przeglądarce, 360 px, klawiatura, powiększenie i brak zewnętrznych żądań; wdrożenie Pages.          |

Założenia po ponownym przeglądzie: jedna aplikacja bez frameworka UI; krótkie kroki zamiast ośmiu długich stron; osobne zdjęcie sroki w atlasie, żeby nie odsłonić finałowego kadru; brak sieci w testach.

Odbiór 2026-11-06: [build CI](https://github.com/TJetka/home-edu/actions/runs/42193868934) przeszedł czyste `npm ci`, formatowanie, 16 testów jednostkowych, kontrolę typów, build i 18 testów Chromium. Pełna lekcja działa przy 1280, 768 i 360 px; sprawdzono zapis, przerwy, atlas, błędne odpowiedzi, klawiaturę, 200% tekstu i blokadę zewnętrznych żądań. Zweryfikowano metadane 27 lokalnych fotografii i cztery linki do materiałów dodatkowych.

Publikacja zablokowana: repozytorium ma `has_pages: false`; `configure-pages` zwraca 404. Administrator musi wybrać **Settings → Pages → Source → GitHub Actions**, a następnie uruchomić ponownie workflow **Test and deploy Pages**. Dostęp SSH pozwala wysyłać kod, ale nie zmieniać tego ustawienia.

Walidacja rodzinna pozostaje osobna: zaprojektowano 30 min; nie zmierzono czasu z uczniem. Podczas pilotażu zapisz czas aktywnej pracy (cel 25–35 min), potrzebną pomoc, uzasadnienia dziecka i wybór dodatków.
