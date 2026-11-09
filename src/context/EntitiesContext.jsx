import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEntities } from '../hooks/useEntities.js';
import { DEFAULT_FILTERS } from '../logic/showFilters.js';
import { loadFavoriteIds, saveFavoriteIds } from '../logic/favoritesStorage.js';
import { EntitiesContext } from './entitiesContextObject.js';

// Единый источник данных для всех страниц:
// useEntities() вызывается здесь ОДИН раз — страницы получают состояние через useEntitiesContext()
export function EntitiesProvider({ children }) {
  const {
    entities,
    loading,
    error,
    addEntity,
    updateEntity,
    removeEntity,
    reloadEntities,
    getById,
  } = useEntities();

  // Избранное: начальное значение читается из localStorage один раз (ленивая инициализация)
  const [storedFavoriteIds, setStoredFavoriteIds] = useState(loadFavoriteIds);

  // Фильтры каталога живут в Provider, поэтому сохраняются при переходах между страницами
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Когда данные загружены, в избранном оставляем только существующие записи
  // (локально созданная запись после перезагрузки страницы уже не существует)
  const favoriteIds = useMemo(() => {
    if (loading || error) return storedFavoriteIds;
    const existingIds = new Set(entities.map((entity) => entity.id));
    return storedFavoriteIds.filter((id) => existingIds.has(id));
  }, [storedFavoriteIds, entities, loading, error]);

  // Синхронизация с внешним хранилищем: при каждом изменении — JSON в localStorage
  useEffect(() => {
    saveFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(
    (id) => {
      const nextIds = favoriteIds.includes(id)
        ? favoriteIds.filter((item) => item !== id)
        : [...favoriteIds, id];
      setStoredFavoriteIds(nextIds);
    },
    [favoriteIds],
  );

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);

  // Удаление записи убирает её и из избранного
  const removeShow = useCallback(
    (id) => {
      removeEntity(id);
      setStoredFavoriteIds((prevIds) => prevIds.filter((item) => item !== id));
    },
    [removeEntity],
  );

  const setFilter = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const value = useMemo(
    () => ({
      entities,
      loading,
      error,
      addEntity,
      updateEntity,
      removeEntity: removeShow,
      reloadEntities,
      getById,
      favoriteIds,
      toggleFavorite,
      isFavorite,
      filters,
      setFilter,
      resetFilters,
    }),
    [
      entities,
      loading,
      error,
      addEntity,
      updateEntity,
      removeShow,
      reloadEntities,
      getById,
      favoriteIds,
      toggleFavorite,
      isFavorite,
      filters,
      setFilter,
      resetFilters,
    ],
  );

  return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>;
}
