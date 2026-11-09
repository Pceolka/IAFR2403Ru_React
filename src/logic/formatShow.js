// Вспомогательные функции отображения полей сериала

const STATUS_LABELS = {
  Running: 'Выходит',
  Ended: 'Завершён',
  'To Be Determined': 'Не определено',
  'In Development': 'В разработке',
};

export function translateStatus(status) {
  return STATUS_LABELS[status] ?? status ?? '—';
}

export function formatRating(rating) {
  return typeof rating === 'number' ? rating.toFixed(1) : '—';
}

export function getYear(isoDate) {
  return isoDate ? isoDate.slice(0, 4) : '—';
}

// "2013-06-24" -> "24.06.2013"
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

export function formatRuntime(minutes) {
  return typeof minutes === 'number' ? `${minutes} мин` : '—';
}
