# Каталог сериалов (React + Vite)

Проектная работа по дисциплине «Dezvoltarea aplicațiilor web cu React».
Студент: Spataru Evghenii, группа IAFR2403 Ru.

SPA для просмотра коллекции телесериалов: загрузка из открытого API, поиск, фильтры, сортировка, окно подробностей, избранное.
Четыре лабораторные работы — этапы одного приложения (коммиты/теги `lab-1` … `lab-4`).

## Запуск

Требуется Node.js 20.19+ или 22.12+.

```bash
npm install
npm run dev
```

Открыть адрес, который выведет Vite (обычно http://localhost:5173).
Сборка: `npm run build`, просмотр сборки: `npm run preview`.

## Предметная область и API

- Сущность: **сериал (show)**.
- API: **TVmaze** — https://api.tvmaze.com/shows?page=0 (публичный, без ключа, CORS разрешён; ответ — массив, на странице 0 — 240 сериалов). Данные API только читаются.
- Документация API: https://www.tvmaze.com/api

### Поля сущности

| Поле | Поле в API TVmaze | Назначение |
|---|---|---|
| `id` | `id` | уникальный идентификатор (key, CRUD, маршрут `/entity/:id`) |
| `name` | `name` | название; **поиск** по тексту |
| `genres` | `genres` | жанры; **категориальный фильтр** |
| `language` | `language` | язык |
| `status` | `status` | статус (выходит / завершён) |
| `rating` | `rating.average` | рейтинг; **фильтр-диапазон** и **сортировка** |
| `premiered` | `premiered` | дата премьеры; **сортировка** |
| `ended` | `ended` | дата окончания |
| `runtime` | `runtime` | длительность серии, мин |
| `network` | `network.name` / `webChannel.name` | канал или стриминговый сервис |
| `country` | `network.country.name` | страна |
| `image` | `image.medium` | постер (если нет — placeholder) |
| `summary` | `summary` (HTML → текст) | описание |

### Поиск, фильтры и сортировка

- Поиск: по названию (`name`) и каналу/сервису (`network`), без учёта регистра, срабатывает при вводе.
- Категориальный фильтр: жанр (`genres`); список жанров строится из загруженных данных.
- Фильтр-диапазон: рейтинг от/до (`rating`, 0–10). Сериалы без рейтинга при заданном диапазоне скрываются.
- Сортировка: рейтинг ↓/↑ (по умолчанию — высокий → низкий), дата премьеры ↓/↑, название А→Я / Я→А. Записи без значения — в конце.

## Этап 1 — компоненты, JSX, props, useState

- Локальный массив из 8 сериалов (`src/data/shows.js`, реальные данные TVmaze).
- Компоненты: `Header`, `ShowList`, `ShowCard`, `ShowDetailsModal`, а также `PosterImage` и `FavoriteButton`.
- Карточка: постер/placeholder, название, жанры, рейтинг, год, статус.
- «Подробнее» открывает модальное окно с расширенными сведениями; закрытие — кнопкой или кликом по фону.
- Избранное: массив ID в `App` (`useState`), переключение через props; счётчик в `Header`; повторное нажатие снимает отметку, один сериал не учитывается дважды.

## Этап 2 — useEffect, Fetch API, useMemo

- Загрузка `fetch()` внутри `useEffect` (async/await), проверка `response.ok`, отмена через `AbortController` в cleanup.
- Состояния: загрузка (индикатор), ошибка (текст + «Повторить»), пустой результат («Ничего не найдено»).
- Ответ API приводится к модели функцией `normalizeShow()` (HTML в описании → текст, `rating.average` → `rating`, `network`/`webChannel` → `network`).
- Список выводится через `map()` с `key={show.id}`.
- Поиск, жанр, диапазон рейтинга и сортировка работают одновременно; результат считается в `useMemo` с зависимостями `[shows, search, genre, minRating, maxRating, sortMode]`; `sort()` вызывается на новом массиве после `filter()`, исходный не мутируется.
- «Найдено: N из M», «Сбросить фильтры» (возвращает все параметры по умолчанию).
- Избранное хранится как массив ID отдельно от отфильтрованного списка — фильтры его не сбрасывают; окно деталей работает как раньше.

## Структура

```
src/
  App.jsx                    — загрузка данных (useEffect), избранное, выбранный сериал
  main.jsx
  index.css
  api/showsApi.js            — fetchShows(): запрос к TVmaze, проверка ответа
  components/
    Header.jsx
    ShowCatalog.jsx          — состояние фильтров + useMemo
    FilterPanel.jsx          — поиск, жанр, рейтинг, сортировка, сброс, «Найдено»
    ShowList.jsx
    ShowCard.jsx
    ShowDetailsModal.jsx
    StatusMessage.jsx        — загрузка / ошибка / пусто
    PosterImage.jsx
    FavoriteButton.jsx
  logic/
    normalizeShow.js         — объект API → модель приложения
    showFilters.js           — matchesSearch, matchesGenre, matchesRatingRange, compareShows
    formatShow.js            — форматирование полей
```

## Скриншоты

| Этап | Скриншот |
|---|---|
| lab-1 | ![lab-1](docs/screenshots/lab-1.png) |
| lab-2 | ![lab-2](docs/screenshots/lab-2.png) |

## Источник данных

Данные о сериалах предоставлены [TVmaze](https://www.tvmaze.com/) (лицензия CC BY-SA).
