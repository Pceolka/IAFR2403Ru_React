import { useContext } from 'react';
import { EntitiesContext } from './entitiesContextObject.js';

// Доступ к единому состоянию из любой страницы/компонента
export function useEntitiesContext() {
  const context = useContext(EntitiesContext);
  if (!context) {
    throw new Error('useEntitiesContext() должен вызываться внутри <EntitiesProvider>');
  }
  return context;
}
