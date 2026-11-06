# Przyroda za oknem

Polska lekcja przyrody dla klasy 4: osiem przystanków, atlas i trzy dodatkowe odkrycia. Bez konta, backendu i analityki. Postęp zostaje w przeglądarce.

```sh
# Node 24 LTS (nvm use)
npm ci
npm run dev
# http://localhost:5173/home-edu/
```

`npm test` sprawdza treść, stan i licencje obrazów. `npm run format:check` sprawdza Prettier. `npm run build` sprawdza typy i tworzy `dist/`. `npm run preview` udostępnia build pod `http://localhost:4173/home-edu/`.

Testy przeglądarki: `npx playwright install chromium`, następnie `npm run test:e2e`. `npm run check` uruchamia pełną walidację.

Publikacja: w repozytorium **Settings → Pages → Source → GitHub Actions**. Następnie uruchom workflow **Test and deploy Pages**. Kolejne pushe do `main` automatycznie testują i wdrażają aplikację pod **https://tjetka.github.io/home-edu/**. Wyniki odbioru i bieżąca blokada publikacji: [docs/delivery.md](docs/delivery.md).

Wymagania: [PRD](PRD%288%29.md). Plan i odbiór: [docs/delivery.md](docs/delivery.md). Licencje fotografii są w aplikacji pod „Źródła ilustracji” i w `src/content/assets.json`. Dane lekcji: `src/content/`; logika: `src/state.ts`; widoki: `src/ui/`.
