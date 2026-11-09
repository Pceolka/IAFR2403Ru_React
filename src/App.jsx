import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import ShowCatalog from './components/ShowCatalog.jsx';
import ShowDetailsModal from './components/ShowDetailsModal.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import { fetchShows } from './api/showsApi.js';

function App() {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // увеличение счётчика повторяет загрузку (кнопка «Повторить»)
  const [reloadKey, setReloadKey] = useState(0);

  // ID избранных сериалов хранятся отдельно от отфильтрованного списка,
  // поэтому фильтры не сбрасывают отметки
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadShows() {
      setIsLoading(true);
      setError(null);
      try {
        const loadedShows = await fetchShows(controller.signal);
        setShows(loadedShows);
      } catch (err) {
        // отмена запроса при размонтировании — не ошибка
        if (err.name === 'AbortError') return;
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadShows();

    return () => controller.abort();
  }, [reloadKey]);

  function toggleFavorite(showId) {
    setFavoriteIds((prevIds) =>
      prevIds.includes(showId)
        ? prevIds.filter((id) => id !== showId)
        : [...prevIds, showId],
    );
  }

  const selectedShow = shows.find((show) => show.id === selectedShowId) ?? null;

  let content;
  if (isLoading) {
    content = <StatusMessage type="loading" text="Загрузка сериалов…" />;
  } else if (error) {
    content = (
      <StatusMessage
        type="error"
        text={`Ошибка загрузки: ${error}`}
        actionLabel="Повторить"
        onAction={() => setReloadKey((key) => key + 1)}
      />
    );
  } else {
    content = (
      <ShowCatalog
        shows={shows}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onOpenDetails={setSelectedShowId}
      />
    );
  }

  return (
    <div className="app">
      <Header favoritesCount={favoriteIds.length} totalCount={shows.length} />

      <main className="app__main">{content}</main>

      {selectedShow && (
        <ShowDetailsModal
          show={selectedShow}
          isFavorite={favoriteIds.includes(selectedShow.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedShowId(null)}
        />
      )}
    </div>
  );
}

export default App;
