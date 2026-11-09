# Каталог сериалов (React + Vite)

Проектная работа по дисциплине «Dezvoltarea aplicațiilor web cu React».
Студент: Spataru Evghenii, группа IAFR2403 Ru.

SPA для просмотра коллекции телесериалов: карточки, окно подробностей, избранное.
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
- API (с этапа 2): **TVmaze** — https://api.tvmaze.com/shows?page=0 (публичный, без ключа, CORS разрешён; одна страница — до 250 записей).
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

### Планируемые поиск, фильтры и сортировка (этап 2)

- Поиск: по `name`, без учёта регистра.
- Категориальный фильтр: жанр (`genres`).
- Фильтр-диапазон: рейтинг от/до (`rating`).
- Сортировка: по рейтингу или по дате премьеры, по возрастанию/убыванию.

## Этап 1 — компоненты, JSX, props, useState

- Локальный массив из 8 сериалов (`src/data/shows.js`, реальные данные TVmaze).
- Компоненты: `Header`, `ShowList`, `ShowCard`, `ShowDetailsModal`, а также `PosterImage` и `FavoriteButton`.
- Карточка: постер/placeholder, название, жанры, рейтинг, год, статус.
- «Подробнее» открывает модальное окно с расширенными сведениями; закрытие — кнопкой или кликом по фону.
- Избранное: массив ID в `App` (`useState`), переключение через props; счётчик в `Header`; повторное нажатие снимает отметку, один сериал не учитывается дважды.

## Структура

```
src/
  App.jsx                    — корневой компонент, состояние избранного и выбранного сериала
  main.jsx
  index.css
  components/
    Header.jsx
    ShowList.jsx
    ShowCard.jsx
    ShowDetailsModal.jsx
    PosterImage.jsx
    FavoriteButton.jsx
  data/shows.js              — локальные данные (этап 1)
  logic/formatShow.js        — форматирование полей
```

## Источник данных

Данные о сериалах предоставлены [TVmaze](https://www.tvmaze.com/) (лицензия CC BY-SA).
