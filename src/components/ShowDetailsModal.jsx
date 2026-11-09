import PosterImage from './PosterImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import {
  formatDate,
  formatRating,
  formatRuntime,
  translateStatus,
} from '../logic/formatShow.js';

function ShowDetailsModal({ show, isFavorite, onToggleFavorite, onEdit, onDelete, onClose }) {
  const details = [
    ['Жанры', show.genres.join(', ') || '—'],
    ['Язык', show.language ?? '—'],
    ['Статус', translateStatus(show.status)],
    ['Премьера', formatDate(show.premiered)],
    ['Окончание', show.ended ? formatDate(show.ended) : 'ещё выходит'],
    ['Длительность серии', formatRuntime(show.runtime)],
    ['Рейтинг', `★ ${formatRating(show.rating)} / 10`],
    ['Канал / сервис', show.network ?? '—'],
    ['Страна', show.country ?? '—'],
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="show-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal__content">
          <PosterImage src={show.image} alt={`Постер: ${show.name}`} className="poster--large" />

          <div className="modal__info">
            <h2 id="show-details-title" className="modal__title">{show.name}</h2>

            <dl className="details-list">
              {details.map(([label, value]) => (
                <div key={label} className="details-list__row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <p className="modal__summary">{show.summary || 'Описание отсутствует.'}</p>

            <div className="modal__actions">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={() => onToggleFavorite(show.id)}
              />
              <button type="button" className="button button--secondary" onClick={() => onEdit(show.id)}>
                Изменить
              </button>
              <button type="button" className="button button--danger" onClick={() => onDelete(show.id)}>
                Удалить
              </button>
              <button type="button" className="button button--secondary" onClick={onClose}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailsModal;
