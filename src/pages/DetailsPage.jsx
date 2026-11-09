import { Link, useParams } from 'react-router';
import { useEntitiesContext } from '../context/useEntitiesContext.js';
import { useDeleteShow } from '../hooks/useDeleteShow.js';
import DataGate from '../components/DataGate.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import PosterImage from '../components/PosterImage.jsx';
import NotFoundMessage from '../components/NotFoundMessage.jsx';
import {
  formatDate,
  formatRating,
  formatRuntime,
  translateStatus,
} from '../logic/formatShow.js';

function DetailsPage() {
  const { id } = useParams();
  const { getById, isFavorite, toggleFavorite } = useEntitiesContext();
  const deleteShow = useDeleteShow();
  const show = getById(id);

  return (
    <DataGate>
      {show ? (
        <article className="details">
          <Link to="/" className="back-link">
            ← К каталогу
          </Link>

          <div className="details__content">
            <PosterImage src={show.image} alt={`Постер: ${show.name}`} className="poster--large" />

            <div className="details__info">
              <h1 className="details__title">
                {show.name}
                {show.isLocal && <span className="badge">добавлен</span>}
              </h1>

              <dl className="details-list">
                {[
                  ['Жанры', show.genres.join(', ') || '—'],
                  ['Язык', show.language ?? '—'],
                  ['Статус', translateStatus(show.status)],
                  ['Премьера', formatDate(show.premiered)],
                  ['Окончание', show.ended ? formatDate(show.ended) : '—'],
                  ['Длительность серии', formatRuntime(show.runtime)],
                  ['Рейтинг', `★ ${formatRating(show.rating)} / 10`],
                  ['Канал / сервис', show.network ?? '—'],
                  ['Страна', show.country ?? '—'],
                ].map(([label, value]) => (
                  <div key={label} className="details-list__row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="details__summary">{show.summary || 'Описание отсутствует.'}</p>

              <div className="details__actions">
                <FavoriteButton
                  isFavorite={isFavorite(show.id)}
                  onToggle={() => toggleFavorite(show.id)}
                />
                <Link to={`/edit/${show.id}`} className="button button--secondary">
                  Изменить
                </Link>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => deleteShow(show.id, '/')}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <NotFoundMessage id={id} />
      )}
    </DataGate>
  );
}

export default DetailsPage;
