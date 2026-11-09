import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useEntitiesContext } from '../context/useEntitiesContext.js';

// Удаление с подтверждением; redirectTo — куда перейти после удаления (например, со страницы деталей)
export function useDeleteShow() {
  const { getById, removeEntity } = useEntitiesContext();
  const navigate = useNavigate();

  return useCallback(
    (id, redirectTo) => {
      const show = getById(id);
      if (!show) return;
      if (!window.confirm(`Удалить сериал «${show.name}»?`)) return;
      removeEntity(show.id);
      if (redirectTo) navigate(redirectTo, { replace: true });
    },
    [getById, removeEntity, navigate],
  );
}
