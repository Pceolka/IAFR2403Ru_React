import { Link } from 'react-router';
import PosterImage from './PosterImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { formatRating, getYear, translateStatus } from '../logic/formatShow.js';

function ShowCard({ show, isFavorite, onToggleFavorite, onDelete }) {
  return (
    <article className={`show-card${isFavorite ? ' show-card--favorite' : ''}`}>
      <Link to={`/entity/${show.id}`} className="show-card__poster-link" tabIndex={-1} aria-hidden="true">
        <PosterImage src={show.image} alt="" />
      </Link>

      <div className="show-card__body">
        <h2 className="show-card__title">
          <Link to={`/entity/${show.id}`} className="show-card__link">
            {show.name}
          </Link>
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
          <Link to={`/entity/${show.id}`} className="button button--secondary">
            Подробнее
          </Link>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(show.id)}
          />
          <div className="show-card__crud">
            <Link to={`/edit/${show.id}`} className="button button--small">
              Изменить
            </Link>
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
