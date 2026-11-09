import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import ShowCatalog from './components/ShowCatalog.jsx';
import ShowDetailsModal from './components/ShowDetailsModal.jsx';
import ShowFormModal from './components/ShowFormModal.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import { useEntities } from './hooks/useEntities.js';
import { getGenreOptions } from './logic/showFilters.js';

function App() {
  const {
    entities: shows,
    loading,
    error,
    addEntity,
    updateEntity,
    removeEntity,
    reloadEntities,
    getById,
  } = useEntities();

  // ID избранных сериалов хранятся отдельно от отфильтрованного списка
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(null);
  // null — форма закрыта; { mode: 'create' } или { mode: 'edit', id }
  const [formState, setFormState] = useState(null);

  const genreOptions = useMemo(() => getGenreOptions(shows), [shows]);

  function toggleFavorite(showId) {
    setFavoriteIds((prevIds) =>
      prevIds.includes(showId)
        ? prevIds.filter((id) => id !== showId)
        : [...prevIds, showId],
    );
  }

  function openCreateForm() {
    setFormState({ mode: 'create' });
  }

  function openEditForm(showId) {
    setSelectedShowId(null);
    setFormState({ mode: 'edit', id: showId });
  }

  function handleFormSubmit(showData) {
    if (formState.mode === 'edit') {
      updateEntity(formState.id, showData);
    } else {
      addEntity(showData);
    }
    setFormState(null);
  }

  function handleDelete(showId) {
    const show = getById(showId);
    if (!show) return;
    if (!window.confirm(`Удалить сериал «${show.name}»?`)) return;

    removeEntity(showId);
    // удалённая запись не должна оставаться в счётчике избранного
    setFavoriteIds((prevIds) => prevIds.filter((id) => id !== showId));
    if (selectedShowId === showId) setSelectedShowId(null);
  }

  const selectedShow = selectedShowId === null ? null : getById(selectedShowId);
  const editedShow = formState?.mode === 'edit' ? getById(formState.id) : null;

  let content;
  if (loading) {
    content = <StatusMessage type="loading" text="Загрузка сериалов…" />;
  } else if (error) {
    content = (
      <StatusMessage
        type="error"
        text={`Ошибка загрузки: ${error}`}
        actionLabel="Повторить"
        onAction={reloadEntities}
      />
    );
  } else {
    content = (
      <ShowCatalog
        shows={shows}
        genreOptions={genreOptions}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onOpenDetails={setSelectedShowId}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="app">
      <Header
        favoritesCount={favoriteIds.length}
        totalCount={shows.length}
        canCreate={!loading && !error}
        onCreate={openCreateForm}
      />

      <main className="app__main">{content}</main>

      {selectedShow && (
        <ShowDetailsModal
          show={selectedShow}
          isFavorite={favoriteIds.includes(selectedShow.id)}
          onToggleFavorite={toggleFavorite}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onClose={() => setSelectedShowId(null)}
        />
      )}

      {formState && (
        <ShowFormModal
          key={formState.mode === 'edit' ? formState.id : 'create'}
          show={editedShow}
          genreOptions={genreOptions}
          onSubmit={handleFormSubmit}
          onClose={() => setFormState(null)}
        />
      )}
    </div>
  );
}

export default App;
