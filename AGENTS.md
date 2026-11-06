# Praca w home-edu

- Cel: jedna polska lekcja z `PRD(8).md`, statycznie pod `/home-edu/`. Bez kont, API, analityki i ocen punktowych.
- Node 24, Vite + TypeScript strict; `npm ci`. Nie dodawaj bibliotek bez konkretnej potrzeby. Zależności i lockfile zmieniaj razem.
- Treść i stałe ID: `src/content/`; czyste przejścia stanu: `src/state.ts`; IO zapisu: `src/storage.ts`; widoki: `src/ui/`. Nie łącz kluczy odpowiedzi z kolejnością opcji.
- Zapisuj każdą zmianę. Restart usuwa tylko `home-edu:przyroda-okolica:v1`, po potwierdzeniu. Nie ujawniaj odpowiedzi w altach przed rozwiązaniem.
- Wszystkie potrzebne obrazy są lokalne, z autorem, źródłem, licencją i opisem zmian. Klucz musi pasować do widocznego okazu.
- Testy bez sieci, małe i deterministyczne. Po zmianie: `node --test tests/unit/<plik>.test.ts`; po logice/IO: `npm test`; przed commitem: `npm run build`. Zmiany przepływu: `npm run test:e2e`.
- Sprawdzaj 360 px, klawiaturę, przerwy i 200% tekstu. Komunikaty po polsku; kontrolki ≥44 px, tekst ≥18 px. Dokumentacja krótka, z rzeczywistymi komendami i wynikami.
- Commituj spójne, sprawdzone zmiany; push bez force. Nie rebase’uj ani nie usuwaj gałęzi. Nie zmieniaj CI bez zgody (workflow Pages jest zamówiony w tym PRD).
- Nie czytaj sekretów ani `.env`. Nie nadpisuj danych. Bez `eval`, niebezpiecznej deserializacji i pobierania kodu w działającej aplikacji. Nie umieszczaj danych dzieci w logach ani repo.
