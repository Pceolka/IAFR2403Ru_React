// Значения формы сериала, их проверка и преобразование в объект записи

export const STATUS_OPTIONS = [
  { value: 'Running', label: 'Выходит' },
  { value: 'Ended', label: 'Завершён' },
  { value: 'To Be Determined', label: 'Не определено' },
  { value: 'In Development', label: 'В разработке' },
];

export const EMPTY_FORM_VALUES = {
  name: '',
  genres: [],
  status: 'Running',
  premiered: '',
  ended: '',
  rating: '',
  runtime: '',
  language: '',
  network: '',
  image: '',
  summary: '',
};

// Запись -> значения формы (все поля — строки, кроме genres)
export function showToFormValues(show) {
  if (!show) return EMPTY_FORM_VALUES;
  return {
    name: show.name ?? '',
    genres: [...show.genres],
    status: show.status ?? 'Running',
    premiered: show.premiered ?? '',
    ended: show.ended ?? '',
    rating: show.rating === null ? '' : String(show.rating),
    runtime: show.runtime === null ? '' : String(show.runtime),
    language: show.language ?? '',
    network: show.network ?? '',
    image: show.image ?? '',
    summary: show.summary ?? '',
  };
}

const textOrNull = (value) => (value.trim() === '' ? null : value.trim());
const numberOrNull = (value) => (value.trim() === '' ? null : Number(value));

// Значения формы -> поля записи
export function formValuesToShow(values) {
  return {
    name: values.name.trim(),
    genres: values.genres,
    status: values.status,
    premiered: values.premiered,
    ended: textOrNull(values.ended),
    rating: numberOrNull(values.rating),
    runtime: numberOrNull(values.runtime),
    language: textOrNull(values.language),
    network: textOrNull(values.network),
    image: textOrNull(values.image),
    summary: values.summary.trim(),
  };
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  const year = Number(value.slice(0, 4));
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) && year >= 1900 && year <= 2100;
}

// Возвращает объект ошибок { поле: текст }; пустой объект — форма корректна
export function validateShowForm(values) {
  const errors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Введите название';
  else if (name.length > 100) errors.name = 'Не длиннее 100 символов';

  if (values.genres.length === 0) errors.genres = 'Выберите хотя бы один жанр';

  if (!values.premiered) errors.premiered = 'Укажите дату премьеры';
  else if (!isValidDate(values.premiered)) errors.premiered = 'Некорректная дата (1900–2100)';

  if (values.ended) {
    if (!isValidDate(values.ended)) errors.ended = 'Некорректная дата (1900–2100)';
    else if (!errors.premiered && values.ended < values.premiered) {
      errors.ended = 'Окончание не может быть раньше премьеры';
    }
  }
  if (values.status === 'Ended' && !values.ended) {
    errors.ended = 'Для завершённого сериала укажите дату окончания';
  }
  if (values.status !== 'Ended' && values.ended && !errors.ended) {
    errors.ended = 'Дата окончания указывается только для завершённого сериала';
  }

  if (values.rating.trim() !== '') {
    const rating = Number(values.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      errors.rating = 'Рейтинг — число от 0 до 10';
    }
  }

  if (values.runtime.trim() !== '') {
    const runtime = Number(values.runtime);
    if (!Number.isInteger(runtime) || runtime < 1 || runtime > 600) {
      errors.runtime = 'Целое число минут от 1 до 600';
    }
  }

  if (values.image.trim() !== '' && !/^https?:\/\/\S+$/i.test(values.image.trim())) {
    errors.image = 'Ссылка должна начинаться с http:// или https://';
  }

  if (values.summary.length > 1000) errors.summary = 'Не длиннее 1000 символов';

  return errors;
}
