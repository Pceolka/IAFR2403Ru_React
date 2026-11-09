// Приводит объект сериала из TVmaze к форме, удобной для приложения

const HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

// summary в TVmaze приходит в виде HTML (<p>, <b>, <i>) — превращаем в обычный текст
function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<\/p>\s*<p>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => HTML_ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeShow(raw) {
  return {
    id: raw.id,
    name: raw.name ?? 'Без названия',
    language: raw.language ?? null,
    genres: Array.isArray(raw.genres) ? raw.genres : [],
    status: raw.status ?? null,
    runtime: raw.runtime ?? raw.averageRuntime ?? null,
    premiered: raw.premiered ?? null,
    ended: raw.ended ?? null,
    rating: raw.rating?.average ?? null,
    network: raw.network?.name ?? raw.webChannel?.name ?? null,
    country: raw.network?.country?.name ?? raw.webChannel?.country?.name ?? null,
    image: raw.image?.medium ?? null,
    summary: htmlToText(raw.summary),
  };
}
