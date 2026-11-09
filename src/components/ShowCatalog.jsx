import { useMemo, useState } from 'react';
import FilterPanel from './FilterPanel.jsx';
import ShowList from './ShowList.jsx';
import StatusMessage from './StatusMessage.jsx';
import {
  DEFAULT_FILTERS,
  compareShows,
  matchesGenre,
  matchesRatingRange,
  matchesSearch,
} from '../logic/showFilters.js';

function ShowCatalog({
  shows,
  genreOptions,
  favoriteIds,
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [genre, setGenre] = useState(DEFAULT_FILTERS.genre);
  const [minRating, setMinRating] = useState(DEFAULT_FILTERS.minRating);
  const [maxRating, setMaxRating] = useState(DEFAULT_FILTERS.maxRating);
  const [sortMode, setSortMode] = useState(DEFAULT_FILTERS.sortMode);

  // Поиск -> жанр -> диапазон рейтинга -> сортировка.
  // filter() возвращает новый массив, поэтому sort() не меняет исходный shows.
  // shows приходит из useEntities: после добавления/изменения/удаления это новый
  // массив, и useMemo пересчитывает результат по актуальным данным.
  const visibleShows = useMemo(() => {
    return shows
      .filter((show) => matchesSearch(show, search))
      .filter((show) => matchesGenre(show, genre))
      .filter((show) => matchesRatingRange(show, minRating, maxRating))
      .sort((a, b) => compareShows(a, b, sortMode));
  }, [shows, search, genre, minRating, maxRating, sortMode]);

  function resetFilters() {
    setSearch(DEFAULT_FILTERS.search);
    setGenre(DEFAULT_FILTERS.genre);
    setMinRating(DEFAULT_FILTERS.minRating);
    setMaxRating(DEFAULT_FILTERS.maxRating);
    setSortMode(DEFAULT_FILTERS.sortMode);
  }

  return (
    <>
      <FilterPanel
        search={search}
        genre={genre}
        minRating={minRating}
        maxRating={maxRating}
        sortMode={sortMode}
        genreOptions={genreOptions}
        foundCount={visibleShows.length}
        totalCount={shows.length}
        onSearchChange={setSearch}
        onGenreChange={setGenre}
        onMinRatingChange={setMinRating}
        onMaxRatingChange={setMaxRating}
        onSortModeChange={setSortMode}
        onReset={resetFilters}
      />

      {visibleShows.length > 0 ? (
        <ShowList
          shows={visibleShows}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <StatusMessage
          type="empty"
          text="Ничего не найдено"
          actionLabel="Сбросить фильтры"
          onAction={resetFilters}
        />
      )}
    </>
  );
}

export default ShowCatalog;
