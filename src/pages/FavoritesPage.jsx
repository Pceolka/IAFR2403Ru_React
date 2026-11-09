import { Link } from 'react-router';
import { useEntitiesContext } from '../context/useEntitiesContext.js';
import { useDeleteShow } from '../hooks/useDeleteShow.js';
import DataGate from '../components/DataGate.jsx';
import ShowList from '../components/ShowList.jsx';

function FavoritesPage() {
  const { entities, favoriteIds, isFavorite, toggleFavorite } = useEntitiesContext();
  const deleteShow = useDeleteShow();

  // порядок — как отмечали
  const favoriteShows = favoriteIds
    .map((id) => entities.find((show) => show.id === id))
    .filter(Boolean);

  return (
    <DataGate>
      <section>
        <h1 className="page-title">
          Избранное <span className="page-title__count">{favoriteShows.length}</span>
        </h1>

        {favoriteShows.length > 0 ? (
          <ShowList
            shows={favoriteShows}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onDelete={(id) => deleteShow(id)}
          />
        ) : (
          <div className="status status--empty" role="status">
            <p className="status__text">В избранном пока ничего нет</p>
            <p className="status__hint">Отмечайте сериалы кнопкой «☆ В избранное» в каталоге.</p>
            <Link to="/" className="button button--secondary">
              Перейти в каталог
            </Link>
          </div>
        )}
      </section>
    </DataGate>
  );
}

export default FavoritesPage;
