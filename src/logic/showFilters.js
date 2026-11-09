// Поиск, фильтры и сортировка списка сериалов

export const ALL_GENRES = 'all';

export const SORT_OPTIONS = [
  { value: 'rating-desc', label: 'Рейтинг: высокий → низкий' },
  { value: 'rating-asc', label: 'Рейтинг: низкий → высокий' },
  { value: 'premiered-desc', label: 'Премьера: новые → старые' },
  { value: 'premiered-asc', label: 'Премьера: старые → новые' },
  { value: 'name-asc', label: 'Название: А → Я' },
  { value: 'name-desc', label: 'Название: Я → А' },
];

export const DEFAULT_FILTERS = {
  search: '',
  genre: ALL_GENRES,
  minRating: '',
  maxRating: '',
  sortMode: 'rating-desc',
};

// Поиск без учёта регистра по названию и по каналу/сервису
export function matchesSearch(show, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [show.name, show.network]
    .filter(Boolean)
    .some((text) => text.toLowerCase().includes(normalizedQuery));
}

// Категориальный фильтр: жанр
export function matchesGenre(show, genre) {
  return genre === ALL_GENRES || show.genres.includes(genre);
}

// Фильтр-диапазон по рейтингу; пустое поле = граница не задана.
// Сериалы без рейтинга при заданной границе не показываются.
export function matchesRatingRange(show, minRating, maxRating) {
  const min = minRating === '' ? null : Number(minRating);
  const max = maxRating === '' ? null : Number(maxRating);
  if (min === null && max === null) return true;
  if (show.rating === null) return false;
  if (min !== null && show.rating < min) return false;
  if (max !== null && show.rating > max) return false;
  return true;
}

// Значения null (нет рейтинга / даты) всегда в конце списка
function compareNullable(a, b, compare) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return compare(a, b);
}

export function compareShows(a, b, sortMode) {
  switch (sortMode) {
    case 'rating-asc':
      return compareNullable(a.rating, b.rating, (x, y) => x - y);
    case 'rating-desc':
      return compareNullable(a.rating, b.rating, (x, y) => y - x);
    case 'premiered-asc':
      return compareNullable(a.premiered, b.premiered, (x, y) => x.localeCompare(y));
    case 'premiered-desc':
      return compareNullable(a.premiered, b.premiered, (x, y) => y.localeCompare(x));
    case 'name-desc':
      return b.name.localeCompare(a.name);
    case 'name-asc':
    default:
      return a.name.localeCompare(b.name);
  }
}

// Список жанров для выпадающего списка — из фактических данных API
export function getGenreOptions(shows) {
  const genres = new Set(shows.flatMap((show) => show.genres));
  return [...genres].sort((a, b) => a.localeCompare(b));
}
