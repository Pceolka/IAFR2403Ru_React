# Каталог сериалов (React + Vite)

Проектная работа по дисциплине «Dezvoltarea aplicațiilor web cu React».
Студент: Spataru Evghenii, группа IAFR2403 Ru.

SPA для просмотра коллекции телесериалов: загрузка из открытого API, поиск, фильтры, сортировка, окно подробностей, избранное, локальное добавление/редактирование/удаление записей.
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

## Этап 3 — формы, useReducer, custom hook

- `logic/entitiesReducer.js` — чистый reducer. Состояние `{ entities, loading, error }`, действия `LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_ENTITY`, `UPDATE_ENTITY`, `REMOVE_ENTITY`. Все действия возвращают новые массивы и объекты (`[...]`, `map`, `filter`, `{ ...entity, ...changes }`), без `push` и изменения исходных данных; в reducer нет `fetch` и других побочных эффектов.
- `hooks/useEntities.js` — `useReducer` + `useEffect` + `fetch` + отмена через `AbortController`. Возвращает `entities, loading, error, addEntity(entity), updateEntity(id, changes), removeEntity(id)`, а также `reloadEntities()` и `getById(id)`. Компоненты не знают о `dispatch`.
- `components/ShowForm.jsx` — одна форма для создания и редактирования. Поля управляются через `useState`, при отправке — `preventDefault()` и проверка (`logic/showForm.js`):
  - обязательные: название, хотя бы один жанр, дата премьеры, статус;
  - рейтинг — число 0–10, длительность — целое 1–600, даты — корректные (1900–2100);
  - диапазон дат: окончание не раньше премьеры; дата окончания обязательна для статуса «Завершён» и не указывается для остальных;
  - ссылка на постер — `http(s)://…`.
- Создание: ID — `crypto.randomUUID()`, запись сразу появляется в списке (с отметкой «добавлен»).
- Редактирование: форма открывается с данными записи (кнопка «Изменить» на карточке или в окне деталей); после сохранения меняется только эта запись.
- Удаление: кнопка «Удалить» с подтверждением; карточка исчезает без перезагрузки, запись убирается и из избранного.
- Поиск, фильтры и сортировка (`useMemo`) пересчитываются по актуальному массиву после любой операции.
- **Изменения локальные:** API TVmaze только читается, после перезагрузки страницы список снова загружается с сервера и локальные изменения сбрасываются (на этом этапе так и задумано).

## Структура

```
src/
  App.jsx                    — избранное, выбранный сериал, открытие формы, обработчики CRUD
  main.jsx
  index.css
  api/showsApi.js            — fetchShows(): запрос к TVmaze, проверка ответа
  hooks/useEntities.js       — загрузка + локальный CRUD (useReducer, useEffect, fetch)
  components/
    Header.jsx
    ShowCatalog.jsx          — состояние фильтров + useMemo
    FilterPanel.jsx          — поиск, жанр, рейтинг, сортировка, сброс, «Найдено»
    ShowList.jsx
    ShowCard.jsx
    ShowDetailsModal.jsx
    StatusMessage.jsx        — загрузка / ошибка / пусто
    ShowForm.jsx             — форма создания/редактирования с валидацией
    ShowFormModal.jsx        — окно с формой
    PosterImage.jsx
    FavoriteButton.jsx
  logic/
    entitiesReducer.js       — чистый reducer (LOAD_*, ADD/UPDATE/REMOVE_ENTITY)
    showForm.js              — значения формы, валидация, преобразование в запись
    normalizeShow.js         — объект API → модель приложения
    showFilters.js           — matchesSearch, matchesGenre, matchesRatingRange, compareShows
    formatShow.js            — форматирование полей
```

## Скриншоты

| Этап | Скриншот |
|---|---|
| lab-1 | ![lab-1](docs/screenshots/lab-1.png) |
| lab-2 | ![lab-2](docs/screenshots/lab-2.png) |
| lab-3 | ![lab-3](docs/screenshots/lab-3.png) |

## Источник данных

Данные о сериалах предоставлены [TVmaze](https://www.tvmaze.com/) (лицензия CC BY-SA).
