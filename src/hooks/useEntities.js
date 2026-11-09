import { useCallback, useEffect, useReducer, useState } from 'react';
import { fetchShows } from '../api/showsApi.js';
import {
  ENTITY_ACTIONS,
  entitiesReducer,
  initialEntitiesState,
} from '../logic/entitiesReducer.js';

// Загрузка сериалов из API + локальные CRUD-операции.
// Компоненты получают простой интерфейс и ничего не знают о dispatch.
export function useEntities() {
  const [state, dispatch] = useReducer(entitiesReducer, initialEntitiesState);
  // увеличение значения запускает загрузку заново (reloadEntities)
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      dispatch({ type: ENTITY_ACTIONS.LOAD_START });
      try {
        const shows = await fetchShows(controller.signal);
        dispatch({ type: ENTITY_ACTIONS.LOAD_SUCCESS, payload: shows });
      } catch (err) {
        // отмена незавершённого запроса (размонтирование / повторная загрузка) — не ошибка
        if (err.name === 'AbortError') return;
        dispatch({
          type: ENTITY_ACTIONS.LOAD_ERROR,
          payload: err.message || 'Не удалось загрузить данные',
        });
      }
    }

    load();

    return () => controller.abort();
  }, [reloadKey]);

  // Создание: уникальный ID генерируется здесь; запись помечается как локальная
  const addEntity = useCallback((entity) => {
    const newEntity = { ...entity, id: crypto.randomUUID(), isLocal: true };
    dispatch({ type: ENTITY_ACTIONS.ADD_ENTITY, payload: newEntity });
    return newEntity;
  }, []);

  const updateEntity = useCallback((id, changes) => {
    dispatch({ type: ENTITY_ACTIONS.UPDATE_ENTITY, payload: { id, changes } });
  }, []);

  const removeEntity = useCallback((id) => {
    dispatch({ type: ENTITY_ACTIONS.REMOVE_ENTITY, payload: id });
  }, []);

  const reloadEntities = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const getById = useCallback(
    (id) => state.entities.find((entity) => entity.id === id) ?? null,
    [state.entities],
  );

  return {
    entities: state.entities,
    loading: state.loading,
    error: state.error,
    addEntity,
    updateEntity,
    removeEntity,
    reloadEntities,
    getById,
  };
}
