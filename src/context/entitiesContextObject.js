import { createContext } from 'react';

// Сам объект контекста — в отдельном файле, чтобы Provider и хук можно было
// держать в разных модулях (иначе ломается Fast Refresh в Vite)
export const EntitiesContext = createContext(null);
