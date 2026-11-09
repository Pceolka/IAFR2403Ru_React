// Сохранение массива ID избранного в localStorage

export const FAVORITES_STORAGE_KEY = 'tv-catalog:favoriteIds';

const isValidId = (id) =>
  (typeof id === 'number' && Number.isFinite(id)) || (typeof id === 'string' && id !== '');

// Безопасное чтение: при отсутствии данных, битом JSON, не-массиве
// или недоступном localStorage возвращается пустой массив
export function loadFavoriteIds() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter(isValidId))];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // хранилище недоступно или переполнено — избранное работает до перезагрузки
  }
}
