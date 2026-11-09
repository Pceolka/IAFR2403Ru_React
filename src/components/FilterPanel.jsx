import { ALL_GENRES, SORT_OPTIONS } from '../logic/showFilters.js';

function FilterPanel({
  search,
  genre,
  minRating,
  maxRating,
  sortMode,
  genreOptions,
  foundCount,
  totalCount,
  onSearchChange,
  onGenreChange,
  onMinRatingChange,
  onMaxRatingChange,
  onSortModeChange,
  onReset,
}) {
  const isRangeInvalid =
    minRating !== '' && maxRating !== '' && Number(minRating) > Number(maxRating);

  return (
    <section className="filters" aria-label="Поиск и фильтры">
      <div className="filters__grid">
        <label className="field field--wide">
          <span className="field__label">Поиск</span>
          <input
            type="search"
            className="field__control"
            placeholder="Название или канал…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Жанр</span>
          <select
            className="field__control"
            value={genre}
            onChange={(event) => onGenreChange(event.target.value)}
          >
            <option value={ALL_GENRES}>Все жанры</option>
            {genreOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="field field--range">
          <legend className="field__label">Рейтинг</legend>
          <div className="field__range">
            <input
              type="number"
              className="field__control"
              min="0"
              max="10"
              step="0.1"
              placeholder="от"
              aria-label="Рейтинг от"
              value={minRating}
              onChange={(event) => onMinRatingChange(event.target.value)}
            />
            <span aria-hidden="true">—</span>
            <input
              type="number"
              className="field__control"
              min="0"
              max="10"
              step="0.1"
              placeholder="до"
              aria-label="Рейтинг до"
              value={maxRating}
              onChange={(event) => onMaxRatingChange(event.target.value)}
            />
          </div>
        </fieldset>

        <label className="field">
          <span className="field__label">Сортировка</span>
          <select
            className="field__control"
            value={sortMode}
            onChange={(event) => onSortModeChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filters__footer">
        <p className="filters__count" aria-live="polite">
          Найдено: <strong>{foundCount}</strong> из {totalCount}
        </p>
        {isRangeInvalid && (
          <p className="filters__warning">«От» больше, чем «до» — диапазон пустой</p>
        )}
        <button type="button" className="button button--secondary" onClick={onReset}>
          Сбросить фильтры
        </button>
      </div>
    </section>
  );
}

export default FilterPanel;
