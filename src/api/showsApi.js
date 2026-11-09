import { normalizeShow } from '../logic/normalizeShow.js';

export const SHOWS_API_URL = 'https://api.tvmaze.com/shows?page=0';

// Загружает список сериалов из TVmaze. Ответ — массив объектов (не { results: [...] }).
// signal — от AbortController, чтобы можно было отменить незавершённый запрос.
export async function fetchShows(signal) {
  let response;
  try {
    response = await fetch(SHOWS_API_URL, { signal });
  } catch (err) {
    // TypeError — сеть недоступна / запрос заблокирован; AbortError пробрасываем как есть
    if (err.name === 'TypeError') {
      throw new Error('Нет соединения с сервером', { cause: err });
    }
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Сервер ответил ошибкой ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Неожиданный формат ответа API');
  }

  return data.map(normalizeShow);
}
