import { useState } from 'react';
import Header from './components/Header.jsx';
import ShowList from './components/ShowList.jsx';
import ShowDetailsModal from './components/ShowDetailsModal.jsx';
import { SHOWS } from './data/shows.js';

function App() {
  // ID избранных сериалов хранятся здесь — в общем родителе Header и карточек
  const [favoriteIds, setFavoriteIds] = useState([]);
  // ID сериала, открытого в окне «Подробнее» (null — окно закрыто)
  const [selectedShowId, setSelectedShowId] = useState(null);

  function toggleFavorite(showId) {
    setFavoriteIds((prevIds) =>
      prevIds.includes(showId)
        ? prevIds.filter((id) => id !== showId)
        : [...prevIds, showId],
    );
  }

  function openDetails(showId) {
    setSelectedShowId(showId);
  }

  function closeDetails() {
    setSelectedShowId(null);
  }

  const selectedShow = SHOWS.find((show) => show.id === selectedShowId) ?? null;

  return (
    <div className="app">
      <Header favoritesCount={favoriteIds.length} totalCount={SHOWS.length} />

      <main className="app__main">
        <ShowList
          shows={SHOWS}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onOpenDetails={openDetails}
        />
      </main>

      {selectedShow && (
        <ShowDetailsModal
          show={selectedShow}
          isFavorite={favoriteIds.includes(selectedShow.id)}
          onToggleFavorite={toggleFavorite}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}

export default App;
