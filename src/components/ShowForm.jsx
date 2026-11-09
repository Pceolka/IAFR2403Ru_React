import { useState } from 'react';
import {
  STATUS_OPTIONS,
  formValuesToShow,
  showToFormValues,
  validateShowForm,
} from '../logic/showForm.js';

// Одна форма для создания и редактирования (controlled-поля на useState)
function ShowForm({ initialShow, genreOptions, onSubmit, onCancel }) {
  const isEdit = Boolean(initialShow);
  const [values, setValues] = useState(() => showToFormValues(initialShow));
  const [errors, setErrors] = useState({});
  // после первой попытки отправки ошибки пересчитываются при каждом изменении
  const [wasSubmitted, setWasSubmitted] = useState(false);

  function updateValues(nextValues) {
    setValues(nextValues);
    if (wasSubmitted) setErrors(validateShowForm(nextValues));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    updateValues({ ...values, [name]: value });
  }

  function toggleGenre(genre) {
    const genres = values.genres.includes(genre)
      ? values.genres.filter((item) => item !== genre)
      : [...values.genres, genre];
    updateValues({ ...values, genres });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setWasSubmitted(true);
    const validationErrors = validateShowForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(formValuesToShow(values));
  }

  // жанры записи, которых нет в общем списке, тоже показываем
  const allGenres = [...new Set([...genreOptions, ...values.genres])];

  return (
    <form className="show-form" onSubmit={handleSubmit} noValidate>
      <h2 id="show-form-title" className="modal__title">
        {isEdit ? `Редактирование: ${initialShow.name}` : 'Новый сериал'}
      </h2>

      <div className="show-form__grid">
        <FormField label="Название *" error={errors.name} wide>
          <input name="name" className="field__control" value={values.name} onChange={handleChange} />
        </FormField>

        <FormField label="Статус *" error={errors.status}>
          <select name="status" className="field__control" value={values.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Рейтинг (0–10)" error={errors.rating}>
          <input
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            className="field__control"
            value={values.rating}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Премьера *" error={errors.premiered}>
          <input name="premiered" type="date" className="field__control" value={values.premiered} onChange={handleChange} />
        </FormField>

        <FormField label="Окончание" error={errors.ended}>
          <input name="ended" type="date" className="field__control" value={values.ended} onChange={handleChange} />
        </FormField>

        <FormField label="Длительность серии, мин" error={errors.runtime}>
          <input
            name="runtime"
            type="number"
            min="1"
            max="600"
            step="1"
            className="field__control"
            value={values.runtime}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Язык" error={errors.language}>
          <input name="language" className="field__control" value={values.language} onChange={handleChange} />
        </FormField>

        <FormField label="Канал / сервис" error={errors.network}>
          <input name="network" className="field__control" value={values.network} onChange={handleChange} />
        </FormField>

        <FormField label="Ссылка на постер" error={errors.image}>
          <input
            name="image"
            type="url"
            placeholder="https://…"
            className="field__control"
            value={values.image}
            onChange={handleChange}
          />
        </FormField>

        <fieldset className={`field field--wide${errors.genres ? ' field--invalid' : ''}`}>
          <legend className="field__label">Жанры *</legend>
          <div className="genre-picker">
            {allGenres.map((genre) => (
              <label
                key={genre}
                className={`genre-chip${values.genres.includes(genre) ? ' genre-chip--active' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={values.genres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
          {errors.genres && <p className="field__error">{errors.genres}</p>}
        </fieldset>

        <FormField label="Описание" error={errors.summary} wide>
          <textarea
            name="summary"
            rows="4"
            className="field__control"
            value={values.summary}
            onChange={handleChange}
          />
        </FormField>
      </div>

      <div className="modal__actions">
        <button type="submit" className="button button--primary">
          {isEdit ? 'Сохранить изменения' : 'Добавить сериал'}
        </button>
        <button type="button" className="button button--secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}

function FormField({ label, error, wide = false, children }) {
  return (
    <label className={`field${wide ? ' field--wide' : ''}${error ? ' field--invalid' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export default ShowForm;
