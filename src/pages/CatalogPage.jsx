import { useMemo } from 'react';
import { useEntitiesContext } from '../context/useEntitiesContext.js';
import { useDeleteShow } from '../hooks/useDeleteShow.js';
import DataGate from '../components/DataGate.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ShowList from '../components/ShowList.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import {
  compareShows,
  getGenreOptions,
  matchesGenre,
  matchesRatingRange,
  matchesSearch,
} from '../logic/showFilters.js';

function CatalogPage() {
  const { entities, filters, setFilter, resetFilters, isFavorite, toggleFavorite } =
    useEntitiesContext();
  const deleteShow = useDeleteShow();
  const { search, genre, minRating, maxRating, sortMode } = filters;

  const genreOptions = useMemo(() => getGenreOptions(entities), [entities]);

  // Поиск -> жанр -> диапазон рейтинга -> сортировка.
  // filter() возвращает новый массив, поэтому sort() не меняет исходный entities.
  // После CRUD entities — новый массив, и useMemo пересчитывает результат.
  const visibleShows = useMemo(() => {
    return entities
      .filter((show) => matchesSearch(show, search))
      .filter((show) => matchesGenre(show, genre))
      .filter((show) => matchesRatingRange(show, minRating, maxRating))
      .sort((a, b) => compareShows(a, b, sortMode));
  }, [entities, search, genre, minRating, maxRating, sortMode]);

  return (
    <DataGate>
      <FilterPanel
        search={search}
        genre={genre}
        minRating={minRating}
        maxRating={maxRating}
        sortMode={sortMode}
        genreOptions={genreOptions}
        foundCount={visibleShows.length}
        totalCount={entities.length}
        onSearchChange={(value) => setFilter('search', value)}
        onGenreChange={(value) => setFilter('genre', value)}
        onMinRatingChange={(value) => setFilter('minRating', value)}
        onMaxRatingChange={(value) => setFilter('maxRating', value)}
        onSortModeChange={(value) => setFilter('sortMode', value)}
        onReset={resetFilters}
      />

      {visibleShows.length > 0 ? (
        <ShowList
          shows={visibleShows}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onDelete={(id) => deleteShow(id)}
        />
      ) : (
        <StatusMessage
          type="empty"
          text="Ничего не найдено"
          actionLabel="Сбросить фильтры"
          onAction={resetFilters}
        />
      )}
    </DataGate>
  );
}

export default CatalogPage;
