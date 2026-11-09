import PosterImage from './PosterImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { formatRating, getYear, translateStatus } from '../logic/formatShow.js';

function ShowCard({ show, isFavorite, onToggleFavorite, onOpenDetails, onEdit, onDelete }) {
  return (
    <article className={`show-card${isFavorite ? ' show-card--favorite' : ''}`}>
      <PosterImage src={show.image} alt={`Постер: ${show.name}`} />

      <div className="show-card__body">
        <h2 className="show-card__title">
          {show.name}
          {show.isLocal && <span className="badge">добавлен</span>}
        </h2>
        <p className="show-card__genres">{show.genres.join(' · ')}</p>

        <dl className="show-card__meta">
          <div>
            <dt>Рейтинг</dt>
            <dd>★ {formatRating(show.rating)}</dd>
          </div>
          <div>
            <dt>Год</dt>
            <dd>{getYear(show.premiered)}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>{translateStatus(show.status)}</dd>
          </div>
        </dl>

        <div className="show-card__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => onOpenDetails(show.id)}
          >
            Подробнее
          </button>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(show.id)}
          />
          <div className="show-card__crud">
            <button type="button" className="button button--small" onClick={() => onEdit(show.id)}>
              Изменить
            </button>
            <button
              type="button"
              className="button button--small button--danger"
              onClick={() => onDelete(show.id)}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ShowCard;
